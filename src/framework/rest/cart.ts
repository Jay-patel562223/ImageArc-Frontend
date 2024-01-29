// @ts-nocheck
import { useModalAction } from '@/components/ui/modal/modal.context';
import { useTranslation } from 'next-i18next';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import { toast } from 'react-toastify';
import client from './client';
import { authorizationAtom } from '@/store/authorization-atom';
import { useAtom } from 'jotai';
import { signOut as socialLoginSignOut } from 'next-auth/react';
import { useToken } from '@/lib/hooks/use-token';
import { API_ENDPOINTS } from './client/api-endpoints';
import { useState } from 'react';
import type {
  RegisterUserInput,
  ChangePasswordUserInput,
  OtpLoginInputType,
} from '@/types';
import { initialOtpState, optAtom } from '@/components/otp/atom';
import { useStateMachine } from 'little-state-machine';
import {
  initialState,
  updateFormState,
} from '@/components/auth/forgot-password';
import { clearCheckoutAtom } from '@/store/checkout';
import { useRouter } from 'next/router';
import { Routes } from '@/config/routes';
import Cookies from 'js-cookie';
import { AUTH_TOKEN_KEY } from '@/lib/constants';
import Router from 'next/router';
import {  useUser } from '@/framework/user';

// const [state, dispatch] = React.useReducer(
//   cartReducer,
//   savedCart ? JSON.parse(savedCart) : initialState
// );

export function useCartDB() {
  // const { locale } = useRouter();
  const { me } = useUser();
  if(me != undefined){

  const formattedOptions = {
    // ...options,
    // language: locale,
  };

  const { data, isLoading, error } = useQuery(
    [process.env.NEXT_PUBLIC_REST_API_ENDPOINT+'/user/cart', formattedOptions],
    ({ queryKey }) =>
    client.users.GetCart()
  );

  return {
    //@ts-ignore
    data: data?.data ?? [],
    isLoading,
    error,
  };
} else {
  return {
    //@ts-ignore
    data: [],
  };
}

  // const { locale } = useRouter();

  // const formattedOptions = {
  //   language: locale,
  // };

  // const { data, isLoading, error } = useQuery<Product[], Error>(
  //   [API_ENDPOINTS.CART, formattedOptions],
  //   ({ queryKey }) =>
  //     client.users.GetCart(queryKey[1])
  // );

  // return {
  //   cartData: data?.data ?? [],
  //   isLoading,
  //   error,
  // };

  // const data = fetch(process.env.NEXT_PUBLIC_REST_API_ENDPOINT+'/user/cart').then((res)=>{
  //   console.log('res: ',res);
  // }).catch((err)=>{
  //   console.log('err: ',err);
  // });


}

export function useAddToCartDB() {
  const { t } = useTranslation('common');
  const { setToken } = useToken();
  // const [_, setAuthorized] = useAtom(authorizationAtom);
  const { closeModal } = useModalAction();
 

  let [serverError, setServerError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(client.users.CartStore, {
    onSuccess: (data) => {
      if (!data.token) {
        // toast.error('error-credential-wrong');
        // setServerError('error-credential-wrong');
        return;
      }
      // setToken(data.token);
      // setAuthorized(true);
      // closeModal();
      //   toast.success('Register successfully');
        return;
    },
    onError: (error: Error) => {
      setServerError(error?.response?.data?.message);

      // toast.error(error?.response?.data?.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries(process.env.NEXT_PUBLIC_REST_API_ENDPOINT+'/user/cart');
    },
  });

  return { mutate, isLoading, serverError, setServerError };

  // return { mutate, isLoading, formError, setFormError };
}

export function useRemoveCartDB() {
  // const { locale: language } = useRouter();
  // const { data, isLoading, error } = useQuery<Product, Error>(
  //   [API_ENDPOINTS.CART, { slug, language }],
  //   () => client.users.RemoveCart({ slug, language })
  // );
  // return {
  //   product: data,
  //   isLoading,
  //   error,
  // };

  // const { closeModal } = useModalAction();
  const queryClient = useQueryClient();
  return useMutation(client.users.RemoveCart, {
    onSuccess: (data) => {
      if (data) {
        // toast.success('successfully-address-deleted');
        // closeModal();
        return;
      }
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};

      toast.error(data?.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries(process.env.NEXT_PUBLIC_REST_API_ENDPOINT+'/user/cart');
    },
  });
}

