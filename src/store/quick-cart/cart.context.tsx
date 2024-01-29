import React, { useCallback, useEffect } from 'react';
import { cartReducer, State, initialState } from './cart.reducer';
import { Item, getItem, getAllItem, inStock } from './cart.utils';
import { useLocalStorage } from '@/lib/use-local-storage';
import { CART_KEY } from '@/lib/constants';
import { useAtom } from 'jotai';
import { verifiedResponseAtom } from '@/store/checkout';
import { useCartDB, useRemoveCartDB } from '@/framework/cart';
import { useUser } from '@/framework/user';
import Cookies from 'js-cookie';
import { AUTH_TOKEN_KEY } from '@/lib/constants';
import { useAddToCartDB } from '@/framework/cart';
import Router from 'next/router';

// const getUpdatedCartData = () => {
//   const { cartData } = useCartDB();
// }
// getUpdatedCartData();

interface CartProviderState extends State {
  addItemsToCart: (items: Item[]) => void;
  addItemToCart: (item: Item, quantity: number) => void;
  removeItemFromCart: (id: Item['id']) => void;
  clearItemFromCart: (id: Item['id']) => void;
  getItemFromCart: (id: Item['id']) => any | undefined;
  getAllItemFromCart: () => any | undefined,
  isInCart: (id: Item['id']) => boolean;
  isInStock: (id: Item['id']) => boolean;
  resetCart: () => void;
  updateCartLanguage: (language: string) => void;
}
export const cartContext = React.createContext<CartProviderState | undefined>(
  undefined
);

cartContext.displayName = 'CartContext';

export const useCart = () => {
  const context = React.useContext(cartContext);
  if (context === undefined) {
    throw new Error(`useCart must be used within a CartProvider`);
  }
  return React.useMemo(() => context, [context]);
};

export const CartProvider: React.FC = (props) => {


  const [savedCart, saveCart] = useLocalStorage(
    CART_KEY,
    JSON.stringify(initialState)
  );
  const [state, dispatch] = React.useReducer(
    cartReducer,
    savedCart ? JSON.parse(savedCart) : initialState
  );

  const { me } = useUser();


  const { mutate: RemoveCartDB } = useRemoveCartDB();
  if (me != undefined) {
    window.onload = function () {
      //  useCartDB();
      //  getData();
    }


    // if(cartData != undefined){
    //   let totalPriceNew = 0;
    //   state.items.map((res)=>{
    //     return totalPriceNew = totalPriceNew + res.price; 
    //   })

    //   state.items = cartData;
    //   state.total = totalPriceNew;
    // }
  }

  // const getData = () => {

  // const { data } = useCartDB();
  // console.log('data: ',data);
  // }

  const { mutate, isLoading, serverError, setServerError } = useAddToCartDB();


  const [, emptyVerifiedResponse] = useAtom(verifiedResponseAtom);

  useEffect(() => {

    emptyVerifiedResponse(null);

  }, [emptyVerifiedResponse, state]);


  useEffect(() => {
    saveCart(JSON.stringify(state));
  }, [state, saveCart]);



  const addItemsToCart = (items: Item[]) => {
    return (dispatch({ type: 'ADD_ITEMS_WITH_QUANTITY', items }));
  }
  const addItemToCart = (item: Item, quantity: number) => {
    if (item.user_id != undefined) {
      // getData();
      dispatch({ type: 'ADD_ITEM_WITH_QUANTITY', item, quantity });

      return mutate({
        // user_id:item.user_id,
        // product_id:item.id,
        ...item,
      });
    } else {
      return dispatch({ type: 'ADD_ITEM_WITH_QUANTITY', item, quantity });

    }

  }


  const removeItemFromCart = (id: Item['id']) => {
    if (me != undefined) {
      dispatch({ type: 'REMOVE_ITEM_OR_QUANTITY', id });
      // getData();
      return RemoveCartDB({ id: id });
    } else {
      return dispatch({ type: 'REMOVE_ITEM_OR_QUANTITY', id });
    }
  }

  const clearItemFromCart = (id: Item['id']) => {
    if (me != undefined) {
      dispatch({ type: 'REMOVE_ITEM', id });
      return RemoveCartDB({ id: id });
    } else {
      return dispatch({ type: 'REMOVE_ITEM', id });
    }
  }

  const isInCart = useCallback(
    (id: Item['id']) => !!getItem(state.items, id),
    [state.items]
  );
  const getItemFromCart = useCallback(
    (id: Item['id']) => getItem(state.items, id),
    [state.items]
  );

  const getAllItemFromCart = async () => {
    const { me } = useUser();
    if (me !== undefined) {
      const token = Cookies.get(AUTH_TOKEN_KEY);
      let newData = await fetch(process?.env?.NEXT_PUBLIC_REST_API_ENDPOINT + '/user/cart', {
        method: 'get',
        headers: new Headers({
          authorization: token ? `${token}` : '',
        }),

      }).then(async (res) => {
        const data = await res.json();
        return data.data;
      }).catch((err) => {
        if (err?.res?.data?.message == "Unauthenticated.") {
          Cookies.remove(AUTH_TOKEN_KEY);
          Router.reload();
        }
        return [];
      });
      return newData;
    } else {
      return [];
    }
  };


  const isInStock = useCallback(
    (id: Item['id']) => inStock(state.items, id),
    [state.items]
  );
  const updateCartLanguage = (language: string) =>
    dispatch({ type: 'UPDATE_CART_LANGUAGE', language });
  const resetCart = () => dispatch({ type: 'RESET_CART' });


  const value = React.useMemo(
    () => ({
      ...state,
      addItemsToCart,
      addItemToCart,
      removeItemFromCart,
      clearItemFromCart,
      getItemFromCart,
      getAllItemFromCart,
      isInCart,
      isInStock,
      resetCart,
      updateCartLanguage,
      saveCart
    }),
    [getItemFromCart, isInCart, isInStock, state, saveCart]
  );
  return <cartContext.Provider value={value} {...props} />;
};
