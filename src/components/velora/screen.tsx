import type { ReactNode } from "react";

/** Cabeçalho editorial padrão das telas internas. */
export function ScreenIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="px-6 pt-8">
      <p className="text-eyebrow">{eyebrow}</p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-ivory">{title}</h1>
      <p className="mt-3 max-w-[22rem] text-[14px] leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export function ScreenList({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-3 px-4 py-8">{children}</div>;
}

export function ListRow({
  photo,
  title,
  meta,
  trailing,
}: {
  photo?: string | undefined;
  title: string;
  meta: string;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg surface-glass p-4">
      {photo ? (
        <img
          src={photo}
          alt={title}
          width={56}
          height={56}
          loading="lazy"
          className="h-14 w-14 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-champagne/25 font-display text-xl text-champagne">
          {title.charAt(0)}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] text-ivory">{title}</p>
        <p className="truncate text-[13px] text-muted-foreground">{meta}</p>
      </div>
      {trailing}
    </div>
  );
}
