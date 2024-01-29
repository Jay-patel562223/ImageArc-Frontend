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
import { ItemInfoRow } from '@/components/checkout/digital/item-info-row';
import PaymentGrid from '@/components/checkout/payment/payment-grid';
import { PlaceOrderAction } from '@/components/checkout/place-order-action';
import Wallet from '@/components/checkout/wallet/wallet';
import CartItem from '@/components/checkout/digital/cart-item';
import { useRouter } from 'next/router';
import { useGetPackageData,useCreateSubscription } from '@/framework/subscription_package';
import cn from 'classnames';
import Button from '@/components/ui/button';
import { useState } from 'react';
import classNames from 'classnames';
import ValidationError from '@/components/ui/validation-error';
import {  useUser } from '@/framework/user';

interface Props {
  className?: string;
}
const VerifiedItemList: React.FC<Props> = ({ className }) => {
  const { t } = useTranslation('common');
  const { items, isEmpty: isEmptyCart } = useCart();
  const [verifiedResponse] = useAtom(verifiedResponseAtom);
  const [coupon, setCoupon] = useAtom(couponAtom);
  const [discount] = useAtom(discountAtom);
  const [payableAmount] = useAtom(payableAmountAtom);
  const [use_wallet] = useAtom(walletAtom);


  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { createSubscriptionPlan, isLoading } = useCreateSubscription();
  const { locale } : any = useRouter();
//   const { items } = useCart();
//   const { me } = useUser();

//   const { orderStatuses } = useOrderStatuses({
//     limit: 1,
//     language: locale
//   });

  const router = useRouter();
  const id = router.query.subId;

    const { packagesDetails } = useGetPackageData(id);
    const { me } = useUser();
  
    let input = {
     //@ts-ignore
      user_id:me?._id,
      package_id:packagesDetails?._id,
      file_type:packagesDetails?.file_type,
      price:packagesDetails?.price,
      qnty:packagesDetails?.qnty,
      type:"SUBSCRIPTION PURCHASE",
      unique_id: 'SUB'+Math.floor(1000000000 + Math.random() * 9000000000)

    };

// const handlePlaceOrder = (e) => {
   
//     //@ts-ignore
//     createSubscriptionPlan(input);
//   };

  const available_items = items?.filter(
    (item) => !verifiedResponse?.unavailable_products?.includes(item.id)
  );

  const { price: price } = usePrice(
     { amount: Number(packagesDetails?.price ?? 0)},
  );


  return (
    <div className={className}>
      <div className="flex flex-col pb-2 border-b border-border-200">
        {/* {!packagesDetails && packagesDetails.length != 0 ?  */}
              {/* <> */}
              <div
                className={cn(
                    'flex w-full space-x-3 rtl:space-x-reverse py-3 first:pt-0 last:pb-0'
                )}
                key={packagesDetails?.id}
                >
                {/* <div className="w-[42px] h-[42px] flex-shrink-0 bg-gray-100">
                    <Image
                    src={item?.image ?? productPlaceholder}
                    alt={item.name}
                    layout="responsive"
                    width={42}
                    height={42}
                    className="product-image rounded-md"
                    />
                </div> */}
                <div className="flex w-full justify-between">
                    <p className="flex flex-col text-sm">
                    <span className={'text-gray-800'}>
                        {packagesDetails?.package_type?.name}
                    </span>
                    <span
                        className={cn(
                        'text-xs font-semibold mt-1.5',
                        'text-gray-500'
                        )}
                    >
                        {packagesDetails?.qnty +' '+packagesDetails?.file_type?.name}  
                        {/* {packagesDetails?.qnty} {packagesDetails?.file_type}   */}
                        {/* {packagesDetails.file_type}  X {packagesDetails.qnty} */}
                    </span>
                    </p>
                    <span
                    className={cn(
                        'text-sm font-semibold',
                        'text-gray-800'
                    )}
                    >
                    {price}
                    </span>
                </div>
                </div>
              {/* </> */}
         {/* : (
          !packagesDetails ? <EmptyCartIcon /> : ''
          
        )} */}


      </div>

      <div className="mt-4 space-y-3">
        <ItemInfoRow title={t('text-sub-total')} value={price} />
        <ItemInfoRow title={t('text-tax')} value="0" />
        {/* <ItemInfoRow title={t('text-shipping')} value="1" /> */}
       
        <div className="flex justify-between pt-3 border-t-4 border-double border-border-200">
          <p className="text-base font-semibold text-heading">
            {t('text-total')}
          </p>
          <span className="text-base font-semibold text-heading">{price}</span>
        </div>
      </div>
     
      {use_wallet && !Boolean(payableAmount) ? null : (
        <PaymentGrid
          theme="bw"
          className="p-5 mt-10 border border-gray-200 bg-light"
          input={input}
        />
      )}

        {/* <Button
        
                // loading={isLoading}
                className="mt-5 w-full mt-8 font-normal h-[50px] !bg-gray-800 transition-colors hover:!bg-gray-900"
                onClick={handlePlaceOrder}
                // disabled={!isAllRequiredFieldSelected}
                // {...props}
            >{t('text-place-order')}</Button> */}
            {errorMessage && (
                <div className="mt-3">
                <ValidationError message={errorMessage} />
                </div>
            )}
            {/* {!isAllRequiredFieldSelected && (
                <div className="mt-3">
                <ValidationError message={t('text-place-order-helper-text')} />
                </div>
            )} */}
      {/* <PlaceOrderAction className="w-full mt-8 font-normal h-[50px] !bg-gray-800 transition-colors hover:!bg-gray-900">
        {t('text-place-order')}
      </PlaceOrderAction> */}
    </div>
  );
};

export default VerifiedItemList;
