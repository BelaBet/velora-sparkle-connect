import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number | undefined };

function Base({ size = 22, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const IconMenu = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Base>
);

export const IconBell = (p: IconProps) => (
  <Base {...p}>
    <path d="M6.5 9.5a5.5 5.5 0 0 1 11 0c0 3.2.8 4.7 1.6 5.6.4.5.1 1.4-.6 1.4H5.5c-.7 0-1-.9-.6-1.4.8-.9 1.6-2.4 1.6-5.6Z" />
    <path d="M10 19.5a2.2 2.2 0 0 0 4 0" />
  </Base>
);

export const IconCompass = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m14.9 9.1-1.6 4.2-4.2 1.6 1.6-4.2 4.2-1.6Z" />
  </Base>
);

export const IconConnections = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 19.5s-6.6-4-6.6-8.6A3.9 3.9 0 0 1 12 7.5a3.9 3.9 0 0 1 6.6 3.4c0 4.6-6.6 8.6-6.6 8.6Z" />
  </Base>
);

export const IconCrown = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 17.5h16M4.5 7.5l3.4 3L12 5.5l4.1 5 3.4-3-1.4 9H5.9l-1.4-9Z" />
  </Base>
);

export const IconShield = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3.4 19 6v6.1c0 4.2-3 7.3-7 8.5-4-1.2-7-4.3-7-8.5V6l7-2.6Z" />
  </Base>
);

export const IconUser = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="8.6" r="3.6" />
    <path d="M5.5 20c.8-3.3 3.4-5.1 6.5-5.1s5.7 1.8 6.5 5.1" />
  </Base>
);

export const IconMessages = (p: IconProps) => (
  <Base {...p}>
    <path d="M20 12.2c0 3.6-3.6 6.5-8 6.5-1 0-2-.15-2.9-.42L4.5 20l1.2-3.3C4.6 15.5 4 13.9 4 12.2c0-3.6 3.6-6.5 8-6.5s8 2.9 8 6.5Z" />
  </Base>
);

export const IconPin = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 21s6-5.3 6-9.6A6 6 0 0 0 6 11.4C6 15.7 12 21 12 21Z" />
    <circle cx="12" cy="11.2" r="2.2" />
  </Base>
);

export const IconInfo = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5.2M12 8.1v.3" />
  </Base>
);

export const IconArrowRight = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 12h13M13 6.6 18.4 12 13 17.4" />
  </Base>
);

export const IconClose = (p: IconProps) => (
  <Base {...p}>
    <path d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5" />
  </Base>
);

export const IconHeartSolid = ({ size = 22, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 20.4s-7.8-4.9-7.8-10.3a4.6 4.6 0 0 1 7.8-3.3 4.6 4.6 0 0 1 7.8 3.3c0 5.4-7.8 10.3-7.8 10.3Z" />
  </svg>
);

/** Velora mark — diamante facetado */
export const VeloraMark = ({ size = 26, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.2}
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M12 2.6 21 12l-9 9.4L3 12l9-9.4Z" />
    <path d="M12 2.6 8.4 12 12 21.4 15.6 12 12 2.6ZM3 12h18" />
  </svg>
);

/** Selo circular de verificação (badge preenchido) */
export const VerifiedSeal = ({ size = 18, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      fill="currentColor"
      d="M12 1.8l2.4 1.9 3-.4 1.1 2.8 2.7 1.4-.7 3 .7 3-2.7 1.4-1.1 2.8-3-.4L12 19.2l-2.4-1.9-3 .4-1.1-2.8-2.7-1.4.7-3-.7-3 2.7-1.4L6.6 3.3l3 .4L12 1.8Z"
    />
    <path
      d="m8.4 10.6 2.4 2.4 4.5-4.5"
      fill="none"
      stroke="var(--obsidian)"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Escudo com check — identidade verificada */
export const ShieldCheck = ({ size = 26, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path fill="currentColor" d="M12 2.2 19.4 5v6.4c0 4.5-3.1 7.8-7.4 9.1-4.3-1.3-7.4-4.6-7.4-9.1V5L12 2.2Z" />
    <path
      d="m8.5 11.6 2.4 2.4 4.6-4.7"
      fill="none"
      stroke="var(--obsidian)"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
