import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { IconCheck, IconLiveness, IconSpark, IconPrivacy } from "./icons";

function Chip({
  icon,
  children,
  className,
}: {
  icon?: ReactNode | undefined;
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-[0.06em]",
        "surface-glass text-pearl",
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

export const VerifiedBadge = ({ className }: { className?: string | undefined }) => (
  <Chip className={className} icon={<IconCheck size={13} className="text-champagne" />}>
    Identidade verificada
  </Chip>
);

export const LivenessBadge = ({ className }: { className?: string | undefined }) => (
  <Chip className={className} icon={<IconLiveness size={13} className="text-champagne" />}>
    Presença verificada
  </Chip>
);

export const TrustBadge = ({ className }: { className?: string | undefined }) => (
  <Chip className={className} icon={<IconSpark size={13} className="text-champagne" />}>
    Perfil confiável
  </Chip>
);

export const PrivacyIndicator = ({ className }: { className?: string | undefined }) => (
  <Chip className={className} icon={<IconPrivacy size={13} className="text-champagne-soft" />}>
    Modo discreto
  </Chip>
);

export const MembershipBadge = ({
  label = "Velora Black",
  className,
}: {
  label?: string | undefined;
  className?: string | undefined;
}) => (
  <span
    className={cn(
      "inline-flex items-center rounded-[3px] hairline-champagne px-2.5 py-1",
      "text-[10px] font-medium uppercase tracking-[0.32em] text-champagne",
      className,
    )}
  >
    {label}
  </span>
);
