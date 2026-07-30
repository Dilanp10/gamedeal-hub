import type { Game } from '../../domain/entities/Game';

export interface RawgGameDto {
  id: number;
  slug: string;
  name: string;
  background_image: string | null;
  rating: number;
  released: string | null;
  genres: Array<{ id: number; name: string }>;
}

export function mapRawgGame(dto: RawgGameDto): Omit<Game, 'deals'> {
  return {
    id: dto.slug,
    title: dto.name,
    coverImage: dto.background_image ?? null,
    // RAWG devuelve 0 cuando el juego no tiene calificaciones aún.
    rating: dto.rating > 0 ? dto.rating : null,
    releaseDate: dto.released ?? null,
    genres: dto.genres.map((g) => g.name),
  };
}
