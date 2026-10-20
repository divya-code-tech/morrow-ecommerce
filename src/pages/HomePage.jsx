import { ArrowDownRight, ArrowRight, ArrowUpRight, Check, CircleDot, Leaf, Sparkles, Truck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../app/hooks';
import { categories } from '../data/products';
import { fetchProducts } from '../features/products/productsSlice';
import ProductCard from '../components/ProductCard';

const categoryImages = {
  Tech: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85',
  Home: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=85',
  Carry: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=85',
  Wear: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85',
  Desk: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=700&q=85',
};

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status, error } = useSelector((state) => state.products);
  const featured = items.filter((product) => product.featured).slice(0, 4);
  const collections = categories.filter((category) => category.value !== 'All');

  return (
    <main>
      <section className="hero shell">
        <div className="hero-copy">
          <div className="hero-kicker"><span className="live-dot" /> A CONSIDERED EDIT FOR EVERY DAY <span>NO. 05</span></div>
          <h1>Considered Goods<br />for <em>Everyday.</em></h1>
          <p className="hero-description">Thoughtfully designed. Beautifully made. Useful objects for your everyday rituals, chosen to be around for a while.</p>
          <div className="hero-actions"><Link to="/shop" className="button button-dark">Shop all goods <ArrowUpRight size={17} /></Link><a href="#featured" className="text-link">Discover the edit <ArrowDownRight size={15} /></a></div>
          <div className="hero-footnote"><span>GOOD DESIGN, LESS NOISE.</span><span className="hero-footnote-line" /><span>MADE FOR YOUR PACE.</span></div>
        </div>
        <div className="hero-visual">
          <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=90" alt="Warm, considered living space with natural textures and simple furniture" />
          <div className="hero-stamp"><span>OBJECTS</span><strong>for living</strong><span>WELL, EVERY DAY.</span></div>
          <div className="hero-image-caption"><span>THE SLOW LIVING EDIT</span><span>01 / 04</span></div>
        </div>
        <div className="hero-side-note">LESS, BUT WITH MORE MEANING <span>↘</span></div>
      </section>

      <section className="value-strip"><div className="shell value-strip-inner"><div><Sparkles size={17} /><span>Considered in every detail</span></div><div><Truck size={18} /><span>Free shipping over ₹2,999</span></div><div><Leaf size={17} /><span>Better materials, longer life</span></div><div><Check size={17} /><span>Easy 7-day returns</span></div></div></section>

      <section className="section shell category-section">
        <div className="section-heading"><div><span className="eyebrow">FIND YOUR EVERYDAY</span><h2>Good things live <em>here.</em></h2></div><p>Little upgrades, lasting favourites.<br />Start with what you need.</p></div>
        <div className="category-grid">
          {collections.map((category, index) => (
            <Link key={category.value} className={`category-tile category-tile-${index + 1}`} to={`/shop?category=${category.value}`}>
              <img src={categoryImages[category.value]} alt="" loading="lazy" />
              <span className="category-index">0{index + 1}</span>
              <div className="category-tile-bottom"><div><span>{category.name}</span><small>{category.value === 'Tech' ? 'Sound & clever essentials' : category.value === 'Home' ? 'Make yourself comfortable' : category.value === 'Carry' ? 'For wherever the day goes' : category.value === 'Wear' ? 'Everyday, made personal' : 'A clearer kind of focus'}</small></div><span className="round-arrow"><ArrowUpRight size={17} /></span></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section featured-section" id="featured"><div className="shell">
        <div className="section-heading featured-heading"><div><span className="eyebrow">THE GOOD STUFF</span><h2>Currently <em>loving.</em></h2></div><Link to="/shop" className="text-link">Shop all objects <ArrowRight size={16} /></Link></div>
        {status === 'loading' || status === 'idle' ? <div className="product-grid">{Array.from({ length: 4 }, (_, index) => <div className="product-skeleton" key={index}><div /><span /><span /></div>)}</div> : null}
        {status === 'failed' && <div className="inline-error"><p>{error || 'We couldn’t load the collection.'}</p><button className="button button-outline" onClick={() => dispatch(fetchProducts())}>Try again</button></div>}
        {status === 'succeeded' && <div className="product-grid">{featured.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>}
      </div></section>

      <section className="editorial-band"><div className="editorial-image"><img src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1400&q=85" alt="Sunlight falling across a calm, plant-filled interior" loading="lazy" /><span className="editorial-image-label">A HOME THAT FEELS LIKE YOU</span></div><div className="editorial-copy"><span className="eyebrow">A DIFFERENT KIND OF SHOPPING</span><h2>Less scrolling.<br /><em>More feeling.</em></h2><p>We believe the things you live with should earn their place. So we look for good materials, useful details, timeless shapes, and little moments of delight.</p><div className="editorial-promise"><CircleDot size={18} /><span>Chosen with care, not just for the trend cycle.</span></div><Link to="/shop" className="button button-light">Find your next favourite <ArrowUpRight size={17} /></Link><span className="editorial-number">M / 005</span></div></section>

      <section className="section shell manifesto-section"><div className="manifesto-top"><span className="eyebrow">THE MORROW POINT OF VIEW</span><span className="manifesto-symbol">✳</span></div><p>Everyday things can be <em>extraordinary.</em><br />You just have to choose them <span>with care.</span></p><div className="manifesto-bottom"><span>A SMALLER, BETTER EDIT OF EVERYDAY LIFE.</span><button className="manifesto-link" onClick={() => navigate('/shop')}>Get to know the collection <ArrowUpRight size={16} /></button></div></section>
    </main>
  );
}
