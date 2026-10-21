import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useApp } from '../AppContext.jsx';

function AuthForm({ mode }) {
  const isReg = mode === 'register';
  const { login } = useApp();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      const data = await api(`/auth/${mode}`, { method: 'POST', body: f });
      login(data);
      nav('/');
    } catch (e2) { setErr(e2.message); }
    setBusy(false);
  };

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <div className="card mt-5"><div className="card-body p-4">
        <h3 className="th-logo mb-3">{isReg ? 'Create account' : 'Welcome back'}</h3>
        {err && <div className="alert alert-danger py-2">{err}</div>}
        <form onSubmit={submit}>
          {isReg && <input className="form-control mb-2" placeholder="Full name" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />}
          <input type="email" className="form-control mb-2" placeholder="Email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
          <input type="password" className="form-control mb-3" placeholder="Password" required minLength={6} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
          <button className="btn btn-dark w-100" disabled={busy}>{busy ? 'Please wait…' : isReg ? 'Sign up' : 'Login'}</button>
        </form>
        <p className="small mt-3 mb-0">
          {isReg ? <>Already have an account? <Link to="/login">Login</Link></> : <>New here? <Link to="/register">Create an account</Link></>}
        </p>
      </div></div>
    </div>
  );
}

export const Login = () => <AuthForm mode="login" />;
export const Register = () => <AuthForm mode="register" />;
