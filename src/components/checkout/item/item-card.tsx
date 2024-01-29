import usePrice from '@/lib/use-price';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
interface Props {
  item: any;
  notAvailable?: boolean;
}

const ItemCard = ({ item, notAvailable }: Props) => {


  const { t } = useTranslation('common');
  const { price } = usePrice({
    amount: Number(item.price),
    // amount: item.itemTotal,
  });
  return (
    <div className="flex justify-between py-2">
      <img src={item.image} alt="" style={{height:'40px'}}/>&nbsp;
      <div className="flex items-center justify-between text-base" style={{width: '100%'}}>

        <span
          className={cn('text-sm', notAvailable ? 'text-red-500' : 'text-body')}
        >
          {/* <span
            className={cn(
              'text-sm font-bold',
              notAvailable ? 'text-red-500' : 'text-heading'
            )}
          >
            {item.quantity}
          </span>
          <span className="mx-2">x</span> */}
           <span>{item.name}</span> | <span>{item?.purchaseFileType?.toUpperCase()} | <span>{item?.purchaseDPI} DPI</span></span>
          {/* <span>{item.name}</span> | <span>{item.unit}</span> */}
        </span>
      </div>
      <span
        className={cn('text-sm', notAvailable ? 'text-red-500' : 'text-body')}
      >
        {!notAvailable ? price : t('text-unavailable')}
      </span>
    </div>
  );
};

export default ItemCard;
