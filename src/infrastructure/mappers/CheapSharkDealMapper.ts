import type { Deal } from '../../domain/entities/Deal';

export interface CheapSharkDealDto {
  storeID: string;
  dealID: string;
  savings: string;
  // /deals endpoint uses salePrice/normalPrice; /games?id= uses price/retailPrice
  salePrice?: string;
  normalPrice?: string;
  price?: string;
  retailPrice?: string;
}

export function mapCheapSharkDeal(
  dto: CheapSharkDealDto,
  storeMap: Map<string, string>,
): Deal {
  const price = parseFloat(dto.salePrice ?? dto.price ?? '0');
  const normalPrice = parseFloat(dto.normalPrice ?? dto.retailPrice ?? '0');
  const savings = Math.round(parseFloat(dto.savings) * 100) / 100;

  return {
    store: storeMap.get(dto.storeID) ?? `Store ${dto.storeID}`,
    price,
    originalPrice: normalPrice > price ? normalPrice : null,
    currency: 'USD',
    discountPercentage: savings,
    dealUrl: `https://www.cheapshark.com/redirect?dealID=${dto.dealID}`,
  };
}
