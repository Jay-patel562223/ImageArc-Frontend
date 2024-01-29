//@ts-nocheck
import usePrice from '@/lib/use-price';
import { formatAddress } from '@/lib/format-address';
import OrderStatuses from '@/components/orders/statuses';
import { useTranslation } from 'next-i18next';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';
import { Eye } from '@/components/icons/eye-icon';
// import { OrderItems } from './order-items';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { SadFaceIcon } from '@/components/icons/sad-face';
import Badge from '@/components/ui/badge';
import type { Order } from '@/types';


interface Props {
  order: Order;
}
const RenderStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const { t } = useTranslation('common');

  switch (status.toLowerCase()) {
    case 'approved':
      return (
        <Badge
          text={`${t('text-refund')} ${t('text-approved')}`}
          color="bg-accent"
          className="ltr:mr-4 rtl:ml-4"
        />
      );

    case 'rejected':
      return (
        <Badge
          text={`${t('text-refund')} ${t('text-rejected')}`}
          color="bg-red-500"
          className="ltr:mr-4 rtl:ml-4"
        />
      );
    case 'processing':
      return (
        <Badge
          text={`${t('text-refund')} ${t('text-processing')}`}
          color="bg-yellow-500"
          className="ltr:mr-4 rtl:ml-4"
        />
      );
    // case 'pending':
    default:
      return (
        <Badge
          text={`${t('text-refund')} ${t('text-pending')}`}
          color="bg-purple-500"
          className="ltr:mr-4 rtl:ml-4"
        />
      );
  }
};
function RefundView({
  status,
  orderId,
}: {
  status: string;
  orderId: string | number;
}) {
  const { t } = useTranslation('common');
  const { openModal } = useModalAction();

  return (
    <>
      {status ? (
        <RenderStatusBadge status={status} />
      ) : (
        <button
          className="flex items-center text-sm font-semibold text-body transition-colors hover:text-accent disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:text-gray-400 ltr:mr-4 rtl:ml-4"
          onClick={() => openModal('REFUND_REQUEST', orderId)}
          disabled={Boolean(status)}
        >
          <SadFaceIcon width={18} className="ltr:mr-2 rtl:ml-2" />
          {t('text-ask-refund')}
        </button>
      )}
    </>
  );
}

const OrderDetails = ({ order }: Props) => {
  const { t } = useTranslation('common');
  const {
    id,
    products,
    status,
    shipping_address,
    billing_address,
    _id,
    unique_id,
    refund,
  } : any = order ?? {};

  const { price: amount } = usePrice({
    amount: Number(order?.price),
  });
  const { price: discount } = usePrice({
    amount: 0,
  });
  const { price: total } = usePrice({
    amount: Number(order?.price),
  });
  const { price: delivery_fee } = usePrice({
    amount: 0,
  });
  const { price: sales_tax } = usePrice({
    amount: 0,
  });


  return (
    <div className="flex w-full flex-col border border-border-200 bg-white lg:w-2/3">
      <div className="flex flex-col items-center border-b border-border-200 p-5 md:flex-row md:justify-between">
        <h2 className="mb-2 flex text-sm font-semibold text-heading md:text-lg">
          {t('text-order-details')} <span className="px-2">-</span>{' '}
          {unique_id}
        </h2>
        <div className="flex items-center">
          {/* <RefundView status={order?.status} orderId={id} /> */}

          <Link
            href={Routes.subscription_view(_id)}
            className="flex items-center text-sm font-semibold text-accent no-underline transition duration-200 hover:text-accent-hover focus:text-accent-hover"
          >
            <Eye width={20} className="ltr:mr-2 rtl:ml-2" />
            {t('text-sub-orders')}
          </Link>
        </div>
      </div>

      <div className="flex flex-col border-b border-border-200 sm:flex-row">
          <div className="flex w-full flex-col px-5 py-4 md:w-5/5">
              <div className="mb-3 flex justify-between">
                <span className="text-sm text-body">Package</span>
                <span className="text-sm text-heading">{order?.package_id?.package_type?.name.toUpperCase() ?? ''}</span>
              </div>
              <div className="mb-3 flex justify-between">
                <span className="text-sm text-body">File Type</span>
                <span className="text-sm text-heading">{order?.file_type?.name != undefined ? order?.file_type?.name.toUpperCase() : '-'}</span>
              </div>
              <div className="mb-3 flex justify-between">
                <span className="text-sm text-body">Quantity</span>
                <span className="text-sm text-heading">{order?.qnty}</span>
              </div>
              <div className="mb-3 flex justify-between">
                <span className="text-sm text-body">Available Quantity</span>
                <span className="text-sm text-heading">{order?.available_qnty}</span>
              </div>
              <div className="mb-3 flex justify-between">
                <span className="text-sm text-body">Used Quantity</span>
                <span className="text-sm text-heading">{order?.used_qnty}</span>
              </div>
              <div className="mb-3 flex justify-between">
                <span className="text-sm text-body">Status</span>
                <span className="text-sm text-heading">{order?.status == 'active' ? 'ACTIVE' : 'INSUFFICIENT QUANTITY'}</span>
              </div>
          </div>
        </div>

      {/* <div className="flex flex-col border-b border-border-200 sm:flex-row">
        

        <div className="flex w-full flex-col px-5 py-4 md:w-2/5">
          <div className="mb-3 flex justify-between">
            <span className="text-sm text-body">{t('text-sub-total')}</span>
            <span className="text-sm text-heading">{amount}</span>
          </div>

        
          <div className="mb-3 flex justify-between">
            <span className="text-sm text-body">{t('text-tax')}</span>
            <span className="text-sm text-heading">{sales_tax}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm font-bold text-heading">
              {t('text-total')}
            </span>
            <span className="text-sm font-bold text-heading">{total}</span>
          </div>
        </div>
      </div> */}

      {/* Order Table */}
      <div>
        {/* <div className="flex w-full items-center justify-center px-6">
          <OrderStatuses status={status?.serial} language={order?.language} />
        </div> */}
        {/* <OrderItems products={products} orderId={id} order={order}/> */}
      </div>
    </div>
  );
};

export default OrderDetails;
