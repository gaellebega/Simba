import { Link } from 'react-router-dom';

const LOGO_SRC = '/images/Screenshot 2026-04-18 114354.png';

export default function BrandLogo({ to = '/', className = '', compact = false }) {
  return (
    <Link to={to} className={`brand-logo ${compact ? 'compact' : ''} ${className}`.trim()}>
      <span className="brand-logo-mark" aria-hidden="true">
        <img
          src={LOGO_SRC}
          alt="Simba Supermarket"
          width={compact ? 40 : 52}
          height={compact ? 40 : 52}
        />
      </span>
    </Link>
  );
}
