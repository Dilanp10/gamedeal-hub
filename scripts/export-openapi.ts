import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import yaml from 'js-yaml';
import { writeFileSync } from 'fs';
import { join } from 'path';

// Side-effect: registra todos los schemas y rutas en el registry global.
import { registry } from '../src/interfaces/http/schemas/index';

export function generateOpenApiDocument(): ReturnType<OpenApiGeneratorV3['generateDocument']> {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: '3.0.3',
    info: {
      title: 'GameDeal Hub API',
      version: '1.0.0',
      description:
        'API REST que agrega y unifica información de videojuegos y ofertas en tiempo real\n' +
        'combinando RAWG (metadatos) y CheapShark (precios).\n\n' +
        'Construida con Spec-Driven Development (Contract-First).',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Entorno de desarrollo local' },
    ],
    tags: [
      { name: 'Games', description: 'Búsqueda y consulta unificada de videojuegos con ofertas.' },
      { name: 'System', description: 'Endpoints operativos (health, docs).' },
    ],
  });
}

// Ejecutable directo: tsx scripts/export-openapi.ts
if (require.main === module) {
  const doc = generateOpenApiDocument();
  const outputPath = join(__dirname, '../openapi/openapi.yaml');
  writeFileSync(outputPath, yaml.dump(doc, { lineWidth: 120, noRefs: true }), 'utf-8');
  console.log(`✓  openapi/openapi.yaml actualizado`);
}
