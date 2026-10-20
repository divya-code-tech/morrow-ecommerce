import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Eye, EyeOff, Leaf } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from '../app/hooks';
import { showToast } from '../features/ui/uiSlice';

export default function AuthPage() {
  const [mode, setMode] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeMode = (nextMode) => { setMode(nextMode); setErrors({}); };
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (mode === 'register' && !form.name.trim()) nextErrors.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email address.';
    if (form.password.length < 6) nextErrors.password = 'Use at least 6 characters for this demo.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    try { localStorage.setItem('morrow-demo-user', JSON.stringify({ name: form.name.trim() || form.email.split('@')[0], email: form.email })); } catch { /* demo session can still continue */ }
    dispatch(showToast(mode === 'register' ? 'Your demo account is ready. Welcome to MORROW.' : 'You’re signed in for this demo. Welcome back.'));
    navigate('/');
  };

  return (
    <main className="auth-page shell"><div className="auth-visual"><img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1300&q=85" alt="Calm interior with natural materials" /><div className="auth-visual-overlay"><span className="eyebrow">WELCOME TO THE EVERYDAY</span><h2>A little more<br /><em>you.</em></h2><p>Save what you love. Come back when you’re ready.</p><div className="auth-visual-mark"><Leaf size={17} /><span>THOUGHTFULLY CHOSEN, ALWAYS.</span></div></div></div><div className="auth-form-panel"><Link className="auth-back-link" to="/"><ArrowUpRight size={14} /> BACK TO MORROW</Link><div className="auth-panel-head"><span className="eyebrow">YOUR MORROW MOMENT</span><h1>{mode === 'signin' ? <>Good to <em>see you.</em></> : <>Let’s make it <em>personal.</em></>}</h1><p>{mode === 'signin' ? 'Sign in to pick up where you left off.' : 'A few details, and a more thoughtful shop awaits.'}</p></div><div className="auth-mode-tabs"><button className={mode === 'signin' ? 'active' : ''} onClick={() => changeMode('signin')}>Sign in</button><button className={mode === 'register' ? 'active' : ''} onClick={() => changeMode('register')}>Create account</button></div><form className="auth-form" onSubmit={submit} noValidate>{mode === 'register' && <label>YOUR NAME<input name="name" value={form.name} onChange={update} placeholder="The name we should use" autoComplete="name" aria-invalid={!!errors.name} />{errors.name && <small className="field-error">{errors.name}</small>}</label>}<label>EMAIL ADDRESS<input name="email" value={form.email} onChange={update} placeholder="you@example.com" type="email" autoComplete="email" aria-invalid={!!errors.email} />{errors.email && <small className="field-error">{errors.email}</small>}</label><label>PASSWORD<div className="password-field"><input name="password" value={form.password} onChange={update} placeholder="At least 6 characters" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} aria-invalid={!!errors.password} /><button type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>{errors.password && <small className="field-error">{errors.password}</small>}</label><button type="submit" className="button button-dark auth-submit">{mode === 'signin' ? 'Sign in to MORROW' : 'Create your account'} <ArrowRight size={17} /></button></form><div className="auth-terms"><Check size={14} /><span>This is a front-end learning demo. It does not create a real account or contact a server.</span></div><div className="auth-alternative">{mode === 'signin' ? <>New to the good stuff? <button onClick={() => changeMode('register')}>Create an account <ArrowUpRight size={13} /></button></> : <>Already part of the edit? <button onClick={() => changeMode('signin')}>Sign in <ArrowUpRight size={13} /></button></>}</div></div></main>
  );
}
