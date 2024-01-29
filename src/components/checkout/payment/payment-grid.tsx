import { RadioGroup } from '@headlessui/react';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import Alert from '@/components/ui/alert';
import StripePayment from '@/components/checkout/payment/stripe';
import RazorpayPayment from '@/components/checkout/payment/razorpay';
import CashOnDelivery from '@/components/checkout/payment/cash-on-delivery';
import { useAtom } from 'jotai';
import { paymentGatewayAtom, PaymentMethodName } from '@/store/checkout';
import cn from 'classnames';

interface PaymentMethodInformation {
  name: string;
  value: PaymentMethodName;
  icon: string;
  component: React.FunctionComponent;
  // input:object;
}



const PaymentGrid: React.FC<{ className?: string; theme?: 'bw';input?:Object }> = ({
  className,
  theme,
  input,
}) => {

 

  const [gateway, setGateway] = useState('STRIPE');

// console.log("gateway",gateway);
  // const [inputNew, setInputNew] = useState<object | undefined>(input);
  // const [inputNewLatest, setInputNewLatest] = useState(input);
  // const [gateway, setGateway] = useAtom<PaymentMethodName>(paymentGatewayAtom);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useTranslation('common');
 

  const AVAILABLE_PAYMENT_METHODS_MAP: Record<
    PaymentMethodName,
    PaymentMethodInformation
  > = {
    // const AVAILABLE_PAYMENT_METHODS_MAP = {
    STRIPE: {
      name: 'Stripe',
      value: 'STRIPE',
      icon: '/payment/stripe.png',
      component: StripePayment,
    },
    RAZORPAY: {
      name: 'Razorpay',
      value: 'RAZORPAY',
      icon: '/payment/razorpay.png',
      component: RazorpayPayment,
    },
    // CASH_ON_DELIVERY: {
    //   name: "Order Without Pay",
    //   value: 'CASH_ON_DELIVERY',
    //   icon: '',
    //   component: CashOnDelivery,
    // },
  };

  // console.log("method_map",AVAILABLE_PAYMENT_METHODS_MAP);

      //@ts-ignore
  const PaymentMethod = AVAILABLE_PAYMENT_METHODS_MAP[gateway];
  const Component = PaymentMethod?.component ?? StripePayment;

  
// console.log("PaymentMethod",PaymentMethod);

  return (
    <div className={className}>
      {errorMessage ? (
        <Alert
          message={t(`common:${errorMessage}`)}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}

      <RadioGroup value={gateway} onChange={setGateway}>
        <RadioGroup.Label className="mb-5 block text-base font-semibold text-heading">
          {t('text-choose-payment')}
        </RadioGroup.Label>

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-2">
          {Object.values(AVAILABLE_PAYMENT_METHODS_MAP).map(
            ({ name, icon, value }) => (
              <RadioGroup.Option value={value} key={value}>
                {({ checked }) => (
                  <div
                    className={cn(
                      'relative flex h-full w-full cursor-pointer items-center justify-center rounded border border-gray-200 bg-light py-3 text-center',
                      checked && '!border-accent bg-light shadow-600',
                      {
                        '!border-gray-800 bg-light shadow-600':
                          theme === 'bw' && checked,
                      }
                    )}
                  >
                    {icon ? (
                      <>
                        {/* eslint-disable */}
                        <img src={icon} alt={name} className="h-[30px]" />
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-heading">
                        {name}
                      </span>
                    )}
                  </div>
                )}
              </RadioGroup.Option>
            )
          )}
        </div>
      </RadioGroup>
      <div>
        <Component input={input}  gateway={gateway}/>
      </div>
    </div>
  );
};

export default PaymentGrid;
