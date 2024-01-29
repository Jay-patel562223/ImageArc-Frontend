import Button from '@/components/ui/button';
import { verifiedTokenAtom } from '@/store/checkout';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import getStripe from '@/lib/get-stripejs';
import { useAtom } from 'jotai';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { toast } from "react-toastify";
import { useCheckoutPay } from '@/framework/checkout';
import { useGetPackageData, useCreateSubscription } from '@/framework/subscription_package';
import { useRouter } from 'next/router';
import { Routes } from '@/config/routes';
import { useCreateOrder } from '@/framework/order';


const StripeForm: React.FC = ({ input }: any) => {
  const { t } = useTranslation('common');
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [_, setVerifiedToken] = useAtom(verifiedTokenAtom);


  const {
    mutate: checkoutPay,
  } = useCheckoutPay();



  const { createOrder } = useCreateOrder();
  const { createSubscriptionPlan, isLoading } = useCreateSubscription();

  // const handlePlaceOrder = (e) => {

  //   createSubscriptionPlan(input);
  // };
  const router = useRouter();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {

    // Block native form submission.
    e.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }
    setLoading(true);

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.

    const cardElement = elements.getElement(CardElement)!;

    // Use your card Element with other Stripe.js APIs
    const { error, token } = await stripe.createToken(cardElement);

    if (error) {
      setLoading(false);
      toast.error(error?.message);
      return;
    }
    if (token) {
      checkoutPay(
        {
          token: token,
          price: input?.price ?? 0,
          type: input?.type ?? '',
          unique_id: input?.unique_id ?? '',
          payment_gateway: input?.payment_gateway ?? 'STRIPE',
        },
        {
          onError: (error: any) => {
            if (error?.response?.data?.link != undefined) {
              stripe
                .confirmCardPayment(error?.response?.data?.link, {
                  payment_method: {
                    card: cardElement,
                    billing_details: {
                      name: 'Test',
                    },
                  },
                })

                .then(function (result) {
                  if (!result.error) {
                    // createSubscriptionPlan(input);
                    if (input.products != undefined) {
                      input.payment_gateway = 'STRIPE'
                      createOrder(input);
                    } else {
                      input.payment_method = 'STRIPE'
                      createSubscriptionPlan(input);
                    }
                  } else {
                    toast.error(result?.error?.message);
                    router.push(Routes.home);

                  }

                }).catch((err) => {
                  toast.error(err);
                });
            }


            // if(error?.response?.data?.message != 'Requires action'){
            //   if(error?.response?.data?.message != undefined){
            //     toast.error(error?.response?.data?.message);
            //   } else {
            //     toast.error("Something went wrong!");
            //   }
            // } else {
            //   toast.error("Please wait....");
            // }

          },
          onSuccess: (data) => {
            // if (!data?.status) {
            //   toast.error(data?.message);

            // } else if (data?.status) {
            setVerifiedToken(token.id);
            // toast.success(t('payment-confirmed'), {
            //   className: '-mt-10 xs:mt-0',
            // });
            if (input.products != undefined) {
              createOrder(input);
            } else {
              input.payment_method = 'STRIPE'
              createSubscriptionPlan(input);
            }


            // toast.success(t('password-successful'));
            // }
            setLoading(false);
          },
        }
      );


    }
    // setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <CardElement />
      {/* <Button
        type="submit"
        loading={loading}
        disabled={!stripe}
        className="StripePay mt-5 ltr:ml-auto rtl:mr-auto transition-colors bg-gray-800 hover:bg-gray-900"
      >
        {t('text-confirm')}
      </Button> */}
      <Button
        type="submit"
        loading={loading}
        disabled={!stripe}
        className=" py-5 px-0 mt-5 w-full mt-8 font-normal h-[50px] !bg-gray-800 transition-colors hover:!bg-gray-900"
      >

        {/* {t('text-place-order')} */}

        {loading ? "please wait..." : t('text-place-order')}
      </Button>
    </form>
  );
};
const StripePayment: React.FC = ({ input }: any, { gateway }: any) => {

  return (
    <Elements stripe={getStripe()}>
      <StripeForm
        //@ts-ignore
        input={input}
      />
    </Elements>
  );
};

export default StripePayment;
