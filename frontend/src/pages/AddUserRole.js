import React, { useState } from 'react';

function AddUserRole() {
  const [email, setEmail] = useState('');
  const [roleName, setRoleName] = useState('Manager'); // القيمة الافتراضية
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const roles = ['Manager', 'Sales', 'Viewer']; // تأكد أن هذه الأدوار موجودة في DB

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/user-roles/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ email, roleName }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('User added successfully with role: ' + roleName);
        setEmail('');
        setRoleName('Manager');
      } else {
        setError(data.msg || 'Failed to add user role.');
      }
    } catch (err) {
      setError('Server error.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Add User to Shop with Role</h2>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          placeholder="user@example.com"
        />

        <label>Role:</label>
        <select
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          style={styles.select}
        >
          {roles.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>

        <button type="submit" style={styles.button}>Add User</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '40px auto',
    padding: '20px',
    boxShadow: '0 0 10px #ccc',
    borderRadius: '8px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  select: {
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '12px',
    backgroundColor: '#1e90ff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default AddUserRole;
