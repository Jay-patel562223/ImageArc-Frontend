import { useTranslation } from 'next-i18next';
import ContactForm from '@/components/settings/contact-form';
import { Image } from '@/components/ui/image';
import contactIllustration from '@/assets/contact-illustration.svg';
import { getLayout } from '@/components/layouts/layout';
import { formatAddress } from '@/lib/format-address';
import { getIcon } from '@/lib/get-icon';
import isEmpty from 'lodash/isEmpty';
import * as socialIcons from '@/components/icons/social';
import Seo from '@/components/seo/seo';
import { useSettings } from '@/framework/settings';
export { getStaticProps } from '@/framework/general.ssr';
import SubscriptionPlan from '@/pages/products/subscriptionPlan'

export const SubscriptionPage = () => {
  const { t } = useTranslation('common');
  const { settings } : any = useSettings();
  return (
    <>
      <Seo title={'Contact'} url={'contact'} />
      <div className="w-full bg-gray-100">
        <SubscriptionPlan/>
        {/* <div className="mx-auto flex w-full max-w-7xl flex-col py-10 px-5 md:flex-row xl:py-14 xl:px-8 2xl:px-14">
        </div> */}
      </div>
    </>
  );
};
SubscriptionPage.getLayout = getLayout;
export default SubscriptionPage;
