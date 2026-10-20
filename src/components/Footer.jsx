import { ArrowUpRight, Instagram, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch } from '../app/hooks';
import { showToast } from '../features/ui/uiSlice';

export default function Footer() {
  const year = new Date().getFullYear();
  const dispatch = useDispatch();
  return (
    <footer className="site-footer">
      <div className="shell footer-top">
        <div className="footer-brand-block">
          <Link to="/" className="brand footer-brand"><span className="brand-word">MORROW<span className="brand-plus">+</span></span><span className="brand-caption">A BETTER EVERYDAY</span></Link>
          <p>Less noise. Better objects.<br />A little more intention in every day.</p>
          <a className="social-link" href="https://www.instagram.com/" target="_blank" rel="noreferrer">Follow along <Instagram size={16} /></a>
        </div>
        <div className="footer-column"><h3>Explore</h3><Link to="/shop">Shop all</Link><Link to="/shop?category=Home">Home rituals</Link><Link to="/shop?category=Tech">Tech & audio</Link><Link to="/shop?category=Carry">Bags & carry</Link></div>
        <div className="footer-column"><h3>Your account</h3><Link to="/account">Sign in</Link><Link to="/wishlist">Wishlist</Link><Link to="/cart">Shopping bag</Link><a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Back to top <ArrowUpRight size={13} /></a></div>
        <div className="footer-newsletter"><span className="eyebrow">A NOTE FROM MORROW</span><h3>Good things,<br /><em>occasionally.</em></h3><p>New finds, considered edits, and small ideas for everyday living.</p><form onSubmit={(event) => { event.preventDefault(); const form = event.currentTarget; dispatch(showToast('Thanks for joining the MORROW demo list.')); form.reset(); }}><input type="email" placeholder="Your email address" aria-label="Your email address" required /><button type="submit" aria-label="Join newsletter"><Send size={16} /></button></form><small>By subscribing, you agree to our demo newsletter terms.</small></div>
      </div>
      <div className="shell footer-bottom"><span>© {year} MORROW GOODS CO.</span><span>Thoughtfully chosen, never overdone.</span><span className="made-mark">DESIGNED FOR THE IN-BETWEEN.</span></div>
    </footer>
  );
}
