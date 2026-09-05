import { MembershipBadge } from "./badges";
import { GhostAction, SaveButton } from "./interaction";

export type ExperienceCardProps = {
  image: string;
  title: string;
  venue: string;
  city: string;
  detail: string;
};

export function ExperienceCard({ image, title, venue, city, detail }: ExperienceCardProps) {
  return (
    <article className="overflow-hidden rounded-xl surface-card">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={image}
          alt={venue}
          width={1408}
          height={912}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 scrim-bottom opacity-70" />
        <MembershipBadge label="Velora Experience" className="absolute left-5 top-5" />
        <SaveButton />
      </div>

      <div className="flex flex-col gap-4 p-6">
        <div>
          <p className="text-eyebrow">{city}</p>
          <h3 className="mt-2 font-display text-2xl text-ivory">{title}</h3>
          <p className="mt-1 text-[13px] text-muted-foreground">{venue}</p>
        </div>
        <p className="text-[13px] leading-relaxed text-pearl/70">{detail}</p>
        <GhostAction>Reservar</GhostAction>
      </div>
    </article>
  );
}
