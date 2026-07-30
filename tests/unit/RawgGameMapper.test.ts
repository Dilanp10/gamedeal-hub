import { describe, it, expect } from 'vitest';
import { mapRawgGame, type RawgGameDto } from '../../src/infrastructure/mappers/RawgGameMapper';

const base: RawgGameDto = {
  id: 3498,
  slug: 'the-witcher-3-wild-hunt',
  name: 'The Witcher 3 Wild Hunt',
  background_image: 'https://media.rawg.io/img.jpg',
  rating: 4.66,
  released: '2015-05-18',
  genres: [
    { id: 1, name: 'RPG' },
    { id: 2, name: 'Adventure' },
  ],
};

describe('mapRawgGame', () => {
  it('mapea correctamente un DTO completo', () => {
    expect(mapRawgGame(base)).toEqual({
      id: 'the-witcher-3-wild-hunt',
      title: 'The Witcher 3 Wild Hunt',
      coverImage: 'https://media.rawg.io/img.jpg',
      rating: 4.66,
      releaseDate: '2015-05-18',
      genres: ['RPG', 'Adventure'],
    });
  });

  it('retorna rating null cuando RAWG devuelve 0 (juego sin calificaciones)', () => {
    const result = mapRawgGame({ ...base, rating: 0 });
    expect(result.rating).toBeNull();
  });

  it('retorna coverImage null cuando background_image es null', () => {
    const result = mapRawgGame({ ...base, background_image: null });
    expect(result.coverImage).toBeNull();
  });

  it('retorna releaseDate null cuando released es null', () => {
    const result = mapRawgGame({ ...base, released: null });
    expect(result.releaseDate).toBeNull();
  });

  it('retorna genres vacío cuando no hay géneros', () => {
    const result = mapRawgGame({ ...base, genres: [] });
    expect(result.genres).toEqual([]);
  });

  it('usa el slug de RAWG como id (no el name)', () => {
    const result = mapRawgGame({ ...base, slug: 'my-stable-slug', name: 'My Game Name' });
    expect(result.id).toBe('my-stable-slug');
  });
});
