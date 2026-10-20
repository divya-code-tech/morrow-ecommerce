import { useEffect, useState } from 'react';

export default function ProductImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (failed || !src) {
    return <div className={`image-fallback ${className}`} role="img" aria-label={`${alt} image unavailable`}><span>m.</span></div>;
  }
  return <img className={className} src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}
