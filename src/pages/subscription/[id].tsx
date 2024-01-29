import { getLayout } from '@/components/layouts/layout';
import SubscriptionView from '@/components/subscription/subscription-view';
import Seo from '@/components/seo/seo';
export { getServerSideProps } from '@/framework/order.ssr';
export default function OrderPage() {
  return (
    <>
      <Seo noindex={true} nofollow={true} />
      <SubscriptionView />
    </>
  );
}

OrderPage.getLayout = getLayout;

// wallet_point only parent order - no children
