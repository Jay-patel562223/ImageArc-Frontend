import CartCheckBagIcon from '@/components/icons/cart-check-bag';
import { formatString } from '@/lib/format-string';
import usePrice from '@/lib/use-price';
import { drawerAtom } from '@/store/drawer-atom';
import { useCart } from '@/store/quick-cart/cart.context';
import { useAtom } from 'jotai';
import { useTranslation } from 'next-i18next';
import { useCartDB } from '@/framework/cart';
import { useUser } from '@/framework/user';
import { useEffect, useState } from 'react';

const CartCounterButton = () => {

  const { t } = useTranslation();
  const [_, setDisplayCart] = useAtom(drawerAtom);
  const { price: totalPrice } = usePrice({
    amount: 0,
    // amount: total,
  });

  // const { data } = useCartDB();

  const { me, isLoading } = useUser();
  let { items: newitems = [], totalUniqueItems, total, getAllItemFromCart } = useCart();
  // const [newTotalUniqueItems,setNewTotalUniqueItems] = useState(totalUniqueItems);

  //   let totalData = getAllItemFromCart();
  //   totalData.then((result:any)=>{
  //     console.log('getAllItemFromCart: ',result);
  //     if(result != undefined){
  //       totalUniqueItems = result.length;
  //       setNewTotalUniqueItems(result.length);
  //     }
  //   });
  const [newItems, setNewItems] = useState<any[]>([]);
  // let setNewItems: Item[] = [];

  let latestData = getAllItemFromCart() || [];
  useEffect(() => {
    latestData.then((res: any) => {
      return setNewItems([...newitems, ...res]);
    }).catch((error: any) => {
      console.error("Error:", error); 
    });
  }, [newitems,totalUniqueItems])


  let newData = newItems.filter((v, i, a) => a.findIndex(v2 => (v2?.id == v?.id)) == i)
  let items = newData;
  totalUniqueItems = items?.length;


  // console.log('fnewTotalUniqueItems: ',newTotalUniqueItems);
  // if(me != undefined){


  // setTimeout(()=>{

  // console.log('data: ',data);
  // totalUniqueItems = data.length;
  // },1000)
  // useEffect(()=>{

  // },[me,useCartDB])
  // }

  function handleCartSidebar() {
    setDisplayCart({ display: true, view: 'cart' });
  }

  return (
    <button
      className="hidden product-cart lg:flex flex-col items-center justify-center p-3 pt-3.5 fixed top-1/2 -mt-12 ltr:right-0 rtl:left-0 z-40 shadow-900 rounded ltr:rounded-tr-none rtl:rounded-tl-none ltr:rounded-br-none rtl:rounded-bl-none bg-accent text-light text-sm font-semibold transition-colors duration-200 focus:outline-none hover:bg-accent-hover"
      onClick={handleCartSidebar}
    // style={{display:totalUniqueItems == 0? 'none':''}}
    >
      <span className="flex pb-0.5">
        <CartCheckBagIcon className="shrink-0" width={14} height={16} />
        <span className="flex ltr:ml-2 rtl:mr-2">
          {/* {} */}
          {/* {me != undefined ? formatString(newTotalUniqueItems, t('common:text-item')) : formatString(totalUniqueItems, t('common:text-item'))} */}
          {formatString(totalUniqueItems, t('common:text-item'))}
        </span>
      </span>
      <span className="bg-light rounded w-full py-2 px-2 text-accent mt-3">
        {/* {totalPrice} */}
        Checkout
      </span>
    </button>
  );
};

export default CartCounterButton;
