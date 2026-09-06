import juliana from "@/assets/discover-juliana.jpg";
import rafael from "@/assets/profile-rafael.jpg";
import marina from "@/assets/profile-juliana.jpg";
import lounge from "@/assets/experience-lounge.jpg";

export type DiscoverProfile = {
  id: string;
  name: string;
  age: number;
  distanceKm: number;
  interests: string[];
  bio: string;
  about: string;
  photo: string;
  photoCount: number;
};

export const discoverProfiles: DiscoverProfile[] = [
  {
    id: "juliana",
    name: "Juliana",
    age: 29,
    distanceKm: 3,
    interests: ["Gastronomia", "Viagens", "Música", "Academia"],
    bio: "Apaixonada por bons vinhos, viagens e conversas profundas.",
    about: "Trabalha com arquitetura, já visitou 22 países e adora um bom jantar em silêncio.",
    photo: juliana,
    photoCount: 5,
  },
  {
    id: "rafael",
    name: "Rafael",
    age: 34,
    distanceKm: 6,
    interests: ["Vinhos", "Golfe", "Arte", "Negócios"],
    bio: "Sócio de uma gestora de investimentos. Fim de semana é vela e vinho.",
    about: "Colecionador de arte contemporânea, prefere encontros discretos em lugares pequenos.",
    photo: rafael,
    photoCount: 4,
  },
  {
    id: "marina",
    name: "Marina",
    age: 31,
    distanceKm: 9,
    interests: ["Literatura", "Yoga", "Design", "Viagens"],
    bio: "Designer, leitora compulsiva e sempre com uma viagem planejada.",
    about: "Estudou em Milão, fala três idiomas e prefere jantares a festas.",
    photo: marina,
    photoCount: 6,
  },
];

export type Connection = {
  id: string;
  name: string;
  age: number;
  photo: string;
  meta: string;
  isNew?: boolean;
};

export const connections: Connection[] = [
  {
    id: "juliana",
    name: "Juliana",
    age: 29,
    photo: juliana,
    meta: "Conexão hoje · São Paulo",
    isNew: true,
  },
  { id: "rafael", name: "Rafael", age: 34, photo: rafael, meta: "Conexão ontem · Jardins" },
  { id: "marina", name: "Marina", age: 31, photo: marina, meta: "Conexão há 3 dias · Itaim" },
];

export type ChatMessage = {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
};

export type Conversation = {
  id: string;
  name: string;
  photo: string;
  messages: ChatMessage[];
};

export const initialConversations: Conversation[] = [
  {
    id: "juliana",
    name: "Juliana",
    photo: juliana,
    messages: [
      { id: "1", from: "them", text: "Oi! Vi que também gosta de vinhos naturais.", time: "14:10" },
      { id: "2", from: "them", text: "Conheço um lugar perfeito para isso.", time: "14:32" },
    ],
  },
  {
    id: "rafael",
    name: "Rafael",
    photo: rafael,
    messages: [
      { id: "1", from: "them", text: "Quinta às 20h no Salon Privé?", time: "09:05" },
      {
        id: "2",
        from: "me",
        text: "Perfeito, te aviso quando eu confirmar a mesa.",
        time: "09:08",
      },
      { id: "3", from: "them", text: "Combinado para quinta, então.", time: "09:10" },
    ],
  },
];

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
