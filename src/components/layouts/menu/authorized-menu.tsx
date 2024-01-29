import { Fragment, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { siteSettings } from '@/config/site';
import Avatar from '@/components/ui/avatar';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import { avatarPlaceholder } from '@/lib/placeholders';
import { UserOutlinedIcon } from '@/components/icons/user-outlined';
import { useLogout, useUser } from '@/framework/user';
import { Routes } from '@/config/routes';
import { useToken } from '@/lib/hooks/use-token';
import { API_ENDPOINTS } from '../../../framework/rest/client/api-endpoints';
import Cookies from 'js-cookie';

const AuthorizedMenu: React.FC<{ minimal?: boolean }> = ({ minimal }) => {
  const { mutate: logout } = useLogout();
  const { me } = useUser();
  const router = useRouter();
  const { setToken } = useToken();
  const { t } = useTranslation('common');

  function handleClick(path: string) {
    router.push(path);
  }

  const activeTab = (tab: any) => {
    return router.asPath == tab ? 'text-accent' : ''
  }

  // const clear = () =>{
  //   Cookies.remove('auth_token')
  // }

  const handlelogout = () => {
    router.replace('/')
  };

  return (
    <Menu
      as="div"
      className="relative inline-block ltr:text-left rtl:text-right"
    >
      <Menu.Button className="flex items-center focus:outline-none">
        {minimal ? (
          <UserOutlinedIcon className="h-5 w-5" />
        ) :
          <Avatar
            src={me?.image ?? avatarPlaceholder}
            title="user name"
            className="h-10 w-10"
          />
          // <img
          // alt={alt} src={src}
          // style={{height: '100%',width: '100%'}}
          // />
        }
        <span className="sr-only">{t('user-avatar')}</span>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          as="ul"
          className={cn(
            'absolute mt-1 w-48 rounded bg-white pb-4 shadow-700 focus:outline-none ltr:right-0 ltr:origin-top-right rtl:left-0 rtl:origin-top-left',
            {
              '!mt-2': minimal,
            }
          )}
        >
          <Menu.Item key={me?.email}>
            <li
              className="flex w-full flex-col space-y-1 rounded-t
             bg-[#2FB6CC] px-4 py-3 text-sm text-white"
            //  bg-[#00b791] px-4 py-3 text-sm text-white"
            >
              <span className="font-semibold capitalize">{me?.first_name + ' ' + me?.last_name}</span>
              {/* <span className="font-semibold capitalize">{data?.name}</span> */}
              <span className="text-xs" style={{
                textOverflow: 'ellipsis',
                wordWrap: 'inherit',
                overflow: 'hidden',
              }}>{me?.email}</span>
            </li>
          </Menu.Item>
          {/* <Menu.Item>
            <li className="flex w-full items-center justify-between bg-accent-500 px-6 py-4 text-xs font-semibold capitalize text-light focus:outline-none ltr:text-left rtl:text-right">
              <span>{t('text-points')}</span>
              <span>{me?.wallet?.available_points ?? 0}</span>
            </li> 
          </Menu.Item>*/}
          {siteSettings.authorizedLinks.map(({ href, label }) => (
            <Menu.Item key={`${href}${label}`}>
              {({ active }) => (
                <li>
                  <button
                    onClick={() => handleClick(href)}
                    className={cn(
                      'block w-full py-2.5 px-6 text-sm font-semibold capitalize text-heading transition duration-200 hover:text-accent focus:outline-none ltr:text-left rtl:text-right',
                      // active ? 'text-accent' : 'text-heading',
                      activeTab(href),
                      'mt-2'
                    )}
                  >
                    {t(label)}
                  </button>
                </li>
              )}
            </Menu.Item>
          ))}
          <Menu.Item>
            <li>
              <span
                onClick={() => logout()}
              // onClick={() => handlelogout()}
              className={cn(
                'cursor-pointer block w-full py-2.5 px-6 text-sm font-semibold capitalize text-heading transition duration-200 hover:text-accent focus:outline-none ltr:text-left rtl:text-right'
              )}
              >
                 {t('auth-menu-logout')}
              </span>
            </li>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default AuthorizedMenu;
