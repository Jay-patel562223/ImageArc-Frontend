import usePrice from '@/lib/use-price';
import dayjs from 'dayjs';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'

type OrderCardProps = {
  order: any;
  isActive: boolean;
  onClick?: (e: any) => void;
};

const OrderCard: React.FC<OrderCardProps> = ({ onClick, order, isActive }) => {
  const { t } = useTranslation('common');
  const { _id:id, status, created_at,created_at_new, delivery_time,unique_id } = order;
  const { price: amount } = usePrice({
    amount: Number(order?.amount) ?? 0,
  });
  const { price: total } = usePrice({
    amount: Number(order?.total) ?? 0,
  });

  let currentTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // let date = new Date(new Date(order?.created_at_new).toLocaleString('en-IN', { timeZone: currentTz }));
  // console.log('currentTz: ',date,order?.created_at_new);
  dayjs.extend(utc)
  dayjs.extend(tz)
  let date = dayjs(order?.created_at_new).tz(currentTz).format('DD/MM/YYYY hh:mm A')


  return (
    <div
      onClick={onClick}
      role="button"
      className={cn(
        'mb-4 flex w-full shrink-0 cursor-pointer flex-col overflow-hidden rounded border-2 border-transparent bg-gray-100 last:mb-0',
        isActive === true && '!border-accent'
      )}
    >
      <div className="flex items-center justify-between border-b border-border-200 py-3 px-5 md:px-3 lg:px-5 ">
        <span className="flex shrink-0 text-sm font-bold text-heading ltr:mr-4 rtl:ml-4 lg:text-base">
          {t('text-order')}
          <span className="font-normal">#{unique_id}</span>
        </span>
        {/* <span
          className="max-w-full truncate whitespace-nowrap rounded bg-blue-100 px-3 py-2 text-sm text-blue-500"
          title={status}
        >
          {status}
        </span> */}
      </div>

      <div className="flex flex-col p-5 md:p-3 lg:px-4 lg:py-5">
        <p className="mb-4 flex w-full items-center justify-between text-sm text-heading last:mb-0">
          <span className="w-24 shrink-0 overflow-hidden" >
            {t('text-order-date')}
          </span>
          <span className="ltr:mr-auto rtl:ml-auto">:</span>
          <span className="ltr:ml-1 rtl:mr-1">
            {/* {dayjs(created_at).format('MMMM D, YYYY')} */}
            {/* {created_at} */}
            {date}
          </span>
        </p>
        {/* <p className="mb-4 flex w-full items-center justify-between text-sm text-heading last:mb-0">
          <span className="w-24 shrink-0 overflow-hidden">
            {t('text-deliver-time')}
          </span>
          <span className="ltr:mr-auto rtl:ml-auto">:</span>
          <span className="truncate ltr:ml-1 rtl:mr-1">{delivery_time}</span>
        </p> */}
        <p className="mb-4 flex w-full items-center justify-between text-sm  text-heading last:mb-0">
          <span className="w-24 shrink-0 overflow-hidden">
            {t('text-amount')}
          </span>
          <span className="ltr:mr-auto rtl:ml-auto">:</span>
          <span className="ltr:ml-1 rtl:mr-1">{amount}</span>
        </p>
        <p className="mb-4 flex w-full items-center justify-between text-sm  text-heading last:mb-0">
          <span className="w-24 flex-shrink-0 overflow-hidden">
            {t('text-total-price')}
          </span>
          <span className="ltr:mr-auto rtl:ml-auto">:</span>
          <span className="ltr:ml-1 rtl:mr-1">{total}</span>
        </p>
      </div>
    </div>
  );
};

export default OrderCard;
