// @ts-nocheck
import {
  DownloadableFilePaginator,
  Order,
  OrderPaginator,
  OrderQueryOptions,
  OrderStatusPaginator,
  QueryOptions,
  CreateOrderInput,
  CreateRefundInput
} from '@/types';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { API_ENDPOINTS } from './client/api-endpoints';
import client from './client';
import { useAtom } from 'jotai';
import { verifiedResponseAtom } from '@/store/checkout';
import { useRouter } from 'next/router';
import { Routes } from '@/config/routes';
import { mapPaginatorData } from '@/framework/utils/data-mappers';
import { ConsoleView } from 'react-device-detect';
import { useCart } from '@/store/quick-cart/cart.context';

export function useOrders(options?: Partial<OrderQueryOptions>) {
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
    [API_ENDPOINTS.ORDERS, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.orders.all(Object.assign({}, queryKey[1], pageParam)),
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

export function useOrder({ tracking_number }: { tracking_number: string }) {
  const { data, isLoading, error } = useQuery<Order, Error>(
    [API_ENDPOINTS.ORDERS, tracking_number],
    () => client.orders.get(tracking_number)
  );

  return {
    order: data,
    isLoading,
    error,
  };
}


export const useDownloadInvoiceMutation = (
  { order_id, isRTL, language }: { order_id: string, isRTL: boolean, language: string },
  options: any = {}
) => {
  const { t } = useTranslation();
  const formattedInput = {
    order_id,
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
    [API_ENDPOINTS.ORDER_INVOICE_DOWNLOAD],
    () => client.orders.downloadInvoice(formattedInput),
    {
      ...options,
    }
  );
};


export const useDownloadMutation = (
  { name,
    purchaseDPI,
    purchaseFileType,
     isRTL, language }: { name: string,
      purchaseDPI:string,
      purchaseFileType:string,
      isRTL: boolean, language: string },
  options: any = {}
) => {
  const { t } = useTranslation();
  const formattedInput = {
    name,
    purchaseDPI,
    purchaseFileType,
    is_rtl: isRTL,
    language,
    // translated_text: {
    //   subtotal: t('order-sub-total'),
    //   discount: t('order-discount'),
    //   tax: t('order-tax'),
    //   delivery_fee: t('order-delivery-fee'),
    //   total: t('order-total'),
    //   products: t('text-products'),
    //   quantity: t('text-quantity'),
    //   invoice_no: t('text-invoice-no'),
    //   date: t('text-date'),
    // },
  };

  const res = useQuery<any, Error>(
    [API_ENDPOINTS.DOWNLOAD],
    () => client.orders.DOWNLOAD(formattedInput),
    {
      ...options,
    }
  );
  return res;
};


export function useOrderStatuses(options: Pick<QueryOptions, 'limit' | 'language'>) {
  const { locale } = useRouter();
  
  const formattedOptions = {
    ...options,
    // language: locale
  };

  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteQuery<OrderStatusPaginator, Error>(
    [API_ENDPOINTS.ORDERS_STATUS, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.orders.statuses(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    }
  );

  function handleLoadMore() {
    fetchNextPage();
  }

  return {
    orderStatuses: data?.pages?.flatMap((page) => page.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? mapPaginatorData(data?.pages[data.pages.length - 1])
      : null,
    isLoading: isFetching,
    isLoadingMore: isFetchingNextPage,
    error,
    loadMore: handleLoadMore,
    hasMore: Boolean(hasNextPage),
  };
}

export function useRefunds(options: Pick<QueryOptions, 'limit'>) {

  const { locale } = useRouter();
  
  const formattedOptions = {
    ...options,
    // language: locale
  };

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteQuery(
    [API_ENDPOINTS.ORDERS_REFUNDS, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.orders.refunds(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    }
  );

  function handleLoadMore() {
    fetchNextPage();
  }

  return {
    refunds: data?.pages?.flatMap((page) => page.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? mapPaginatorData(data?.pages[data.pages.length - 1])
      : null,
    isLoading,
    isLoadingMore: isFetchingNextPage,
    error,
    loadMore: handleLoadMore,
    hasMore: Boolean(hasNextPage),
  };
}

export const useDownloadableProducts = (
  options: Pick<QueryOptions, 'limit'>
) => {

  const { locale } = useRouter();
  
  const formattedOptions = {
    ...options,
    // language: locale
  };

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteQuery<DownloadableFilePaginator, Error>(
    [API_ENDPOINTS.ORDERS_DOWNLOADS, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.orders.downloadable(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    }
  );

  function handleLoadMore() {
    fetchNextPage();
  }

  return {
    downloads: data?.pages?.flatMap((page) => page.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? mapPaginatorData(data?.pages[data.pages.length - 1])
      : null,
    isLoading,
    isLoadingMore: isFetchingNextPage,
    error,
    loadMore: handleLoadMore,
    hasMore: Boolean(hasNextPage),
  };
};

export function useCreateRefund() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const { closeModal } = useModalAction();
  const queryClient = useQueryClient();
  const { mutate: createRefundRequest, isLoading } = useMutation(
    client.orders.createRefund,
    {
      onSuccess: (data) => {
        toast.success(t('text-refund-request-submitted'));
      },
      onError: (error) => {
        const {
          response: { data },
        }: any = error ?? {};

        toast.error(t(data?.message));
      },
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.ORDERS);
        closeModal();
      },
    }
  );

  function formatRefundInput(input: CreateRefundInput) {
    const formattedInputs = {
      ...input,
      // language: locale
    };
    createRefundRequest(formattedInputs);
  }

  return {
    createRefundRequest: formatRefundInput,
    isLoading,
  };
}

export function useCreateOrder() {
  const router = useRouter();
  const { locale } = router;
  const { removeItemFromCart } = useCart();

  const { mutate: createOrder, isLoading } = useMutation(client.orders.create, {
    onSuccess: (data) => {
      // if (data?.tracking_number) {
      //   router.push(Routes.order(data?.tracking_number));
      // }
      data = data?.data;
        console.log("data", data);
      data?.products.map((res)=>{
         console.log("res", res);
          // setTimeout(()=>{
          //   removeItemFromCart(res?.product_id);
          // },1000)
          removeItemFromCart(res?.product_id);
        })
      if (data?._id) {
      toast.success("Order placed!");
        router.push(Routes.order(data?._id));
      }
      // console.log("sucess", data);
    },
    onError: (error) => {
      // const {
      //   response: { data },
      // }: any = error ?? {};
      toast.error(error?.response?.data?.message);
      // console.log("errr",error?.response?.data?.message)
    },
  });

  function formatOrderInput(input: CreateOrderInput) {
    const formattedInputs = {
      ...input,
      language: locale
    };
    createOrder(formattedInputs);
  }

  return {
    createOrder: formatOrderInput,
    isLoading,
  };
}

export function useGenerateDownloadableUrl() {
  const { mutate: getDownloadableUrl } = useMutation(
    client.orders.generateDownloadLink,
    {
      onSuccess: (data) => {
        function download(fileUrl: string, fileName: string) {
          var a = document.createElement('a');
          a.href = fileUrl;
          a.setAttribute('download', fileName);
          a.click();
        }

        download(data, 'record.name');
      },
    }
  );

  function generateDownloadableUrl(digital_file_id: string) {
    getDownloadableUrl({
      digital_file_id,
    });
  }

  return {
    generateDownloadableUrl,
  };
}

export function useVerifyOrder() {
  const [_, setVerifiedResponse] = useAtom(verifiedResponseAtom);

  return useMutation(client.orders.verify, {
    onSuccess: (data) => {
      if (data) {
        //@ts-ignore
        setVerifiedResponse(data);
      }
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};

      toast.error(data?.message);
    },
  });
}
