        //@ts-nocheck
import { useRouter } from 'next/router';
import Logo from '@/components/ui/logo';
import Input from '@/components/ui/forms/input';
import Label from '@/components/ui/forms/label';
import PasswordInput from '@/components/ui/forms/password-input';
import Button from '@/components/ui/button';
import { useTranslation } from 'next-i18next';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { Form } from '@/components/ui/forms/form';
import type { RegisterUserInput } from '@/types';
import * as yup from 'yup';
import { useRegister } from '@/framework/user';
import { Regex } from '@/framework/utils/regex';
import Alert from '../ui/alert';
import Select from '../ui/select/select';
import { useCountrysQuery } from '@/framework/country';
import { API_ENDPOINTS } from '../../framework/rest/client/api-endpoints';
import { useState } from 'react';
import PhoneInput from '@/components/ui/forms/phone-input';

// const phoneRegExp = Regex.phoneRegExp;
// const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const registerFormSchema = yup.object().shape({
  // image: yup.mixed().required('image-required'),
  first_name: yup.string().required('error-first_name-required'),
  last_name: yup.string().required('error-last_name-required'),
  email: yup
    .string()
    .email('error-email-format')
    .required('error-email-required'),
  password: yup.string().matches(
    Regex.password,
    "Password Must Contain 8 Characters, 1 Uppercase, 1 Lowercase, 1 Number and 1 Special Character"
  ).required(),
  // mobile_no: yup.string().required('error-mobile-required'),
  // mobile_no: yup.string().required('error-mobile-required').matches(Regex.phoneRegExp, 'error-mobile-not-valid-required'),
});

function RegisterForm() {
  const { t } = useTranslation('common');
  const { openModal } = useModalAction();
  // const { mutate, isLoading, formError } = useRegister();


  const { countries, paginatorInfo,  error } = useCountrysQuery({
    limit: 10000,
  });

  const { query, locale } = useRouter();
   

  const [stateData, setStateData] = useState([]);
  // const [stateData, setStateData] = useState<array | null>([user?.state]);
  const [countryData, setCountryData] = useState<object | null>();
  const [newStateData, setNewStateData] = useState<object | null>();
  const [phone, setPhone] = useState<string>('');
      

  const changeValue = async (e: any) => {
    setCountryData(e);
    setNewStateData([]);

   await fetch(process.env.NEXT_PUBLIC_REST_API_ENDPOINT+''+API_ENDPOINTS.COUNTRY_STATE+'/'+e?._id).then( async(res)=>{
     const data = await res.json();
     setStateData(data?.data);
    }).catch((err)=>{

    });
  
  }

  const changeState = (e: any) => {
    setNewStateData(e);
  }

  const { mutate, isLoading, serverError, setServerError } = useRegister();


  function onSubmit(values: RegisterUserInput) {
  // function onSubmit({ image,first_name,last_name,mobile_no,email,password }: RegisterUserInput) {

   mutate({
      image:values?.image,
      first_name:values?.first_name,
      last_name:values?.last_name,
      mobile_no:phone,
      country:JSON.stringify(countryData),
      state:JSON.stringify(newStateData),
      email:values?.email,
      password:values?.password
    });
  }

  const changePhone = (e:any) => {
    setPhone(e);
  }




  return (
    <>
    <Alert
        variant="error"
        message={serverError && t(serverError)}
        className="mb-6"
        closeable={true}
        onClose={() => setServerError(null)}
      />
      <Form<RegisterUserInput>
        onSubmit={onSubmit}
        validationSchema={registerFormSchema}
        // serverError={formError}
      >
        {({ register, formState: { errors } }) => (
          <>
          {/* <Alert className="mb-4" variant={formError ? 'errorOutline' : 'info'} message={formError ?? ''} /> */}
          <Label>Image</Label>
          <Input
           type="file"  
          {...register('image')}
          className="mb-4"
          error={t(errors.image?.message!)}
        />

          <Input
          label={t('text-first-name')}
          {...register('first_name')}
          variant="outline"
          className="mb-4"
          error={t(errors.first_name?.message!)}
        />
         <Input
          label={t('text-last-name')}
          {...register('last_name')}
          variant="outline"
          className="mb-4"
          error={t(errors?.last_name?.message!)}
        />
        <Input
          label={t('text-email')}
          {...register('email')}
          type="email"
          variant="outline"
          className="mb-4"
          error={t(errors?.email?.message!)}
        />
        <PasswordInput
          label={t('text-password')}
          {...register('password')}
          error={t(errors?.password?.message!)}
          variant="outline"
          className="mb-4"
        />
        {/* <Input
          label={t('text-mobile')}
          {...register('mobile_no')}
          variant="outline"
          className="mb-4"
          error={t(errors?.mobile_no?.message!)}
        /> */}
        <Label>Mobile number</Label>
         <PhoneInput
          country="us"
          // value={contact}
          // {...register('mobile_no')}
          // label={t('text-country_name')}
          variant="outline"
          className="mb-4"
          error={t(errors?.mobile_no?.message!)}
          // disabled={true}
          inputClass="!p-0 ltr:!pr-4 rtl:!pl-4 ltr:!pl-14 rtl:!pr-14 !flex !items-center !w-full !appearance-none !transition !duration-300 !ease-in-out !text-heading !text-sm focus:!outline-none focus:!ring-0 !border !border-border-base !rounded focus:!border-accent !h-12"
          // dropdownClass="focus:!ring-0 !border !border-border-base !shadow-350"
          onChange={changePhone}
        />
         <Label>Country</Label>
              <Select
              // {...register('country')}
                getOptionLabel={(option: any) => option?.country}
                getOptionValue={(option: any) => option?.country}
                isMulti={false}
                options={countries}
                onChange={changeValue}
                className="mb-4"
              />
                <Label>State</Label>
              <Select
              // {...register('state')}
                getOptionLabel={(option: any) => option?.states}
                getOptionValue={(option: any) => option?.states}
                isMulti={false}
                options={stateData}
                className="mb-4"
                onChange={changeState}
                // isClearable={true}
                value={newStateData}
              />
       
            <div className="mt-8">
              <Button
                className="h-12 w-full"
                loading={isLoading}
                disabled={isLoading}
              >
                {t('text-register')}
              </Button>
            </div>
          </>
        )}
      </Form>
      {/* End of forgot register form */}

      <div className="relative mt-8 mb-6 flex flex-col items-center justify-center text-sm text-heading sm:mt-11 sm:mb-8">
        <hr className="w-full" />
        <span className="absolute -top-2.5 bg-light px-2 ltr:left-2/4 ltr:-ml-4 rtl:right-2/4 rtl:-mr-4">
          {t('text-or')}
        </span>
      </div>
      <div className="text-center text-sm text-body sm:text-base">
        {t('text-already-account')}{' '}
        <button
          onClick={() => openModal('LOGIN_VIEW')}
          className="font-semibold text-accent underline transition-colors duration-200 hover:text-accent-hover hover:no-underline focus:text-accent-hover focus:no-underline focus:outline-none ltr:ml-1 rtl:mr-1"
        >
          {t('text-login')}
        </button>
      </div>
    </>
  );
}
export default function RegisterView() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { closeModal } = useModalAction();
  function handleNavigate(path: string) {
    router.push(`/${path}`);
    closeModal();
  }

  return (
    <div className="flex h-full min-h-screen w-screen flex-col justify-center bg-light py-6 px-5 sm:p-8 md:h-auto md:min-h-0 md:max-w-[480px] md:rounded-xl">
      <div className="flex justify-center">
        <Logo />
      </div>
      <p className="mt-4 mb-7 px-2 text-center text-sm leading-relaxed text-body sm:mt-5 sm:mb-10 sm:px-0 md:text-base">
        {t('registration-helper')}
        <span
          onClick={() => handleNavigate('terms')}
          className="mx-1 cursor-pointer text-accent underline hover:no-underline"
        >
          {t('text-terms')}
        </span>
        &
        <span
          onClick={() => handleNavigate('privacy')}
          className="cursor-pointer text-accent underline hover:no-underline ltr:ml-1 rtl:mr-1"
        >
          {t('text-policy')}
        </span>
      </p>
      <RegisterForm />
    </div>
  );
}
