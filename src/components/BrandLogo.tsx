import { Link } from 'react-router-dom';

interface BrandLogoProps {
  className?: string;
  imageClassName?: string;
  link?: boolean;
  priority?: boolean;
}

export default function BrandLogo({
  className = '',
  imageClassName = '',
  link = true,
  priority = false,
}: BrandLogoProps) {
  const logo = (
    <div className={`brand-logo-shell ${className}`}>
      <img
        src="/brand/fashion2gether-logo-wide.jpg"
        alt="Fashion 2 Gether — Wear better. Look better"
        className={`brand-logo-image ${imageClassName}`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </div>
  );

  return link ? <Link to="/" aria-label="Fashion 2 Gether home">{logo}</Link> : logo;
}
