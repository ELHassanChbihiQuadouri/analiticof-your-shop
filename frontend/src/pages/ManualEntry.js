import React, { useState } from 'react';

function ManualEntry() {
  const [formData, setFormData] = useState({
    customer: '',
    total: '',
    status: 'Pending',
    date: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to add orders.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/orders/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Order added successfully!');
        setFormData({ customer: '', total: '', status: 'Pending', date: '' });
      } else {
        setError(data.msg || 'Failed to add order.');
      }
    } catch (error) {
      setError('Server error.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Add New Order</h2>
      {message && <p style={{color: 'green'}}>{message}</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="customer"
          placeholder="Customer Name"
          value={formData.customer}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="number"
          name="total"
          placeholder="Total Amount"
          value={formData.total}
          onChange={handleChange}
          required
          style={styles.input}
          min="0"
          step="0.01"
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Add Order</button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: '400px', margin: '30px auto', padding: '20px', boxShadow: '0 0 10px #ccc', borderRadius: '10px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '10px', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ccc' },
  button: { padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
};

export default ManualEntry;
