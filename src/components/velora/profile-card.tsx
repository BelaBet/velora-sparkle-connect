import { VerifiedBadge } from "./badges";
import { InterestButton, PassButton } from "./interaction";
import { IconLocation } from "./icons";

export type ProfileCardProps = {
  photo: string;
  name: string;
  age: number;
  city: string;
  distanceKm: number;
  interests: string[];
  quote: string;
  priority?: boolean;
};

/**
 * ProfileCard — hierarquia Velora: imagem, identidade, informação, ação.
 * A fotografia domina; a interface não compete com ela.
 */
export function ProfileCard({
  photo,
  name,
  age,
  city,
  distanceKm,
  interests,
  quote,
  priority,
}: ProfileCardProps) {
  return (
    <article className="group relative aspect-[3/4.35] w-full overflow-hidden rounded-xl surface-card">
      <img
        src={photo}
        alt={`${name}, ${age}`}
        width={900}
        height={1200}
        loading={priority ? "eager" : "lazy"}
        className="absolute inset-0 h-full w-full object-cover transition-velora duration-[600ms] group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 scrim-bottom" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6">
        <VerifiedBadge className="self-start" />

        <div>
          <h3 className="font-display text-[2rem] leading-none text-ivory">
            {name}, {age}
          </h3>
          <p className="mt-2 flex items-center gap-1.5 text-[13px] text-muted-foreground">
            <IconLocation size={14} />
            {city} · {distanceKm} km
          </p>
        </div>

        <p className="text-[13px] tracking-[0.04em] text-pearl/80">{interests.join(" · ")}</p>

        <p className="font-display text-[1.15rem] leading-snug text-pearl/90 italic">“{quote}”</p>

        <div className="mt-2 flex items-center justify-between">
          <PassButton />
          <InterestButton />
        </div>
      </div>
    </article>
  );
}
