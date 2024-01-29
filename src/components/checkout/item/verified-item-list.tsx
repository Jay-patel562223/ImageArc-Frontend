import Coupon from '@/components/checkout/coupon';
import usePrice from '@/lib/use-price';
import EmptyCartIcon from '@/components/icons/empty-cart';
import { CloseIcon } from '@/components/icons/close-icon';
import { useTranslation } from 'next-i18next';
import { useCart } from '@/store/quick-cart/cart.context';
import {
  calculatePaidTotal,
  calculateTotal,
} from '@/store/quick-cart/cart.utils';
import { useAtom } from 'jotai';
import {
  couponAtom,
  discountAtom,
  payableAmountAtom,
  verifiedResponseAtom,
  walletAtom,
} from '@/store/checkout';
import ItemCard from '@/components/checkout/item/item-card';
import { ItemInfoRow } from '@/components/checkout/item/item-info-row';
import PaymentGrid from '@/components/checkout/payment/payment-grid';
import { PlaceOrderAction } from '@/components/checkout/place-order-action';
import Wallet from '@/components/checkout/wallet/wallet';
import { useOrderStatuses } from '@/framework/order';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@/framework/user';
import { checkoutAtom } from '@/store/checkout';
import { formatOrderedProduct } from '@/lib/format-ordered-product';

interface Props {
  className?: string;
}
const VerifiedItemList: React.FC<Props> = ({ className }) => {
  const { t } = useTranslation('common');
  const [verifiedResponse] = useAtom(verifiedResponseAtom);
  const [coupon, setCoupon] = useAtom(couponAtom);
  const [discount] = useAtom(discountAtom);
  const [payableAmount] = useAtom(payableAmountAtom);
  const [use_wallet] = useAtom(walletAtom);

  let { items:newitems, total:newTotal, isEmpty: isEmptyCart,getAllItemFromCart } = useCart();
  const [newItems,setNewItems] = useState<any[]>([]);
  // let setNewItems: Item[] = [];
  let latestData = getAllItemFromCart();
  useEffect(()=>{
  latestData.then((res:any)=> {
    return setNewItems([...newitems, ...res]);
  } );
},[newitems])

  let newData = newItems.filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i)
  let items = newData;
  


  const available_items = items?.filter(
    (item) => !verifiedResponse?.unavailable_products?.includes(item.id)
  );

  const { price: tax } = usePrice(
    // verifiedResponse && {
    //   amount: verifiedResponse.total_tax ?? 0,
    // }
     { amount: 0}
  );

  const { price: shipping } = usePrice(
    verifiedResponse && {
      amount: verifiedResponse.shipping_charge ?? 0,
    }
  );

  const base_amount = newTotal;
  // const base_amount = calculateTotal(available_items);

  const { price: sub_total } = usePrice(
    { amount: newTotal}
    // verifiedResponse && {
    //   amount: newTotal,
    // }
  );

  const { price: discountPrice } = usePrice(
    //@ts-ignore
    discount && {
      amount: Number(discount),
    }
  );
  const totalPrice = newTotal;
  // verifiedResponse
    // ? calculatePaidTotal(
    //     {
    //       totalAmount: base_amount,
    //       tax: verifiedResponse?.total_tax,
    //       shipping_charge: verifiedResponse?.shipping_charge,
    //     },
    //     Number(discount)
    //   )
    // : 0;
  const { price: total } = usePrice(
    {amount: newTotal <= 0 ? 0 : newTotal}
    // verifiedResponse && {
    //   amount: totalPrice <= 0 ? 0 : totalPrice,
    // }
  );

 

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // const { createOrder, isLoading } = useCreateOrder();
  const { locale } : any = useRouter();
  // const { items } = useCart();
  const { me } = useUser();

  const { orderStatuses } = useOrderStatuses({
    limit: 1,
    language: locale
  });

  const [
    {
      billing_address,
      shipping_address,
      delivery_time,
      verified_response,
      customer_contact,
      payment_gateway,
      token,
    },
  ] = useAtom(checkoutAtom);

  let input = {
    //@ts-ignore
    user_id:me._id,
    products: available_items?.map((item) => formatOrderedProduct(item)),
    status: orderStatuses[0]?.id ?? '1',
    amount: Number(base_amount),
    price: Number(base_amount),
    paid_total: Number(totalPrice),
    total: Number(totalPrice),
    payment_gateway,
    type:"PRODUCT PURCHASE",
    // use_wallet_points:0,
    // coupon_id: Number(coupon?.id),
    // discount: Number(discountPrice) ?? 0,
    // sales_tax: verified_response?.total_tax,
    // delivery_fee: verified_response?.shipping_charge,
    // delivery_time: delivery_time?.title,
    customer_contact:me?.mobile_no,
    unique_id: 'ORD'+Math.floor(1000000000 + Math.random() * 9000000000),
    // purchaseTypeDPI:items?.map((item) => {
    //   return {_id:item?.id,purchaseDPI:item?.purchaseDPI,purchaseFileType:item?.purchaseFileType};
    // })
    // billing_address: {
    //   ...(billing_address?.address && billing_address.address),
    // },
    // shipping_address: {
    //   ...(shipping_address?.address && shipping_address.address),
    // },
  };
// console.log('items: ',items);
  return (
    <div className={className}>
      <div className="flex flex-col pb-2 border-b border-border-200">
        {!isEmptyCart ? (
          items?.map((item) => {
            const notAvailable = verifiedResponse?.unavailable_products?.find(
              (d: any) => d === item.id
            );
            return (
              <ItemCard
                item={item}
                key={item.id}
                notAvailable={!!notAvailable}
              />
            );
          })
        ) : (
          <EmptyCartIcon />
        )}
      </div>

      <div className="mt-4 space-y-2">
        <ItemInfoRow title={t('text-sub-total')} value={sub_total} />
        <ItemInfoRow title={t('text-tax')} value={tax} />
        {/* <ItemInfoRow title={t('text-shipping')} value={shipping} /> */}
        {/* {discount && coupon ? (
          <div className="flex justify-between">
            <p className="text-sm text-body ltr:mr-4 rtl:ml-4">
              {t('text-discount')}
            </p>
            <span className="flex items-center text-xs font-semibold text-red-500 ltr:mr-auto rtl:ml-auto">
              ({coupon?.code})
              <button onClick={() => setCoupon(null)}>
                <CloseIcon className="w-3 h-3 ltr:ml-2 rtl:mr-2" />
              </button>
            </span>
            <span className="text-sm text-body">{discountPrice}</span>
          </div>
        ) : (
          <div className="mt-5 !mb-4 flex justify-between">
            <Coupon />
          </div>
        )} */}
        <div className="flex justify-between pt-3 border-t-4 border-double border-border-200">
          <p className="text-base font-semibold text-heading">
            {t('text-total')}
          </p>
          <span className="text-base font-semibold text-heading">{total}</span>
        </div>
      </div>
      {/* {verifiedResponse && (
        <Wallet
          totalPrice={totalPrice}
          walletAmount={verifiedResponse.wallet_amount}
          walletCurrency={verifiedResponse.wallet_currency}
        />
      )} */}
      {!isEmptyCart ?
      use_wallet && !Boolean(payableAmount) ? null : (
        <PaymentGrid className="p-5 mt-10 border border-gray-200 bg-light" input={input} />
      ) : ''
      }
      {/* <PlaceOrderAction>{t('text-place-order')}</PlaceOrderAction> */}
    </div>
  );
};

export default VerifiedItemList;
