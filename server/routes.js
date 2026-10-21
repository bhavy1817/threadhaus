import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User, Product, Cart } from './models.js';
import { protect, adminOnly, signToken } from './auth.js';

const router = Router();
const wrap = (fn) => (req, res) => fn(req, res).catch((e) => res.status(500).json({ message: e.message }));

/* ---------- AUTH: register / login (JWT) ---------- */
router.post('/auth/register', wrap(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
  if (await User.findOne({ email: email.toLowerCase() })) return res.status(400).json({ message: 'Email already registered' });
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
  res.status(201).json({ token: signToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}));

router.post('/auth/login', wrap(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: (email || '').toLowerCase() });
  if (!user || !(await bcrypt.compare(password || '', user.password)))
    return res.status(400).json({ message: 'Invalid email or password' });
  res.json({ token: signToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}));

router.get('/auth/me', protect, (req, res) => res.json({ user: req.user }));

/* ---------- PRODUCTS: get / add / edit / delete ---------- */
router.get('/products', wrap(async (req, res) => {
  const { category, type, q, featured } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (type) filter.type = type;
  if (featured) filter.featured = true;
  if (q) filter.name = { $regex: q, $options: 'i' };
  res.json(await Product.find(filter).sort({ createdAt: -1 }));
}));

router.get('/products/:id', wrap(async (req, res) => {
  const p = await Product.findById(req.params.id).catch(() => null);
  if (!p) return res.status(404).json({ message: 'Product not found' });
  res.json(p);
}));

router.post('/products', protect, adminOnly, wrap(async (req, res) => {
  res.status(201).json(await Product.create(req.body));
}));

router.put('/products/:id', protect, adminOnly, wrap(async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!p) return res.status(404).json({ message: 'Product not found' });
  res.json(p);
}));

router.delete('/products/:id', protect, adminOnly, wrap(async (req, res) => {
  const p = await Product.findByIdAndDelete(req.params.id);
  if (!p) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
}));

/* ---------- CART ---------- */
const getCart = async (userId) => {
  const cart = (await Cart.findOne({ user: userId })) || (await Cart.create({ user: userId, items: [] }));
  return cart.populate('items.product');
};

router.get('/cart', protect, wrap(async (req, res) => res.json(await getCart(req.user._id))));

router.post('/cart', protect, wrap(async (req, res) => {
  const { productId, size, qty = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const cart = await Cart.findOne({ user: req.user._id }) || (await Cart.create({ user: req.user._id, items: [] }));
  const existing = cart.items.find((i) => String(i.product) === productId && i.size === size);
  if (existing) existing.qty += Number(qty);
  else cart.items.push({ product: productId, size, qty: Number(qty) });
  await cart.save();
  res.json(await getCart(req.user._id));
}));

router.put('/cart/:itemId', protect, wrap(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  const item = cart?.items.id(req.params.itemId);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  item.qty = Math.max(1, Number(req.body.qty));
  await cart.save();
  res.json(await getCart(req.user._id));
}));

router.delete('/cart/:itemId', protect, wrap(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  cart?.items.pull(req.params.itemId);
  await cart?.save();
  res.json(await getCart(req.user._id));
}));

router.post('/cart/checkout', protect, wrap(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.json({ message: 'Order placed successfully' });
}));

export default router;
