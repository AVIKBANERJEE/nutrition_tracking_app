// userModel.js

// Function to execute SQL query
async function query(connection, sql, values = []) {
    try {
      const [rows] = await connection.execute(sql, values);
      return rows;
    } catch (err) {
      console.error("Query execution error:", err);
      throw err;
    }
  }
  
  // Execute the user table schema creation
  async function createUserTable(connection) {
    const userTableSchema = `
      CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          age INT NOT NULL CHECK (age >= 12),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`;
  
    await query(connection, userTableSchema);
  }
  
  // MySQL User model
  const UserModel = {
    async create(connection, user) {
      const sql = 'INSERT INTO users (name, email, password, age) VALUES (?, ?, ?, ?)';
      const { name, email, password, age } = user;
      await query(connection, sql, [name, email, password, age]);
    },
  
    async findById(connection, id) {
      const sql = 'SELECT * FROM users WHERE id = ?';
      const rows = await query(connection, sql, [id]);
      return rows[0];
    },
  
    async findByEmail(connection, email) {
      const sql = 'SELECT * FROM users WHERE email = ?';
      const rows = await query(connection, sql, [email]);
      return rows[0];
    },
  
    async findAll(connection) {
      const sql = 'SELECT * FROM users';
      return await query(connection, sql);
    },
  
    async update(connection, id, user) {
      const { name, email, password, age } = user;
      const sql = 'UPDATE users SET name = ?, email = ?, password = ?, age = ? WHERE id = ?';
      await query(connection, sql, [name, email, password, age, id]);
    },
  
    async delete(connection, id) {
      const sql = 'DELETE FROM users WHERE id = ?';
      await query(connection, sql, [id]);
    }
  };
  
  module.exports = { UserModel, createUserTable };
  