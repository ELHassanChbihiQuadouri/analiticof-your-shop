import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage('Login successful! Redirecting...');

        setTimeout(() => {
          if (data.user.needsShopSetup && data.user.role === 'Manager') {
            navigate('/shop-setup');
          } else {
            navigate('/dashboard');
          }
        }, 1500);
      } else {
        setError(data.msg || 'Login failed');
      }
    } catch {
      setError('Server error');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>

      {/* ✅ رابط التسجيل */}
      <p style={styles.linkText}>
        Don't have an account?{' '}
        <span onClick={() => navigate('/signup')} style={styles.link}>
          Sign up
        </span>
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '30px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    borderRadius: '12px',
    backgroundColor: '#f7f9fc',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#0b3d91',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '12px 15px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    padding: '12px',
    backgroundColor: '#1e90ff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(30, 144, 255, 0.5)',
  },
  success: {
    color: 'green',
    textAlign: 'center',
    marginBottom: '15px',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '15px',
  },
  linkText: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#333',
  },
  link: {
    color: '#1e90ff',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default Login;
