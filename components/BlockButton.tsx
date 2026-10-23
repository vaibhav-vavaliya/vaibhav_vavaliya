import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'plain' | 'blue' | 'green' | 'yellow' | 'red';
type Size = 'sm' | 'md' | 'lg';

type Common = {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconOnly?: boolean;
  children?: ReactNode;
  className?: string;
};

type AsLink = Common & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>;
type AsButton = Common & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

export function BlockButton(props: AsLink | AsButton) {
  const { variant = 'plain', size = 'md', icon, iconOnly, children, className = '', ...rest } = props;
  const cls = [
    'bs-btn',
    `bs-btn--${variant}`,
    size !== 'md' && `bs-btn--${size}`,
    iconOnly && 'bs-btn--icon',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const inner = (
    <>
      {icon}
      {children}
    </>
  );

  if ('href' in rest && rest.href !== undefined) {
    return (
      <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {inner}
    </button>
  );
}
