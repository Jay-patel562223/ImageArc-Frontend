import type { NextPageWithLayout } from '@/types';
import { getLayout } from '@/components/layouts/layout';
import { useTranslation } from 'next-i18next';
export { getStaticProps } from '@/framework/shops-page.ssr';
import { useProduct } from '@/framework/product';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import ShowInDetails from '../../components/products/ShowInDetails'
import NotFound from '@/components/ui/not-found';
import SubscriptionPlan from './subscriptionPlan'
import Spinner from '@/components/ui/loaders/spinner/spinner';


const ShopsPage: NextPageWithLayout = () => {
  const { t } = useTranslation('common');

  const router = useRouter();
  const slug = router.query.id;
  

  // @ts-ignore
    const { product, isLoading } = useProduct({ slug: slug ?? '' });

    if (isLoading || !product)
      return (
        <div className="relative flex items-center justify-center w-96 h-96 bg-light" style={{width: 'auto'}}>
          <Spinner text={t('common:text-loading')} />
        </div>
    );

  // @ts-ignore
    if(!product?.data){
      return (
        <div className="min-h-full px-4 pt-6 pb-8 bg-gray-100 lg:p-8">
          <NotFound text="text-no-shops" />
        </div>
      )
    }

  const CartCounterButton = dynamic(
    () => import('@/components/cart/cart-counter-button'),
    { ssr: false }
  );

  

  
    if(slug == undefined){
        return (
            <div className="min-h-full px-4 pt-6 pb-8 bg-gray-100 lg:p-8">
              <NotFound text="text-no-shops" />
            </div>
          );
    } 
      

    
  return (
    <div>
    
     <ShowInDetails product={product} isLoading={isLoading}/>
     <CartCounterButton />
    
      <SubscriptionPlan/>
    
    </div>
  )

};
ShopsPage.getLayout = getLayout;

export default ShopsPage;
