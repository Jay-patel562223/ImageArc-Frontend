import { useEffect } from 'react';
import dayjs from 'dayjs';
import Link from '@/components/ui/link';
import usePrice from '@/lib/use-price';
import { formatAddress } from '@/lib/format-address';
import { formatString } from '@/lib/format-string';
import { Routes } from '@/config/routes';
import { useTranslation } from 'next-i18next';
import { useCart } from '@/store/quick-cart/cart.context';
import { CheckMark } from '@/components/icons/checkmark';
import Badge from '@/components/ui/badge';
import { OrderItems } from '@/components/orders/order-items';
import { useAtom } from 'jotai';
import { clearCheckoutAtom } from '@/store/checkout';
import SuborderItems from '@/components/orders/suborder-items';
import Spinner from '@/components/ui/loaders/spinner/spinner';
import isEmpty from 'lodash/isEmpty';
import OrderStatuses from '@/components/orders/statuses';
import { useDownloadInvoiceMutation,useOrder } from '@/framework/order';
import { useRouter } from 'next/router';
import Button from '@/components/ui/button';
import { useIsRTL } from '@/lib/locals';
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'

function OrderView({ order, language }: any) {
  const { t } = useTranslation('common');
  const { resetCart,removeItemFromCart } = useCart();
  const [, resetCheckout] = useAtom(clearCheckoutAtom);


  // if(order.length != 0){
  //   order.products.map((res)=>{
  //     setTimeout(()=>{
  //       removeItemFromCart(res?.product_id);
  //     },1000)
  //   })
  // }

  // useEffect(() => {
  //   // resetCart();
  //   resetCheckout();
  // }, [ resetCheckout]);
// }, [resetCart, resetCheckout]);

  const { price: total } = usePrice({ amount: Number(order?.total!) });
  // const { price: total } = usePrice({ amount: Number(order?.paid_total!) });

  

  const { price: wallet_total } = usePrice({
    amount: Number(order?.wallet_point?.amount!),
  });
  const { price: sub_total } = usePrice({ amount: Number(order?.amount!) });
  const { price: shipping_charge } = usePrice({
    amount: Number(order?.delivery_fee) ?? 0,
  });
  const { price: tax } = usePrice({ amount: Number(order?.sales_tax)  });
  const { price: discount } = usePrice({ amount: Number(order?.discount)  });
  const { alignLeft, alignRight, isRTL } = useIsRTL();

  const { query, locale } = useRouter();

  const { refetch } = useDownloadInvoiceMutation(
    {
      order_id: order?._id as string,
      isRTL,
      language: locale!,
    },
    { enabled: false }
  );


  async function handleDownloadInvoice() {
    const { data } = await refetch();
    if (data) {
      // const a = document.createElement('a');
      // a.href = data;
      // // a.download = "test.pdf";
      // a.setAttribute('download', 'order-invoice.pdf');
      // a.click();
      var blob = new Blob([data], {type: "application/pdf"});
      var objectUrl = URL.createObjectURL(blob);
      window.open(objectUrl);
    }
  }

  let currentTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  dayjs.extend(utc)
  dayjs.extend(tz)
  let date = dayjs(order?.created_at_new).tz(currentTz).format('DD/MM/YYYY hh:mm A')
  

  // const value = moment(date).format('MM/DD/YYYY h:mm a');

  return (
    <div className="p-4 sm:p-8">
       
      <div className="mx-auto w-full max-w-screen-lg rounded border bg-light p-6 shadow-sm sm:p-8 lg:p-12">
        {/* <h2 className="mb-9 flex flex-col items-center justify-between text-base font-bold text-heading sm:mb-12 sm:flex-row">
          <span className="order-2 mt-5 ltr:mr-auto rtl:ml-auto sm:order-1 sm:mt-0">
           */}
            {/* <span className="ltr:mr-4 rtl:ml-4">{t('text-status')} :</span>
            {/* <Badge
              text={order?.status}
              className="whitespace-nowrap text-sm font-normal"
            /> */}
             
          {/* </span>
          
          
        </h2> */}
        <Link
            href={Routes.home}
            className="order-1 inline-flex items-center text-base font-normal text-accent underline hover:text-accent-hover hover:no-underline sm:order-2"
          >
            {t('text-back-to-home')}
          </Link>
          <Button
          onClick={handleDownloadInvoice}
          className="mb-5  bg-blue-500 ltr:ml-auto rtl:mr-auto"
          style={{background:"rgb(47 182 204 / var(--tw-bg-opacity))",display: 'flex'}}
        >
          {t('common:text-download')} Invoice
        </Button>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 md:mb-12 lg:grid-cols-4">
          <div className="rounded border border-border-200 py-4 px-5 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold text-heading">
              {t('text-order-number')}
            </h3>
            <p className="text-sm text-body-dark">{order?.unique_id}</p>
          </div>
          <div className="rounded border border-border-200 py-4 px-5 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold text-heading">
              {t('text-date')}
            </h3>
            <p className="text-sm text-body-dark">
              {date}
              {/* {order?.created_at} */}
              {/* {dayjs(order?.created_at).tz('Europe/Paris')} */}
              {/* {dayjs(order?.created_at).format('MMMM D, YYYY')} */}
            </p>
          </div>
          <div className="rounded border border-border-200 py-4 px-5 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold text-heading">
              {t('text-total')}
            </h3>
            <p className="text-sm text-body-dark">{total}</p>
          </div>
          <div className="rounded border border-border-200 py-4 px-5 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold text-heading">
              {t('text-payment-method')}
            </h3>
            <p className="text-sm text-body-dark">
              {order?.payment_gateway ?? 'N/A'}
              
            </p>
          </div>
        </div>
        {/* end of order received  */}

        {/* start of order Status */}
        {/* <div className="mb-8 flex w-full items-center justify-center md:mb-12">
          <OrderStatuses status={order?.status?.serial} language={language} />
        </div> */}
        {/* end of order Status */}

        <div className="flex flex-col lg:flex-row">
          <div className="mb-12 w-full lg:mb-0 lg:w-1/2 ltr:lg:pr-3 rtl:lg:pl-3">
            <h2 className="mb-6 text-xl font-bold text-heading">
              {t('text-total-amount')}
            </h2>
            <div>
              <p className="mt-5 flex text-body-dark">
                <strong className="w-5/12 text-sm font-semibold text-heading sm:w-4/12">
                  {t('text-sub-total')}
                </strong>
                :
                <span className="w-7/12 text-sm ltr:pl-4 rtl:pr-4 sm:w-8/12 ">
                  {sub_total}
                </span>
              </p>
              {/* <p className="mt-5 flex text-body-dark">
                <strong className="w-5/12 text-sm font-semibold text-heading sm:w-4/12">
                  {t('text-shipping-charge')}
                </strong>
                :
                <span className="w-7/12 text-sm ltr:pl-4 rtl:pr-4 sm:w-8/12 ">
                  {shipping_charge}
                </span>
              </p> */}
              <p className="mt-5 flex text-body-dark">
                <strong className="w-5/12 text-sm font-semibold text-heading sm:w-4/12">
                  {t('text-tax')}
                </strong>
                :
                <span className="w-7/12 text-sm ltr:pl-4 rtl:pr-4 sm:w-8/12 ">
                  {tax}
                </span>
              </p>
              <p className="mt-5 flex text-body-dark">
                <strong className="w-5/12 text-sm font-semibold text-heading sm:w-4/12">
                  {t('text-discount')}
                </strong>
                :
                <span className="w-7/12 text-sm ltr:pl-4 rtl:pr-4 sm:w-8/12 ">
                  {discount}
                </span>
              </p>
              <p className="mt-5 flex text-body-dark">
                <strong className="w-5/12 text-sm font-semibold text-heading sm:w-4/12">
                  {t('text-total')}
                </strong>
                :
                <span className="w-7/12 text-sm ltr:pl-4 rtl:pr-4 sm:w-8/12">
                  {total}
                </span>
              </p>
              {/* {wallet_total && (
                <p className="mt-5 flex text-body-dark">
                  <strong className="w-5/12 text-sm font-semibold text-heading sm:w-4/12">
                    {t('text-paid-from-wallet')}
                  </strong>
                  :
                  <span className="w-7/12 text-sm ltr:pl-4 rtl:pr-4 sm:w-8/12">
                    {wallet_total}
                  </span>
                </p>
              )} */}
            </div>
          </div>
          {/* end of total amount */}

          <div className="w-full lg:w-1/2 ltr:lg:pl-3 rtl:lg:pr-3">
            <h2 className="mb-6 text-xl font-bold text-heading">
              {t('text-order-details')}
            </h2>
            <div>
              <p className="mt-5 flex text-body-dark">
                <strong className="w-4/12 text-sm font-semibold text-heading">
                  {t('text-total-item')}
                </strong>
                :
                <span className="w-8/12 text-sm ltr:pl-4 rtl:pr-4 ">
                  {formatString(order?.products?.length, t('text-item'))}
                </span>
              </p>
              {!isEmpty(order?.delivery_time) && (
                <p className="mt-5 flex text-body-dark">
                  <strong className="w-4/12 text-sm font-semibold text-heading">
                    {t('text-deliver-time')}
                  </strong>
                  :
                  <span className="w-8/12 text-sm ltr:pl-4 rtl:pr-4 ">
                    {order?.delivery_time}
                  </span>
                </p>
              )}
              {!isEmpty(order?.shipping_address) && (
                <p className="mt-5 flex text-body-dark">
                  <strong className="w-4/12 text-sm font-semibold text-heading">
                    {t('text-shipping-address')}
                  </strong>
                  :
                  <span className="w-8/12 text-sm ltr:pl-4 rtl:pr-4 ">
                    {formatAddress(order?.shipping_address!)}
                  </span>
                </p>
              )}
              {!isEmpty(order?.billing_address) && (
                <p className="mt-5 flex text-body-dark">
                  <strong className="w-4/12 text-sm font-semibold text-heading">
                    {t('text-billing-address')}
                  </strong>
                  :
                  <span className="w-8/12 text-sm ltr:pl-4 rtl:pr-4">
                    {formatAddress(order?.billing_address!)}
                  </span>
                </p>
              )}
            </div>
          </div>
          {/* end of order details */}
        </div>
        <div className="mt-12">
          {order?.products.length > 0 ? 
            <OrderItems products={order?.products} orderId={order?._id} order={order}/>
           : ""
          }
        </div>
        {order?.children?.length > 1 ? (
          <div>
            <h2 className="mt-12 mb-6 text-xl font-bold text-heading">
              {t('text-sub-orders')}
            </h2>
            <div>
              <div className="mb-12 flex items-start rounded border border-gray-700 p-4">
                <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-sm bg-dark px-2 ltr:mr-3 rtl:ml-3">
                  <CheckMark className="h-2 w-2 shrink-0 text-light" />
                </span>
                <p className="text-sm text-heading">
                  <span className="font-bold">{t('text-note')}:</span>{' '}
                  {t('message-sub-order')}
                </p>
              </div>
              {Array.isArray(order?.children) && order?.children.length && (
                <div className="">
                  <SuborderItems items={order?.children} />
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

    </div>
  );
}

export default function Order() {
  const { query } = useRouter();
  const { order, isLoading } = useOrder({
    tracking_number: query.tracking_number!.toString(),
  });

  //@ts-ignore
  let orderData = order?.data;

  if (isLoading) {
    return <Spinner showText={false} />;
  }
  return <OrderView order={orderData} language={orderData?.language} />;
}