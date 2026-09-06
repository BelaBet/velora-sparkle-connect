import type { SVGProps } from "react";

/**
 * Velora Icons — thin line, 1.5px, soft corners, editorial geometry.
 * Proprietary set: no third-party icon library signature.
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 20, children, ...props }: IconProps) {
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

export const IconHeart = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 20s-7.2-4.4-7.2-9.4A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7.2 3c0 5-7.2 9.4-7.2 9.4Z" />
  </Base>
);

export const IconPass = (p: IconProps) => (
  <Base {...p}>
    <path d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5" />
  </Base>
);

export const IconCheck = (p: IconProps) => (
  <Base {...p}>
    <path d="m5 12.6 4.4 4.4L19 7.4" />
  </Base>
);

export const IconSpark = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3.5c.9 4.6 3.9 7.6 8.5 8.5-4.6.9-7.6 3.9-8.5 8.5-.9-4.6-3.9-7.6-8.5-8.5 4.6-.9 7.6-3.9 8.5-8.5Z" />
  </Base>
);

export const IconLiveness = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="3.4" fill="currentColor" stroke="none" />
  </Base>
);

export const IconLocation = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="7.5" />
    <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3" />
  </Base>
);

export const IconPrivacy = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3.2 19 6v6c0 4.2-3 7.3-7 8.8-4-1.5-7-4.6-7-8.8V6l7-2.8Z" />
  </Base>
);

export const IconSave = (p: IconProps) => (
  <Base {...p}>
    <path d="M7 4.5h10a.5.5 0 0 1 .5.5v14.2l-5.5-3.4-5.5 3.4V5a.5.5 0 0 1 .5-.5Z" />
  </Base>
);

export const IconArrow = (p: IconProps) => (
  <Base {...p}>
    <path d="M7.5 16.5 16.5 7.5M9.5 7.5h7v7" />
  </Base>
);
