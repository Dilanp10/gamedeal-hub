import { describe, it, expect } from 'vitest';
import yaml from 'js-yaml';
import { readFileSync } from 'fs';
import { join } from 'path';
import { generateOpenApiDocument } from '../../scripts/export-openapi';

const DESIGN_YAML_PATH = join(
  __dirname,
  '../../specs/001-games-search/contracts/games-search.openapi.yaml',
);

describe('Contract: generated OpenAPI vs design contract', () => {
  const generated = generateOpenApiDocument();
  const design = yaml.load(readFileSync(DESIGN_YAML_PATH, 'utf-8')) as Record<string, unknown>;

  const generatedSchemas = (generated.components?.schemas ?? {}) as Record<string, unknown>;
  const designSchemas = (
    (design['components'] as Record<string, unknown>)?.['schemas'] ?? {}
  ) as Record<string, unknown>;

  it('generated document contains all schemas defined in the design contract', () => {
    const expectedNames = Object.keys(designSchemas);
    for (const name of expectedNames) {
      expect(generatedSchemas, `Schema "${name}" faltante en el documento generado`).toHaveProperty(
        name,
      );
    }
  });

  it('Game schema has required fields: id, title, deals', () => {
    const game = generatedSchemas['Game'] as Record<string, unknown>;
    expect(game).toBeDefined();
    const required = game['required'] as string[];
    expect(required).toContain('id');
    expect(required).toContain('title');
    expect(required).toContain('deals');
  });

  it('Deal schema has required fields: store, price, currency, discount_percentage, deal_url', () => {
    const deal = generatedSchemas['Deal'] as Record<string, unknown>;
    expect(deal).toBeDefined();
    const required = deal['required'] as string[];
    expect(required).toContain('store');
    expect(required).toContain('price');
    expect(required).toContain('currency');
    expect(required).toContain('discount_percentage');
    expect(required).toContain('deal_url');
  });

  it('ErrorResponse code field is an enum with INTERNAL_ERROR, UPSTREAM_ERROR, NOT_FOUND', () => {
    const errorResp = generatedSchemas['ErrorResponse'] as Record<string, unknown>;
    expect(errorResp).toBeDefined();
    const props = (errorResp['properties'] as Record<string, unknown>)?.['error'] as Record<
      string,
      unknown
    >;
    const codeEnum = ((props?.['properties'] as Record<string, unknown>)?.['code'] as Record<
      string,
      unknown
    >)?.['enum'] as string[];
    expect(codeEnum).toContain('INTERNAL_ERROR');
    expect(codeEnum).toContain('UPSTREAM_ERROR');
    expect(codeEnum).toContain('NOT_FOUND');
  });

  it('GET /api/v1/games/search path exists with operationId searchGames', () => {
    const paths = generated.paths as Record<string, unknown>;
    expect(paths).toHaveProperty('/api/v1/games/search');
    const getOp = (
      paths['/api/v1/games/search'] as Record<string, unknown>
    )?.['get'] as Record<string, unknown>;
    expect(getOp).toBeDefined();
    expect(getOp['operationId']).toBe('searchGames');
  });

  it('GET /api/v1/games/search has responses 200, 400, 500', () => {
    const paths = generated.paths as Record<string, unknown>;
    const responses = (
      (paths['/api/v1/games/search'] as Record<string, unknown>)?.['get'] as Record<
        string,
        unknown
      >
    )?.['responses'] as Record<string, unknown>;
    expect(responses).toHaveProperty('200');
    expect(responses).toHaveProperty('400');
    expect(responses).toHaveProperty('500');
  });
});
