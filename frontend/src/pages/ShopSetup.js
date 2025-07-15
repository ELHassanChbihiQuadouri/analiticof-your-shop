import React, { useState, useEffect } from 'react';

function ShopSetup() {
  const [shopName, setShopName] = useState('');
  const [shopUrl, setShopUrl] = useState('');
  const [platform, setPlatform] = useState('shopify');
  const [importMethod, setImportMethod] = useState('api');
  const [message, setMessage] = useState('');

  // لجلب بيانات المتجر الحالية عند تحميل الصفحة
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:5000/api/shops', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch shop data');
        return res.json();
      })
      .then(data => {
        setShopName(data.name);
        setShopUrl(data.url);
        setPlatform(data.platform);
        setImportMethod(data.importMethod);
      })
      .catch(() => {
        // متجر غير موجود أو خطأ في جلب البيانات
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in');
      return;
    }

    try {
      const body = { 
        name: shopName,    // تصحيح هنا
        url: shopUrl, 
        platform, 
        importMethod 
      };
      const res = await fetch('http://localhost:5000/api/shops/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setMessage('Shop setup successful!');
      } else {
        const err = await res.json();
        setMessage('Error: ' + (err.msg || 'Failed to setup shop'));
      }
    } catch (error) {
      setMessage('Server error');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Setup Your Shop</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Shop Name"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="url"
          placeholder="Shop URL"
          value={shopUrl}
          onChange={(e) => setShopUrl(e.target.value)}
          required
          style={styles.input}
        />
        <select value={platform} onChange={(e) => setPlatform(e.target.value)} style={styles.input}>
          <option value="shopify">Shopify</option>
          <option value="woocommerce">WooCommerce</option>
          <option value="custom">Custom Store</option>
        </select>
        <select value={importMethod} onChange={(e) => setImportMethod(e.target.value)} style={styles.input}>
          <option value="api">Import via API</option>
          <option value="file">Upload Data File</option>
          <option value="manual">Manual Entry</option>
        </select>

        <button type="submit" style={styles.button}>Setup Shop</button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: '500px', margin: '30px auto', padding: '20px', boxShadow: '0 0 10px #ccc', borderRadius: '10px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '10px', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ccc' },
  button: { padding: '12px', backgroundColor: '#1e90ff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
};

export default ShopSetup;
