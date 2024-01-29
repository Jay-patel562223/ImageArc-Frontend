// @ts-nocheck
import { useModalAction } from '@/components/ui/modal/modal.context';
import type { Review, ReviewPaginator, ReviewQueryOptions } from '@/types';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import { mapPaginatorData } from './utils/data-mappers';

export function useReviews(options?: Partial<ReviewQueryOptions>) {
  const {
    data: response,
    isLoading,
    error,
    isFetching,
  } = useQuery<ReviewPaginator, Error>(
    [API_ENDPOINTS.PRODUCTS_REVIEWS, options],
    ({ queryKey }) =>
      client.reviews.all(Object.assign({}, queryKey[1] as ReviewQueryOptions)),
    {
      keepPreviousData: true,
    }
  );
  return {
    reviews: response?.data ?? [],
    paginatorInfo: mapPaginatorData(response),
    isLoading,
    error,
    isFetching,
    hasMore: response && response?.last_page > response?.current_page,
  };
}

export function useReview({ id }: { id: string }) {
  const { data, isLoading, error } = useQuery<Review, Error>(
    [API_ENDPOINTS.PRODUCTS_REVIEWS, id],
    () => client.reviews.get({ id }),
    {
      enabled: Boolean(id),
    }
  );
  return {
    review: data,
    isLoading,
    error,
  };
}

export function useCreateReview() {
  const { t } = useTranslation('common');
  const { closeModal } = useModalAction();
  const queryClient = useQueryClient();
  const [error, setError] = useState(false);

  const { mutate: createReview, isLoading } = useMutation(
    client.reviews.create,
    {
      onSuccess: (res) => {
        toast.success(t('text-review-request-submitted'));
        closeModal();

      },
      onError: (err) => {
        setError(err?.response?.data?.message);
      },
      onSettled: () => {
        queryClient.invalidateQueries([API_ENDPOINTS.ORDERS]);
        // closeModal();
      },
    }
  );
  return {
    createReview,
    isLoading,
    error
  };
}

export function useUpdateReview() {
  const { t } = useTranslation('common');
  const { closeModal } = useModalAction();
  const queryClient = useQueryClient();
  const [error, setError] = useState(false);

  const { mutate: updateReview, isLoading } = useMutation(
    client.reviews.update,
    {
      onSuccess: (res) => {
        toast.success(t('text-review-request-update-submitted'));
        closeModal();
      },
      onError: (err) => {
        setError(err?.response?.data?.message);
      },
      onSettled: () => {
        queryClient.invalidateQueries([API_ENDPOINTS.ORDERS]);
      },
    }
  );
  return {
    updateReview,
    isLoading,
    error
  };
}
