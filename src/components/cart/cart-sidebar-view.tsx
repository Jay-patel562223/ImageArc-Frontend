import { useRouter } from 'next/router';
import { motion, AnimateSharedLayout } from 'framer-motion';
import CartCheckBagIcon from '@/components/icons/cart-check-bag';
import EmptyCartIcon from '@/components/icons/empty-cart';
import { CloseIcon } from '@/components/icons/close-icon';
import CartItem from '@/components/cart/cart-item';
import { fadeInOut } from '@/lib/motion/fade-in-out';
import { Routes } from '@/config/routes';
import usePrice from '@/lib/use-price';
import { useCart } from '@/store/quick-cart/cart.context';
import { formatString } from '@/lib/format-string';
import { useTranslation } from 'next-i18next';
import { useAtom } from 'jotai';
import { drawerAtom } from '@/store/drawer-atom';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { AUTH_TOKEN_KEY } from '@/lib/constants';
import { cartReducer, State, initialState } from '../../store/quick-cart/cart.reducer';
import { useLocalStorage } from '@/lib/use-local-storage';
import { CART_KEY } from '@/lib/constants';
import React, { useCallback } from 'react';
import { useCartDB } from '@/framework/cart';
import {  useUser } from '@/framework/user';

// const getData = () => {
//   const { items ,addItemsToCart} = useCart();
//   console.log('items: ',items);
//   const [savedCart, saveCart] = useLocalStorage(
//     CART_KEY,
//     JSON.stringify(initialState)
//   );
//   const [state, dispatch] = React.useReducer(
//     cartReducer,
//     savedCart ? JSON.parse(savedCart) : initialState
//   );
//   // const { items} = useCart();
//   // console.log('items: ',items);

//     console.log('reloaded');
//     const token = Cookies.get(AUTH_TOKEN_KEY);
//     const data = fetch(process.env.NEXT_PUBLIC_REST_API_ENDPOINT+'/user/cart', { 
//       method: 'get', 
//       headers: new Headers({
//           'Authorization': token ? token : '', 
//           'Content-Type': 'application/x-www-form-urlencoded'
//       }), 
//     }).then(async(res)=>{
//       const data = await res.json();

//       // setTimeout(() => {
//         const cartData = data.data;
//         console.log('cartData: ',cartData);
//         let totalPriceNew = 0;
//         cartData.map((res:any)=>{
//           console.log('fsdsd: ',res.id);
//             return dispatch({ type: 'REMOVE_ITEM_OR_QUANTITY', id:res.id }); 
//           })
//         addItemsToCart(cartData)
//         // dispatch({ type: 'ADD_ITEMS_WITH_QUANTITY', cartData });

//         // state.items.map((res)=>{
//         //   return totalPriceNew = totalPriceNew + res.price; 
//         // })
    
//         // state.items = cartData;
//         // state.total = totalPriceNew;
//         // state.totalUniqueItems = state?.items?.length ?? 0
//       // }, 1000);

//     }).catch((err)=>{
//       console.log('err: ',err);
//     });
// }

const CartSidebarView = () => {
  const { me,isLoading } = useUser();
 

  // getData();
  const { t } = useTranslation('common');
  let { items:newitems, totalUniqueItems, total, language,getAllItemFromCart } = useCart();
  // if(!isLoading){
  //   if(me != undefined){
  //     const { data } = useCartDB();
  //     console.log('data: ',data);
  //     items = data;
  //     totalUniqueItems = data.length;
  
  //   }
  // }
  const [newItems,setNewItems] = useState<any[]>([]);
  // let setNewItems: Item[] = [];
    let latestData = getAllItemFromCart();
    useEffect(()=>{
    latestData.then((res:any)=> { 
      return setNewItems([...newitems, ...res]);
    }).catch((error: any) => {
      console.error("Error:", error); 
    });
  },[newitems])
  let newData = newItems.filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i)
  let items = newData;
  totalUniqueItems = items?.length;

  const [_, closeSidebar] = useAtom(drawerAtom);
  const router = useRouter();
  function handleCheckout() {
    if(items.length > 0){

      const isRegularCheckout = items.find((item) => !Boolean(item.is_digital));
      if (isRegularCheckout) {
        router.push(Routes.checkout, undefined, {
          locale: language
        });
      } else {
        router.push(Routes.checkoutDigital, undefined, {
          locale: language
        });
      }

      closeSidebar({ display: false, view: '' });
    }

  }

  let totalPriceNew = 0;
  items.map((res)=> totalPriceNew = totalPriceNew + res.price);



  // const [isChecked,setIsChecked] = useState(false);
  // const [fileType,setFileType] = useState<Array | null>([]);
  // const [dpi,setDpi] = useState<Array | null>([]);

  // const changeFileType = (e:any) => {
  //   const newData = JSON.parse(e.target.value);
  //   setFileType((old: any) => {
     
  //     const data = [...old, newData];
  //     const ids = data.map((o:any) => o.id)
  //     const filtered = data.filter((res:any, index:any) => !ids.includes(res.id, index + 1))
  //     return [...filtered];

  //   });
  // }


  // const changeDPIType = (e:any) => {
  //   const newData = JSON.parse(e.target.value);
  //   setDpi((old: any) => {
  //    const check = old.map((res:any)=>res.id == newData.id ? 'exist' : 'notexist');
  //     return check[0] == "exist" ? [newData] : [...old, newData]
  //   });
  //   // setDpi(JSON.parse(e.target.value));
  // }



  const { price: totalPrice } = usePrice({
    amount: Number(totalPriceNew),
  });

  return (
    <section className="relative flex h-full flex-col">
      <header className="fixed top-0 z-10 flex w-full max-w-md items-center justify-between border-b border-border-200 border-opacity-75 bg-light py-4 px-6">
        <div className="flex font-semibold text-accent">
          <CartCheckBagIcon className="shrink-0" width={24} height={22} />
          <span className="flex ltr:ml-2 rtl:mr-2">
            {formatString(totalUniqueItems, t('text-item'))}
          </span>
        </div>
        <button
          onClick={() => closeSidebar({ display: false, view: '' })}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-muted transition-all duration-200 hover:bg-accent hover:text-light focus:bg-accent focus:text-light focus:outline-none ltr:ml-3 ltr:-mr-2 rtl:mr-3 rtl:-ml-2"
        >
          <span className="sr-only">{t('text-close')}</span>
          <CloseIcon className="h-3 w-3" />
        </button>
      </header>
      {/* End of cart header */}

      <AnimateSharedLayout>
        <motion.div layout className="flex-grow pt-16 pb-20">
          {items.length > 0 ? (
            items?.map((item) => <CartItem item={item} key={item.id} 
            // setIsChecked={setIsChecked}
            // fileType={fileType}
            // changeFileType={changeFileType}
            // changeDPIType={changeDPIType}
            />)
          ) : (
            <motion.div
              layout
              initial="from"
              animate="to"
              exit="from"
              variants={fadeInOut(0.25)}
              className="flex h-full flex-col items-center justify-center"
            >
              <EmptyCartIcon width={140} height={176} />
              <h4 className="mt-6 text-base font-semibold">
                {t('text-no-products')}
              </h4>
            </motion.div>
          )}
        </motion.div>
      </AnimateSharedLayout>
      {/* End of cart items */}

      <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
        <button
          className="flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold shadow-700 transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
          onClick={handleCheckout}
          // disabled={!isChecked}
        >
          <span className="flex h-full flex-1 items-center px-5 text-light">
            {t('text-checkout')}
          </span>
          <span className="flex h-full shrink-0 items-center rounded-full bg-light px-5 text-accent">
            {totalPrice}
          </span>
        </button>
      </footer>
      {/* End of footer */}
    </section>
  );
};

export default CartSidebarView;
