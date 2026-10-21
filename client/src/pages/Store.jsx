import { useEffect, useState } from 'react';
import { Link, useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { api, money } from '../api.js';
import { useApp } from '../AppContext.jsx';
import { ProductCard, Loading } from '../components/Parts.jsx';
import ProductImage from '../components/ProductImage.jsx';

/* ---------------- HOME ---------------- */
export function Home() {
  const [items, setItems] = useState(null);
  useEffect(() => { api('/products?featured=true').then(setItems).catch(() => setItems([])); }, []);
  return (
    <>
      <section className="th-hero">
        <div className="container py-5">
          <div className="row align-items-center py-4">
            <div className="col-lg-7">
              <p className="text-uppercase small tracking">New Season · Men &amp; Women</p>
              <h1 className="display-4 th-logo">Wear the<br />story you write.</h1>
              <p className="lead my-3">Everyday essentials, bold basics and statement pieces, made to move with you.</p>
              <Link to="/shop?category=men" className="btn btn-dark btn-lg me-2">Shop Men</Link>
              <Link to="/shop?category=women" className="btn btn-outline-dark btn-lg">Shop Women</Link>
            </div>
          </div>
        </div>
      </section>
      <div className="container mt-5">
        <div className="row g-3">
          {['men', 'women'].map((c) => (
            <div className="col-md-6" key={c}>
              <Link to={`/shop?category=${c}`} className={`th-banner ${c}`}>
                <span>{c === 'men' ? "Men's Collection" : "Women's Collection"}</span>
                <small>Explore →</small>
              </Link>
            </div>
          ))}
        </div>
        <h2 className="th-logo mt-5 mb-3">Featured Picks</h2>
        {!items ? <Loading /> : (
          <div className="row g-3">
            {items.map((p) => <div className="col-6 col-md-4 col-lg-3" key={p._id}><ProductCard product={p} /></div>)}
          </div>
        )}
      </div>
    </>
  );
}

/* ---------------- SHOP ---------------- */
const TYPES = ['tshirt', 'shirt', 'top', 'hoodie', 'jacket', 'jeans', 'trousers', 'dress', 'kurti', 'skirt'];

export function Shop() {
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState(null);
  const category = params.get('category') || '';
  const type = params.get('type') || '';
  const q = params.get('q') || '';

  useEffect(() => {
    setItems(null);
    const qs = new URLSearchParams({ ...(category && { category }), ...(type && { type }), ...(q && { q }) });
    api('/products?' + qs).then(setItems).catch(() => setItems([]));
  }, [category, type, q]);

  const set = (k, v) => { const n = new URLSearchParams(params); v ? n.set(k, v) : n.delete(k); setParams(n); };

  return (
    <div className="container mt-4">
      <h2 className="th-logo">{category ? `${category === 'men' ? "Men's" : "Women's"} Clothing` : 'All Clothing'}</h2>
      <div className="row g-2 my-3">
        <div className="col-md-4"><input className="form-control" placeholder="Search products…" value={q} onChange={(e) => set('q', e.target.value)} /></div>
        <div className="col-6 col-md-3">
          <select className="form-select" value={category} onChange={(e) => set('category', e.target.value)}>
            <option value="">Men &amp; Women</option><option value="men">Men</option><option value="women">Women</option>
          </select>
        </div>
        <div className="col-6 col-md-3">
          <select className="form-select" value={type} onChange={(e) => set('type', e.target.value)}>
            <option value="">All types</option>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      {!items ? <Loading /> : items.length === 0 ? <p className="text-muted">No products found.</p> : (
        <div className="row g-3">
          {items.map((p) => <div className="col-6 col-md-4 col-lg-3" key={p._id}><ProductCard product={p} /></div>)}
        </div>
      )}
    </div>
  );
}

/* ---------------- PRODUCT DETAILS ---------------- */
export function ProductDetails() {
  const { id } = useParams();
  const { user, addToCart } = useApp();
  const nav = useNavigate();
  const [p, setP] = useState(null);
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState('');

  useEffect(() => { api('/products/' + id).then((d) => { setP(d); setSize(d.sizes[1] || d.sizes[0]); }).catch((e) => setErr(e.message)); }, [id]);

  if (err) return <div className="container mt-5 alert alert-danger">{err}</div>;
  if (!p) return <Loading />;

  const add = async () => {
    if (!user) return nav('/login');
    try { await addToCart(p._id, size, qty); } catch (e) { setErr(e.message); }
  };

  return (
    <div className="container mt-4">
      <div className="row g-4">
        <div className="col-md-6"><ProductImage product={p} className="big" /></div>
        <div className="col-md-6">
          <div className="small text-uppercase text-muted">{p.category}'s {p.type} · {p.colorName}</div>
          <h2 className="th-logo">{p.name}</h2>
          <div className="th-price fs-3 mb-2">{money(p.price)}</div>
          <p>{p.description}</p>
          <div className="mb-3">
            <div className="fw-semibold mb-1">Size</div>
            {p.sizes.map((s) => (
              <button key={s} onClick={() => setSize(s)} className={`btn btn-sm me-2 mb-2 ${size === s ? 'btn-dark' : 'btn-outline-dark'}`}>{s}</button>
            ))}
          </div>
          <div className="d-flex align-items-center gap-2 mb-3">
            <label className="fw-semibold">Qty</label>
            <input type="number" min="1" max="10" className="form-control w-auto" value={qty} onChange={(e) => setQty(Math.max(1, +e.target.value))} />
          </div>
          <button className="btn btn-dark btn-lg" onClick={add}>{user ? 'Add to Cart' : 'Login to Add to Cart'}</button>
          <Link to="/cart" className="btn btn-outline-dark btn-lg ms-2">View Cart</Link>
        </div>
      </div>
    </div>
  );
}

/* ---------------- CART ---------------- */
export function Cart() {
  const { user, cart, total, updateQty, removeItem, loadCart, notify } = useApp();
  const nav = useNavigate();
  if (!user) return <div className="container mt-5"><p>Please <Link to="/login">log in</Link> to see your cart.</p></div>;

  const checkout = async () => {
    await api('/cart/checkout', { method: 'POST' });
    await loadCart();
    notify('Order placed. Thank you!');
    nav('/');
  };

  return (
    <div className="container mt-4">
      <h2 className="th-logo">Your Cart</h2>
      {cart.items.length === 0 ? <p className="text-muted mt-3">Your cart is empty. <Link to="/shop">Start shopping</Link></p> : (
        <div className="row g-4">
          <div className="col-lg-8">
            {cart.items.map((i) => i.product && (
              <div className="card mb-2" key={i._id}>
                <div className="card-body d-flex align-items-center gap-3">
                  <div style={{ width: 90 }}><ProductImage product={i.product} /></div>
                  <div className="flex-grow-1">
                    <Link to={`/product/${i.product._id}`} className="fw-semibold text-dark text-decoration-none">{i.product.name}</Link>
                    <div className="small text-muted">Size {i.size} · {money(i.product.price)}</div>
                  </div>
                  <input type="number" min="1" className="form-control" style={{ width: 70 }} value={i.qty} onChange={(e) => updateQty(i._id, e.target.value)} />
                  <div className="fw-semibold" style={{ width: 90 }}>{money(i.product.price * i.qty)}</div>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(i._id)}>✕</button>
                </div>
              </div>
            ))}
          </div>
          <div className="col-lg-4">
            <div className="card"><div className="card-body">
              <h5>Order Summary</h5>
              <div className="d-flex justify-content-between"><span>Subtotal</span><span>{money(total)}</span></div>
              <div className="d-flex justify-content-between"><span>Shipping</span><span>{total > 1999 ? 'Free' : money(99)}</span></div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5"><span>Total</span><span>{money(total + (total > 1999 ? 0 : 99))}</span></div>
              <button className="btn btn-dark w-100 mt-3" onClick={checkout}>Place Order</button>
            </div></div>
          </div>
        </div>
      )}
    </div>
  );
}
