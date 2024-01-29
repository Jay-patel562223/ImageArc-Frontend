import cn from 'classnames';
import NotFound from '@/components/ui/not-found';
import CategoriesLoader from '@/components/ui/loaders/categories-loader';
import CategoryCard from '@/components/ui/category-card';
import { useRouter } from 'next/router';
import CategoryBreadcrumb from '@/components/ui/category-breadcrumb-card';
import Scrollbar from '@/components/ui/scrollbar';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'next-i18next';
import findNestedData from '@/lib/find-nested-data';
import type { Category } from '@/types';
import ProductGridHome from '@/components/products/grids/home';
import { useCategories } from '@/framework/category';
import { useProductsCategory,useProducts } from '@/framework/product';
import { Routes } from '@/config/routes';
import { Grid } from '@/components/products/grid';
import { PRODUCTS_PER_PAGE } from '@/framework/client/variables';
import dynamic from 'next/dynamic';

// interface CategoriesProps {
//   notFound: boolean;
//   loading: boolean;
//   categories: Category[];
//   className?: string;
//   variables: any;
// }
const Categories = () => {
  const { t } = useTranslation('common');

  const { categories } = useCategories({
    // ...(type ? { type } : { type: query.searchType }),
    limit: 10000000
  });


  const router = useRouter();
  const { pathname, query } = router;

  const id = query?.id;



  const { products, loadMore, isLoadingMore, isLoading, hasMore, error } =
  useProducts({
  // useProductsCategory({
      // ...variables,
      // ...(query.category && { categories: query.category }),
      // ...(query.text && { name: query.text }),
      limit: 1
    });

  // if(id){
    // const {
    //   products,
    //   isLoading,
    //   paginatorInfo,
    //   error,
    //   loadMore,
    //   isLoadingMore,
    //   hasMore,
    // } = useProductsCategory({
    //   slug: id,
    //   // limit: PRODUCTS_PER_PAGE,
    //   orderBy: 'created_at',
    //   sortedBy: 'DESC',
    //   // ...(query?.category && { categories: query?.category }),
    //   // ...(searchType && { type: searchType }),
    //   // ...restQuery,
    //   limit: 1
    // });
  
  // }

  const renderCategories = categories;

  // const onCategoryClick = (slug: string) => {
    
  //   router.push(Routes.products_category(slug));
    
  // };

  // if (loading) {
  //   return (
  //     <div className="hidden xl:block">
  //       <div className="mt-8 w-72 px-2">
  //         <CategoriesLoader />
  //       </div>
  //     </div>
  //   );
  // }
  if (!products) {
    return (
      <div className="bg-light">
        <div className="min-h-full p-5 md:p-8 lg:p-12 2xl:p-16">
          <NotFound text="text-no-category" className="h-96" />
        </div>
      </div>
    );
  }

  const CartCounterButton = dynamic(
    () => import('@/components/cart/cart-counter-button'),
    { ssr: false }
  );

  return (
    <div className="bg-light">
      <div className="px-3 pt-3 md:px-6 md:pt-6 lg:px-10 lg:pt-10 2xl:px-14 2xl:pt-14">
        {query?.category ? (
          <Scrollbar className="w-full">
            <div
              className={cn('px-2 pt-2 pb-7', {
                'mb-8 divide-dashed border-b border-dashed border-gray-200':
                  query?.category,
              })}
            >
              {/* <CategoryBreadcrumb
                categories={[ selectedCategory]}
              /> */}
            </div>
          </Scrollbar>
        ) : (
          <h3 className="mb-8 px-2 pt-2 text-2xl font-semibold text-heading">
            {/* {t('text-all-categories')} */}
            All Categories
          </h3>
        )}
      </div>

      <div className="p-5 !pt-0 md:p-8 lg:p-12 2xl:p-16">
        
        {/* {isEmpty(renderCategories) && <Products layout="minimal" />} */}
        {/* {isEmpty(renderCategories) && (
          <ProductGridHome
            gridClassName="!grid-cols-[repeat(auto-fill,minmax(290px,1fr))]"
            variables={products}
          />
        )} */}

    {/* {id ?  */}
    {/* {!['compact', 'minimal'].includes(layout) && width > 1023 && ( */}
        <CartCounterButton />
      {/* )} */}
     <Grid
      products={products}
      loadMore={loadMore}
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
      error={error}
      limit={PRODUCTS_PER_PAGE}
      // className="py-6"
      // gridClassName="!grid-cols-[repeat(auto-fill,minmax(290px,1fr))]"
      // column="five"
            
    />
     {/* : 
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-6">
    {Array.isArray(renderCategories) &&
      renderCategories?.map((item: any, idx: number) => (
        <CategoryCard
          key={idx}
          item={item}
          onClick={() => onCategoryClick(item?._id!)}
        />
      ))}
  </div>} */}
   

      </div>
    </div>
  );
};

export default Categories;
