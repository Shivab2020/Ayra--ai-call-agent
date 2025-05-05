const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Create and connect to SQLite database
const db = new sqlite3.Database('./ayra.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    // Don't exit on connection error, just log it
    console.log('Continuing without database connection. Some features may not work.');
  } else {
    console.log('Connected to the SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  // Conversations table
  db.run(`CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    type TEXT,
    timestamp TEXT,
    agent_type TEXT,
    user_name TEXT,
    summary TEXT,
    status TEXT,
    data TEXT
  )`);

  // Restaurant reservations table
  db.run(`CREATE TABLE IF NOT EXISTS restaurant_reservations (
    id TEXT PRIMARY KEY,
    name TEXT,
    phone TEXT,
    date TEXT,
    time TEXT,
    guests INTEGER,
    special_requests TEXT,
    status TEXT,
    created_at TEXT,
    updated_at TEXT
  )`);

  // Restaurant orders table
  db.run(`CREATE TABLE IF NOT EXISTS restaurant_orders (
    id TEXT PRIMARY KEY,
    name TEXT,
    phone TEXT,
    address TEXT,
    items TEXT,
    total REAL,
    type TEXT,
    status TEXT,
    order_time TEXT,
    delivery_time TEXT,
    pickup_time TEXT,
    updated_at TEXT
  )`);

  // Hospital appointments table
  db.run(`CREATE TABLE IF NOT EXISTS hospital_appointments (
    id TEXT PRIMARY KEY,
    patient_name TEXT,
    patient_id TEXT,
    phone TEXT,
    doctor TEXT,
    department TEXT,
    date TEXT,
    time TEXT,
    reason TEXT,
    status TEXT,
    created_at TEXT,
    updated_at TEXT
  )`);

  // Hospital reminders table
  db.run(`CREATE TABLE IF NOT EXISTS hospital_reminders (
    id TEXT PRIMARY KEY,
    patient_name TEXT,
    patient_id TEXT,
    phone TEXT,
    type TEXT,
    date TEXT,
    time TEXT,
    doctor TEXT,
    message TEXT,
    status TEXT,
    created_at TEXT,
    scheduled_for TEXT,
    sent_at TEXT
  )`);
}

// Helper function to generate ID
function generateId(prefix) {
  return prefix + Math.random().toString(36).substr(2, 9);
}

// API Routes

// Get all conversations
app.get('/api/conversations', (req, res) => {
  const type = req.query.type;
  let query = 'SELECT * FROM conversations';
  
  if (type) {
    query += ' WHERE type = ?';
    db.all(query, [type], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  } else {
    db.all(query, [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  }
});

// Save a conversation
app.post('/api/conversations', (req, res) => {
  const { type, agent_type, user_name, summary, status, data } = req.body;
  const id = generateId('conv');
  const timestamp = new Date().toISOString();
  
  const query = `INSERT INTO conversations (id, type, timestamp, agent_type, user_name, summary, status, data) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(query, [id, type, timestamp, agent_type, user_name, summary, status, JSON.stringify(data)], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const savedConversation = {
      id,
      type,
      timestamp,
      agent_type,
      user_name,
      summary,
      status,
      data
    };
    
    // If the data contains extractedData, process it to create activities
    if (data && data.extractedData) {
      if (type === 'restaurant') {
        processRestaurantData(savedConversation, data.extractedData);
      } else if (type === 'hospital') {
        processHospitalData(savedConversation, data.extractedData);
      }
    }
    
    res.json(savedConversation);
  });
});

// Extract data from conversations to populate activities
function processConversations() {
  console.log('Processing conversations to extract booking data...');
  
  db.all('SELECT * FROM conversations', [], (err, conversations) => {
    if (err) {
      console.error('Error fetching conversations for processing:', err);
      return;
    }
    
    // Process each conversation
    conversations.forEach(conversation => {
      let data;
      try {
        data = JSON.parse(conversation.data);
      } catch (e) {
        console.error(`Error parsing conversation data for ${conversation.id}:`, e);
        return; // Skip this conversation
      }
      
      // Check if we have extractedData
      if (data && data.extractedData) {
        // Process based on conversation type
        if (conversation.type === 'restaurant') {
          processRestaurantData(conversation, data.extractedData);
        } else if (conversation.type === 'hospital') {
          processHospitalData(conversation, data.extractedData);
        }
      }
    });
  });
}

// Process restaurant data
function processRestaurantData(conversation, extractedData) {
  // Check for reservation data
  if (extractedData.reservation) {
    const reservation = extractedData.reservation;
    
    // Check if this reservation already exists
    if (reservation.date && reservation.time) {
      const query = `SELECT * FROM restaurant_reservations 
                    WHERE name = ? AND date = ? AND time = ?`;
      
      db.get(query, [reservation.name, reservation.date, reservation.time], (err, row) => {
        if (err) {
          console.error('Error checking for existing reservation:', err);
          return;
        }
        
        // If no existing reservation, create one
        if (!row) {
          createReservationFromData(reservation, conversation);
        }
      });
    }
  }
  
  // Check for order data
  if (extractedData.order) {
    const order = extractedData.order;
    
    // Check if this order already exists (using name and items as a basic check)
    if (order.name && order.items) {
      const query = `SELECT * FROM restaurant_orders 
                    WHERE name = ? AND order_time > datetime('now', '-1 day')`;
      
      db.get(query, [order.name], (err, row) => {
        if (err) {
          console.error('Error checking for existing order:', err);
          return;
        }
        
        // If no existing order, create one
        if (!row) {
          createOrderFromData(order, conversation);
        }
      });
    }
  }
}

// Process hospital data
function processHospitalData(conversation, extractedData) {
  // Check for appointment data
  if (extractedData.appointment) {
    const appointment = extractedData.appointment;
    
    // Check if this appointment already exists
    if (appointment.patient_name && appointment.date && appointment.time) {
      const query = `SELECT * FROM hospital_appointments 
                    WHERE patient_name = ? AND date = ? AND time = ?`;
      
      db.get(query, [appointment.patient_name, appointment.date, appointment.time], (err, row) => {
        if (err) {
          console.error('Error checking for existing appointment:', err);
          return;
        }
        
        // If no existing appointment, create one
        if (!row) {
          createAppointmentFromData(appointment, conversation);
        }
      });
    }
  }
  
  // Check for reminder data
  if (extractedData.reminder) {
    const reminder = extractedData.reminder;
    
    // Check if this reminder already exists
    if (reminder.patient_name && reminder.date) {
      const query = `SELECT * FROM hospital_reminders 
                    WHERE patient_name = ? AND date = ? AND time = ?`;
      
      db.get(query, [reminder.patient_name, reminder.date, reminder.time || ''], (err, row) => {
        if (err) {
          console.error('Error checking for existing reminder:', err);
          return;
        }
        
        // If no existing reminder, create one
        if (!row) {
          createReminderFromData(reminder, conversation);
        }
      });
    }
  }
}

// Helper functions to create entities from extracted data
function createReservationFromData(reservation, conversation) {
  const id = generateId('r');
  const created_at = new Date().toISOString();
  const status = 'confirmed';
  
  const query = `INSERT INTO restaurant_reservations 
                (id, name, phone, date, time, guests, special_requests, status, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(query, [
    id, 
    reservation.name || 'Customer', 
    reservation.phone || '', 
    reservation.date || '', 
    reservation.time || '', 
    reservation.guests || 1, 
    reservation.special_requests || '', 
    status, 
    created_at
  ], function(err) {
    if (err) {
      console.error('Error creating reservation from conversation:', err);
    } else {
      console.log(`Created reservation ${id} from conversation ${conversation.id}`);
    }
  });
}

function createOrderFromData(order, conversation) {
  const id = generateId('o');
  const order_time = new Date().toISOString();
  const status = 'pending';
  
  // Determine if delivery or pickup
  const type = order.delivery_address ? 'delivery' : 'pickup';
  
  const query = `INSERT INTO restaurant_orders 
                (id, name, phone, address, items, total, type, status, order_time) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(query, [
    id, 
    order.name || 'Customer', 
    order.phone || '', 
    order.delivery_address || order.address || '', 
    JSON.stringify(order.items || []), 
    order.total || 0.0, 
    type, 
    status, 
    order_time
  ], function(err) {
    if (err) {
      console.error('Error creating order from conversation:', err);
    } else {
      console.log(`Created order ${id} from conversation ${conversation.id}`);
    }
  });
}

function createAppointmentFromData(appointment, conversation) {
  const id = generateId('a');
  const created_at = new Date().toISOString();
  const status = 'scheduled';
  
  const query = `INSERT INTO hospital_appointments 
                (id, patient_name, patient_id, phone, doctor, department, date, time, reason, status, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(query, [
    id, 
    appointment.patient_name || 'Patient', 
    appointment.patient_id || '', 
    appointment.phone || '', 
    appointment.doctor || '', 
    appointment.department || '', 
    appointment.date || '', 
    appointment.time || '', 
    appointment.reason || appointment.notes || '', 
    status, 
    created_at
  ], function(err) {
    if (err) {
      console.error('Error creating appointment from conversation:', err);
    } else {
      console.log(`Created appointment ${id} from conversation ${conversation.id}`);
    }
  });
}

function createReminderFromData(reminder, conversation) {
  const id = generateId('rem');
  const created_at = new Date().toISOString();
  const status = 'scheduled';
  
  const query = `INSERT INTO hospital_reminders 
                (id, patient_name, patient_id, phone, type, date, time, doctor, message, status, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(query, [
    id, 
    reminder.patient_name || 'Patient', 
    reminder.patient_id || '', 
    reminder.phone || '', 
    reminder.type || 'appointment', 
    reminder.date || '', 
    reminder.time || '', 
    reminder.doctor || '', 
    reminder.message || '', 
    status, 
    created_at
  ], function(err) {
    if (err) {
      console.error('Error creating reminder from conversation:', err);
    } else {
      console.log(`Created reminder ${id} from conversation ${conversation.id}`);
    }
  });
}

// Restaurant Reservations API
app.get('/api/restaurant/reservations', (req, res) => {
  db.all('SELECT * FROM restaurant_reservations', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/restaurant/reservations', (req, res) => {
  const { name, phone, date, time, guests, special_requests } = req.body;
  const id = generateId('r');
  const created_at = new Date().toISOString();
  const status = 'confirmed';
  
  const query = `INSERT INTO restaurant_reservations 
                (id, name, phone, date, time, guests, special_requests, status, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(query, [id, name, phone, date, time, guests, special_requests, status, created_at], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    res.json({
      id,
      name,
      phone,
      date,
      time,
      guests,
      special_requests,
      status,
      created_at
    });
  });
});

// Restaurant Orders API
app.get('/api/restaurant/orders', (req, res) => {
  db.all('SELECT * FROM restaurant_orders', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Parse JSON items field
    const orders = rows.map(order => ({
      ...order,
      items: JSON.parse(order.items)
    }));
    
    res.json(orders);
  });
});

app.post('/api/restaurant/orders', (req, res) => {
  const { name, phone, address, items, total, type } = req.body;
  const id = generateId('o');
  const order_time = new Date().toISOString();
  const status = 'pending';
  
  const query = `INSERT INTO restaurant_orders 
                (id, name, phone, address, items, total, type, status, order_time) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(query, [id, name, phone, address, JSON.stringify(items), total, type, status, order_time], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    res.json({
      id,
      name,
      phone,
      address,
      items,
      total,
      type,
      status,
      order_time
    });
  });
});

// Hospital Appointments API
app.get('/api/hospital/appointments', (req, res) => {
  db.all('SELECT * FROM hospital_appointments', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/hospital/appointments', (req, res) => {
  const { patient_name, patient_id, phone, doctor, department, date, time, reason } = req.body;
  const id = generateId('a');
  const created_at = new Date().toISOString();
  const status = 'scheduled';
  
  const query = `INSERT INTO hospital_appointments 
                (id, patient_name, patient_id, phone, doctor, department, date, time, reason, status, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(query, [id, patient_name, patient_id, phone, doctor, department, date, time, reason, status, created_at], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    res.json({
      id,
      patient_name,
      patient_id,
      phone,
      doctor,
      department,
      date,
      time,
      reason,
      status,
      created_at
    });
  });
});

// Hospital Reminders API
app.get('/api/hospital/reminders', (req, res) => {
  db.all('SELECT * FROM hospital_reminders', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/hospital/reminders', (req, res) => {
  const { patient_name, patient_id, phone, type, date, time, doctor, message } = req.body;
  const id = generateId('rem');
  const created_at = new Date().toISOString();
  const status = 'scheduled';
  
  const query = `INSERT INTO hospital_reminders 
                (id, patient_name, patient_id, phone, type, date, time, doctor, message, status, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(query, [id, patient_name, patient_id, phone, type, date, time, doctor, message, status, created_at], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    res.json({
      id,
      patient_name,
      patient_id,
      phone,
      type,
      date,
      time,
      doctor,
      message,
      status,
      created_at
    });
  });
});

// Get upcoming activities (combined restaurant and hospital)
app.get('/api/upcoming', (req, res) => {
  const limit = req.query.limit || 10;
  
  Promise.all([
    new Promise((resolve, reject) => {
      db.all('SELECT *, "reservation" as type, "restaurant" as category FROM restaurant_reservations WHERE date >= date("now") ORDER BY date, time', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),
    new Promise((resolve, reject) => {
      db.all('SELECT *, "order" as type, "restaurant" as category FROM restaurant_orders WHERE status NOT IN ("delivered", "picked", "completed", "cancelled") ORDER BY order_time DESC', [], (err, rows) => {
        if (err) reject(err);
        else {
          // Parse items JSON for each order
          const parsedRows = rows.map(row => {
            try {
              if (row.items && typeof row.items === 'string') {
                row.items = JSON.parse(row.items);
              }
            } catch (e) {
              console.error(`Error parsing items for order ${row.id}:`, e);
            }
            return row;
          });
          resolve(parsedRows);
        }
      });
    }),
    new Promise((resolve, reject) => {
      db.all('SELECT *, "appointment" as type, "hospital" as category FROM hospital_appointments WHERE date >= date("now") ORDER BY date, time', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),
    new Promise((resolve, reject) => {
      db.all('SELECT *, "reminder" as type, "hospital" as category FROM hospital_reminders WHERE status = "scheduled" ORDER BY date, time', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    })
  ])
  .then(results => {
    const [reservations, orders, appointments, reminders] = results;
    
    // Log counts for debugging
    console.log(`Upcoming activities: ${reservations.length} reservations, ${orders.length} orders, ${appointments.length} appointments, ${reminders.length} reminders`);
    
    // Add datetime for sorting
    const activities = [
      ...reservations.map(r => {
        // Format date for sorting
        let datetime = null;
        try {
          datetime = new Date(`${r.date}T${r.time}`);
          // Validate date
          if (isNaN(datetime.getTime())) {
            datetime = new Date(); // Fallback to current date
          }
        } catch (e) {
          console.error(`Error parsing date for reservation ${r.id}:`, e);
          datetime = new Date(); // Fallback to current date
        }
        return {...r, datetime};
      }),
      
      ...orders.map(o => {
        // Calculate display time based on order type
        let displayTime = o.order_time;
        let datetime = null;
        
        if (o.delivery_time) {
          displayTime = o.delivery_time;
        } else if (o.pickup_time) {
          displayTime = o.pickup_time;
        }
        
        try {
          datetime = new Date(displayTime);
          // Validate date
          if (isNaN(datetime.getTime())) {
            datetime = new Date(); // Fallback to current date
          }
        } catch (e) {
          console.error(`Error parsing date for order ${o.id}:`, e);
          datetime = new Date(); // Fallback to current date
        }
        
        return {...o, datetime};
      }),
      
      ...appointments.map(a => {
        // Format date for sorting
        let datetime = null;
        try {
          datetime = new Date(`${a.date}T${a.time}`);
          // Validate date
          if (isNaN(datetime.getTime())) {
            datetime = new Date(); // Fallback to current date
          }
        } catch (e) {
          console.error(`Error parsing date for appointment ${a.id}:`, e);
          datetime = new Date(); // Fallback to current date
        }
        return {...a, datetime};
      }),
      
      ...reminders.map(r => {
        // Format date for sorting
        let datetime = null;
        try {
          if (r.scheduled_for) {
            datetime = new Date(r.scheduled_for);
          } else {
            datetime = new Date(`${r.date}T${r.time}`);
          }
          // Validate date
          if (isNaN(datetime.getTime())) {
            datetime = new Date(); // Fallback to current date
          }
        } catch (e) {
          console.error(`Error parsing date for reminder ${r.id}:`, e);
          datetime = new Date(); // Fallback to current date
        }
        return {...r, datetime};
      })
    ];
    
    // Sort by datetime
    activities.sort((a, b) => {
      // Handle invalid dates
      if (!a.datetime) return 1;
      if (!b.datetime) return -1;
      return a.datetime - b.datetime;
    });
    
    // Return sorted and limited results
    res.json(activities.slice(0, limit));
  })
  .catch(err => {
    console.error('Error fetching upcoming activities:', err);
    res.status(500).json({ error: err.message });
  });
});

// Extract data from a conversation and create activities
app.post('/api/extract-from-conversation/:id', (req, res) => {
  const conversationId = req.params.id;
  
  db.get('SELECT * FROM conversations WHERE id = ?', [conversationId], (err, conversation) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }
    
    let data;
    try {
      data = JSON.parse(conversation.data);
    } catch (e) {
      res.status(400).json({ error: 'Invalid conversation data' });
      return;
    }
    
    const results = {
      success: false,
      message: 'No extracted data found',
      extractedItems: []
    };
    
    // Check if we have extractedData
    if (data && data.extractedData) {
      results.success = true;
      results.message = 'Data extracted successfully';
      
      // Process based on conversation type
      if (conversation.type === 'restaurant') {
        if (data.extractedData.reservation) {
          results.extractedItems.push({ 
            type: 'reservation', 
            name: data.extractedData.reservation.name || 'Unknown'
          });
          processRestaurantData(conversation, data.extractedData);
        }
        
        if (data.extractedData.order) {
          results.extractedItems.push({ 
            type: 'order', 
            name: data.extractedData.order.name || 'Unknown'
          });
          processRestaurantData(conversation, data.extractedData);
        }
      } else if (conversation.type === 'hospital') {
        if (data.extractedData.appointment) {
          results.extractedItems.push({ 
            type: 'appointment', 
            name: data.extractedData.appointment.patient_name || 'Unknown'
          });
          processHospitalData(conversation, data.extractedData);
        }
        
        if (data.extractedData.reminder) {
          results.extractedItems.push({ 
            type: 'reminder', 
            name: data.extractedData.reminder.patient_name || 'Unknown'
          });
          processHospitalData(conversation, data.extractedData);
        }
      }
    }
    
    res.json(results);
  });
});

// Start server
console.log('Starting server on port', PORT);
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Process existing conversations
  setTimeout(() => {
    processConversations();
  }, 5000); // Wait 5 seconds after server start to ensure database is ready
});

// Keep Node.js process alive
setInterval(() => {
  console.log('Server still running at:', new Date().toLocaleTimeString());
}, 10000);

// Add an unhandledRejection handler (this can cause process to exit if not handled)
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit
});

// Add uncaughtException handler (this can cause process to exit if not handled) 
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Don't exit
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Received SIGINT signal, shutting down gracefully');
  server.close(() => {
    console.log('HTTP server closed');
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed');
      }
      process.exit(0);
    });
  });
});

// Additional exit handler
process.on('exit', () => {
  console.log('Process exiting');
}); 