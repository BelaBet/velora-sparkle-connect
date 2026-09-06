import { useState } from "react";
import { cn } from "./utils";
import { IconClose, IconArrowRight, IconHeartSolid } from "./icons-nav";

/**
 * DiscoverActions — Não é pra mim · Tenho interesse · Próxima.
 * O interesse é o centro visual: círculo champagne com pulso de 240ms.
 */
export function DiscoverActions({
  onPass,
  onInterest,
  onNext,
  disabled = false,
}: {
  onPass?: (() => void) | undefined;
  onInterest?: (() => void) | undefined;
  onNext?: (() => void) | undefined;
  disabled?: boolean | undefined;
}) {
  const [pulse, setPulse] = useState(0);

  return (
    <div className="flex items-start justify-center gap-9 px-6 py-6">
      <SideAction label="Não é pra mim" onClick={onPass} disabled={disabled}>
        <IconClose size={22} />
      </SideAction>

      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          aria-label="Tenho interesse"
          disabled={disabled}
          onClick={() => {
            setPulse((p) => p + 1);
            onInterest?.();
          }}
          className="flex h-[68px] w-[68px] items-center justify-center rounded-full border border-champagne text-champagne transition-velora hover:bg-champagne/10 active:scale-95 disabled:pointer-events-none disabled:opacity-30"
        >
          <span key={pulse} className="animate-interest inline-flex rounded-full">
            <IconHeartSolid size={30} />
          </span>
        </button>
        <span className="text-[12.5px] text-champagne">Tenho interesse</span>
      </div>

      <SideAction label="Próxima" onClick={onNext} disabled={disabled}>
        <IconArrowRight size={22} />
      </SideAction>
    </div>
  );
}

function SideAction({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: (() => void) | undefined;
  disabled?: boolean | undefined;
}) {
  return (
    <div className="flex flex-col items-center gap-2 pt-2.5">
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "flex h-[52px] w-[52px] items-center justify-center rounded-full border border-ivory/15 text-pearl",
          "transition-velora hover:border-ivory/35 hover:text-ivory active:scale-95 disabled:pointer-events-none disabled:opacity-30",
        )}
      >
        {children}
      </button>
      <span className="text-[12.5px] text-muted-foreground">{label}</span>
    </div>
  );
}
