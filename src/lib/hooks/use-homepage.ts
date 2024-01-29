import { TYPES_PER_PAGE } from '@/framework/client/variables';
import { useTypes } from '@/framework/type';

export default function useHomepage() {
  const { types } = useTypes({
    limit: TYPES_PER_PAGE,
  });
  // let typesNew = types?.data;
  let typesNew = types;
  if (!typesNew) {
    return {
      homePage: {
        slug: '',
      },
    };
  }

  return {
    homePage: typesNew.find((type:any) => type?.settings?.isHome) ?? typesNew[0],
  };
}
