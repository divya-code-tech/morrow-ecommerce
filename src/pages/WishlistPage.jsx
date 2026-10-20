import { ArrowRight, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from '../app/hooks';
import EmptyState from '../components/EmptyState';
import { removeWishlistItem, selectWishlistProducts } from '../features/wishlist/wishlistSlice';
import { fetchProducts } from '../features/products/productsSlice';
import { addToCart } from '../features/cart/cartSlice';
import { showToast } from '../features/ui/uiSlice';
import { formatPrice } from '../components/ProductCard';
import ProductImage from '../components/ProductImage';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const products = useSelector(selectWishlistProducts);
  const productStatus = useSelector((state) => state.products.status);
  if (products.length === 0 && (productStatus === 'idle' || productStatus === 'loading')) return <main className="shell wishlist-page"><div className="wishlist-heading"><div><span className="eyebrow">THE MAYBE-LATER LIST</span><h1>Keeping an eye <em>on these.</em></h1><p>Restoring your saved finds…</p></div></div><div className="collection-loading"><span /><span /><span /></div></main>;
  if (products.length === 0 && productStatus === 'failed') return <main className="shell wishlist-page"><div className="wishlist-heading"><div><span className="eyebrow">THE MAYBE-LATER LIST</span><h1>A little <em>detour.</em></h1><p>We need the product catalogue to restore your wishlist.</p></div></div><button className="button button-dark" onClick={() => dispatch(fetchProducts())}>Try again <ArrowRight size={16} /></button></main>;
  return (
    <main className="shell wishlist-page"><div className="wishlist-heading"><div><span className="eyebrow">THE MAYBE-LATER LIST</span><h1>Keeping an eye <em>on these.</em></h1><p>All the good things you’re not quite ready to bring home.</p></div><div className="wishlist-count-mark"><Heart size={22} /><strong>{String(products.length).padStart(2, '0')}</strong><span>SAVED FINDS</span></div></div>
      {products.length === 0 ? <EmptyState type="wishlist" title="Nothing saved just yet." description="Found something that made you pause? Tap the little heart and we’ll keep it here for you." actionLabel="Find something good" /> : <><div className="wishlist-toolbar"><span>{products.length} {products.length === 1 ? 'object' : 'objects'} saved</span><Link to="/shop" className="text-link">Keep exploring <ArrowRight size={15} /></Link></div><div className="wishlist-grid">{products.map((product, index) => <article key={product.id} className="wishlist-row"><Link className="wishlist-row-image" to={`/product/${product.id}`}><ProductImage src={product.image} alt={product.name} /></Link><div className="wishlist-row-copy"><span className="eyebrow">{product.category}</span><Link to={`/product/${product.id}`}><h2>{product.name}</h2></Link><span className="wishlist-color">{product.color}</span><strong>{formatPrice(product.price)}</strong><div className="wishlist-row-actions"><button className="button button-dark" onClick={() => { dispatch(addToCart({ productId: product.id })); dispatch(showToast(`${product.name} added to your bag`)); }}>Add to bag <ShoppingBag size={15} /></button><button className="remove-saved" onClick={() => { dispatch(removeWishlistItem(product.id)); dispatch(showToast('Removed from your wishlist')); }}><Trash2 size={14} /> Remove</button></div></div><span className="wishlist-row-index">0{index + 1}</span></article>)}</div></>}
      <div className="wishlist-bottom-note"><span>GOOD TASTE TAKES TIME.</span><span>✳</span><span>NO RUSH. NO PRESSURE.</span></div>
    </main>
  );
}
