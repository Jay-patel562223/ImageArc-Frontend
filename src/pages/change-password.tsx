import Card from '@/components/ui/cards/card';
import { useTranslation } from 'next-i18next';
import Seo from '@/components/seo/seo';
import ChangePasswordForm from '@/components/auth/change-password-form';
import DashboardLayout from '@/layouts/_dashboard';
export { getStaticProps } from '@/framework/general.ssr';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';

const ChangePasswordPage = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <Seo noindex={true} nofollow={true} />
      <Card className="w-full">
      <div className="flex">

<Link
      href={Routes.home}
      // className="ltr:ml-auto rtl:mr-auto inline-flex items-center justify-center text-accent font-semibold transition-colors hover:text-accent-hover focus:text-accent-hover focus:outline-none"
      className="ltr:ml-auto rtl:mr-auto  inline-flex items-center text-base font-normal text-accent underline hover:text-accent-hover hover:no-underline sm:order-2"
    >
      {t('text-back-to-home')}
    </Link>
  </div>
        <h1 className="mb-5 text-lg font-semibold text-heading sm:mb-8 sm:text-xl">
          {t('change-password')}
        </h1>
        <ChangePasswordForm />
      </Card>
    </>
  );
};
ChangePasswordPage.authenticationRequired = true;

ChangePasswordPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default ChangePasswordPage;
