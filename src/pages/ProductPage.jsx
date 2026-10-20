
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../app/hooks';
import { addToCart } from '../features/cart/cartSlice';
import { fetchProducts } from '../features/products/productsSlice';
import { showToast } from '../features/ui/uiSlice';
import { toggleWishlist } from '../features/wishlist/wishlistSlice';
import { formatPrice } from '../components/ProductCard';
import ProductImage from '../components/ProductImage';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';

const COLOR_SWATCHES = {
  'stone / graphite': '#77756E',
  'silver / ink': '#8C8C91',
  'warm white': '#F3EFE5',
  'natural / olive': '#999B79',
  charcoal: '#363636',
  clay: '#B76E4C',
  'mist blue': '#A9D0E6',
  'cloud white': '#F4F4F0',
  oatmeal: '#D5C4A2',
  black: '#252525',
  'paper / ink': '#CBC7B9',
  tortoise: '#815437',
  moss: '#78845D',
  blush: '#D88180',
  sand: '#D9C3A0',
  slate: '#65717B',
  'washed navy': '#36496B',
};

const getColorHex = (color) =>
  COLOR_SWATCHES[String(color || '').trim().toLowerCase()] ||
  '#C9B28C';


export default function ProductPage() {
  const { productId } = useParams();
  const dispatch = useDispatch();

  const { items, status, error } = useSelector(
    (state) => state.products
  );

  const product = items.find((item) => item.id === productId);

  const isSaved = useSelector((state) =>
    state.wishlist.ids.includes(productId)
  );

  // Keep all React state declarations before any conditional returns.
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openDetails, setOpenDetails] = useState(true);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
    setSelectedColorIndex(0);
  }, [productId]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // Use real colour variants when they exist in the product data.
  // Otherwise, fall back to the product's existing colour and image.
  const colorOptions =
    Array.isArray(product?.colorOptions) &&
    product.colorOptions.length > 0
      ? product.colorOptions
      : product
        ? [
            {
              name: product.color || 'Default',
              hex: getColorHex(product.color),
              image: product.image,
              images: product.images,
           }
          ]
        : [];

  const selectedColor =
    colorOptions[selectedColorIndex] || colorOptions[0] || null;

  // Images belong to the selected colour when variant images exist.
  const galleryImages = selectedColor?.images?.length
    ? selectedColor.images
    : selectedColor?.image
      ? [selectedColor.image]
      : product?.images?.length
        ? product.images
        : product?.image
          ? [product.image]
          : [];

  const add = () => {
    if (!product) return;

    dispatch(
      addToCart({
        productId: product.id,
        quantity,
      })
    );

    dispatch(
      showToast(
        `${quantity} × ${product.name} added to your bag`
      )
    );
  };

  const toggleSaved = () => {
    if (!product) return;

    dispatch(toggleWishlist(product.id));

    dispatch(
      showToast(
        isSaved
          ? 'Removed from your wishlist'
          : 'Saved for later'
      )
    );
  };

  if (status === 'idle' || status === 'loading') {
    return (
      <main className="shell product-loading">
        <div className="product-detail-skeleton" />
        <div className="product-detail-skeleton" />
      </main>
    );
  }

  if (status === 'failed') {
    return (
      <main className="shell not-found-content">
        <span className="eyebrow">A SMALL DETOUR</span>
        <h1>
          The collection took a <em>wrong turn.</em>
        </h1>
        <p>
          {error || 'We could not load this product just now.'}
        </p>
        <button
          className="button button-dark"
          onClick={() => dispatch(fetchProducts())}
        >
          Try again <ArrowRight size={16} />
        </button>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="shell not-found-content">
        <EmptyState
          type="search"
          title="We can’t find that one."
          description="It may have moved on to a better place. Explore the collection and find something new."
        />
      </main>
    );
  }

  const similar = items
    .filter(
      (item) =>
        item.id !== product.id &&
        (item.category === product.category || item.featured)
    )
    .slice(0, 4);

  return (
    <main className="product-page shell">
      <div className="shop-breadcrumb">
        <Link to="/shop">
          <ArrowLeft size={13} /> BACK TO SHOP
        </Link>
        <span>/</span>
        <span>{product.category.toUpperCase()}</span>
        <span>/</span>
        <strong>{product.name.toUpperCase()}</strong>
      </div>

      <div className="product-detail-layout">
        <section
          className="product-gallery"
          aria-label="Product image gallery"
        >
          <div className="product-main-image">
            <ProductImage
              src={galleryImages[selectedImage] || product.image}
              alt={`${product.name} - ${
                selectedColor?.name || product.color || 'Default'
              }`}
              className="detail-image"
            />

            <span className="gallery-counter">
              {String(selectedImage + 1).padStart(2, '0')}
              {' '}
              <span>/</span>
              {' '}
              {String(Math.max(galleryImages.length, 1)).padStart(
                2,
                '0'
              )}
            </span>
          </div>

          <div className="product-thumbnails">
            {galleryImages.map((src, index) => (
              <button
                key={`${src}-${index}`}
                type="button"
                className={
                  selectedImage === index ? 'selected' : ''
                }
                onClick={() => setSelectedImage(index)}
                aria-label={`View image ${index + 1}`}
                aria-pressed={selectedImage === index}
              >
                <ProductImage
                  src={src}
                  alt={`${product.name}, view ${index + 1}`}
                />
              </button>
            ))}
          </div>
        </section>

        <section className="product-detail-copy">
          <div className="detail-category-line">
            <span className="eyebrow">
              MORROW / {product.category.toUpperCase()}
            </span>

            <span className="detail-rating">
              ★ {product.rating}{' '}
              <small>({product.reviews} reviews)</small>
            </span>
          </div>

          <h1>
            {product.name}
            <span className="title-period">.</span>
          </h1>

          <p className="product-detail-intro">
            {product.description}
          </p>

          <div className="detail-price-row">
            <strong>{formatPrice(product.price)}</strong>

            {product.compareAt && (
              <>
                <del>{formatPrice(product.compareAt)}</del>
                <span className="save-percent">
                  SAVE{' '}
                  {Math.round(
                    (1 - product.price / product.compareAt) * 100
                  )}
                  %
                </span>
              </>
            )}
          </div>

          <p className="tax-note">
            Inclusive of all taxes. Shipping calculated at checkout.
          </p>

          {/* Interactive colour selector */}
          <div className="product-option">
            <span>COLOUR / FINISH</span>

            <strong>
              {selectedColor?.name || product.color || 'Default'}
            </strong>

            <div className="colour-swatch-row">
              {colorOptions.map((option, index) => {
                const isSelected = selectedColorIndex === index;

                return (
                  <button
                    key={`${option.name || 'colour'}-${index}`}
                    type="button"
                    className={`colour-swatch ${
                      isSelected ? 'is-selected' : ''
                    }`}
                    style={{
                      backgroundColor:
                        option.hex || option.value || '#C9B28C',
                      outline: isSelected
                        ? '2px solid currentColor'
                        : 'none',
                      outlineOffset: isSelected ? '3px' : '0',
                    }}
                    title={option.name || `Colour ${index + 1}`}
                    aria-label={`Select ${
                      option.name || `colour ${index + 1}`
                    }`}
                    aria-pressed={isSelected}
                    onClick={() => {
                      setSelectedColorIndex(index);
                      setSelectedImage(0);
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div className="purchase-row">
            <div className="quantity-stepper">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                onClick={() =>
                  setQuantity((value) => Math.max(1, value - 1))
                }
              >
                <Minus size={14} />
              </button>

              <span>{String(quantity).padStart(2, '0')}</span>

              <button
                type="button"
                aria-label="Increase quantity"
                disabled={quantity >= 10}
                onClick={() =>
                  setQuantity((value) => Math.min(10, value + 1))
                }
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              type="button"
              className="button button-dark add-to-bag"
              onClick={add}
            >
              Add to bag — {formatPrice(product.price * quantity)}
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              onClick={toggleSaved}
              className={`detail-save ${
                isSaved ? 'is-saved' : ''
              }`}
              aria-label={
                isSaved
                  ? 'Remove from wishlist'
                  : 'Add to wishlist'
              }
            >
              <Heart
                size={20}
                fill={isSaved ? 'currentColor' : 'none'}
              />
            </button>
          </div>

          <div className="stock-message">
            <span className="live-dot" />
            {product.stock <= 10
              ? `Only ${product.stock} left — thoughtfully made in small batches.`
              : 'In stock and ready to find a home.'}
          </div>

          <div className="product-service-notes">
            <div>
              <Truck size={18} />
              <span>
                <strong>Good things, delivered</strong>
                <small>Free shipping on orders ₹2,999+</small>
              </span>
            </div>

            <div>
              <ShieldCheck size={18} />
              <span>
                <strong>A little peace of mind</strong>
                <small>Easy 7-day returns on eligible items</small>
              </span>
            </div>
          </div>

          <div className="product-accordion">
            <button
              type="button"
              onClick={() =>
                setOpenDetails((open) => !open)
              }
              aria-expanded={openDetails}
            >
              <span>THE DETAILS</span>
              <ChevronDown
                className={openDetails ? 'rotated' : ''}
                size={17}
              />
            </button>

            {openDetails && (
              <ul>
                {(product.details || []).map((detail, index) => (
                  <li key={`${detail}-${index}`}>
                    <Check size={14} />
                    {detail}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            className="share-product"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              dispatch(showToast('Product link copied'));
            }}
          >
            <span>KNOW SOMEONE WHO’D LOVE THIS?</span>
            <span>Share this find ↗</span>
          </button>
        </section>
      </div>

      <section className="section related-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">GOOD COMPANY</span>
            <h2>
              You may also <em>like.</em>
            </h2>
          </div>

          <Link
            className="text-link"
            to={`/shop?category=${encodeURIComponent(
              product.category
            )}`}
          >
            Shop {product.category.toLowerCase()}
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="product-grid">
          {similar.map((item, index) => (
            <ProductCard
              product={item}
              index={index}
              key={item.id}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
