import Card from '@/components/ui/cards/card';
import Seo from '@/components/seo/seo';
import WishlistProducts from '@/components/products/wishlist-products';
import { useWindowSize } from '@/lib/use-window-size';
import dynamic from 'next/dynamic';
import DashboardLayout from '@/layouts/_dashboard';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';

export { getStaticProps } from '@/framework/general.ssr';
const CartCounterButton = dynamic(
  () => import('@/components/cart/cart-counter-button'),
  { ssr: false }
);
const MyWishlistPage = () => {
  const { width } = useWindowSize();
  return (
    <>
      <Seo noindex={true} nofollow={true} />
      <Card className="w-full shadow-none sm:shadow">
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
        <WishlistProducts />
      </Card>
      {width > 1023 && <CartCounterButton />}
    </>
  );
};

MyWishlistPage.authenticationRequired = true;

MyWishlistPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default MyWishlistPage;
function t(arg0: string): import("react").ReactNode {
  throw new Error('Function not implemented.');
}

