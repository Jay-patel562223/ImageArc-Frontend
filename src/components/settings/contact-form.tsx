import type { CreateContactUsInput } from '@/types';
import Button from '@/components/ui/button';
import { Form } from '@/components/ui/forms/form';
import Input from '@/components/ui/forms/input';
import TextArea from '@/components/ui/forms/text-area';
import { useContact } from '@/framework/user';
import { useTranslation } from 'next-i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

const contactFormSchema = yup.object().shape({
  name: yup.string().required('error-name-required').trim(),
  email: yup
    .string()
    .email('error-email-format')
    .required('error-email-required').trim(),
  subject: yup.string().required('error-subject-required').trim(),
  description: yup.string().required('error-description-required').trim(),
});
const ContactForm = () => {
  const { t } = useTranslation('common');
  const { mutate, isLoading } = useContact();

  interface FormValues {
    name: string;
    email: string;
    subject: string;
    description: string;
  }

  const {
    register,
    handleSubmit,
    setError,
    reset,

    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(contactFormSchema),
  });

  function onSubmit(values: CreateContactUsInput) {
    mutate(values);
    reset();
  }

  return (

    // <Form<CreateContactUsInput>
    //   onSubmit={onSubmit}
    //   validationSchema={contactFormSchema}
    // >
    //   {({ register, formState: { errors } }) => (
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label={t('text-name')}
              {...register('name')}
              variant="outline"
              error={t(errors.name?.message!)}
            />
            <Input
              label={t('text-email')}
              {...register('email')}
              type="email"
              variant="outline"
              error={t(errors.email?.message!)}
            />
          </div>
          <Input
            label={t('text-subject')}
            {...register('subject')}
            variant="outline"
            className="my-6"
            error={t(errors.subject?.message!)}
          />
          <TextArea
            label={t('text-description')}
            {...register('description')}
            variant="outline"
            className="my-6"
            error={t(errors.description?.message!)}
          />

          <Button loading={isLoading} disabled={isLoading}>
            {t('text-submit')}
          </Button>
        </>
      </form>
      // )}
    // {/* </Form> */}
  );
};

export default ContactForm;
