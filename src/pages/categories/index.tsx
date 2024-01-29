// @ts-nocheck
import type { NextPageWithLayout } from '@/types';
import { getLayout } from '@/components/layouts/layout';
import Button from '@/components/ui/button';
import NotFound from '@/components/ui/not-found';
import { useTranslation } from 'next-i18next';
import rangeMap from '@/lib/range-map';
import CouponLoader from '@/components/ui/loaders/coupon-loader';
import { useShops } from '@/framework/shop';
import ErrorMessage from '@/components/ui/error-message';
import ShopCard from '@/components/ui/cards/shop';
import { SHOPS_LIMIT } from '@/lib/constants';
export { getStaticProps } from '@/framework/shops-page.ssr';
import { useCategories } from '@/framework/category';
import { useProductsCategory,useProducts } from '@/framework/product';
import { Routes } from '@/config/routes';
import { Grid } from '@/components/products/grid';
import { PRODUCTS_PER_PAGE, TYPES_PER_PAGE } from '@/framework/client/variables';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import CategoryCard from '@/components/ui/category-card';
import Link from '@/components/ui/link';
import { useState } from 'react';
import CategoriesLoader from '@/components/ui/loaders/categories-loader';
import BakeryCategoryLoader from '@/components/ui/loaders/bakery-categories-loader';


const ShowProductByCategory = ({id}) => {

  const { products, loadMore, isLoadingMore, isLoading, hasMore, error } =
  // useProducts({
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useProductsCategory({
      // ...variables,
      // ...(query.category && { categories: query.category }),
      // ...(query.text && { name: query.text }),
      id:id ? id : '',
      limit: TYPES_PER_PAGE
    });

    if (error) return <ErrorMessage message={error.message} />;



    if (!isLoading && !products.length && id) {
      return (
        <div className="min-h-full px-4 pt-6 pb-8 bg-gray-100 lg:p-8">
          <NotFound text="text-no-shops" />
        </div>
      );
    }

    return (
      <>
      <Grid
          products={products}
          loadMore={loadMore}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          error={error}
          limit={PRODUCTS_PER_PAGE}
                
        />
      </>
    )
}


const ShopsPage: NextPageWithLayout = () => {
  const CartCounterButton = dynamic(
    () => import('@/components/cart/cart-counter-button'),
    { ssr: false }
  );
  const { categories,isLoading, isFetching } = useCategories({
    // ...(type ? { type } : { type: query.searchType }),
    limit: 10000000
  });
  const router = useRouter();

  const { t } = useTranslation('common');
  const limit = SHOPS_LIMIT;
  // const { shops, isLoading, isLoadingMore, hasMore, loadMore, error } =
  //   useShops({
  //     limit,
  //     is_active: 1,
  //   });
  // const [categoryShow,setCategoryShow] = useState('');

 console.log('isLoading: ',isLoading,isFetching,categories);
  if(isLoading && categories.length == 0){
    <CategoriesLoader />
  }
  
  if (!isLoading && !categories.length) {
    return (
      <div className="min-h-full px-4 pt-6 pb-8 bg-gray-100 lg:p-8">
        <NotFound text="text-no-shops" />
      </div>
    );
  }

  // if(categories.length == 0){
  //   return <NotFound text="text-no-category" className="h-96" />
  // } 


  // eslint-disable-next-line react-hooks/rules-of-hooks
    const { pathname, query } = router;
  
    const id = query?.id;
    const categoryShow = query?.category;

  

  // if (!categories.length) {
  // const { products, loadMore, isLoadingMore, isLoading, hasMore, error } =
  // // useProducts({
  // // eslint-disable-next-line react-hooks/rules-of-hooks
  // useProductsCategory({
  //     // ...variables,
  //     // ...(query.category && { categories: query.category }),
  //     // ...(query.text && { name: query.text }),
  //     id:id,
  //     limit: TYPES_PER_PAGE
  //   });

  //   if (error) return <ErrorMessage message={error.message} />;
  //   if (!isLoading && !products.length && id) {
  //     return (
  //       <div className="min-h-full px-4 pt-6 pb-8 bg-gray-100 lg:p-8">
  //         <NotFound text="text-no-shops" />
  //       </div>
  //     );
  //   }
  // }


  
    const onCategoryClick = (slug: string,name:string) => {
      // setCategoryShow(name);
      router.push(Routes.products_category(slug,name));
      
    };


  return (
    <div className="min-h-screen bg-light ">
      <div className="flex flex-col w-full max-w-6xl p-8 mx-auto pt-14">
        <h3 className="mb-8 text-2xl font-bold text-heading">
            <Link
              href={Routes.categories}
              className="ltr:ml-auto rtl:mr-auto inline-flex items-center justify-center text-accent font-semibold transition-colors hover:text-accent-hover focus:text-accent-hover focus:outline-none"
            >
             {t('text-all-categories')}
            </Link>
            {categoryShow != undefined ? ' > ' + categoryShow : ''}
          <div className="flex">

          <Link
                href={Routes.home}
                // className="ltr:ml-auto rtl:mr-auto inline-flex items-center justify-center text-accent font-semibold transition-colors hover:text-accent-hover focus:text-accent-hover focus:outline-none"
                className="ltr:ml-auto rtl:mr-auto  inline-flex items-center text-base font-normal text-accent underline hover:text-accent-hover hover:no-underline sm:order-2"
              >
                Back to Home
                {/* {t('text-back-to-home')} */}
              </Link>
            </div>
        </h3>
        
        {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"> */}
        <CartCounterButton />
      { id ? 
        //   <Grid
        //   products={products}
        //   loadMore={loadMore}
        //   isLoading={isLoading}
        //   isLoadingMore={isLoadingMore}
        //   hasMore={hasMore}
        //   error={error}
        //   limit={PRODUCTS_PER_PAGE}
                
        // />
        <ShowProductByCategory id={id}/>
      : 
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-6">
      {Array.isArray(categories) &&
      categories?.map((item: any, idx: number) => (
          <CategoryCard
            key={idx}
            item={item}
            onClick={() => onCategoryClick(item?._id!,item?.name)}
          />
        ))}
        </div>
        }
        
          {/* {isLoading && !shops.length ? (
            <>
              {rangeMap(limit, (i) => (
                <CouponLoader key={i} uniqueKey={`shops-${i}`} />
              ))}
            </>
          ) : (
            shops.map((shop) => <ShopCard shop={shop} key={shop.id} />)
          )} */}
        {/* </div> */}
        {/* {hasMore && (
          <div className="flex items-center justify-center mt-8 lg:mt-12">
            <Button onClick={loadMore} loading={isLoadingMore}>
              {t('text-load-more')}
            </Button>
          </div>
        )} */}
      </div>
    </div>
  );
};
ShopsPage.getLayout = getLayout;

export default ShopsPage;
