import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import Button from '@/components/ui/button';
import ProductLoader from '@/components/ui/loaders/product-loader';
import NotFound from '@/components/ui/not-found';
import rangeMap from '@/lib/range-map';
import ProductCard from '@/components/products/cards/card';
import ErrorMessage from '@/components/ui/error-message';
import { useProducts } from '@/framework/product';
import { PRODUCTS_PER_PAGE } from '@/framework/client/variables';
import type { Product } from '@/types';
import { Image } from '@/components/ui/image';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface Props {
  limit?: number;
  sortedBy?: string;
  orderBy?: string;
  column?: 'five' | 'auto';
  shopId?: string;
  gridClassName?: string;
  products: Product[] | undefined;
  isLoading?: boolean;
  error?: any;
  loadMore?: any;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  className?: string;
}

export function SimilarProducts({
  className,
  gridClassName,
  products,
  isLoading,
  error,
  loadMore,
  isLoadingMore,
  hasMore,
  limit = PRODUCTS_PER_PAGE,
  column = 'auto',
}: Props) {
  const { t } = useTranslation('common');

  // products = products?.data;


  const router = useRouter();

  const navigate = (path: string) => {
    router.push(path);
    // closeModal();
  };

  if (error) return <ErrorMessage message={error.message} />;

  if (!isLoading && !products?.length) {
    return (
      <div className="min-h-full w-full px-4 pt-6 pb-8 lg:p-8">
        <NotFound text="text-not-found" className="mx-auto w-7/12" />
      </div>
    );
  }



  return (
    // <div className={cn('w-full', className)}>
      <div
        className={
          cn(
          {
            'grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3 ':
              column === 'auto',
          },
          gridClassName
        )}
      >
        {isLoading && !products?.length
          ? rangeMap(limit, (i) => (
              <ProductLoader key={i} uniqueKey={`product-${i}`} />
            ))
          : products?.map((product) => (
              // <ProductCard product={product} key={product?._id}  />
              <div
              onClick={() => navigate(Routes.product(product._id))}
              // onClick={handleProductQuickView}
              key={product?._id} 
              className="relative flex h-48 w-auto items-center justify-center sm:h-64"
              role="button"
              style={{marginBottom: '35px'}}
            >
              <span className="sr-only">{t('text-product-image')}</span>
              <Image
                //@ts-ignore
                src={product.image ?? ''}
                alt={product.name}
                layout="fill"
                objectFit="contain"
                className="product-image"
              />
              {/* {discount && (
                <div className="absolute top-3 rounded-full bg-yellow-500 px-1.5 text-xs font-semibold leading-6 text-light ltr:right-3 rtl:left-3 sm:px-2 md:top-4 md:px-2.5 ltr:md:right-4 rtl:md:left-4">
                  {discount}
                </div>
              )} */}
            </div>
            ))}
      </div>
     
    // </div>
  );
}
interface ProductsGridProps {
  className?: string;
  gridClassName?: string;
  variables?: any;
  column?: 'five' | 'auto';
}
export default function ProductsGrid({
  className,
  gridClassName,
  variables,
  column = 'auto',
}: ProductsGridProps) {
  const { products, loadMore, isLoadingMore, isLoading, hasMore, error } =
    useProducts(variables);

  const productsItem:any = products;
  return (
    <SimilarProducts
      products={productsItem}
      loadMore={loadMore}
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
      error={error}
      className={className}
      gridClassName={gridClassName}
      column={column}
    />
  );
}
