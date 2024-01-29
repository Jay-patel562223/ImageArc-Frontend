import Spinner from '@/components/ui/loaders/spinner/spinner';
// import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import Details from '../../components/products/details/details';
// import ShortDetails from './short-details';
// import { stickyShortDetailsAtom } from '@/store/sticky-short-details-atom';
// import { useAtom } from 'jotai';
// import { AttributesProvider } from './attributes.context';
import { useProduct } from '@/framework/product';
import { useRouter } from 'next/router';
import CartCounterButton from '@/components/cart/cart-counter-button';
// /var/www/html/FE_SHOP_PHOTO/src/components/products/details/details.tsx
// const RelatedProducts = dynamic(() => import('./related-products'));
// import ShowInDetails from '../../components/products/ShowInDetails'
// import Details from '../../components/products/cards/card'
// import type { NextPageWithLayout } from '@/types';
import { getLayout } from '@/components/layouts/layout';
// import { InferGetStaticPropsType } from 'next';
// export { getStaticPaths,getStaticProps } from '@/framework/product.ssr';
// import { getStaticPaths, getStaticProps } from '@/framework/shop.ssr';


import { NextPageWithLayout } from '@/types';
import { InferGetStaticPropsType } from 'next';
import { getStaticPaths, getStaticProps } from '@/framework/product.ssr';
// export { getStaticPaths, getStaticProps };
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';


// interface ProductPopupProps {
//   slug: string;
//   // productSlug: string;
// }


const ProductPage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = () => {
  
// const ProductPage: NextPageWithLayout = () => {
  const { t } = useTranslation('common');

  const router = useRouter();
  const slug = router.query.slug;
  //@ts-ignore
  const { product, isLoading } = useProduct({ slug: slug });
  
  // return <ShowInDetails product={product} isLoading={isLoading}/>

  let productItem:any = product;
  productItem = productItem?.data

  if (isLoading || !product)
    return (
      <div className="relative flex items-center justify-center w-96 h-96 bg-light">
        <Spinner text={t('common:text-loading')} />
      </div>
    );

    return (
    // <AttributesProvider>
     <div>
        <Details product={productItem} backBtn={false} isModal={true} />

      <CartCounterButton />
      </div>

    // </AttributesProvider>
    
  );
};

ProductPage.getLayout = getLayout;

export default ProductPage;
