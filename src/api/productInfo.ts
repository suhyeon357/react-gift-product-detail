import type { ProductInfo } from '../types/Products';
import { fetcher } from './client';

export const fetchProdcutInfo = async (
  productId: number
): Promise<ProductInfo> => {
  const endpoint = `/api/products/${productId}`;
  const res = await fetcher(
    endpoint,
    '상품 상세정보를 불러오지 못했습니다.'
  );
  return res.data;
};
