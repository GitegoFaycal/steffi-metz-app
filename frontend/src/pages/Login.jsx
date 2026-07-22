import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {login} from '../api';

export default function Login(){
  const navigate = useNavigate();
  const [email,setEmail] = useState('admin@steffi.com');
  const [password,setPassword] = useState('admin123');
  const [error,setError] = useState('');
  const [loading,setLoading] = useState(false);

  async function submit(e){
    e.preventDefault();
    setError(''); setLoading(true);
    try { await login(email,password); navigate('/admin'); }
    catch(err){ setError(err.message); }
    finally{ setLoading(false); }
  }

  return <section className="section pt-32 min-h-screen bg-linen">
    <div className="max-w-md mx-auto px-5">
      <div className="card p-8">
        <div className="eyebrow">Secure access</div>
        <h1 className="heading mt-3">User <em>Login</em></h1>
        <p className="text-stone-600 text-sm leading-7 mt-3">Login to manage orders, payments, newsletters, and emails.</p>
        <form onSubmit={submit} className="grid gap-4 mt-7">
          <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required />
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required />
          {error && <p className="text-bordeaux text-sm">{error}</p>}
          <button className="btn-primary" disabled={loading}>{loading?'Signing in...':'Login'}</button>
        </form>
        <p className="text-xs text-stone-500 mt-5">Demo admin: <b>admin@steffi.com</b> / <b>admin123</b></p>
      </div>
    </div>
  </section>
}
