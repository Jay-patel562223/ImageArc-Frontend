import Button from '@/components/ui/button';
import PasswordInput from '@/components/ui/forms/password-input';
import type { ChangePasswordUserInput } from '@/types';
import { useTranslation } from 'next-i18next';
import { Form } from '@/components/ui/forms/form';
import { useChangePassword } from '@/framework/user';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { Regex } from '@/framework/utils/regex';


export const changePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required('error-old-password-required'),
  newPassword: yup.string().matches(
    Regex.password,
    "Password Must Contain 8 Characters, 1 Uppercase, 1 Lowercase, 1 Number and 1 Special Character"
  ).required(),
  // newPassword: yup.string().required('error-new-password-required'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'error-match-passwords')
    .required('error-confirm-password'),
});

export default function ChangePasswordForm() {
  const { t } = useTranslation('common');
  const {
    mutate: changePassword,
    isLoading: loading,
    // formError,
  } = useChangePassword();


interface FormValues {
  oldPassword: string;
  newPassword: string;
  passwordConfirmation: string;
}

  const {
    register,
    handleSubmit,
    setError,
    reset,

    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(changePasswordSchema),
  });

  
  function onSubmit(values: FormValues) {
  // function onSubmit({ newPassword, oldPassword }: ChangePasswordUserInput) {
    // changePassword({
    //   oldPassword,
    //   newPassword,
    // });
    changePassword(
      {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      },
      {
        onError: (error: any) => {
          // setError('oldPassword', {
          //   type: 'manual',
          //   message: error?.response?.data?.message,
          // });
          toast.error(error?.response?.data?.message);
          // Object.keys(error?.response?.data).forEach((field: any) => {
          //   setError(field, {
          //     type: 'manual',
          //     message: error?.response?.data[field][0],
          //   });
          // });
        },
        onSuccess: (data) => {

          if (!data?.status) {
            toast.error(data?.message);

            // setError('oldPassword', {
            //   type: 'manual',
            //   message: data?.message ?? '',
            // });
          } else if (data?.status) {
            toast.success(t('password-successful'));
            reset();
          }
        },
      }
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
    {/* <Form<ChangePasswordUserInput & { passwordConfirmation: string }>
      onSubmit={onSubmit}
      validationSchema={changePasswordSchema}
      className="flex flex-col"
      serverError={formError}
    >
      {({ register, formState: { errors } }) => ( */}
        <>
        
          <PasswordInput
            label={t('text-old-password')}
            {...register('oldPassword')}
            error={t(errors.oldPassword?.message!)}
            className="mb-5"
            variant="outline"
          />
          <PasswordInput
            label={t('text-new-password')}
            {...register('newPassword')}
            error={t(errors.newPassword?.message!)}
            className="mb-5"
            variant="outline"
          />
          <PasswordInput
            label={t('text-confirm-password')}
            {...register('passwordConfirmation')}
            error={t(errors.passwordConfirmation?.message!)}
            className="mb-5"
            variant="outline"
          />
              <div className="flex">

          <Button
            loading={loading}
            disabled={loading}
            className="ltr:ml-auto rtl:mr-auto"
          >
            {t('text-submit')}
          </Button>
          </div>
        </>
      {/* )} */}
    {/* </Form> */}
    </form>
  );
}
