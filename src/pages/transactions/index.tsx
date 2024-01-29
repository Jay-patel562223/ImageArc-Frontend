import TransactionList from '@/components/transaction/transaction-list';
import Seo from '@/components/seo/seo';
import ErrorMessage from '@/components/ui/error-message';
import { useOrders } from '@/framework/order';
import { useTransactions } from '@/framework/transaction';
import Spinner from '@/components/ui/loaders/spinner/spinner';
import isEmpty from 'lodash/isEmpty';
import OrderDetails from '@/components/subscription/subscription-details';
import TransactionListMobile from '@/components/transaction/transaction-list-mobile';
import NotFound from '@/components/ui/not-found';
import { getLayout as getSiteLayout } from '@/components/layouts/layout';
import DashboardSidebar from '@/components/dashboard/sidebar';
export { getStaticProps } from '@/framework/general.ssr';

function NoOrderFound() {
  return (
    <div className="my-auto flex h-[80vh] w-full items-center justify-center rounded bg-light p-5 md:p-8">
      <NotFound text="text-no-transaction-found" />
    </div>
  );
}

export default function OrdersPage() {
  const { orders, isLoading, error, hasMore, loadMore, isLoadingMore } =
  useTransactions({
    limit: 5,
  });
  // transactions

  const ordersItem:any = orders;

  if (error) return <ErrorMessage message={error.message} />;
  // if (isLoading && !isEmpty(orders)) {
  if (isLoading && isEmpty(ordersItem)) {
    return (
      <div className="my-auto flex h-[80vh] w-full items-center justify-center rounded bg-light p-5 md:p-8">
        <Spinner simple className="h-10 w-10" />
      </div>
    );
  }

  // if (!isLoading && isEmpty(orders)) {
  if (!isLoading && isEmpty(ordersItem)) {
    return <NoOrderFound />;
  }


  return (
    <>
      <Seo noindex={true} nofollow={true} />
      <div className="hidden w-full overflow-hidden lg:flex">
        <TransactionList
          orders={ordersItem}
          isLoadingMore={isLoadingMore}
          loadMore={loadMore}
          hasMore={hasMore}
        />
        
      </div>
      <TransactionListMobile
        isLoadingMore={isLoadingMore}
        onLoadMore={loadMore}
        hasNextPage={hasMore}
        orders={ordersItem}
      />
    </>
  );
}

const getLayout = (page: React.ReactElement) =>
  getSiteLayout(
    <div className="mx-auto flex w-full max-w-1920 flex-col items-start bg-light py-10 px-5 lg:bg-gray-100 xl:flex-row xl:py-14 xl:px-8 2xl:px-14">
      <DashboardSidebar className="hidden shrink-0 ltr:mr-8 rtl:ml-8 xl:block xl:w-80" />
      {page}
    </div>
  );

OrdersPage.authenticationRequired = true;

OrdersPage.getLayout = getLayout;
