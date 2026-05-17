const SIZE_MAP = {
  sm:  { full: '1.125rem', icon: '1rem'     },
  md:  { full: '1.5rem',   icon: '1.25rem'  },
  lg:  { full: '2.25rem',  icon: '1.875rem' },
};

const DOT_CLASS = {
  dark:  'text-primary-muted',
  light: 'text-primary',
};

/**
 * Logo — Marca tipográfica Glucode
 *
 * Props: variant (full | icon), theme (light | dark), size (sm | md | lg), className.
 */
export const Logo = ({
  variant  = 'full',
  theme    = 'light',
  size     = 'md',
  className = '',
}) => {
  const fontSize  = SIZE_MAP[size]?.[variant] ?? SIZE_MAP.md[variant];
  const dotClass  = DOT_CLASS[theme] ?? DOT_CLASS.light;

  return (
    <span
      className={`font-black tracking-tighter whitespace-nowrap select-none font-sans ${className}`}
      style={{ fontSize }}
      aria-label={variant === 'full' ? 'Glucode' : 'G'}
    >
      {variant === 'full' ? 'Glucode' : 'G'}
      <span className={dotClass}>.</span>
    </span>
  );
};
