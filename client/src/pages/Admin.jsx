import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, money } from '../api.js';
import { useApp } from '../AppContext.jsx';
import ProductImage from '../components/ProductImage.jsx';

const TYPES = ['tshirt', 'shirt', 'top', 'hoodie', 'jacket', 'jeans', 'trousers', 'dress', 'kurti', 'skirt'];
const empty = { name: '', description: '', price: '', category: 'men', type: 'tshirt', color: '#222222', colorName: '', sizes: 'S,M,L,XL', stock: 50, image: '', featured: false };

export default function Admin() {
  const { user, notify } = useApp();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [err, setErr] = useState('');

  const load = () => api('/products').then(setItems);
  useEffect(() => { load(); }, []);

  if (user?.role !== 'admin') return <div className="container mt-5 alert alert-warning">Admin access only. <Link to="/login">Login as admin</Link></div>;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault(); setErr('');
    const body = { ...form, price: Number(form.price), stock: Number(form.stock), sizes: String(form.sizes).split(',').map((s) => s.trim()).filter(Boolean) };
    try {
      if (editId) await api('/products/' + editId, { method: 'PUT', body });
      else await api('/products', { method: 'POST', body });
      notify(editId ? 'Product updated' : 'Product added');
      setForm(empty); setEditId(null); load();
    } catch (e2) { setErr(e2.message); }
  };

  const edit = (p) => { setEditId(p._id); setForm({ ...p, sizes: p.sizes.join(',') }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const del = async (p) => { if (confirm(`Delete "${p.name}"?`)) { await api('/products/' + p._id, { method: 'DELETE' }); notify('Product deleted'); load(); } };

  return (
    <div className="container mt-4">
      <h2 className="th-logo">Manage Products</h2>
      <form className="card card-body my-3" onSubmit={submit}>
        <h5>{editId ? 'Edit product' : 'Add product'}</h5>
        {err && <div className="alert alert-danger py-2">{err}</div>}
        <div className="row g-2">
          <div className="col-md-6"><input className="form-control" placeholder="Name" required value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
          <div className="col-md-3"><input className="form-control" type="number" placeholder="Price (₹)" required value={form.price} onChange={(e) => set('price', e.target.value)} /></div>
          <div className="col-md-3"><input className="form-control" type="number" placeholder="Stock" value={form.stock} onChange={(e) => set('stock', e.target.value)} /></div>
          <div className="col-md-3"><select className="form-select" value={form.category} onChange={(e) => set('category', e.target.value)}><option value="men">Men</option><option value="women">Women</option></select></div>
          <div className="col-md-3"><select className="form-select" value={form.type} onChange={(e) => set('type', e.target.value)}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
          <div className="col-md-3"><input className="form-control" placeholder="Colour name" value={form.colorName} onChange={(e) => set('colorName', e.target.value)} /></div>
          <div className="col-md-3"><input type="color" className="form-control form-control-color w-100" value={form.color} onChange={(e) => set('color', e.target.value)} /></div>
          <div className="col-md-6"><input className="form-control" placeholder="Sizes (comma separated)" value={form.sizes} onChange={(e) => set('sizes', e.target.value)} /></div>
          <div className="col-md-6"><input className="form-control" placeholder="Real photo URL (optional, replaces illustration)" value={form.image} onChange={(e) => set('image', e.target.value)} /></div>
          <div className="col-12"><textarea className="form-control" rows="2" placeholder="Description" value={form.description} onChange={(e) => set('description', e.target.value)} /></div>
          <div className="col-12 d-flex align-items-center gap-3">
            <div className="form-check"><input id="feat" type="checkbox" className="form-check-input" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} /><label htmlFor="feat" className="form-check-label">Featured on home</label></div>
            <button className="btn btn-dark">{editId ? 'Save changes' : 'Add product'}</button>
            {editId && <button type="button" className="btn btn-outline-secondary" onClick={() => { setEditId(null); setForm(empty); }}>Cancel</button>}
          </div>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead><tr><th></th><th>Name</th><th>Category</th><th>Type</th><th>Price</th><th></th></tr></thead>
          <tbody>
            {items.map((p) => (
              <tr key={p._id}>
                <td style={{ width: 60 }}><ProductImage product={p} /></td>
                <td>{p.name}</td><td className="text-capitalize">{p.category}</td><td>{p.type}</td><td>{money(p.price)}</td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-dark me-1" onClick={() => edit(p)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => del(p)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
