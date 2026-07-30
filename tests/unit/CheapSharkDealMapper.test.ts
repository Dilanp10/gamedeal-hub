import { describe, it, expect } from 'vitest';
import {
  mapCheapSharkDeal,
  type CheapSharkDealDto,
} from '../../src/infrastructure/mappers/CheapSharkDealMapper';

const storeMap = new Map([
  ['1', 'Steam'],
  ['25', 'Epic Games Store'],
]);

const baseDto: CheapSharkDealDto = {
  storeID: '1',
  salePrice: '9.99',
  normalPrice: '39.99',
  savings: '75.000000',
  dealID: 'ABC123',
};

describe('mapCheapSharkDeal', () => {
  it('mapea correctamente una oferta con descuento', () => {
    expect(mapCheapSharkDeal(baseDto, storeMap)).toEqual({
      store: 'Steam',
      price: 9.99,
      originalPrice: 39.99,
      currency: 'USD',
      discountPercentage: 75,
      dealUrl: 'https://www.cheapshark.com/redirect?dealID=ABC123',
    });
  });

  it('retorna originalPrice null cuando no hay descuento (salePrice == normalPrice)', () => {
    const dto: CheapSharkDealDto = {
      ...baseDto,
      salePrice: '39.99',
      normalPrice: '39.99',
      savings: '0.000000',
    };
    const result = mapCheapSharkDeal(dto, storeMap);
    expect(result.originalPrice).toBeNull();
    expect(result.discountPercentage).toBe(0);
  });

  it('usa fallback "Store {id}" para storeID desconocido', () => {
    const dto: CheapSharkDealDto = { ...baseDto, storeID: '99' };
    const result = mapCheapSharkDeal(dto, storeMap);
    expect(result.store).toBe('Store 99');
  });

  it('resuelve correctamente Epic Games Store', () => {
    const dto: CheapSharkDealDto = { ...baseDto, storeID: '25' };
    const result = mapCheapSharkDeal(dto, storeMap);
    expect(result.store).toBe('Epic Games Store');
  });

  it('la URL del deal incluye el dealID correcto', () => {
    const result = mapCheapSharkDeal({ ...baseDto, dealID: 'XYZ999' }, storeMap);
    expect(result.dealUrl).toBe('https://www.cheapshark.com/redirect?dealID=XYZ999');
  });

  it('redondea el porcentaje de descuento a 2 decimales', () => {
    const dto: CheapSharkDealDto = { ...baseDto, savings: '33.333333' };
    const result = mapCheapSharkDeal(dto, storeMap);
    expect(result.discountPercentage).toBe(33.33);
  });
});
