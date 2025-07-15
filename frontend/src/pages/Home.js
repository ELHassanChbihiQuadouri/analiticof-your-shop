import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

function Home() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // يمكنك إضافة إرسال بيانات الاتصال إلى السيرفر هنا

    setFormStatus('Your message has been sent successfully!');
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setFormStatus(null), 5000);
  };

  return (
    <>
      <Navbar />
      <main style={styles.main}>
        <section style={styles.hero}>
          {user ? (
            <h1 style={styles.title}>Welcome back, {user.name}!</h1>
          ) : (
            <h1 style={styles.title}>Welcome to AnaliticOf Your Shop</h1>
          )}
          <p style={styles.subtitle}>
            Manage your shop orders and analyze sales data effortlessly.
          </p>

          {user ? (
            <a href="/dashboard" style={styles.primaryButton}>
              Go to Dashboard
            </a>
          ) : (
            <>
              <div style={styles.authLinks}>
                <a href="/signup" style={styles.secondaryButton}>Sign Up</a>
                <a href="/login" style={styles.primaryButton}>Login</a>
              </div>

              {/* خيار التسجيل بالدعوة */}
              <div style={{ marginTop: 20, textAlign: 'center' }}>
                <p>Are you invited by your Manager?</p>
                <Link to="/signup-invitation" style={styles.primaryButton}>
                  Sign Up with Invitation Code
                </Link>
              </div>
            </>
          )}
        </section>

        {/* Features Section */}
        <section style={styles.featuresSection}>
          <h2 style={styles.featuresTitle}>Features</h2>
          <div style={styles.featuresList}>
            <div style={styles.featureCard}>
              <h3>Order Management</h3>
              <p>Easily add, update, and track your customer orders.</p>
            </div>
            <div style={styles.featureCard}>
              <h3>Sales Analytics</h3>
              <p>Visualize your sales trends and make informed decisions.</p>
            </div>
            <div style={styles.featureCard}>
              <h3>User Friendly</h3>
              <p>Intuitive design for smooth user experience.</p>
            </div>
          </div>
        </section>

        {/* Description Section */}
        <section style={styles.descriptionSection}>
          <h2 style={styles.sectionTitle}>About AnaliticOf Your Shop</h2>
          <p style={styles.description}>
            AnaliticOf Your Shop is designed to empower small and medium-sized store owners by providing an easy-to-use platform to manage orders, analyze sales, and make data-driven decisions. Our intuitive interface and powerful analytics tools help you grow your business effectively.
          </p>
        </section>

        {/* Contact Description */}
        <section style={styles.contactDescriptionSection}>
          <h2 style={styles.sectionTitle}>Get in Touch</h2>
          <p style={styles.description}>
            If you have any questions, feedback, or need support, please use the contact form below or reach us via the contact details.
          </p>
        </section>

        {/* Contact Info */}
        <section style={styles.contactInfoSection}>
          <h3 style={styles.contactInfoTitle}>Contact Information</h3>
          <p><strong>Email:</strong> support@analiticofyourshop.com</p>
          <p><strong>Phone:</strong> +1 (555) 123-4567</p>
          <p><strong>Address:</strong> 123 Market Street, Suite 100, Cityville</p>
        </section>

        {/* Contact Form */}
        <section style={styles.contactFormSection}>
          <h3 style={styles.sectionTitle}>Send Us a Message</h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>
              Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Your full name"
              />
            </label>
            <label style={styles.label}>
              Email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="you@example.com"
              />
            </label>
            <label style={styles.label}>
              Message
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                style={styles.textarea}
                placeholder="Write your message here..."
                rows={5}
              />
            </label>
            <button type="submit" style={styles.submitButton}>Send Message</button>
          </form>
          {formStatus && <p style={styles.successMessage}>{formStatus}</p>}
        </section>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2025 AnaliticOf Your Shop. All rights reserved.</p>
      </footer>
    </>
  );
}

const styles = {
  main: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#000000',
    backgroundColor: '#FFFFFF',
    minHeight: '120vh',
    padding: '60px 20px',
    maxWidth: '1500px',
    margin: '0 auto',
  },
  hero: {
    textAlign: 'center',
    padding: '60px 20px 80px',
    background: 'linear-gradient(135deg,rgb(115, 159, 255),rgb(30, 119, 175))',
    color: 'white',
    borderRadius: '15px',
    boxShadow: '0 12px 30px rgba(37, 99, 235, 0.3)',
  },
  title: {
    fontSize: '3rem',
    fontWeight: '900',
    marginBottom: '20px',
    lineHeight: 1.1,
  },
  subtitle: {
    fontSize: '1.3rem',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: '40px',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
    lineHeight: 1.6,
  },
  authLinks: {
    display: 'inline-flex',
    justifyContent: 'center',
    gap: '24px',
  },
  primaryButton: {
    backgroundColor: '#03a7ff',
    color: '#1e3a8a',
    padding: '14px 32px',
    fontSize: '1.2rem',
    borderRadius: '10px',
    fontWeight: '700',
    boxShadow: '0 6px 14px rgba(0, 247, 255, 0.6)',
    cursor: 'pointer',
    border: 'none',
    transition: 'background-color 0.3s ease',
    textDecoration: 'none',
    display: 'inline-block',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '2.5px solid white',
    padding: '14px 32px',
    fontSize: '1.2rem',
    borderRadius: '10px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: 'none',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    textDecoration: 'none',
    display: 'inline-block',
  },
  featuresSection: {
    marginBottom: '80px',
  },
  featuresTitle: {
    textAlign: 'center',
    fontSize: '2.8rem',
    fontWeight: '900',
    marginBottom: '45px',
    color: '#1e293b',
  },
  featuresList: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    flexWrap: 'wrap',
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
    width: '300px',
    padding: '35px 30px',
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'default',
    fontWeight: '600',
    fontSize: '1.05rem',
  },
  descriptionSection: {
    textAlign: 'center',
    marginBottom: '60px',
    maxWidth: '720px',
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: '1.15rem',
    color: '#475569',
    lineHeight: 1.7,
  },
  sectionTitle: {
    fontSize: '2.6rem',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '25px',
  },
  contactDescriptionSection: {
    textAlign: 'center',
    marginBottom: '40px',
    fontSize: '1.15rem',
    color: '#475569',
    maxWidth: '720px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  contactInfoSection: {
    backgroundColor: '#ffffff',
    padding: '30px 35px',
    borderRadius: '15px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
    marginBottom: '60px',
    fontSize: '1.05rem',
    color: '#334155',
    maxWidth: '520px',
    marginLeft: 'auto',
    marginRight: 'auto',
    lineHeight: 1.65,
  },
  contactInfoTitle: {
    fontWeight: '800',
    fontSize: '1.7rem',
    marginBottom: '25px',
    color: '#1e293b',
  },
  contactFormSection: {
    backgroundColor: '#ffffff',
    padding: '40px 35px',
    borderRadius: '15px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
    marginBottom: '80px',
    maxWidth: '620px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  label: {
    fontWeight: '600',
    fontSize: '1.1rem',
    color: '#334155',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  input: {
    padding: '14px 18px',
    fontSize: '1.1rem',
    borderRadius: '12px',
    border: '1.8px solid #cbd5e1',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  textarea: {
    padding: '14px 18px',
    fontSize: '1.1rem',
    borderRadius: '12px',
    border: '1.8px solid #cbd5e1',
    resize: 'vertical',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    fontWeight: '700',
    padding: '16px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
    boxShadow: '0 6px 20px rgb(37 99 235 / 0.7)',
    transition: 'background-color 0.3s ease',
  },
  successMessage: {
    color: '#16a34a',
    textAlign: 'center',
    marginTop: '20px',
    fontWeight: '700',
    fontSize: '1.1rem',
  },
  footer: {
    backgroundColor: '#1f2937',
    color: '#d1d5db',
    textAlign: 'center',
    padding: '28px 15px',
    fontSize: '1rem',
    fontWeight: '600',
    marginTop: '60px',
  },
};

export default Home;
