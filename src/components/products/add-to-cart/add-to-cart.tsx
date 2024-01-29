// @ts-nocheck
import Counter from '@/components/ui/counter';
import AddToCartBtn from '@/components/products/add-to-cart/add-to-cart-btn';
import { cartAnimation } from '@/lib/cart-animation';
import { useCart } from '@/store/quick-cart/cart.context';
import { generateCartItem } from '@/store/quick-cart/generate-cart-item';
// import { useAddToCartDB } from '@/framework/cart';

interface Props {
  data: any;
  variant?:
    | 'helium'
    | 'neon'
    | 'argon'
    | 'oganesson'
    | 'single'
    | 'big'
    | 'text';
  counterVariant?:
    | 'helium'
    | 'neon'
    | 'argon'
    | 'oganesson'
    | 'single'
    | 'details';
  counterClass?: string;
  variation?: any;
  disabled?: boolean;
}

export const AddToCart = ({
  data,
  variant = 'helium',
  counterVariant,
  counterClass,
  variation,
  disabled,
}: Props) => {
  const {
    addItemToCart,
    removeItemFromCart,
    isInStock,
    getItemFromCart,
    isInCart,
    updateCartLanguage,
    language,
    totalUniqueItems
  } = useCart();
  // console.log('totalUniqueItems: ',totalUniqueItems);
  const item = generateCartItem(data, variation);

  // const { mutate, isLoading, serverError, setServerError } = useAddToCartDB();


  const handleAddClick = (
    e: React.MouseEvent<HTMLButtonElement | MouseEvent>
  ) => {
    e.stopPropagation();
    // Check language and update
    if (item?.language !== language){
      updateCartLanguage(item?.language);
    }

    // if(item.user_id != undefined){

    //     mutate({
    //       // user_id:item.user_id,
    //       // product_id:item.id,
    //       ...item
    //     });
    // }


    addItemToCart(item, 1);
    if (!isInCart(item.id)) {
      cartAnimation(e);
    }
    if(totalUniqueItems == 0){
      location.reload();
    }
    // setTimeout(() => {
    //   window.location.reload();
    // }, 500)

  };
  const handleRemoveClick = (e: any) => {
    e.stopPropagation();
    removeItemFromCart(item.id);
    // setTimeout(() => {
    //   window.location.reload();
    // }, 500)
  };
  const outOfStock = isInCart(item?.id) && !isInStock(item.id);


  return !isInCart(item?.id) ? (
    <AddToCartBtn
      disabled={disabled }
      variant={variant}
      onClick={handleAddClick}
    />
  ) : (
    <AddToCartBtn
      disabled={disabled }
      variant='remove'
      onClick={handleRemoveClick}
    />
    // <>
    //   <Counter
    //     value={getItemFromCart(item.id).quantity}
    //     onDecrement={handleRemoveClick}
    //     onIncrement={handleAddClick}
    //     variant={counterVariant || variant}
    //     className={counterClass}
    //     disabled={outOfStock}
    //   />
    // </>
  );
};
