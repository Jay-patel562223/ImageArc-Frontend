import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import cn from 'classnames';

const headerLinks = [
  { href: Routes.categories, icon: null, label: 'nav-menu-categories' },
  // { href: Routes.coupons, icon: null, label: 'nav-menu-offer' },
  // { href: Routes.help, label: 'nav-menu-faq' },
  { href: Routes.subscriptionsListForPurchase, label: 'nav-menu-subscription' },
  { href: Routes.contactUs, label: 'nav-menu-contact' },
];

const StaticMenu = () => {
  const router = useRouter();
  const { t } = useTranslation('common');

  return (
    <>
      {headerLinks.map(({ href, label, icon }) => 
      {
        const active = router.pathname == href
        return (
        <li key={`${href}${label}`}>
          <Link
            href={href}
            className={cn(
              'flex items-center font-normal text-heading no-underline transition duration-200 hover:text-accent focus:text-accent',
              active ? 'text-accent' : 'text-heading',
              'mt-2'
            )}
            // className="flex items-center font-normal text-heading no-underline transition duration-200 hover:text-accent focus:text-accent"
            // style={{...active}}
          >
            {icon && <span className="ltr:mr-2 rtl:ml-2">{icon}</span>}
            {t(label)}
          </Link>
        </li>
        )
      })}
    </>
  );
};

export default StaticMenu;
