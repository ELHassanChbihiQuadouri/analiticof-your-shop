import React, { useState, useEffect } from 'react';

function UserManagement() {
  const [usersRoles, setUsersRoles] = useState([]);
  const [email, setEmail] = useState('');
  const [roleName, setRoleName] = useState('Viewer');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const fetchUsersRoles = () => {
    fetch('http://localhost:5000/api/user-roles', {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(res => res.json())
      .then(data => setUsersRoles(data))
      .catch(() => setUsersRoles([]));
  };

  useEffect(() => {
    fetchUsersRoles();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

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
        setMessage('Verification code sent to user email.');
        setEmail('');
        fetchUsersRoles();
      } else {
        setError(data.msg || 'Failed to send verification code.');
      }
    } catch {
      setError('Server error.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to remove this user?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/user-roles/delete/${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.msg);
        fetchUsersRoles();
      } else {
        setError(data.msg || 'Failed to remove user.');
      }
    } catch {
      setError('Server error.');
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 20, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h2>User Management</h2>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleAddUser} style={{ marginBottom: 30 }}>
        <input
          type="email"
          placeholder="User Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ padding: 10, marginRight: 10, width: '60%' }}
        />
        <select
          value={roleName}
          onChange={e => setRoleName(e.target.value)}
          style={{ padding: 10, marginRight: 10 }}
        >
          <option value="Viewer">Viewer</option>
          <option value="Sales">Sales</option>
        </select>
        <button
          type="submit"
          style={{ padding: 10, backgroundColor: '#1e90ff', color: 'white', border: 'none', borderRadius: 5 }}
        >
          Send Invitation
        </button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#1e90ff', color: 'white' }}>
          <tr>
            <th style={{ padding: 10 }}>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {usersRoles.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: 10 }}>
                No users found.
              </td>
            </tr>
          )}
          {usersRoles.map(({ id, User, Role }) => (
            <tr key={id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: 10 }}>{User?.name || 'N/A'}</td>
              <td>{User?.email || 'N/A'}</td>
              <td>{Role?.name || 'N/A'}</td>
              <td>
                <button
                  onClick={() => handleDelete(id)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#ff4d4d',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                  }}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
