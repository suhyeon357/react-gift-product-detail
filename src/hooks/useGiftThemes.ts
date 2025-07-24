import { useQuery } from '@tanstack/react-query';
import { fetchGiftThemes } from '../api/giftTheme';
import { type GiftTheme } from '../types/GiftTheme';

export const useGiftThemes = () => {
  return useQuery<GiftTheme[], Error>({
    queryKey: ['giftThemes'],
    queryFn: async () => {
      const res = await fetchGiftThemes();
      console.log('useGiftThemes select res:', res);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
