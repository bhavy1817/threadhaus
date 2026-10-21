import bcrypt from 'bcryptjs';
import { User, Product } from './models.js';

const M = ['S', 'M', 'L', 'XL', 'XXL'];
const W = ['XS', 'S', 'M', 'L', 'XL'];
const BOTTOM_M = ['28', '30', '32', '34', '36'];
const BOTTOM_W = ['26', '28', '30', '32', '34'];

const p = (name, category, type, colorName, color, price, description, sizes, featured = false) => ({
  name, category, type, colorName, color, price, description, sizes, featured, stock: 40,
});

const products = [
  // ---------- MEN ----------
  p('Classic White Crew Tee', 'men', 'tshirt', 'White', '#f4f4f2', 499, 'Soft 100% combed cotton crew-neck tee. A wardrobe essential that goes with everything.', M, true),
  p('Midnight Black Tee', 'men', 'tshirt', 'Black', '#1b1b1d', 549, 'Heavyweight black cotton tee with a relaxed, clean fit.', M),
  p('Navy Oxford Shirt', 'men', 'shirt', 'Navy', '#1f3a5f', 1299, 'Button-down Oxford shirt in breathable cotton. Smart for office and weekends.', M, true),
  p('Sky Blue Formal Shirt', 'men', 'shirt', 'Sky Blue', '#8fb8de', 1199, 'Crisp full-sleeve formal shirt with a regular fit and easy-iron finish.', M),
  p('Olive Zip Hoodie', 'men', 'hoodie', 'Olive', '#5b6b3a', 1799, 'Fleece-lined hoodie with kangaroo pocket and full zip.', M, true),
  p('Charcoal Pullover Hoodie', 'men', 'hoodie', 'Charcoal', '#3b3f45', 1699, 'Cozy pullover hoodie with drawstring hood, perfect for cooler evenings.', M),
  p('Indigo Slim Fit Jeans', 'men', 'jeans', 'Indigo', '#2b4570', 1999, 'Stretch denim slim-fit jeans with five-pocket styling.', BOTTOM_M, true),
  p('Washed Black Jeans', 'men', 'jeans', 'Washed Black', '#2a2a2e', 2099, 'Straight-fit washed black jeans with a lived-in feel.', BOTTOM_M),
  p('Khaki Chino Trousers', 'men', 'trousers', 'Khaki', '#b59d6e', 1599, 'Tailored cotton chinos with a smooth, comfortable stretch.', BOTTOM_M),
  p('Grey Formal Trousers', 'men', 'trousers', 'Grey', '#6f737a', 1699, 'Flat-front formal trousers with a sharp crease.', BOTTOM_M),
  p('Tan Bomber Jacket', 'men', 'jacket', 'Tan', '#a67c52', 2999, 'Lightweight bomber jacket with ribbed cuffs and a zip front.', M),
  p('Maroon Polo Tee', 'men', 'shirt', 'Maroon', '#7a1f2b', 999, 'Pique-knit polo with a classic collar and two-button placket.', M),
  // ---------- WOMEN ----------
  p('Blush Pink Cotton Top', 'women', 'top', 'Blush Pink', '#e8a9b5', 699, 'Light and airy cotton top with a flattering relaxed cut.', W, true),
  p('Ivory Crew Tee', 'women', 'tshirt', 'Ivory', '#f3ece0', 599, 'Soft everyday tee in a boxy, slightly cropped fit.', W),
  p('Emerald Wrap Dress', 'women', 'dress', 'Emerald', '#0f7a5a', 2499, 'Flowy wrap dress with a defined waist and midi length.', W, true),
  p('Floral Summer Dress', 'women', 'dress', 'Rose', '#d9667a', 1999, 'Breezy knee-length dress in a soft floral-toned fabric.', W),
  p('Black Evening Dress', 'women', 'dress', 'Black', '#18181a', 2999, 'Elegant fitted evening dress with a flared hem.', W, true),
  p('Mustard Cotton Kurti', 'women', 'kurti', 'Mustard', '#d19a1e', 1299, 'Straight-cut cotton kurti with side slits and a round neckline.', W, true),
  p('Teal Printed Kurti', 'women', 'kurti', 'Teal', '#1f7f86', 1399, 'Everyday long kurti in breathable fabric, easy to style.', W),
  p('Light Wash Mom Jeans', 'women', 'jeans', 'Light Blue', '#7fa3cc', 1999, 'High-rise mom-fit jeans with a vintage light wash.', BOTTOM_W),
  p('Black Skinny Jeans', 'women', 'jeans', 'Black', '#232326', 1899, 'High-stretch skinny jeans that hold their shape all day.', BOTTOM_W),
  p('Plum A-Line Skirt', 'women', 'skirt', 'Plum', '#6d2e5a', 1299, 'Midi A-line skirt with an elastic waist and gentle flare.', W),
  p('Beige Wide-Leg Trousers', 'women', 'trousers', 'Beige', '#cdb999', 1799, 'High-waist wide-leg trousers with a fluid drape.', BOTTOM_W),
  p('Lavender Hoodie', 'women', 'hoodie', 'Lavender', '#a99bd1', 1799, 'Soft fleece pullover hoodie with an oversized fit.', W),
  p('Denim Blue Jacket', 'women', 'jacket', 'Denim Blue', '#4f7ab0', 2699, 'Classic button-front denim jacket with chest pockets.', W),
];

export const ADMIN_EMAIL = 'admin@threadhaus.com';
export const ADMIN_PASSWORD = 'Admin@123';

// Safe to call on every start: only fills in what is missing, never wipes existing data.
export async function ensureSeed() {
  if ((await Product.countDocuments()) === 0) {
    await Product.insertMany(products);
    console.log(`Added ${products.length} sample products`);
  }
  if (!(await User.findOne({ email: ADMIN_EMAIL }))) {
    await User.create({ name: 'Admin', email: ADMIN_EMAIL, password: await bcrypt.hash(ADMIN_PASSWORD, 10), role: 'admin' });
    console.log(`Admin created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  }
}

export async function resetProducts() {
  await Product.deleteMany({});
  await Product.insertMany(products);
}
