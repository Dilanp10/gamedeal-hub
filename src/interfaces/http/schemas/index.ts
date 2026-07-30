// Orden de importación deliberado: cada capa depende de la anterior.
export { DealSchema } from './deal.schema';
export type { Deal } from './deal.schema';

export { GameSchema } from './game.schema';
export type { Game } from './game.schema';

export { SearchMetaSchema, SearchGamesResponseSchema, SearchQuerySchema } from './search.schema';
export type { SearchMeta, SearchGamesResponse, SearchQuery } from './search.schema';

export { ValidationErrorResponseSchema, ErrorResponseSchema } from './error.schema';
export type { ValidationErrorResponse, ErrorResponse } from './error.schema';

export { registry } from './registry';

// Registro de rutas: debe ejecutarse después de que todos los schemas de componentes
// estén registrados. El import sin alias es suficiente (efecto de lado).
import './paths';
