import { Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from './components/Parts.jsx';
import { Home, Shop, ProductDetails, Cart } from './pages/Store.jsx';
import { Login, Register } from './pages/Auth.jsx';
import Admin from './pages/Admin.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '70vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<div className="container mt-5"><h3>Page not found</h3></div>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
