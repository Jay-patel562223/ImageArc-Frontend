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



export function useCheckoutPay() {
  return useMutation(client.users.checkoutPay);

}

export function useRazorPayCheckoutPay() {
  return useMutation(client.users.razorPayCheckoutPay);

}