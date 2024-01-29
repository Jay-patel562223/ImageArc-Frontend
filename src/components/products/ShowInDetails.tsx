import Spinner from '@/components/ui/loaders/spinner/spinner';
import { useTranslation } from 'next-i18next';
import Details from '../../components/products/details/details';

interface ShowInDetails {
    product: string;
}
const ShowInDetails = ({product,isLoading}:any) => {
  
    const { t } = useTranslation('common');

  let productItem:any = product;
  productItem = productItem?.data


  if (isLoading || !product)
    return (
      <div className="relative flex items-center justify-center w-96 h-96 bg-light">
        <Spinner text={t('common:text-loading')} />
      </div>
    );

    

    return <Details product={productItem} backBtn={false} isModal={true} />;

};

export default ShowInDetails;
