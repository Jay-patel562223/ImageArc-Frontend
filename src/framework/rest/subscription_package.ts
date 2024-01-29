// @ts-nocheck
import type {
  PopularProductQueryOptions,
  Product,
  ProductPaginator,
  ProductQueryOptions,
  QuestionPaginator,
  QuestionQueryOptions,
  GetParams,
  ProductPackage,
  CreateSubInput,
  OrderQueryOptions,
  OrderPaginator,
} from '@/types';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import { mapPaginatorData } from '@/framework/utils/data-mappers';
import { formatProductsArgs } from '@/framework/utils/format-products-args';
import { useTranslation } from 'next-i18next';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { Routes } from '@/config/routes';


export function useSubPackages() {
// export function useProduct({ slug }: { slug: string }) {
  const { locale: language } = useRouter();
  const { data, isLoading, error } = useQuery<Product, Error>(
    [API_ENDPOINTS.SUBSCRIPTIONPACKAGE],
    () => client.products.SUBSCRIPTIONPACKAGE()
  );
  return {
    packages: data?.data ?? [],
    isLoading,
    error,
  };
}

// console.log("data+_+_+_+_+_",data);

export function useGetPackageData(id: unknown) {
  const { data, isLoading, error } = useQuery<ProductPackage, Error>(
    [API_ENDPOINTS.SUBSCRIPTIONPACKAGE, id],
    () => client.products.SUBSCRIPTIONPACKAGEID(id)
  );

  return {
    packagesDetails: data?.data ?? '',
    isLoading,
    error,
  };
}


export function useGetUserPackageData(id: { id: string }) {
  const { data, isLoading, error } = useQuery<ProductPackage, Error>(
    [API_ENDPOINTS.USERSUBSCRIPTION, id],
    () => client.products.USERSUBSCRIPTIONID(id)
  );

  return {
    packagesDetails: data?.data ?? '',
    isLoading,
    error,
  };
}

// export function useGetUserAllPackageData() {
//   const { data, isLoading, error } = useQuery<ProductPackage, Error>(
//     [API_ENDPOINTS.USERALLSUBSCRIPTION],
//     () => client.products.USERALLSUBSCRIPTION()
//   );

//   return {
//     allPackagesData: data?.data ?? '',
//     isLoading,
//     error,
//   };
// }

export const useDownloadSubscriptionInvoiceMutation = (
  { id, isRTL, language }: { id: string, isRTL: boolean, language: string },
  options: any = {}
) => {
  const { t } = useTranslation();
  const formattedInput = {
    id,
    is_rtl: isRTL,
    language,
    translated_text: {
      subtotal: t('order-sub-total'),
      discount: t('order-discount'),
      tax: t('order-tax'),
      delivery_fee: t('order-delivery-fee'),
      total: t('order-total'),
      products: t('text-products'),
      quantity: t('text-quantity'),
      invoice_no: t('text-invoice-no'),
      date: t('text-date'),
    },
  };

  return useQuery<any, Error>(
    [API_ENDPOINTS?.SUBSCRIPTIONINVOICE],
    () => client.products.SUBSCRIPTIONINVOICE(formattedInput),
    {
      ...options,
    }
  );
};



export function useBasePackages() {
  // export function useProduct({ slug }: { slug: string }) {
    const { locale: language } = useRouter();
    const { data, isLoading, error } = useQuery<Product, Error>(
      [API_ENDPOINTS.BASEPACKAGE],
      () => client.products.BASEPACKAGE()
    );
    return {
      packagesData: data?.data ?? [],
      isLoading,
      error,
    };
  }


export function useSubLogin(slug) {
  // export function useProduct({ slug }: { slug: string }) {
    const { locale: language } = useRouter();
    const { data, isLoading, error } = useQuery<Product, Error>(
      [API_ENDPOINTS.USERSUBSCRIPTIONLOGIN],
      () => client.products.USERSUBSCRIPTIONLOGIN(slug)     
    );
    return {
      packagesData: data?.data ?? [],
      isLoading,
      error,
    };
  }
  


export function useSubscriptions(options?: Partial<OrderQueryOptions>) {
  const { locale } = useRouter();
  
  const formattedOptions = {
    ...options,
    // language: locale
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<OrderPaginator, Error>(
    [API_ENDPOINTS.USERSUBSCRIPTION, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.products.USERSUBSCRIPTION(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    }
  );

  function handleLoadMore() {
    fetchNextPage();
  }

  return {
    orders: data?.pages?.flatMap((page) => page.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? mapPaginatorData(data?.pages[data.pages.length - 1])
      : null,
    isLoading,
    error,
    isFetching,
    isLoadingMore: isFetchingNextPage,
    loadMore: handleLoadMore,
    hasMore: Boolean(hasNextPage),
  };
}


export function useCreateSubscription() {
  const router = useRouter();
  const { locale } = router;

  const { mutate: createSubscriptionPlan, isLoading } = useMutation(client.products.createSubscriptionOrder, {
    onSuccess: (data) => {
      // if (data?.tracking_number) {
      //   router.push(Routes.order(data?.tracking_number));
      // }
      data = data?.data;
      if (data?._id) {
      toast.success("Order placed!");
        router.push(Routes.subscription_view(data?._id));
      }
    },
    onError: (error) => {
      // const {
      //   response: { data },
      // }: any = error ?? {};
      toast.error(error?.response?.data?.message);
    },
  });

  
  
  function formatOrderInput(input: CreateSubInput) {
    const formattedInputs = {
      ...input,
      language: locale
    };
    createSubscriptionPlan(formattedInputs);
  }

  return {
    createSubscriptionPlan: formatOrderInput,
    isLoading,
  };
}

export function useCreateNewSubscription() {
  const router = useRouter();
  const { locale } = router;

  return useMutation(client.products.createSubscriptionOrder);
}

export function useProductExist(slug) {

  const router = useRouter();
  const { locale } = router;

  const { locale: language } = useRouter();
    const { data, isLoading, error } = useQuery<Product, Error>(
      [API_ENDPOINTS.CHECKPRODUCTEXIST],
      () => client.products.productExist(slug)
    );
    return {
      data: data?.data ?? [],
      isLoading,
      error,
    };

  // const  { mutate } = useMutation(client.products.productExist,{
  //     onSuccess: (data) => {
  //       if (data) {
  //         // toast.success('successfully-address-deleted');
  //         // closeModal();
  //         // return;
  //       }
  //     },
  //     onError: (error) => {
  //       const {
  //         response: { data },
  //       }: any = error ?? {};
  
  //       // toast.error(data?.message);
  //     },
  //     onSettled: () => {
  //       // queryClient.invalidateQueries(API_ENDPOINTS.USERS_ME);
  //     },
  // });
  // return 
}


export function usecreateRazorPayOrder() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  const { locale } = router;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMutation(client.products.createRazorPayOrder);
}



// export function useDeletePackageData(id: { id: string }) {
//   return useMutation(client.products.DELETEUSERSUBSCRIPTION(id));

//   // return useQuery<ProductPackage, Error>(
//   //   [API_ENDPOINTS.DELETEUSERSUBSCRIPTION, id],
//   //   () => client.products.DELETEUSERSUBSCRIPTION(id)
//   // );

// }


export const useDeletePackageData = () => {
  const { closeModal } = useModalAction();
  const queryClient = useQueryClient();
  return useMutation(client.products.DELETEUSERSUBSCRIPTION, {
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

      // toast.error(data?.message);
    },
    onSettled: () => {
      // queryClient.invalidateQueries(API_ENDPOINTS.USERS_ME);
    },
  });
};