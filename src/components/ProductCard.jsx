import { ArrowUpRight, Heart, Plus, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from '../app/hooks';
import { addToCart } from '../features/cart/cartSlice';
import { showToast } from '../features/ui/uiSlice';
import { toggleWishlist } from '../features/wishlist/wishlistSlice';
import ProductImage from './ProductImage';

export const formatPrice = (price) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

export default function ProductCard({ product, index = 0 }) {
  const dispatch = useDispatch();
  const saved = useSelector((state) => state.wishlist.ids.includes(product.id));
  const add = (event) => {
    event.preventDefault();
    event.stopPropagation();
    dispatch(addToCart({ productId: product.id }));
    dispatch(showToast(`${product.name} added to your bag`));
  };
  const toggleSaved = (event) => {
    event.preventDefault();
    event.stopPropagation();
    dispatch(toggleWishlist(product.id));
    dispatch(showToast(saved ? 'Removed from your wishlist' : 'Saved for later'));
  };

  return (
    <article className="product-card" style={{ '--card-index': index }}>
      <div className="product-image-wrap">
        <Link to={`/product/${product.id}`} className="product-image-link" aria-label={`View ${product.name}`}>
          <ProductImage src={product.image} alt={product.name} className="product-image" />
        </Link>
        {product.badge && <span className={`product-badge ${product.badge === 'New' ? 'badge-new' : ''}`}>{product.badge}</span>}
        <button className={`wishlist-button ${saved ? 'is-saved' : ''}`} onClick={toggleSaved} aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}>
          <Heart size={17} fill={saved ? 'currentColor' : 'none'} />
        </button>
        <button className="quick-add" onClick={add} aria-label={`Add ${product.name} to cart`}><Plus size={18} /><span>Quick add</span></button>
      </div>
      <div className="product-card-info">
        <div className="product-meta-line"><span>{product.category}</span><span className="product-rating"><Star size={12} fill="currentColor" /> {product.rating}</span></div>
        <Link to={`/product/${product.id}`} className="product-title-link"><h3>{product.name}</h3><ArrowUpRight className="product-open-icon" size={15} /></Link>
        <div className="product-price-row"><strong>{formatPrice(product.price)}</strong>{product.compareAt && <del>{formatPrice(product.compareAt)}</del>}</div>
      </div>
    </article>
  );
}
