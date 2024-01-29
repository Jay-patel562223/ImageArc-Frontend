import type { Order } from '@/types';
import Button from '@/components/ui/button';
import { useTranslation } from 'next-i18next';
import Collapse from 'rc-collapse';
import 'rc-collapse/assets/index.css';
// import { useSelectedOrder } from './order-list';
import OrderDetails from './subscription-details';
import OrderCard from './subscription-card';
import { atom, useAtom } from 'jotai';

interface SubscriptionWithLoaderProps {
  hasNextPage: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  orders: Order[];
}

const selectedOrderAtom = atom<Order | null>(null);
export function useSelectedOrder() {
  return useAtom(selectedOrderAtom);
}

const SubscriptionListMobile: React.FC<SubscriptionWithLoaderProps> = ({
  hasNextPage,
  isLoadingMore,
  onLoadMore,
  orders,
}) => {
  const { t } = useTranslation('common');
  const [selectedOrder, setSelectedOrder] = useSelectedOrder();

  return (
    <div className="flex w-full flex-col lg:hidden">
      <div className="flex h-full w-full flex-col px-0 pb-5">
        <h3 className="pb-5 text-xl font-semibold text-heading">
          {t('profile-sidebar-subscription')}
        </h3>
        <Collapse
          accordion={true}
          defaultActiveKey="active"
          expandIcon={() => null}
        >
          {orders.map((order, index: number) => (
            <Collapse.Panel
              header={
                <OrderCard
                  key={`mobile_${index}`}
                  order={order}
                  onClick={() => setSelectedOrder(order)}
                  isActive={order?.id === selectedOrder?.id}
                />
              }
              headerClass="accordion-title"
              key={index}
              className="mb-4"
            >
              {selectedOrder && (
                <OrderDetails
                  order={orders.find(({ id }) => id === selectedOrder.id)!}
                />
              )}
            </Collapse.Panel>
          ))}

          {hasNextPage && (
            <div className="mt-8 flex justify-center">
              <Button
                loading={isLoadingMore}
                onClick={onLoadMore}
                className="h-11 text-sm font-semibold md:text-base"
              >
                {t('text-load-more')}
              </Button>
            </div>
          )}
        </Collapse>
      </div>
    </div>
  );
};

export default SubscriptionListMobile;
