import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Heart, Menu, Moon, Search, ShoppingBag, Sun, X } from 'lucide-react';
import { useDispatch, useSelector } from '../app/hooks';
import { selectCartCount } from '../features/cart/cartSlice';
import { selectWishlistCount } from '../features/wishlist/wishlistSlice';
import { toggleTheme } from '../features/ui/uiSlice';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector(selectWishlistCount);
  const theme = useSelector((state) => state.ui.theme);
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const search = (event) => {
    event.preventDefault();
    navigate(`/shop${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`);
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="announcement"><span>GOOD THINGS, THOUGHTFULLY CHOSEN.</span><span className="announcement-right">Complimentary shipping on orders ₹2,999+</span></div>
      <header className="site-header">
        <div className="header-main shell">
          <button className="icon-button mobile-menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <Link to="/" className="brand" onClick={closeMenu} aria-label="Morrow home">
            <span className="brand-word">MORROW<span className="brand-plus">+</span></span>
            <span className="brand-caption">A BETTER EVERYDAY</span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            <NavLink to="/shop" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Shop all</NavLink>
            <Link to="/shop?category=Home" className="nav-link">Home rituals</Link>
            <Link to="/shop?category=Tech" className="nav-link">Tech & audio</Link>
            <Link to="/shop?category=Carry" className="nav-link">Bags & carry</Link>
          </nav>
          <div className="header-actions">
            <button className="icon-button theme-toggle" onClick={() => dispatch(toggleTheme())} aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'} title="Toggle appearance">
              {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
            </button>
            <Link to="/wishlist" className="icon-button header-heart" aria-label={`Wishlist, ${wishlistCount} items`}>
              <Heart size={20} /><span className="icon-count">{wishlistCount}</span>
            </Link>
            <Link to="/cart" className="bag-link" aria-label={`Shopping bag, ${cartCount} items`}>
              <ShoppingBag size={19} /><span>Bag</span><span className="bag-count">{cartCount}</span>
            </Link>
          </div>
        </div>
        <div className="header-bottom shell">
          <p className="header-note">Objects with purpose. Made for your pace.</p>
          <form className="search-form" onSubmit={search} role="search">
            <Search size={16} aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the collection" aria-label="Search products" />
            {query && <button type="button" className="search-clear" onClick={() => setQuery('')} aria-label="Clear search"><X size={14} /></button>}
            <button type="submit" className="search-submit" aria-label="Submit search"><ArrowUpRight size={17} /></button>
          </form>
        </div>
        {menuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            <Link onClick={closeMenu} to="/shop">Shop all objects <ArrowUpRight size={16} /></Link>
            <Link onClick={closeMenu} to="/shop?category=Home">Home rituals <ArrowUpRight size={16} /></Link>
            <Link onClick={closeMenu} to="/shop?category=Tech">Tech & audio <ArrowUpRight size={16} /></Link>
            <Link onClick={closeMenu} to="/shop?category=Carry">Bags & carry <ArrowUpRight size={16} /></Link>
            <Link onClick={closeMenu} to="/wishlist">Your wishlist <Heart size={16} /></Link>
            <Link onClick={closeMenu} to="/account">Sign in / create account <ArrowUpRight size={16} /></Link>
            <button className="mobile-theme-link" onClick={() => { dispatch(toggleTheme()); setMenuOpen(false); }}>{theme === 'light' ? <Moon size={16} /> : <Sun size={16} />} Switch to {theme === 'light' ? 'dark' : 'light'} mode</button>
          </nav>
        )}
      </header>
    </>
  );
}
