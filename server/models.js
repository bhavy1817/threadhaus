import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, enum: ['men', 'women'], required: true },
    // garment type drives the accurate illustration: tshirt, shirt, hoodie, jacket, jeans, trousers, dress, kurti, skirt, top
    type: { type: String, required: true },
    color: { type: String, default: '#222222' },
    colorName: { type: String, default: '' },
    sizes: { type: [String], default: ['S', 'M', 'L', 'XL'] },
    stock: { type: Number, default: 50 },
    image: { type: String, default: '' }, // optional real photo URL; overrides illustration
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      size: String,
      qty: { type: Number, default: 1, min: 1 },
    },
  ],
});

export const User = mongoose.model('User', userSchema);
export const Product = mongoose.model('Product', productSchema);
export const Cart = mongoose.model('Cart', cartSchema);
