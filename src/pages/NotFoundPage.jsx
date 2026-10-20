import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return <main className="shell not-found-content"><span className="eyebrow">404 / A WRONG TURN</span><h1>Well, this is <em>unexpected.</em></h1><p>The page you’re looking for isn’t here. Let’s get you back to the good stuff.</p><Link to="/" className="button button-dark"><ArrowLeft size={16} /> Back to MORROW</Link><span className="not-found-code">M / 404</span></main>;
}
