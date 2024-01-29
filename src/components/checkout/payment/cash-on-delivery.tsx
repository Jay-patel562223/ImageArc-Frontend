import { useTranslation } from 'next-i18next';
import Button from '@/components/ui/button';
import { useCreateSubscription } from '@/framework/subscription_package';

const CashOnDelivery = ({input}:any) => {
  const { t } = useTranslation('common');
  const { createSubscriptionPlan, isLoading } = useCreateSubscription();


const handlePlaceOrder = () => {
   
  //@ts-ignore
  createSubscriptionPlan(input);
};

  return (
    <>
        <span className="block text-sm text-body">{t('text-cod-message')}</span>
        <Button
            type="submit"
            onClick={handlePlaceOrder}
            className="mt-5 w-full mt-8 font-normal h-[50px] !bg-gray-800 transition-colors hover:!bg-gray-900"
        >{t('text-place-order')}</Button>
    </>
  );
};
export default CashOnDelivery;
