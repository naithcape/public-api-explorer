const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist/public-api-explorer')));

// Initialize SQLite database
const db = new Database('api-explorer.db', { verbose: console.log });

// Create tables if they don't exist
function initializeDatabase() {
  // APIs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS apis (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      link TEXT NOT NULL,
      description TEXT NOT NULL,
      votes_up INTEGER DEFAULT 0,
      votes_down INTEGER DEFAULT 0,
      status TEXT DEFAULT 'New',
      active INTEGER DEFAULT 1
    )
  `);

  // API Requests table
  db.exec(`
    CREATE TABLE IF NOT EXISTS api_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      link TEXT NOT NULL,
      description TEXT NOT NULL,
      submitted_date TEXT NOT NULL,
      status TEXT DEFAULT 'Pending',
      status_reason TEXT
    )
  `);

  // Check if APIs table is empty, if so, populate with initial data
  const count = db.prepare('SELECT COUNT(*) as count FROM apis').get();

  if (count.count === 0) {
    // Import initial APIs from the model file
    const { INITIAL_APIS } = require('./src/app/models/api.model');

    // Insert initial APIs
    const insertApi = db.prepare(`
      INSERT INTO apis (id, name, link, description, votes_up, votes_down, status, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    INITIAL_APIS.forEach(api => {
      insertApi.run(
        api.id,
        api.name,
        api.link,
        api.description,
        api.votes_up,
        api.votes_down,
        api.status,
        api.active ? 1 : 0
      );
    });

    console.log('Database initialized with initial APIs');
  }
}

// Initialize the database
initializeDatabase();

// API Routes

// Get all APIs
app.get('/api/apis', (req, res) => {
  try {
    const apis = db.prepare('SELECT * FROM apis').all();
    res.json(apis.map(api => ({
      ...api,
      active: Boolean(api.active)
    })));
  } catch (error) {
    console.error('Error fetching APIs:', error);
    res.status(500).json({ error: 'Failed to fetch APIs' });
  }
});

// Get active APIs
app.get('/api/apis/active', (req, res) => {
  try {
    const apis = db.prepare('SELECT * FROM apis WHERE active = 1').all();
    res.json(apis.map(api => ({
      ...api,
      active: Boolean(api.active)
    })));
  } catch (error) {
    console.error('Error fetching active APIs:', error);
    res.status(500).json({ error: 'Failed to fetch active APIs' });
  }
});

// Get APIs by status
app.get('/api/apis/status/:status', (req, res) => {
  try {
    const { status } = req.params;
    const apis = db.prepare('SELECT * FROM apis WHERE status = ?').all(status);
    res.json(apis.map(api => ({
      ...api,
      active: Boolean(api.active)
    })));
  } catch (error) {
    console.error('Error fetching APIs by status:', error);
    res.status(500).json({ error: 'Failed to fetch APIs by status' });
  }
});

// Add a new API
app.post('/api/apis', (req, res) => {
  try {
    const { name, link, description } = req.body;

    const insertApi = db.prepare(`
      INSERT INTO apis (name, link, description, votes_up, votes_down, status, active)
      VALUES (?, ?, ?, 0, 0, 'New', 1)
    `);

    const result = insertApi.run(name, link, description);

    const newApi = db.prepare('SELECT * FROM apis WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      ...newApi,
      active: Boolean(newApi.active)
    });
  } catch (error) {
    console.error('Error adding API:', error);
    res.status(500).json({ error: 'Failed to add API' });
  }
});

// Update an API
app.put('/api/apis/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, link, description, votes_up, votes_down, status, active } = req.body;

    const updateApi = db.prepare(`
      UPDATE apis
      SET name = ?, link = ?, description = ?, votes_up = ?, votes_down = ?, status = ?, active = ?
      WHERE id = ?
    `);

    updateApi.run(name, link, description, votes_up, votes_down, status, active ? 1 : 0, id);

    const updatedApi = db.prepare('SELECT * FROM apis WHERE id = ?').get(id);

    if (!updatedApi) {
      return res.status(404).json({ error: 'API not found' });
    }

    res.json({
      ...updatedApi,
      active: Boolean(updatedApi.active)
    });
  } catch (error) {
    console.error('Error updating API:', error);
    res.status(500).json({ error: 'Failed to update API' });
  }
});

// Delete an API
app.delete('/api/apis/:id', (req, res) => {
  try {
    const { id } = req.params;

    const deleteApi = db.prepare('DELETE FROM apis WHERE id = ?');
    const result = deleteApi.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'API not found' });
    }

    res.json({ message: 'API deleted successfully' });
  } catch (error) {
    console.error('Error deleting API:', error);
    res.status(500).json({ error: 'Failed to delete API' });
  }
});

// Vote up an API
app.post('/api/apis/:id/vote-up', (req, res) => {
  try {
    const { id } = req.params;

    // Get current API
    const api = db.prepare('SELECT * FROM apis WHERE id = ?').get(id);

    if (!api) {
      return res.status(404).json({ error: 'API not found' });
    }

    // Update votes
    const votes_up = api.votes_up + 1;

    // Determine new status and active state
    let status = api.status;
    let active = api.active;

    const totalVotes = votes_up + api.votes_down;

    if (totalVotes <= 2) {
      status = 'New';
    } else if (votes_up >= 5) {
      status = 'Recommended';
      active = 1;
    } else if (api.votes_down >= 3) {
      status = 'Not Recommended';
    }

    // Update API
    const updateApi = db.prepare(`
      UPDATE apis
      SET votes_up = ?, status = ?, active = ?
      WHERE id = ?
    `);

    updateApi.run(votes_up, status, active, id);

    const updatedApi = db.prepare('SELECT * FROM apis WHERE id = ?').get(id);

    res.json({
      ...updatedApi,
      active: Boolean(updatedApi.active)
    });
  } catch (error) {
    console.error('Error voting up API:', error);
    res.status(500).json({ error: 'Failed to vote up API' });
  }
});

// Vote down an API
app.post('/api/apis/:id/vote-down', (req, res) => {
  try {
    const { id } = req.params;

    // Get current API
    const api = db.prepare('SELECT * FROM apis WHERE id = ?').get(id);

    if (!api) {
      return res.status(404).json({ error: 'API not found' });
    }

    // Update votes
    const votes_down = api.votes_down + 1;

    // Determine new status and active state
    let status = api.status;
    let active = api.active;

    const totalVotes = api.votes_up + votes_down;

    if (totalVotes <= 2) {
      status = 'New';
    } else if (api.votes_up >= 5) {
      status = 'Recommended';
    } else if (votes_down >= 3) {
      status = 'Not Recommended';
    }

    if (votes_down >= 5) {
      active = 0;
    }

    // Update API
    const updateApi = db.prepare(`
      UPDATE apis
      SET votes_down = ?, status = ?, active = ?
      WHERE id = ?
    `);

    updateApi.run(votes_down, status, active, id);

    const updatedApi = db.prepare('SELECT * FROM apis WHERE id = ?').get(id);

    res.json({
      ...updatedApi,
      active: Boolean(updatedApi.active)
    });
  } catch (error) {
    console.error('Error voting down API:', error);
    res.status(500).json({ error: 'Failed to vote down API' });
  }
});

// API Request Routes

// Get all API requests
app.get('/api/requests', (req, res) => {
  try {
    const requests = db.prepare('SELECT * FROM api_requests').all();
    res.json(requests);
  } catch (error) {
    console.error('Error fetching API requests:', error);
    res.status(500).json({ error: 'Failed to fetch API requests' });
  }
});

// Get pending API requests
app.get('/api/requests/pending', (req, res) => {
  try {
    const requests = db.prepare("SELECT * FROM api_requests WHERE status = 'Pending'").all();
    res.json(requests);
  } catch (error) {
    console.error('Error fetching pending API requests:', error);
    res.status(500).json({ error: 'Failed to fetch pending API requests' });
  }
});

// Submit a new API request
app.post('/api/requests', (req, res) => {
  try {
    const { name, link, description } = req.body;
    const submitted_date = new Date().toISOString();

    const insertRequest = db.prepare(`
      INSERT INTO api_requests (name, link, description, submitted_date, status)
      VALUES (?, ?, ?, ?, 'Pending')
    `);

    const result = insertRequest.run(name, link, description, submitted_date);

    const newRequest = db.prepare('SELECT * FROM api_requests WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Error submitting API request:', error);
    res.status(500).json({ error: 'Failed to submit API request' });
  }
});

// Approve an API request
app.post('/api/requests/:id/approve', (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // Start a transaction
    db.exec('BEGIN TRANSACTION');

    // Get the request
    const request = db.prepare('SELECT * FROM api_requests WHERE id = ?').get(id);

    if (!request) {
      db.exec('ROLLBACK');
      return res.status(404).json({ error: 'API request not found' });
    }

    // Update request status
    const updateRequest = db.prepare(`
      UPDATE api_requests
      SET status = 'Approved', status_reason = ?
      WHERE id = ?
    `);

    updateRequest.run(reason || null, id);

    // Add the API to the APIs table
    const insertApi = db.prepare(`
      INSERT INTO apis (name, link, description, votes_up, votes_down, status, active)
      VALUES (?, ?, ?, 0, 0, 'New', 1)
    `);

    insertApi.run(request.name, request.link, request.description);

    // Commit the transaction
    db.exec('COMMIT');

    res.json({ message: 'API request approved successfully' });
  } catch (error) {
    db.exec('ROLLBACK');
    console.error('Error approving API request:', error);
    res.status(500).json({ error: 'Failed to approve API request' });
  }
});

// Decline an API request
app.post('/api/requests/:id/decline', (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ error: 'Reason is required for declining a request' });
    }

    // Update request status
    const updateRequest = db.prepare(`
      UPDATE api_requests
      SET status = 'Declined', status_reason = ?
      WHERE id = ?
    `);

    const result = updateRequest.run(reason, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'API request not found' });
    }

    res.json({ message: 'API request declined successfully' });
  } catch (error) {
    console.error('Error declining API request:', error);
    res.status(500).json({ error: 'Failed to decline API request' });
  }
});

// Catch-all route to serve Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/public-api-explorer/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
