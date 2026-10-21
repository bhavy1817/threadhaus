# ThreadHaus: Men & Women Clothing Store (MERN)

MongoDB + Express + React (Vite) + Node. Bootstrap UI, JWT login/register, product CRUD, cart.

## Run (simplest way, needs only Node.js LTS)
From inside this folder (the one containing `client`, `server`, `package.json`):

```
npm run setup
npm run dev
```
Then open http://localhost:5173

No database install and no .env file needed: a temporary database is created with 24 sample products.
The first run downloads a small MongoDB engine, so it can take a minute. Data resets every time you stop the app.

Admin login: `admin@threadhaus.com` / `Admin@123` (a "Manage products" / Admin link appears after login).

## Production / deploy (one server serves both)
Set `MONGO_URI` (MongoDB Atlas) and `JWT_SECRET`, then:
```
npm run build
npm start
```
On first start with an empty database it adds the sample products and the admin user automatically.
