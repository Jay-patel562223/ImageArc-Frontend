//@ts-nocheck
/* eslint-disable @next/next/no-img-element */
import Button from '@/components/ui/button';
import Card from '@/components/ui/cards/card';
import FileInput from '@/components/ui/forms/file-input';
import Input from '@/components/ui/forms/input';
import Label from '@/components/ui/forms/label';
import TextArea from '@/components/ui/forms/text-area';
import { useTranslation } from 'next-i18next';
import pick from 'lodash/pick';
import { Form } from '@/components/ui/forms/form';
import { useUpdateUser } from '@/framework/user';
import type { UpdateUserInput, User } from '@/types';
import PhoneInput from '@/components/ui/forms/phone-input';
import { useForm } from 'react-hook-form';
import Alert from '../ui/alert';
import Select from '../ui/select/select';
import { useCountrysQuery } from '@/framework/country';
import { API_ENDPOINTS } from '../../framework/rest/client/api-endpoints';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import BackButton from '@/components/ui/back-button';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';

const ProfileForm = ({ user }: { user: User }) => {
  const router = useRouter();

  const { t } = useTranslation('common');
  const { mutate: updateProfile, isLoading,serverError } = useUpdateUser();

  let contact = user?.mobile_no ?? '';
  const [phone, setPhone] = useState<string>(contact);

  const changePhone = (e:any) => {
    setPhone(e);
  }
  function onSubmit(values: UpdateUserInput) {
    if (!user) {
      return false;
    }
    updateProfile({
      id: user._id,
      image:values?.image,
      first_name:values?.first_name,
      last_name:values?.last_name,
      email:values?.email,
      mobile_no:phone,
      country:JSON.stringify(countryData),
      state:JSON.stringify(newStateData),
      // name: values.name,
      // profile: {
      //   id: user?.profile?.id,
      //   bio: values?.profile?.bio ?? '',
      //   //@ts-ignore
      //   avatar: values?.profile?.avatar?.[0],
      // },
    });
  }


  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateUserInput>({
    defaultValues: {
      ...(user &&
        pick(user, [
          // 'image',
          'first_name',
          'last_name',
          'email',
          'mobile_no',
          'country',
          'state',
        ])),
        // pick(me, ['name', 'profile.bio', 'profile.contact', 'profile.avatar'])),
    },
  });


  const { countries, paginatorInfo,  error } = useCountrysQuery({
    limit: 10000,
  });

  const { query, locale } = useRouter();
   

  const [stateData, setStateData] = useState<array | null>([]);
  // const [stateData, setStateData] = useState<array | null>([user?.state]);
  const [countryData, setCountryData] = useState<object | null>(user?.country);
  const [newStateData, setNewStateData] = useState<object | null>(user?.state);

  const [photo, setPhoto] = useState(user?.image);


  const changeValue = async (e: any) => {
    setCountryData(e);
    setNewStateData([]);

   await fetch(process.env.NEXT_PUBLIC_REST_API_ENDPOINT+''+API_ENDPOINTS.COUNTRY_STATE+'/'+e?._id).then( async(res)=>{
     const data = await res.json();
     setStateData(data?.data);
    }).catch((err)=>{

    });
  
  }

  useEffect(async()=>{
    await fetch(process.env.NEXT_PUBLIC_REST_API_ENDPOINT+''+API_ENDPOINTS.COUNTRY_STATE+'/'+user?.country?._id).then( async(res)=>{
      const data = await res.json();
      setStateData(data?.data);
     }).catch((err)=>{
 
     });
  },[])

  const changeState = (e: any) => {
    setNewStateData(e);
  }


  return (
    // <Form<UpdateUserInput>
    //   onSubmit={onSubmit}
    //   useFormProps={{
    //     ...(user && {
    //       defaultValues: pick(user, [
    //         'first_name',
    //         'last_name',
    //         'email',
    //         'mobile_no',
    //         'country',
    //         'state',
    //       ]),
    //     }),
    //   }}
    // >
                
    <form onSubmit={handleSubmit(onSubmit)}>
       {/* {({ register, control, formState: { errors } }) => ( */}
      {/* // {({ register, control }) => ( */}
        <>
       
          <div className="mb-8 flex">
         
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
              {serverError != null ?
                <Alert className="mb-4" variant={serverError ? 'errorOutline' : 'info'} message={serverError ?? ''} />
                :''
              }
         
              {/* <div className="mb-8">
                <FileInput control={control} name="profile.avatar" />
              </div> */}

              <div className="mb-6 flex flex-row">
                {/* <Input
                  className="flex-1"
                  label={t('text-name')}
                  {...register('name')}
                  variant="outline"
                /> */}
              </div>

              <Label>Image</Label>
          <Input
           type="file"  
          // label={t('text-image')}
          {...register('image')}
          // variant="inline"
          className="mb-4"
          error={t(errors.image?.message!)}
          // error={t(errors?.first_name?.message!)}
        />

          {photo ?
              <img src={photo} alt="" height="100px" width="100px" className="mb-4"/>
             : "" 
            }

          <Input
          label={t('text-first-name')}
          {...register('first_name')}
          variant="outline"
          className="mb-4"
          error={t(errors.first_name?.message!)}
          // error={t(errors?.first_name?.message!)}
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
          readOnly
          style={{background:'lightgrey'}}
        />
        <Label>Mobile number</Label>
        <PhoneInput
          country="us"
          value={contact}
          // {...register('mobile_no')}
          label={t('text-country_name')}
          variant="outline"
          className="mb-4"
          error={t(errors?.mobile_no?.message!)}
          // disabled={true}
          inputClass="!p-0 ltr:!pr-4 rtl:!pl-4 ltr:!pl-14 rtl:!pr-14 !flex !items-center !w-full !appearance-none !transition !duration-300 !ease-in-out !text-heading !text-sm focus:!outline-none focus:!ring-0 !border !border-border-base !rounded focus:!border-accent !h-12"
          // dropdownClass="focus:!ring-0 !border !border-border-base !shadow-350"
          onChange={changePhone}
        />
        {/* <Input
          label={t('text-mobile')}
          {...register('mobile_no')}
          variant="outline"
          className="mb-4"
          error={t(errors?.mobile_no?.message!)}
        /> */}
          <Label>Country</Label>
              <Select
                name='country'
                getOptionLabel={(option: any) => option?.country}
                getOptionValue={(option: any) => option?.country}
                isMulti={false}
                options={countries}
                // options={countries}
                onChange={changeValue}
                className="mb-4"
                value={[user?.country]}
                // defaultValue={[user?.country]}
              />
              <Label>State</Label>
              <Select
                name='state'
                getOptionLabel={(option: any) => option?.states}
                getOptionValue={(option: any) => option?.states}
                isMulti={false}
                options={stateData}
                className="mb-4"
                onChange={changeState}
                defaultValue={[user?.state]}
                // onChange={changeValue}
                value={newStateData}
              />
         {/* <Input
          label={t('text-country_name')}
          {...register('country')}
          variant="outline"
          className="mb-4"
          error={t(errors?.country?.message!)}
        />
         <Input
          label={t('text-state_name')}
          {...register('state')}
          variant="outline"
          className="mb-4"
          error={t(errors?.state?.message!)}
        /> */}

              {/* <TextArea
                label={t('text-bio')}
                //@ts-ignore
                {...register('profile.bio')}
                variant="outline"
                className="mb-6"
              /> */}

              <div className="flex">
              
              {/* <BackButton/> */}
                {/* <a
                  className="ltr:ml-auto rtl:mr-auto inline-flex items-center justify-center text-accent font-semibold transition-colors hover:text-accent-hover focus:text-accent-hover focus:outline-none"
                  onClick={router.back}
                >
                  
                  {t('text-back')}
                </a> */}
                
                <Button
                  className="ltr:ml-auto rtl:mr-auto"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {t('text-save')}
                </Button>
              </div>
            </Card>
          </div>
        </>
      {/* )} */}
    {/* </Form> */}
    </form>
  );
};

export default ProfileForm;
