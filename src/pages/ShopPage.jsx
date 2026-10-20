import { useEffect, useMemo, useState } from 'react';
import { ArrowDownUp, ArrowRight, RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../app/hooks';
import { categories } from '../data/products';
import { fetchProducts } from '../features/products/productsSlice';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';

const PAGE_SIZE = 8;

export default function ShopPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items, status, error } = useSelector((state) => state.products);
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const category = searchParams.get('category') || 'All';

  useEffect(() => { setQuery(searchParams.get('q') || ''); setPage(1); }, [searchParams]);

  const setCategory = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value === 'All') next.delete('category'); else next.set('category', value);
    setSearchParams(next);
    setPage(1);
  };

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const matched = items.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category;
      const searchable = `${product.name} ${product.category} ${product.description} ${product.color}`.toLowerCase();
      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
    if (sort === 'price-low') matched.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') matched.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') matched.sort((a, b) => b.rating - a.rating);
    else if (sort === 'name') matched.sort((a, b) => a.name.localeCompare(b.name));
    else matched.sort((a, b) => Number(b.featured) - Number(a.featured));
    return matched;
  }, [items, category, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visibleProducts = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const clearFilters = () => { setQuery(''); setSort('featured'); setSearchParams({}); setPage(1); };

  return (
    <main className="shop-page shell">
      <div className="shop-breadcrumb"><span>HOME</span><span>/</span><strong>SHOP ALL</strong></div>
      <div className="shop-hero"><div><span className="eyebrow">THE FULL MORROW EDIT</span><h1>Everyday, <em>considered.</em></h1><p>Useful little things. Beautifully made essentials.<br />Objects you’ll be glad you brought home.</p></div><div className="shop-hero-side"><span>01 — 17</span><span className="shop-hero-rule" /><span>FIND YOUR NEW FAVOURITE</span></div></div>
      <div className="shop-controls-top"><p><strong>{filtered.length.toString().padStart(2, '0')}</strong> objects to explore</p><div className="shop-control-actions"><button className={`filter-toggle ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters((show) => !show)}><SlidersHorizontal size={16} /> Filters <span>{category !== 'All' ? '1' : '0'}</span></button><label className="sort-control"><ArrowDownUp size={15} /><span>Sort by</span><select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }} aria-label="Sort products"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Top rated</option><option value="name">Name A–Z</option></select></label></div></div>
      <div className="shop-layout">
        <aside className={`shop-sidebar ${showFilters ? 'is-open' : ''}`}>
          <div className="sidebar-head"><span className="eyebrow">REFINE YOUR FIND</span><button onClick={() => setShowFilters(false)} aria-label="Close filters"><X size={16} /></button></div>
          <div className="filter-group"><h3>Categories</h3>{categories.map((item) => <button key={item.value} className={`category-filter ${category === item.value ? 'selected' : ''}`} onClick={() => setCategory(item.value)}><span>{item.name}</span><span className="filter-radio">{category === item.value && <span />}</span></button>)}</div>
          <div className="sidebar-note"><span>✳</span><p>Good design should feel good to own. Every single day.</p></div>
          <button className="reset-filters" onClick={clearFilters}><RotateCcw size={13} /> Reset all filters</button>
        </aside>
        <section className="shop-results" aria-label="Product results">
          <div className="active-filter-row">{category !== 'All' && <button className="filter-chip" onClick={() => setCategory('All')}>{categories.find((entry) => entry.value === category)?.name || category} <X size={13} /></button>}{query && <button className="filter-chip" onClick={() => { setQuery(''); setSearchParams((previous) => { const next = new URLSearchParams(previous); next.delete('q'); return next; }); }}>“{query}” <X size={13} /></button>}</div>
          {(status === 'idle' || status === 'loading') && <div className="product-grid">{Array.from({ length: 8 }, (_, index) => <div className="product-skeleton" key={index}><div /><span /><span /></div>)}</div>}
          {status === 'failed' && <div className="inline-error"><p>{error || 'The collection is unavailable right now.'}</p><button className="button button-outline" onClick={() => dispatch(fetchProducts())}>Retry loading</button></div>}
          {status === 'succeeded' && visibleProducts.length > 0 && <><div className="product-grid shop-product-grid">{visibleProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div><div className="pagination"><span>SHOWING <strong>{String((safePage - 1) * PAGE_SIZE + 1).padStart(2, '0')}–{String(Math.min(safePage * PAGE_SIZE, filtered.length)).padStart(2, '0')}</strong> OF <strong>{String(filtered.length).padStart(2, '0')}</strong></span><div className="pagination-actions"><button aria-label="Previous page" disabled={safePage === 1} onClick={() => { setPage((current) => current - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>←</button>{Array.from({ length: totalPages }, (_, index) => <button key={index} className={safePage === index + 1 ? 'current' : ''} onClick={() => { setPage(index + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>{String(index + 1).padStart(2, '0')}</button>)}<button aria-label="Next page" disabled={safePage === totalPages} onClick={() => { setPage((current) => current + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><ArrowRight size={15} /></button></div></div></>}
          {status === 'succeeded' && visibleProducts.length === 0 && <EmptyState type="search" title="Nothing found, just yet." description="Try another word or choose a different category. The good stuff is here somewhere." actionLabel="Clear filters" actionTo="/shop" />}
        </section>
      </div>
    </main>
  );
}
