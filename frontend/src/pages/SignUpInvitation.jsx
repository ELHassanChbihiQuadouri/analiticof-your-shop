import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function SignUpInvitation() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    code: '',
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setErrors([]);

    try {
      const res = await fetch('http://localhost:5000/api/user-roles/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.msg || 'Registration successful! You can now login.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        if (data.errors) {
          setErrors(data.errors.map(err => err.msg));
        } else if (data.msg) {
          setErrors([data.msg]);
        } else {
          setErrors(['Registration failed']);
        }
      }
    } catch (error) {
      setErrors(['Server error. Please try again later.']);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Sign Up Invitation</h2>

      {message && <p style={{ color: 'green' }}>{message}</p>}

      {errors.length > 0 && (
        <ul style={{ color: 'red' }}>
          {errors.map((err, i) => <li key={i}>{err}</li>)}
        </ul>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password (min 6 characters)"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
          style={styles.input}
        />
        <input
          type="text"
          name="code"
          placeholder="Verification Code"
          value={formData.code}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>Register</button>
      </form>

      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    boxShadow: '0 0 10px #ccc',
    borderRadius: '10px',
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

export default SignUpInvitation;
