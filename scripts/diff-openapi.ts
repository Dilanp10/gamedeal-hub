/**
 * Compara los schemas y rutas del documento OpenAPI generado desde Zod
 * contra el contrato de diseño en specs/001-games-search/contracts/.
 * Sale con código 1 si hay diferencias estructurales.
 */
import yaml from 'js-yaml';
import { readFileSync } from 'fs';
import { join } from 'path';
import { generateOpenApiDocument } from './export-openapi';

type OpenApiDoc = Record<string, unknown>;

function extractContract(doc: OpenApiDoc) {
  return {
    schemas: (doc['components'] as Record<string, unknown>)?.['schemas'] ?? {},
    paths: Object.fromEntries(
      Object.entries((doc['paths'] as Record<string, unknown>) ?? {}).map(([path, methods]) => [
        path,
        Object.fromEntries(
          Object.entries(methods as Record<string, unknown>).map(([method, op]) => [
            method,
            {
              operationId: (op as Record<string, unknown>)['operationId'],
              responses: Object.keys(
                ((op as Record<string, unknown>)['responses'] as Record<string, unknown>) ?? {},
              ),
            },
          ]),
        ),
      ]),
    ),
  };
}

const designYaml = readFileSync(
  join(__dirname, '../specs/001-games-search/contracts/games-search.openapi.yaml'),
  'utf-8',
);
const designDoc = yaml.load(designYaml) as OpenApiDoc;
const generatedDoc = generateOpenApiDocument() as unknown as OpenApiDoc;

const designContract = extractContract(designDoc);
const generatedContract = extractContract(generatedDoc);

const designSchemaKeys = Object.keys(designContract.schemas as object).sort();
const generatedSchemaKeys = Object.keys(generatedContract.schemas as object).sort();

let hasErrors = false;

// 1. Comprobar que todos los schemas del diseño existen en el generado
const missingSchemas = designSchemaKeys.filter((k) => !generatedSchemaKeys.includes(k));
if (missingSchemas.length > 0) {
  console.error(`✗  Schemas faltantes en el documento generado: ${missingSchemas.join(', ')}`);
  hasErrors = true;
}

// 2. Comprobar que el path principal existe con los métodos correctos
const designPaths = Object.keys(designContract.paths);
const generatedPaths = Object.keys(generatedContract.paths);
const missingPaths = designPaths.filter((p) => !generatedPaths.includes(p));
if (missingPaths.length > 0) {
  console.error(`✗  Rutas faltantes en el documento generado: ${missingPaths.join(', ')}`);
  hasErrors = true;
}

// 3. Comprobar response codes por ruta
for (const path of designPaths) {
  const designMethods = designContract.paths[path] ?? {};
  const generatedMethods = generatedContract.paths[path] ?? {};
  for (const [method, designOp] of Object.entries(
    designMethods as Record<string, { operationId: string; responses: string[] }>,
  )) {
    const genOp = (generatedMethods as Record<string, { operationId: string; responses: string[] }>)[
      method
    ];
    if (!genOp) {
      console.error(`✗  Método ${method.toUpperCase()} ${path} faltante en generado`);
      hasErrors = true;
      continue;
    }
    const missingCodes = designOp.responses.filter((c) => !genOp.responses.includes(c));
    if (missingCodes.length > 0) {
      console.error(
        `✗  ${method.toUpperCase()} ${path}: response codes faltantes: ${missingCodes.join(', ')}`,
      );
      hasErrors = true;
    }
  }
}

if (hasErrors) {
  console.error('\n✗  El documento generado difiere del contrato de diseño.');
  process.exit(1);
} else {
  console.log('✓  El documento generado es compatible con el contrato de diseño.');
}
