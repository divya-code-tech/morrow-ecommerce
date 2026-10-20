
import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShieldCheck,
  Tag,
  Trash2,
  Truck,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../app/hooks';
import {
  clearCart,
  removeFromCart,
  selectCartItems,
  selectCartSubtotal,
  setQuantity,
} from '../features/cart/cartSlice';
import { fetchProducts } from '../features/products/productsSlice';
import { showToast } from '../features/ui/uiSlice';
import { formatPrice } from '../components/ProductCard';
import ProductImage from '../components/ProductImage';
import EmptyState from '../components/EmptyState';

const COUPON_KEY = 'morrowCoupon';
const VALID_COUPON = 'MORROW10';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector(selectCartItems);
  const productStatus = useSelector((state) => state.products.status);
  const subtotal = useSelector(selectCartSubtotal);

  // Restore the coupon when the page loads or refreshes.
  const [couponText, setCouponText] = useState(() =>
    localStorage.getItem(COUPON_KEY) === VALID_COUPON
      ? VALID_COUPON
      : ''
  );

  const [couponApplied, setCouponApplied] = useState(
    () => localStorage.getItem(COUPON_KEY) === VALID_COUPON
  );

  const [couponError, setCouponError] = useState('');

  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal === 0 || subtotal >= 2999 ? 0 : 99;
  const total = Math.max(0, subtotal - discount + shipping);

  const freeShippingProgress = Math.min(100, (subtotal / 2999) * 100);
  const remainingForFreeShipping = Math.max(0, 2999 - subtotal);

  // Remove the coupon from both React state and browser storage.
  const clearSavedCoupon = () => {
    localStorage.removeItem(COUPON_KEY);
    setCouponApplied(false);
    setCouponText('');
    setCouponError('');
  };

  // Apply and persist the demo coupon.
  const applyCoupon = (event) => {
    event.preventDefault();

    if (couponText.trim().toUpperCase() === VALID_COUPON) {
      localStorage.setItem(COUPON_KEY, VALID_COUPON);

      setCouponText(VALID_COUPON);
      setCouponApplied(true);
      setCouponError('');

      dispatch(showToast('A little treat: 10% off applied'));
    } else {
      setCouponApplied(false);
      localStorage.removeItem(COUPON_KEY);
      setCouponError(
        'That code didn’t work. Try MORROW10 for the demo discount.'
      );
    }
  };

  // Remove a product and clear the coupon if it was the last item.
  const handleRemoveItem = (productId) => {
    if (items.length === 1) {
      clearSavedCoupon();
    }

    dispatch(removeFromCart(productId));
    dispatch(showToast('Item removed from your bag'));
  };

  // Clear the cart and its applied coupon together.
  const handleClearCart = () => {
    clearSavedCoupon();
    dispatch(clearCart());
    dispatch(showToast('Your bag has been cleared'));
  };

  // Demo checkout: no payment is collected.
  const handleCheckout = () => {
    if (items.length === 0) return;

    clearSavedCoupon();
    dispatch(clearCart());
    dispatch(showToast('Demo checkout complete. No payment was taken.'));
    navigate('/shop');
  };

  if (
    items.length === 0 &&
    (productStatus === 'idle' || productStatus === 'loading')
  ) {
    return (
      <main className="shell cart-page">
        <div className="cart-page-heading">
          <div>
            <span className="eyebrow">YOUR SELECTION</span>
            <h1>
              The good things <em>you chose.</em>
            </h1>
            <p>Loading your saved selection…</p>
          </div>
          <span className="cart-step-label">01 / YOUR BAG</span>
        </div>

        <div className="collection-loading">
          <span />
          <span />
          <span />
        </div>
      </main>
    );
  }

  if (items.length === 0 && productStatus === 'failed') {
    return (
      <main className="shell cart-page">
        <div className="cart-page-heading">
          <div>
            <span className="eyebrow">YOUR SELECTION</span>
            <h1>
              One small <em>detour.</em>
            </h1>
            <p>We need the product catalogue to restore your bag.</p>
          </div>
        </div>

        <button
          className="button button-dark"
          onClick={() => dispatch(fetchProducts())}
        >
          Try again <ArrowRight size={16} />
        </button>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="shell cart-page">
        <div className="cart-page-heading">
          <div>
            <span className="eyebrow">YOUR SELECTION</span>
            <h1>
              The good things <em>you chose.</em>
            </h1>
          </div>
          <span className="cart-step-label">01 / YOUR BAG</span>
        </div>

        <EmptyState
          type="cart"
          title="Your bag is taking a breather."
          description="A little empty for now. Find something useful, beautiful, or both."
          actionLabel="Explore the collection"
        />
      </main>
    );
  }

  return (
    <main className="shell cart-page">
      <div className="cart-page-heading">
        <div>
          <span className="eyebrow">YOUR SELECTION</span>
          <h1>
            The good things <em>you chose.</em>
          </h1>
          <p>Good choices. We’ll keep them safe right here.</p>
        </div>

        <span className="cart-step-label">
          01 / YOUR BAG <span>—</span> 02 / DELIVERY
        </span>
      </div>

      <div className="cart-layout">
        <section className="cart-list-section">
          <div className="cart-list-heading">
            <span>ITEM DETAILS</span>
            <span>QUANTITY</span>
            <span>SUBTOTAL</span>
          </div>

          <div className="cart-items-list">
            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                <div className="cart-item-main">
                  <Link
                    to={`/product/${item.id}`}
                    className="cart-item-image"
                  >
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                    />
                  </Link>

                  <div className="cart-item-copy">
                    <span className="eyebrow">{item.category}</span>

                    <Link to={`/product/${item.id}`}>
                      <h2>{item.name}</h2>
                    </Link>

                    <span className="cart-item-colour">
                      {item.color}
                    </span>

                    <strong>{formatPrice(item.price)}</strong>

                    <button
                      className="remove-item mobile-remove"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                </div>

                <div className="cart-item-quantity">
                  <div className="quantity-stepper">
                    <button
                      aria-label={`Decrease ${item.name} quantity`}
                      disabled={item.quantity <= 1}
                      onClick={() =>
                        dispatch(
                          setQuantity({
                            productId: item.id,
                            quantity: item.quantity - 1,
                          })
                        )
                      }
                    >
                      <Minus size={13} />
                    </button>

                    <span>
                      {String(item.quantity).padStart(2, '0')}
                    </span>

                    <button
                      aria-label={`Increase ${item.name} quantity`}
                      disabled={item.quantity >= 10}
                      onClick={() =>
                        dispatch(
                          setQuantity({
                            productId: item.id,
                            quantity: item.quantity + 1,
                          })
                        )
                      }
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <button
                    className="remove-item desktop-remove"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </div>

                <strong className="cart-line-total">
                  {formatPrice(item.lineTotal)}
                </strong>
              </article>
            ))}
          </div>

          <div className="cart-continue-row">
            <Link to="/shop" className="text-link">
              <ArrowLeft size={15} /> Continue exploring
            </Link>

            <button
              className="clear-cart-button"
              onClick={handleClearCart}
            >
              Clear bag
            </button>
          </div>
        </section>

        <aside className="order-summary">
          <div className="summary-heading">
            <span className="eyebrow">THE RECAP</span>
            <h2>
              Order <em>summary.</em>
            </h2>
          </div>

          <div className="shipping-progress">
            <div className="shipping-progress-copy">
              {remainingForFreeShipping > 0 ? (
                <>
                  <Truck size={16} />
                  <span>
                    You’re{' '}
                    <strong>
                      {formatPrice(remainingForFreeShipping)}
                    </strong>{' '}
                    away from free shipping.
                  </span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>
                    You’ve unlocked <strong>free shipping!</strong>
                  </span>
                </>
              )}
            </div>

            <div className="progress-track">
              <span
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          <form className="coupon-form" onSubmit={applyCoupon}>
            <label htmlFor="coupon-code">A LITTLE EXTRA</label>

            <div>
              <Tag size={15} />

              <input
                id="coupon-code"
                value={couponText}
                onChange={(event) => {
                  setCouponText(event.target.value);
                  setCouponError('');
                }}
                placeholder="Enter a promo code"
                disabled={couponApplied}
              />

              <button disabled={couponApplied}>
                {couponApplied ? <Check size={15} /> : 'Apply'}
              </button>
            </div>

            {couponError && (
              <p className="coupon-error">{couponError}</p>
            )}

            {couponApplied && (
              <p className="coupon-success">
                MORROW10 · 10% savings applied{' '}
                <button
                  type="button"
                  onClick={clearSavedCoupon}
                >
                  Remove
                </button>
              </p>
            )}
          </form>

          <div className="summary-lines">
            <div>
              <span>
                Subtotal (
                {items.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                )}{' '}
                items)
              </span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>

            {couponApplied && (
              <div className="discount-line">
                <span>Little extra (10%)</span>
                <strong>−{formatPrice(discount)}</strong>
              </div>
            )}

            <div>
              <span>Shipping</span>
              <strong>
                {shipping === 0
                  ? 'Complimentary'
                  : formatPrice(shipping)}
              </strong>
            </div>

            <div className="summary-total">
              <span>
                Total <small>INCL. TAXES</small>
              </span>
              <strong>{formatPrice(total)}</strong>
            </div>
          </div>

          <button
            className="button button-dark checkout-button"
            onClick={handleCheckout}
          >
            Continue to checkout <ArrowRight size={17} />
          </button>

          <p className="checkout-demo-note">
            Demo checkout only. No payment details are collected.
          </p>

          <div className="secure-note">
            <ShieldCheck size={16} />
            <span>Thoughtful products. Safe, simple checkout.</span>
          </div>
        </aside>
      </div>

      <div className="cart-bottom-note">
        <span>✳</span>
        <p>
          Good things are worth keeping around. Thank you for
          choosing with care.
        </p>
        <span>MORROW / 005</span>
      </div>
    </main>
  );
}
