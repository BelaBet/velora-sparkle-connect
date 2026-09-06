import { useState } from "react";
import { cn } from "./utils";
import { IconPin, IconInfo, ShieldCheck, VerifiedSeal } from "./icons-nav";

export type DiscoverProfile = {
  photo?: string | undefined;
  name: string;
  age: number;
  distanceKm?: number | undefined;
  city?: string | undefined;
  interests?: string[] | undefined;
  bio?: string | undefined;
  photoCount?: number | undefined;
  verified?: boolean | undefined;
};

/**
 * DiscoverCard — a fotografia domina; identidade, informação e ação sobre o gradiente.
 * Sem foto (perfis reais ainda sem upload), cai para um monograma discreto.
 */
export function DiscoverCard({
  profile,
  onAbout,
}: {
  profile: DiscoverProfile;
  onAbout?: (() => void) | undefined;
}) {
  const [photoIndex] = useState(0);
  const verified = profile.verified ?? true;
  const interests = profile.interests ?? [];
  const photoCount = profile.photoCount ?? 1;

  return (
    <article className="relative aspect-[9/15.2] w-full overflow-hidden rounded-2xl border border-border bg-graphite">
      {profile.photo ? (
        <img
          src={profile.photo}
          alt={`${profile.name}, ${profile.age}`}
          width={900}
          height={1300}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-charcoal">
          <span className="font-display text-8xl text-champagne/40">
            {profile.name.charAt(0)}
          </span>
        </div>
      )}
      <div className="absolute inset-0 scrim-bottom" />

      {/* Identidade */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
        {verified && (
          <div className="flex items-center gap-2">
            <ShieldCheck size={30} className="text-champagne" />
            <span className="max-w-[7.5rem] text-[13px] font-medium leading-tight text-ivory">
              Identidade verificada
            </span>
          </div>
        )}
        {(profile.distanceKm != null || profile.city) && (
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full surface-glass px-3 py-1.5 text-[13px] text-ivory">
            <IconPin size={15} className="text-champagne" />
            {profile.distanceKm != null ? `${profile.distanceKm} km` : profile.city}
          </span>
        )}
      </div>

      {/* Informação + ação secundária */}
      <div className="absolute inset-x-0 bottom-0 p-5 pb-9">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-[2rem] font-semibold leading-none text-ivory">
              {profile.name}, <span className="font-light text-ivory/90">{profile.age}</span>
              {verified && <VerifiedSeal size={20} className="text-champagne" />}
            </h2>

            {interests.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {interests.map((tag, i) => (
                  <li
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full surface-glass px-3 py-1.5 text-[12.5px] text-pearl"
                  >
                    {i !== 2 && <span className="h-1 w-1 rounded-full bg-champagne" />}
                    {tag}
                  </li>
                ))}
              </ul>
            )}

            {profile.bio && (
              <p className="mt-3 text-[14px] leading-snug text-pearl/85">{profile.bio}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onAbout}
            className="flex shrink-0 flex-col items-center gap-1 rounded-full surface-glass px-3 py-3 text-pearl transition-velora hover:text-champagne"
          >
            <IconInfo size={20} />
            <span className="text-[11px]">Sobre</span>
          </button>
        </div>

        {/* Indicador de fotos */}
        {photoCount > 1 && (
          <div className="mt-5 flex items-center justify-center gap-1.5">
            {Array.from({ length: photoCount }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-[3px] rounded-full transition-velora",
                  i === photoIndex ? "w-8 bg-champagne" : "w-6 bg-ivory/20",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
