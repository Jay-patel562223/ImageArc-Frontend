// @ts-nocheck
import { useTranslation } from 'next-i18next';
import { billingAddressAtom, shippingAddressAtom } from '@/store/checkout';
import dynamic from 'next/dynamic';
import { getLayout } from '@/components/layouts/layout';
import { AddressType } from '@/framework/utils/constants';
import Seo from '@/components/seo/seo';
import { useUser } from '@/framework/user';
export { getStaticProps } from '@/framework/general.ssr';
import SubscriptionPlan from '../../pages/products/subscriptionPlan';
import { useSubPackages,useBasePackages, useSubLogin, useProductExist } from '@/framework/subscription_package';
import { useCart } from '@/store/quick-cart/cart.context';
import { isMobile } from 'react-device-detect';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Routes } from '@/config/routes';
import { toast } from 'react-toastify';

const ScheduleGrid = dynamic(
  () => import('@/components/checkout/schedule/schedule-grid')
);
const AddressGrid = dynamic(
  () => import('@/components/checkout/address-grid'),
  { ssr: false }
);
const ContactGrid = dynamic(
  () => import('@/components/checkout/contact/contact-grid')
);
const RightSideView = dynamic(
  () => import('@/components/checkout/right-side-view'),
  { ssr: false }
);

const SubscriptionRightSideView = dynamic(
  () => import('@/components/checkout/subscription-right-side-view'),
  { ssr: false }
);

// export function PNG(packagesData) {
//   return packagesData?.file_type?.name  == "png" ? packagesData?.available_qnty : 0;
// } 

export default function CheckoutPage() {
  const { t } = useTranslation();
  const { me } = useUser();
  const { _id, address, profile } = me ?? {};
  const { items, isEmpty: isEmptyCart } = useCart();
  const router = useRouter();

  let arr = [];
  let ids = [];
  const data = items.map((res)=>{
    const str = res.image.split('.');
    const finalStr = str[str.length -1];

    ids.push(res.id);
    arr.push(res.purchaseFileType)
    // arr.push(finalStr)
  })
  let text = arr.join();
  let newids = ids.join();
   const { packagesData, isLoading } = useSubLogin(text);
  // PNG(packagesData);
   

//   const {data:existData} = useProductExist({id:newids});

//   const { removeItemFromCart } = useCart();

//   existData.map((res)=>{
//     if(res.isAvailble == '0'){
//       removeItemFromCart(res?._id);
//       toast.error('Product not available');
//     }
//   })
//   const { items:itemsNew, isEmpty: isEmptyCartNew } = useCart();

//     useEffect(()=>{
//       if(isEmptyCartNew){
//         router.push(Routes.home)
//       }
//     },[itemsNew])

  // productExist({id:newids});
  // useEffect(()=>{

  // },[items])
  // const { packagesData, isLoading } = useSubLogin(JSON.stringify(arr));
  // let packageCount = packagesData.length;

  // packageCount = packageCount != undefined ? packageCount : 0;

  let jpgAvailble = 0;
  let jpegAvailble = 0;
  let pngAvailble = 0;
  let fileType = [];


  let check = 0;
  let newCheck = packagesData.length != 0 ? packagesData[0] : 0;
  let availableProduct = 0;
  let pId = [];

  let jpg = 0;
  let png = 0;
  let tif= 0;

  if(packagesData !== undefined){
  // packagesData.map((res)=>{
  packagesData.map((res)=>{
    // if(res.file_type != undefined){
    //   fileType.push(res.file_type);
    // }
    // if(res.file_type == 'jpg'){
    //   fileType.push('jpeg');
    // } else if(res.file_type == 'jpeg'){
    //   fileType.push('jpg');
    // }
    if(res?.file_type?.name != undefined){
      fileType.push(res?.file_type?.name);
    }
    if(res?.file_type?.name == 'jpg'){
      fileType.push('jpeg');
    } else if(res?.file_type?.name == 'jpeg'){
      fileType.push('jpg');
    }
    

    if(res.available_qnty > 0){
      check = 1;
    } else {
      check = 0;
    }

    pId.push(res._id);
    availableProduct = Number(availableProduct ?? 0) + Number(res?.available_qnty ?? 0)
    if(res?.file_type?.name == 'jpg'){
      jpg = Number(jpg ?? 0) + Number(res?.available_qnty ?? 0)
    }else if(res?.file_type?.name == 'png'){
      png = Number(png ?? 0) + Number(res?.available_qnty ?? 0)
    }else if(res?.file_type?.name == 'tif'){
      tif = Number(tif ?? 0) + Number(res?.available_qnty ?? 0)
    }
  });
    // if(packagesData.file_type != undefined){
    //   fileType.push(packagesData.file_type);
    // }
    // if(packagesData.file_type == 'jpg'){
    //   fileType.push('jpeg');
    // } else if(packagesData.file_type == 'jpeg'){
    //   fileType.push('jpg');
    // }

    if(packagesData.file_type == 'jpg'){
      jpgAvailble = packagesData?.available_qnty;
    }
    if(packagesData.file_type == 'jpeg'){
      jpegAvailble = packagesData?.available_qnty;
    }
    if(packagesData.file_type == 'png'){
      pngAvailble = packagesData?.available_qnty;
    }

   
  // })
} else {
//  if(packagesData.length != 0){
//   // if(Array.isArray(packagesData)){
   
//   // check = packagesData.length
// } else {
  if(packagesData != undefined && packagesData != null){
    check = 1;
  } else {
    check = 0;
  }
// }
}

let available_qnty = packagesData?.available_qnty ?? 0;
// if(available_qnty )

const [showPopup, setShowPopup] = useState(false);

const toggleShowInfoPopup = () => {
  setShowPopup(!showPopup);
};

  return (
    <>
    {/* <div
            className="alert alert-warning alert-dismissible"
            role="alert"
            style={{display: showPopup ? 'none':'block',background: 'lightyellow',padding: '10px',
            position: 'fixed',
            marginTop: '80px',
            width: '100%'
          }}
          >
             
            <button
              type="button"
              className="close"
              data-dismiss="alert"
              aria-label="Close"
              onClick={toggleShowInfoPopup}
              style={{float:'right'}}
            >
              <span aria-hidden="true">&times;</span>
            </button>
            Your plan reached the limit. Do you want to renew?

            <div style={{padding: '5px'}}>BRONZE (JPG) <a href="" style={{float: "right",background:'yellow',border: '1px solid darkgrey',padding: '3px'}} className="font-normal ">RENEW</a></div>
              <div style={{padding: '5px'}}>BRONZE (PNG) <a href="" style={{float: "right",background:'yellow',border: '1px solid darkgrey',padding: '3px'}} className="font-normal ">RENEW</a></div>
          </div> */}
      <Seo noindex={true} nofollow={true} />
      <div className="px-4 py-8 bg-gray-100 lg:py-10 lg:px-8 xl:py-14 xl:px-16 2xl:px-20">
        <div className="flex flex-col items-center w-full max-w-5xl m-auto rtl:space-x-reverse lg:flex-row lg:items-start lg:space-x-8">
          <div className="w-full space-y-6 lg:max-w-2xl">

          {
          
            !isMobile && <><h1><b>Subscription</b></h1> <SubscriptionPlan/></>
          }
          

            {/* <ContactGrid
              className="p-5 bg-light shadow-700 md:p-8"
              contact={profile?.contact}
              label={t('text-contact-number')}
              count={1}
            /> */}

            {/* <AddressGrid
              userId={_id!}
              className="p-5 bg-light shadow-700 md:p-8"
              label={t('text-billing-address')}
              count={2}
              //@ts-ignore
              addresses={address?.filter(
                (item) => item?.type === AddressType.Billing
              )}
              atom={billingAddressAtom}
              type={AddressType.Billing}
            />
            <AddressGrid
              userId={me?._id!}
              className="p-5 bg-light shadow-700 md:p-8"
              label={t('text-shipping-address')}
              count={3}
              //@ts-ignore
              addresses={address?.filter(
                (item) => item?.type === AddressType.Shipping
              )}
              atom={shippingAddressAtom}
              type={AddressType.Shipping}
            />
            <ScheduleGrid
              className="p-5 bg-light shadow-700 md:p-8"
              label={t('text-delivery-schedule')}
              count={4}
            /> */}
          </div>
          <div className="w-full mt-10 mb-10 sm:mb-12 lg:mb-0 lg:w-96">
            <h1 style={{margin: '-40px 0px 27px 0px'}}> <b>Checkout</b> </h1>
            {/* <h1 style={{margin: '-40px 0px 27px 0px'}}> <b>Purchase Individual</b> </h1> */}
           {check != 0 && newCheck != 0 ? <SubscriptionRightSideView packagesData={newCheck} fileType={fileType} availableProduct={availableProduct} pId={pId} png={png} jpg={jpg} tif={tif}/> : <RightSideView />}
           {
            isMobile && <><h1 style={{marginTop:'40px',fontSize: 'large'}}>Subscription</h1><SubscriptionPlan/></>
          }
          </div>
        </div>
      </div>
    </>
  );
}
CheckoutPage.authenticationRequired = true;
CheckoutPage.getLayout = getLayout;
