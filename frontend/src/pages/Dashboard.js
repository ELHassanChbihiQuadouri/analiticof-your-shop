import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const [user, setUser] = useState(null);
  const [shop, setShop] = useState(null);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    averageOrderValue: 0,
    monthlyGrowthRate: 0,
    cancellationRate: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    fetch('http://localhost:5000/api/shops', {
      headers: { Authorization: 'Bearer ' + token },
    })
      .then(res => {
        if (!res.ok) throw new Error('Shop not found');
        return res.json();
      })
      .then(data => {
        setShop(data);
        return fetch('http://localhost:5000/api/orders', {
          headers: { Authorization: 'Bearer ' + token },
        });
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
      })
      .then(ordersData => {
        setOrders(ordersData);
      })
      .catch(() => {
        setShop(null);
        setOrders([]);
      });

    fetch('http://localhost:5000/api/dashboard/stats', {
      headers: { Authorization: 'Bearer ' + token },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
      })
      .then(statsData => {
        setStats(statsData);
      })
      .catch(() => {
        setStats({
          averageOrderValue: 0,
          monthlyGrowthRate: 0,
          cancellationRate: 0,
        });
      });
  }, [navigate]);

  const updateOrderStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/orders/update/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update order');
      const updatedOrder = await res.json();
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? updatedOrder.order : order
        )
      );
    } catch (error) {
      alert('Error updating order status');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!user) return <p>Loading...</p>;

  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const ordersCount = orders.length;
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const shippedCount = orders.filter(o => o.status === 'Shipped').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
  const cancelledCount = orders.filter(o => o.status === 'Cancelled').length;

  const currentYear = new Date().getFullYear();
  const salesByMonth = new Array(12).fill(0);
  orders.forEach(order => {
    const date = new Date(order.date);
    if (date.getFullYear() === currentYear) {
      salesByMonth[date.getMonth()] += order.total;
    }
  });

  const monthLabels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const barData = {
    labels: monthLabels,
    datasets: [
      {
        label: `Monthly Sales in ${currentYear} ($)`,
        data: salesByMonth,
        backgroundColor: 'rgba(37, 99, 235, 0.7)',
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: `Monthly Sales in ${currentYear}` },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => `$${value.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Welcome, {user.name}!</h1>
        <div>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
          {user.role === 'Manager' && (
            <Link to="/user-management" style={styles.userMgmtBtn}>Manage Users</Link>
          )}
        </div>
      </header>

      {!shop ? (
        <>
          <h2>You haven't registered a shop yet.</h2>
          <div style={styles.actions}>
            <Link to="/shop-setup" style={styles.actionBtn}>Register Your Shop</Link>
            <Link to="/manual-entry" style={{ ...styles.actionBtn, backgroundColor: '#28a745' }}>Enter Data Manually</Link>
          </div>
        </>
      ) : (
        <>
          <nav style={styles.nav}>
            <Link to="/manual-entry" style={styles.navLink}>Add Manual Order</Link>
          </nav>

          <section style={styles.statsSection}>
            <StatCard title="Total Sales" value={`$${totalSales.toFixed(2)}`} />
            <StatCard title="Total Orders" value={ordersCount} />
            <StatCard title="Pending Orders" value={pendingCount} />
            <StatCard title="Shipped Orders" value={shippedCount} />
            <StatCard title="Delivered Orders" value={deliveredCount} />
            <StatCard title="Cancelled Orders" value={cancelledCount} />
            <StatCard title="Average Order Value" value={`$${stats.averageOrderValue}`} />
            <StatCard title="Monthly Growth Rate" value={`${stats.monthlyGrowthRate}%`} />
            <StatCard title="Cancellation Rate" value={`${stats.cancellationRate}%`} />
          </section>

          <section style={styles.chartContainer}>
            <Bar data={barData} options={barOptions} />
          </section>

          <section>
            <h2>Recent Orders</h2>
            <table style={styles.table}>
              <thead style={styles.tableHead}>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Total ($)</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={styles.tableRow}>
                    <td>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>{order.status}</td>
                    <td>{new Date(order.date).toLocaleDateString()}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={e => updateOrderStatus(order.id, e.target.value)}
                        style={styles.select}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div style={styles.statCard}>
      <p style={styles.statTitle}>{title}</p>
      <p style={styles.statValue}>{value}</p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '40px auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f0f4ff',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  logoutBtn: {
    backgroundColor: '#ff4d4d',
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginRight: '10px',
  },
  userMgmtBtn: {
    backgroundColor: '#1e90ff',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  actions: {
    display: 'flex',
    gap: '20px',
  },
  actionBtn: {
    padding: '12px 30px',
    backgroundColor: '#1e90ff',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  nav: {
    marginBottom: '30px',
    display: 'flex',
    gap: '20px',
  },
  navLink: {
    padding: '10px 20px',
    backgroundColor: '#1e90ff',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  statsSection: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '40px',
  },
  statCard: {
    flex: '1 1 150px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  statTitle: {
    fontSize: '1rem',
    color: '#555',
    marginBottom: '8px',
    fontWeight: '600',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1e40af',
  },
  chartContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: '12px',
    boxShadow: '0 3px 12px rgba(0,0,0,0.1)',
    marginBottom: '40px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  tableHead: {
    backgroundColor: '#1e90ff',
    color: 'white',
  },
  tableRow: {
    borderBottom: '1px solid #ddd',
  },
  select: {
    padding: '6px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    cursor: 'pointer',
  },
};

export default Dashboard;
