import { useState } from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  className?: string;
  imageClassName?: string;
  link?: boolean;
  priority?: boolean;
}

const OFFICIAL_LOGO = '/brand/fashion2gether-official.webp?v=20260924';

export default function BrandLogo({
  className = '',
  imageClassName = '',
  link = true,
  priority = false,
}: BrandLogoProps) {
  const [failed, setFailed] = useState(false);

  const logo = (
    <div
      className={`brand-logo-shell ${className}`}
      role="img"
      aria-label="Fashion 2 Gether"
    >
      {!failed ? (
        <img
          src={OFFICIAL_LOGO}
          alt=""
          aria-hidden="true"
          className={`brand-logo-image ${imageClassName}`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full min-h-[44px] w-full items-center justify-center gap-2 overflow-hidden rounded-[10px] bg-[#08080d] px-3 py-1.5">
          <span className="font-elegant text-[22px] sm:text-[25px] italic leading-none text-[#ff0a88]">
            Fashion
          </span>
          <span className="font-display text-[13px] sm:text-[15px] font-semibold tracking-[0.08em] leading-none text-white whitespace-nowrap">
            2 <span className="text-[#168cf6]">GETHER</span>
          </span>
        </div>
      )}
    </div>
  );

  return link ? <Link to="/" aria-label="Fashion 2 Gether home">{logo}</Link> : logo;
}
