import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from './api.js';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('th_user')); } catch { return null; }
  });
  const [cart, setCart] = useState({ items: [] });
  const [toast, setToast] = useState('');

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const loadCart = useCallback(async () => {
    if (!localStorage.getItem('th_token')) return setCart({ items: [] });
    try { setCart(await api('/cart')); } catch { /* token expired */ }
  }, []);

  useEffect(() => { loadCart(); }, [user, loadCart]);

  const login = (data) => {
    localStorage.setItem('th_token', data.token);
    localStorage.setItem('th_user', JSON.stringify(data.user));
    setUser(data.user);
  };
  const logout = () => {
    localStorage.removeItem('th_token');
    localStorage.removeItem('th_user');
    setUser(null);
    setCart({ items: [] });
  };

  const addToCart = async (productId, size, qty = 1) => {
    setCart(await api('/cart', { method: 'POST', body: { productId, size, qty } }));
    notify('Added to cart');
  };
  const updateQty = async (id, qty) => setCart(await api(`/cart/${id}`, { method: 'PUT', body: { qty } }));
  const removeItem = async (id) => setCart(await api(`/cart/${id}`, { method: 'DELETE' }));

  const count = cart.items.reduce((s, i) => s + i.qty, 0);
  const total = cart.items.reduce((s, i) => s + (i.product?.price || 0) * i.qty, 0);

  return (
    <Ctx.Provider value={{ user, login, logout, cart, count, total, addToCart, updateQty, removeItem, loadCart, notify }}>
      {children}
      {toast && <div className="th-toast">{toast}</div>}
    </Ctx.Provider>
  );
}
