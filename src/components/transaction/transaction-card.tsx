import usePrice from '@/lib/use-price';
import dayjs from 'dayjs';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/lib/locals';
import { Table } from '@/components/ui/table';
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'

type OrderCardProps = {
  order: any;
};

const TransactionCard: React.FC<OrderCardProps> = ({  order }) => {


  const { t } = useTranslation('common');
  const { alignLeft, alignRight } = useIsRTL();
  // const { openModal } = useModalAction();
  const orderTableColumns = [
    {
      title: 'Order Id',
      dataIndex: 'unique_order_id',
      key: 'unique_order_id',
      align: alignLeft,
      width: 120,
      render: function Render(_: any, record: any) {
        return record.unique_order_id;
      },
    },
    {
      title: 'Charge Id',
      dataIndex: 'charge_id',
      key: 'charge_id',
      align: alignLeft,
      width: 120,
      render: function Render(_: any, record: any) {
       
        if(record.payment_gateway == "STRIPE"){
          return record.charge_id != undefined ? record.charge_id : record.payment_intent_id;
        } else {
          return record.razorpay_id;
        }
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: alignLeft,
      width: 100,
      render: function RenderAmount(amount: any) {
        const { price } = usePrice({
          amount: Number(amount) ?? 0,
        });
        return <p>{price}</p>;
      },
    },
    {
      title: 'Type',
      dataIndex: 'pay_type',
      key: 'pay_type',
      align: alignLeft,
      width: 120,
    },
    {
      title: 'Payment Gateway',
      dataIndex: 'payment_gateway',
      key: 'payment_gateway',
      align: alignLeft,
      width: 120,
    },
    {
      title: 'Card',
      dataIndex: 'last4',
      key: 'last4',
      align: alignLeft,
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: alignLeft,
      width: 100,
      render: function RenderStatus(status: any) {
      
        return <p>{status.toUpperCase()}</p>;
      },
    },
    {
      title: 'Order Date',
      dataIndex: 'created_at',
      key: 'created_at',
      align: alignLeft,
      width: 100,
      render: function RenderCreatedAt(created_at: any) {
        let currentTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        dayjs.extend(utc)
        dayjs.extend(tz)
        let date = dayjs(created_at).tz(currentTz).format('DD/MM/YYYY hh:mm A')

        return <p>{date}</p>;
        // return <p>{created_at}</p>;
        // return <p>{dayjs(created_at).format('MMMM D, YYYY')}</p>;
      },
    },
  ];

  
  return (
    <Table
      //@ts-ignore
      columns={orderTableColumns}
      data={order}
      rowKey={(record: any) =>
        record._id
          ? record._id
          : record.product_id
      }
      className="orderDetailsTable w-full"
      rowClassName="!cursor-auto"
      scroll={{ x: 350, y: 500 }}
    />
  );

};

export default TransactionCard;
