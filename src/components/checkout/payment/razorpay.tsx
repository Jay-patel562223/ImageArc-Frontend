//@ts-nocheck
import Button from '@/components/ui/button';
import { verifiedTokenAtom } from '@/store/checkout';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import getStripe from '@/lib/get-stripejs';
import { useCallback } from "react";
import useRazorpay from "react-razorpay";
import { useTranslation } from 'next-i18next';
import Logo from '../../../../public/logo.webp'
import { useCreateNewSubscription, usecreateRazorPayOrder, useCreateSubscription, useDeletePackageData } from '@/framework/subscription_package';
import { useUser } from '@/framework/user';
import { useRazorPayCheckoutPay } from '@/framework/checkout';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { getEnv } from '@/config/get-env';
import { useCart } from '@/store/quick-cart/cart.context';
import { useCreateOrder } from '@/framework/order';
import { API_ENDPOINTS } from '../../../framework/rest/client/api-endpoints';

const RazorPayPayment: React.FC = ({ input, gateway }: any) => {
  const Razorpay = useRazorpay();
  const { t } = useTranslation('common');
  // const { createSubscriptionPlan, isLoading } = useCreateSubscription();
  const { me } = useUser();

  const {
    mutate: checkoutPay,
  } = useRazorPayCheckoutPay();


  // const { mutate: createSubscriptionPlan, isLoading } = useCreateNewSubscription();
  const { mutate: deleteSubscriptionPlan } = useDeletePackageData();
  // const { mutate: deleteAddressById } = useDeleteAddress();


  const { createOrder } = useCreateOrder();
  const { createSubscriptionPlan, isLoading } = useCreateSubscription();


  const { mutate: createRazorPayOrder } = usecreateRazorPayOrder();

  const router = useRouter();
  const { removeItemFromCart } = useCart();

  input.payment_gateway = 'RAZORPAY';
  // const inputAll = input;
  let inputData: { notes: any; }[] = [];
  if (input.type == "PRODUCT PURCHASE") {

    input.products = typeof input.products == 'string' ? JSON.parse(input.products) : input.products;
    input.products = JSON.stringify(input.products);

    inputData.push({ notes: { email: me?.email, user_id: input?.user_id, unique_id: input?.unique_id, address: "Razorpay Corporate Office", type: input?.type, payment_gateway:input.payment_gateway, ...input } });
  } else {
    inputData.push({ notes: { email: me?.email, user_id: input?.user_id, unique_id: input?.unique_id, address: "Razorpay Corporate Office", type: input?.type, payment_gateway:input.payment_gateway, extraData: JSON.stringify(input) } });
  }

  const allData = input?.products != undefined ? JSON.parse(input?.products) : [];
  let NewInputData = inputData[0];

  const handlePayment = useCallback(() => {
    // const order = createRazorPayOrder({amount: input.price != undefined ? Number(input.price)  : Number(input.amount) });
    // order
    createRazorPayOrder(
      { amount: input.price != undefined ? Number(input.price) : Number(input.amount) },
      {
        onError: (error: any) => {
          toast.error(error?.response?.data?.message);
        },
        onSuccess: (data) => {
          //@ts-ignore
          const options: RazorpayOptions = {
            // key: process.env.RAZORPAY_KEY,
            // key: env.RAZORPAY_KEY,
            // key: getEnv('RAZORPAY_KEY'),
            key: "rzp_test_EIP3dabkWemMx7",
            // key: "rzp_test_4m8J8ZjNICgEiH",
            amount: input.price != undefined ? Number(input.price) * 100 : Number(input.amount) * 100,
            currency: "INR",
            name: "IMAGE ARC",
            description: "Test Transaction",
            image: Logo,
            // type:'customer',
            order_id: data?.data?.id,
            handler: function (res) {
              input.status = 'active';
              // input.status = 'pending';
              if (input.products != undefined) {
                input.payment_gateway = 'RAZORPAY'
                input.products = JSON.parse(input.products);
                createOrder(input);
              } else {
                input.payment_method = 'RAZORPAY'
                createSubscriptionPlan(input);
              }
              if (typeof allData != 'string') {
                allData.map((res) => {
                  setTimeout(() => {
                    removeItemFromCart(res?.product_id);
                  }, 1000)
                })
              }
              // setTimeout(()=>{
              //   if(input.type == "PRODUCT PURCHASE"){
              //     router.push(Routes.orders)
              //   } else {
              //     router.push(Routes.subscriptions)
              //   }
              //   toast.success('Order placed successfully');
              // },2000)
              // checkoutPay(
              //   {
              //     razorpay_payment_id: res.razorpay_payment_id,
              //     // amount: input.price,
              //   })
            },
            "modal": {
              "ondismiss": function () {
                console.log('Checkout form closed');
              }
            },
            prefill: {
              name: me?.first_name + '' + me?.last_name,
              email: me?.email,
              contact: me?.mobile_no,
              //@ts-ignore
              user_id: me?._id
            },
            notes: {
              ...NewInputData.notes
            },
            // NewInputData,
            // notes: {
            //   // address: "Razorpay Corporate Office",
            //   // user_id:me?._id,
            //   // extraData1:'test',

            //   // extraData: JSON.stringify(input),
            //   // payment_gateway:input.payment_gateway
            //   // order_id:id
            //   // user_id: input.user_id,
            //   // products: input.products,
            //   // status: input.status,
            //   // amount: input.amount,
            //   // price: input.price,
            //   // paid_total: input.paid_total,
            //   // total: input.total,
            //   
            // },
            // extraData:{
            //   user_id:me?._id,

            // },
            theme: {
              color: "#3399cc",
            },

          };
          const rzpay = new Razorpay(options);
          //@ts-ignore
          rzpay.on("payment.failed", function (response) {
            // checkoutPay(
            //   {
            //     razorpay_payment_id: response.error.metadata.payment_id,
            //     // amount: input.price,
            //   },
            //   {
            //     onError: (error: any) => {

            //     },
            //     onSuccess: (data) => {

            //     }
            //   }
            // )
            deleteSubscriptionPlan({ id: id });
            // setTimeout(() => {
            //   window.location.reload();
            // }, 3000)

            // console.log("responseCode"  , response.error.code);
            // console.log("description",response.error.description);
            // console.log("source", response.error.source);
            // console.log("step" ,response.error.step);
            // console.log("reason", response.error.reason);
            // console.log("order_id", response.error.metadata.order_id);
            // console.log("payment_id", response.error.metadata.payment_id);
            // console.log("response+_+_+_", response);
          });


          rzpay.open();

          //   }
          // });

        },
      }
    );



  }, [Razorpay]);

  return (
    <div className="App">
      <Button
        type="submit"
        onClick={handlePayment}
        className="mt-5 w-full mt-8 font-normal h-[50px] !bg-gray-800 transition-colors hover:!bg-gray-900"
      >{t('text-place-order')}</Button>
    </div>
  );
};

export default RazorPayPayment;
