import type { Deal } from './Deal';

export interface Game {
  id: string;
  title: string;
  coverImage: string | null;
  rating: number | null;
  releaseDate: string | null;
  genres: string[];
  deals: Deal[];
}
