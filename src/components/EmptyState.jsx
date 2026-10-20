import { ArrowRight, Heart, PackageSearch, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const iconMap = { cart: ShoppingBag, wishlist: Heart, search: PackageSearch };

export default function EmptyState({ type = 'search', title, description, actionLabel = 'Explore the shop', actionTo = '/shop' }) {
  const Icon = iconMap[type] || PackageSearch;
  return <div className="empty-state"><span className="empty-icon"><Icon size={24} strokeWidth={1.5} /></span><span className="eyebrow">A LITTLE PAUSE</span><h2>{title}</h2><p>{description}</p><Link to={actionTo} className="button button-dark">{actionLabel} <ArrowRight size={16} /></Link></div>;
}
