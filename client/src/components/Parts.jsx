import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext.jsx';
import ProductImage from './ProductImage.jsx';
import { money } from '../api.js';

export function Navbar() {
  const { user, logout, count } = useApp();
  const nav = useNavigate();
  return (
    <nav className="navbar navbar-expand-lg th-nav sticky-top">
      <div className="container">
        <Link className="navbar-brand th-logo" to="/">Thread<span>Haus</span></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><NavLink className="nav-link" to="/shop">All</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/shop?category=men">Men</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/shop?category=women">Women</NavLink></li>
            {user?.role === 'admin' && <li className="nav-item"><NavLink className="nav-link" to="/admin">Admin</NavLink></li>}
          </ul>
          <div className="d-flex align-items-center gap-3">
            <Link to="/cart" className="th-cart">🛍 Cart <span className="badge bg-dark">{count}</span></Link>
            {user ? (
              <>
                <span className="small text-muted">Hi, {user.name.split(' ')[0]}</span>
                <button className="btn btn-sm btn-outline-dark" onClick={() => { logout(); nav('/'); }}>Logout</button>
              </>
            ) : (
              <>
                <Link className="btn btn-sm btn-outline-dark" to="/login">Login</Link>
                <Link className="btn btn-sm btn-dark" to="/register">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="th-footer mt-5">
      <div className="container py-4 d-flex flex-wrap justify-content-between gap-2">
        <div><strong className="th-logo">ThreadHaus</strong><div className="small">Everyday style for men &amp; women.</div></div>
        <div className="small">© {new Date().getFullYear()} ThreadHaus. All rights reserved.</div>
      </div>
    </footer>
  );
}

// Reusable component that receives data through props
export function ProductCard({ product }) {
  return (
    <Link to={`/product/${product._id}`} className="card th-card h-100 text-decoration-none">
      <ProductImage product={product} />
      <div className="card-body">
        <div className="small text-uppercase text-muted">{product.category}'s · {product.colorName}</div>
        <div className="fw-semibold text-dark">{product.name}</div>
        <div className="th-price">{money(product.price)}</div>
      </div>
    </Link>
  );
}

export const Loading = () => <div className="text-center py-5 text-muted">Loading…</div>;
