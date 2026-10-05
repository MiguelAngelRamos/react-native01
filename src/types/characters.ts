/**
 * character.ts — Tipos de los datos que devuelve la API de Rick and Morty.
 *
 * Esto es TypeScript puro: funciona exactamente igual que en React web.
 * Tipar la respuesta de la API nos da autocompletado en todo el proyecto y hace
 * que el compilador nos avise si accedemos a un campo que no existe.
 *
 * Documentación de la API: https://rickandmortyapi.com/documentation/#character
 */

/**
 * La API devuelve el estado con estos tres valores exactos.
 * Usar una unión de literales (en lugar de `string`) permite que TypeScript
 * verifique que manejamos todos los casos al asignar un color a cada estado.
 */
export type CharacterStatus = 'Alive' | 'Dead' | 'unknown';

export type CharacterGender = 'Female' | 'Male' | 'Genderless' | 'unknown';

/** Referencia a una ubicación (origen o ubicación actual). */
export interface LocationReference {
  name: string;
  url: string;
}

/** Un personaje tal como lo devuelve GET /api/character. */
export interface Character {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  /** Subespecie o variante. Suele venir como string vacío. */
  type: string;
  gender: CharacterGender;
  origin: LocationReference;
  location: LocationReference;
  /** URL de una imagen JPEG de 300x300. */
  image: string;
  /** URLs de los episodios en los que aparece. */
  episode: string[];
  url: string;
  created: string;
}

/** Metadatos de paginación que acompañan a cada página de resultados. */
export interface PaginationInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

/** Forma completa de la respuesta de GET /api/character?page=N. */
export interface CharacterPageResponse {
  info: PaginationInfo;
  results: Character[];
}
