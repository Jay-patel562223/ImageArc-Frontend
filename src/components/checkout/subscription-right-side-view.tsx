

import Coupon from '@/components/checkout/coupon';
import usePrice from '@/lib/use-price';
import EmptyCartIcon from '@/components/icons/empty-cart';
import { CloseIcon } from '@/components/icons/close-icon';
import { useTranslation } from 'next-i18next';
import { useCart } from '@/store/quick-cart/cart.context';
import {
  calculatePaidTotal,
  calculateTotal,
  Item,
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
import cn from 'classnames';
import Button from '../ui/button';
import { formatOrderedProduct } from '@/lib/format-ordered-product';
import { useUser } from '@/framework/user';
import { useCreateOrder } from '@/framework/order';
import { useEffect, useState } from 'react';
// import {PNG} from '../../pages/checkout/index';
// import { useSubLogin } from '@/framework/rest/subscription_package';
import { useSubLogin } from '../../framework/rest/subscription_package';

// console.log("PNG",PNG("value"));

export const SubscriptionRightSideView = ({
  packagesData,
  fileType,
  availableProduct,
  pId,
  png,
  tif,
  jpg,
}: {
  packagesData?: any;
  fileType?: any;
  availableProduct: any,
  pId: any,
  png: any,
  tif: any,
  jpg: any
}) => {


  const { t } = useTranslation('common');
  let { items: newitems, isEmpty: isEmptyCart, getAllItemFromCart } = useCart();
  const [verifiedResponse] = useAtom(verifiedResponseAtom);
  const [coupon, setCoupon] = useAtom(couponAtom);
  const [discount] = useAtom(discountAtom);
  const [payableAmount] = useAtom(payableAmountAtom);
  const [use_wallet] = useAtom(walletAtom);

  const [newItems, setNewItems] = useState<any[]>([]);

  // const { packagesData, isLoading } = useSubLogin([]);

  let PNG = png;
  let JPG = jpg;
  let TIF = tif;

  let use_png = 0;
  let use_jpg = 0;
  let use_tif = 0;


  // const Packages = packagesData.map((items: any) => {
  //   if (items.file_type.name == "jpg") {
  //     return JPG = JPG + items?.available_qnty
  //   } else if (items.file_type.name == "png") {
  //     return PNG = PNG + items?.available_qnty
  //   } else if (items.file_type.name == "tif") {
  //     return TIF = TIF + items?.available_qnty
  //   }
  // })



  // console.log("png", PNG)
  // console.log("jpg", JPG)
  // console.log("tif+_+_+P_", TIF)

  // let setNewItems: Item[] = [];



  let latestData = getAllItemFromCart();

  useEffect(() => {
    latestData.then((res: any) => setNewItems([...newitems, ...res]));
  }, [newitems])


  let newData = newItems.filter((v, i, a) => a.findIndex(v2 => (v2.id === v.id)) === i)

  

  let items = newData;

  

  const pdata = packagesData;
  // pId = JSON.stringify(pId);
  pId = pId.join(',')
  // const availableProduct = pdata?.available_qnty ?? 0;
  // const availableProduct = pdata?.available_qnty ?? 0;
  // const availableProduct = pdata?.qnty ?? 0 - pdata?.used_qnty ?? 0;
  // const available_items = items?.filter(
  //   (item) => !verifiedResponse?.unavailable_products?.includes(item.id)
  // );

  // const { price: tax } = usePrice(
  //   verifiedResponse && {
  //     amount: verifiedResponse.total_tax ?? 0,
  //   }
  // );

  // const { price: shipping } = usePrice(
  //   verifiedResponse && {
  //     amount: verifiedResponse.shipping_charge ?? 0,
  //   }
  // );

  // const base_amount = calculateTotal(available_items);

  // const { price: sub_total } = usePrice(
  //   verifiedResponse && {
  //     amount: base_amount,
  //   }
  // );

  // const { price: discountPrice } = usePrice(
  //   //@ts-ignore
  //   discount && {
  //     amount: Number(discount),
  //   }
  // );
  // const totalPrice = verifiedResponse
  //   ? calculatePaidTotal(
  //       {
  //         totalAmount: base_amount,
  //         tax: verifiedResponse?.total_tax,
  //         shipping_charge: verifiedResponse?.shipping_charge,
  //       },
  //       Number(discount)
  //     )
  //   : 0;
  // const { price: total } = usePrice(
  //   verifiedResponse && {
  //     amount: totalPrice <= 0 ? 0 : totalPrice,
  //   }
  // );

  let available_items: Item[] = [];
  const { me } = useUser();
  const { createOrder, isLoading } = useCreateOrder();

  const handlePlaceOrder = () => {



    let input = {
      //@ts-ignore
      user_id: me?._id,
      products: available_items?.map((item) => formatOrderedProduct(item)),
      status: 'PAID',
      amount: 0,
      coupon_id: '',
      discount: 0,
      paid_total: 0,
      sales_tax: 0,
      delivery_fee: 0,
      total: 0,
      delivery_time: '',
      customer_contact: me?.mobile_no,
      payment_gateway: "SUBSCRIPTION",
      pId: pId,
      png: use_png,
      tif: use_tif,
      jpg: use_jpg,

      // pId: packagesData?._id,
      unique_id: 'SUB' + Math.floor(1000000000 + Math.random() * 9000000000),
      purchaseTypeDPI: items?.map((item) => {
        return { _id: item?.id, purchaseDPI: item?.purchaseDPI, purchaseFileType: item?.purchaseFileType };
      })
      // use_wallet_points,
      // billing_address: {
      //   ...(billing_address?.address && billing_address.address),
      // },
      // shipping_address: {
      //   ...(shipping_address?.address && shipping_address.address),
      // },
    };
    // if (payment_gateway === 'STRIPE') {
    //   //@ts-ignore
    //   input.token = token;
    // }

    // delete input.billing_address.__typename;
    // delete input.shipping_address.__typename;
    //@ts-ignore
    createOrder(input);
  };
  // console.log("csdsscsccsd",input?.products);
  // /var/www/html/FE_SHOP_PHOTO/src/components/checkout/subscription-right-side-view.tsx
  let totalFile = 0;

  const DefaultRouteHandler = (currentUser:any) => {
    if (currentUser == 'png' && PNG > 0) {
      PNG = PNG - 1;
      use_png = use_png + 1;
      return '(Deduct from Subscription)';
    } else if (currentUser == 'jpg' && JPG > 0) {
      JPG = JPG - 1;
      use_jpg = use_jpg + 1;
      return '(Deduct from Subscription)';
    } else if (currentUser == 'tif' && TIF > 0) {
      TIF = TIF - 1;
      use_tif = use_tif + 1
      return '(Deduct from Subscription)';
    }
    return '(Need to purchase)';
  };

  return (
    <div >
      <div className="flex flex-col pb-2 border-b border-border-200">

        {!isEmptyCart ?
          (items?.map((item) => {
            const valuesItems = DefaultRouteHandler(item?.purchaseFileType?.toLowerCase())
             if(valuesItems == '(Deduct from Subscription)'){
              totalFile = totalFile + 1
              available_items.push(item);
             }else {
              totalFile = totalFile + 1;
             }
            // if (fileType.includes(item?.purchaseFileType?.toLowerCase())) {
            //   // if(fileType.includes(item?.unit?.toLowerCase())) {
            //   totalFile = totalFile + 1
            //   available_items.push(item);
            // } else {
            //   totalFile = totalFile;
            // }
            return (<div key={item.id}>
              <div className="flex justify-between py-2">
                <img src={item.image} alt="" style={{ height: '40px' }} />&nbsp;
                <div className="flex items-center justify-between text-base" style={{ width: '100%' }}>
                  <span
                    className={cn('text-sm', 'text-body')}
                  >
                    {/* <span
                        className={cn(
                          'text-sm font-bold',
                          'text-heading'
                        )}
                      >
                        {item?.quantity}
                      </span>
                      <span className="mx-2">x</span> */}
                    <span>{item?.name}</span> | <span>{item?.purchaseFileType?.toUpperCase()}</span> | <span>{item?.purchaseDPI} DPI</span>
                    {/* <span>{item?.name}</span> | <span>{item?.unit}</span> */}
                  </span>
                </div>
                &nbsp;
                <span
                  className={cn('text-sm', 'text-body')}
                  style={{ margin: 'auto !important' }}
                >
                  {/* {fileType.includes(item?.purchaseFileType?.toLowerCase()) ? '(Deduct from Subscription)' : '(Need to purchase)'} */}
                  {/* {DefaultRouteHandler(item?.purchaseFileType?.toLowerCase())} */}
                  {valuesItems}
                  {/* {console.log( "datdatda+_)090",fileType.includes(item?.purchaseFileType?.toLowerCase()) ? '(Deduct from Subscription)' : '(Need to purchase)')} */}
                  {/* {fileType.includes(item?.unit?.toLowerCase()) ? '(Deduct from Subscription)' : '(Need to purchase)'} */}
                  {/* {!notAvailable ? price : t('text-unavailable')} */}
                </span>
              </div>
            </div>
            )
          })
          )
          : (
            <EmptyCartIcon />
          )}


      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between pt-1 ">
          <p className="text-       return  ;base text-heading">
            Total Cart Product
          </p>
          <span className="text-base text-heading">{totalFile}</span>
        </div>
        <div className="flex justify-between pt-1 ">
          <p className="text-base text-heading">
            Available Product in Package
          </p>
          <span className="text-base text-heading">{availableProduct}</span>
        </div>

        {/* <ItemInfoRow title={t('text-sub-total')} value={sub_total} />
        <ItemInfoRow title={t('text-tax')} value={tax} />
        <ItemInfoRow title={t('text-shipping')} value={shipping} />
        */}
        {/* <div className="flex justify-between pt-3 border-t-4 border-double border-border-200">
          <p className="text-base font-semibold text-heading">
            {t('text-total')}
          </p>
          <span className="text-base font-semibold text-heading">{total}</span>
        </div> */}
      </div>

      {/* {use_wallet && !Boolean(payableAmount) ? null : (
        <PaymentGrid className="p-5 mt-10 border border-gray-200 bg-light" />
      )} */}
      {/* <PlaceOrderAction>{t('text-place-order')}</PlaceOrderAction> */}
      <Button

        // loading={isLoading}
        className="mt-5 w-full mt-8 font-normal h-[50px] !bg-gray-800 transition-colors hover:!bg-gray-900"
        onClick={handlePlaceOrder}
      // disabled={!isAllRequiredFieldSelected}
      // {...props}
      >{t('text-place-order')}</Button>

    </div>
  );

};

export default SubscriptionRightSideView;
