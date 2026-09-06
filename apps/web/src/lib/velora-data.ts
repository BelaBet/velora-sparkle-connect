import lounge from "@/assets/experience-lounge.jpg";

export type Experience = {
  id: string;
  image: string;
  title: string;
  venue: string;
  city: string;
  detail: string;
};

export const experiences: Experience[] = [
  {
    id: "salon-prive",
    image: lounge,
    title: "Jantar reservado",
    venue: "Salon Privé · Jardins",
    city: "São Paulo",
    detail: "Salão privativo, menu degustação para dois e entrada discreta pelo lobby.",
  },
  {
    id: "rooftop-aurora",
    image: lounge,
    title: "Rooftop ao entardecer",
    venue: "Terraço Aurora · Itaim",
    city: "São Paulo",
    detail: "Coquetéis autorais e vista panorâmica, com reserva de mesa privativa.",
  },
];
