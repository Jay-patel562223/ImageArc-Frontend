import Button from '@/components/ui/button';
import Scrollbar from '@/components/ui/scrollbar';
import { useTranslation } from 'next-i18next';
import OrderCard from './subscription-card';
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';
import type { Order } from '@/types';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';

const selectedOrderAtom = atom<Order | null>(null);
export function useSelectedOrder() {
  return useAtom(selectedOrderAtom);
}

export default function OrderList({
  orders,
  hasMore,
  isLoadingMore,
  loadMore,
}: {
  orders: Order[];
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
}) {
  const { t } = useTranslation('common');
  const [selectedOrder, setSelectedOrder] = useSelectedOrder();
  useEffect(() => {
    if (!selectedOrder && orders.length) {
      setSelectedOrder(orders[0]);
    }
  }, [orders, selectedOrder, setSelectedOrder]);

  return (
    <div className="h-[80vh] min-h-[670px] w-full ltr:pr-5 rtl:pl-5 md:w-1/3 md:shrink-0 ltr:lg:pr-8 rtl:lg:pl-8">
    
      <div className="flex h-full flex-col bg-white pb-5 md:border md:border-border-200">
      <div className="flex ltr:mr-4 ltr:mt-4">

        <Link
              href={Routes.home}
              // className="ltr:ml-auto rtl:mr-auto inline-flex items-center justify-center text-accent font-semibold transition-colors hover:text-accent-hover focus:text-accent-hover focus:outline-none"
              className="ltr:ml-auto rtl:mr-auto  inline-flex items-center text-base font-normal text-accent underline hover:text-accent-hover hover:no-underline sm:order-2"
            >
              {t('text-back-to-home')}
            </Link>
    </div>
        <h3 className="py-5 px-5 text-xl font-semibold text-heading">
          {t('profile-sidebar-subscription')}
        </h3>
        
        <Scrollbar className="w-full" style={{ height: 'calc(100% - 80px)' }}>
          <div className="px-5">
            {orders.map((order: any, index: number) => (
              <OrderCard
                key={index}
                order={order}
                onClick={() => setSelectedOrder(order)}
                isActive={order?._id === selectedOrder?._id}
              />
            ))}
            {hasMore && (
              <div className="mt-8 flex justify-center lg:mt-12">
                <Button
                  loading={isLoadingMore}
                  onClick={loadMore}
                  className="h-11 text-sm font-semibold md:text-base"
                >
                  {t('text-load-more')}
                </Button>
              </div>
            )}
          </div>
        </Scrollbar>
      </div>
    </div>
  );
}
