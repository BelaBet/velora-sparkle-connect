import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { IconHeart, IconPass, IconSave, IconArrow } from "./icons";

function CircleAction({
  children,
  label,
  onClick,
  className,
  size = "md",
}: {
  children: ReactNode;
  label: string;
  onClick?: (() => void) | undefined;
  className?: string | undefined;
  size?: "sm" | "md" | undefined;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-full surface-glass transition-velora",
        "text-pearl hover:border-champagne/40 hover:text-champagne active:scale-95",
        size === "md" ? "h-14 w-14" : "h-10 w-10",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function InterestButton({ onInterest }: { onInterest?: (() => void) | undefined }) {
  const [active, setActive] = useState(false);
  const [pulse, setPulse] = useState(0);

  return (
    <CircleAction
      label="Demonstrar interesse"
      onClick={() => {
        setActive(true);
        setPulse((p) => p + 1);
        onInterest?.();
      }}
      className={cn(active && "border-champagne/50 text-champagne")}
    >
      <span key={pulse} className="animate-interest inline-flex rounded-full">
        <IconHeart size={22} className={cn(active && "fill-champagne/25")} />
      </span>
    </CircleAction>
  );
}

export const PassButton = ({ onPass }: { onPass?: (() => void) | undefined }) => (
  <CircleAction label="Passar" onClick={onPass}>
    <IconPass size={20} />
  </CircleAction>
);

export const SaveButton = ({ onSave }: { onSave?: (() => void) | undefined }) => (
  <CircleAction label="Salvar" size="sm" onClick={onSave}>
    <IconSave size={16} />
  </CircleAction>
);

export function GhostAction({ children, onClick }: { children: ReactNode; onClick?: (() => void) | undefined }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex items-center gap-2 border-b border-champagne/30 pb-1 text-[13px] tracking-[0.14em] uppercase text-champagne transition-velora hover:border-champagne"
    >
      {children}
      <IconArrow size={15} className="transition-velora group-hover:translate-x-0.5" />
    </button>
  );
}
