import { useQuery } from '@tanstack/react-query';
import type { ThemeInfo } from '../types/GiftTheme';
import { fetchThemeInfo } from '../api/themeInfo';
import { queryKeys } from '../constants/queryKeys';

export const useThemeInfo = (themeId: number) => {
  return useQuery<ThemeInfo, Error>({
    queryKey: queryKeys.themeInfo(themeId),
    queryFn: () => fetchThemeInfo(themeId),
    enabled: !!themeId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
