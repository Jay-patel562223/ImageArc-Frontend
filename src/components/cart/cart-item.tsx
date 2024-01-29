import { Image } from '@/components/ui/image';
import { motion } from 'framer-motion';
import { siteSettings } from '@/config/site';
import Counter from '@/components/ui/counter';
import { CloseIcon } from '@/components/icons/close-icon';
import { fadeInOut } from '@/lib/motion/fade-in-out';
import usePrice from '@/lib/use-price';
import { useTranslation } from 'next-i18next';
import { useCart } from '@/store/quick-cart/cart.context';
import { useEffect, useState } from 'react';

interface CartItemProps {
  item: any;
  // setIsChecked: any;
  // fileType: any;
  // changeFileType: any;
  // changeDPIType: any;
}

const CartItem = ({ item,
  // setIsChecked,
  // fileType,
  // changeFileType,
  // changeDPIType 
}: CartItemProps) => {
  const { t } = useTranslation('common');
  const { isInStock, clearItemFromCart, addItemToCart, removeItemFromCart, updateCartLanguage, language } =
    useCart();

  const { price } = usePrice({
    amount: item.price,
  });
  
  const { price: itemPrice } = usePrice({
    amount: item.price,
    // amount: item.itemTotal,
  });
  function handleIncrement(e: any) {
    e.stopPropagation();
    // Check language and update
    if (item?.language !== language){
      updateCartLanguage(item?.language);
    }
    addItemToCart(item, 1);
  }
  const handleRemoveClick = (e: any) => {
    e.stopPropagation();
    removeItemFromCart(item.id);
  };



  // const setTypeVal = (id:any,type:any) => {
  //   return  JSON.stringify({"id":id,'type':type});
  // }
  
  // const setDpiVal = (id:any,type:any) => {
  //   return  JSON.stringify({"id":id,'dpi':type});
  // }

  // if(fileType.length == 0){
  //   fileType = [{id:item.id,type:""}]; 
  // }

  const outOfStock = !isInStock(item.id);

  // const checkActive = fileType.filter((data: any)=> {
  //  return data.id == item.id && data.type == ""
  // });
  // let checkActive = true;
  // if(fileType.length == 0){
  //   checkActive = true;
  // } else {
  //   checkActive = fileType.some((data: any)=> {
  //     return data.id == item.id && data.type == ""
  //    });
  // }
  // const check = checkActive.length > 1;

  // useEffect(()=>{

  // },[fileType])

  // const checkActive = async (fileType:any,item:any) => {
  //   if(fileType.length == 0){
  //     return true;
  //   } else {
  //     return await fileType.some(async (data: any)=> {
  //       return await data.id == item.id && data.type == ""
  //      })
  //   }
  // }


  return (
    <motion.div
      layout
      initial="from"
      animate="to"
      exit="from"
      variants={fadeInOut(0.25)}
      className="flex items-center border-b border-solid border-border-200 border-opacity-75 py-4 px-4 text-sm sm:px-6"
    >
      <div className="flex-shrink-0">
        {/* <Counter
          value={item.quantity}
          onDecrement={handleRemoveClick}
          onIncrement={handleIncrement}
          variant="pillVertical"
          disabled={outOfStock}
        /> */}
      </div>

      <div className="relative mx-4 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden bg-gray-100 sm:h-16 sm:w-16">
        <Image
          src={item?.image ?? siteSettings?.product?.placeholderImage}
          alt={item.name}
          layout="fill"
          objectFit="contain"
        />
      </div>
      <div>
        {/* <h3 className="font-bold text-heading">{item.name}</h3> */}
        <h3 className="font-bold text-heading">{item?.name} </h3>
        {/* <p className="my-2.5 font-semibold text-accent">{price}</p> */}
        <span className="text-xs text-body">
        {item?.purchaseFileType?.toUpperCase()} | {item?.purchaseDPI} DPI
          {/* {item?.quantity} X {item?.purchaseFileType?.toUpperCase()} */}
          {/* {item.quantity} X {item.unit} */}
        </span>
        {/* <br />

        <select name="file_extension" id="" style={{
              height: '40px',
              border: '1px solid #E4E4E4',
              width: '100%',
              margin:'1px'
        }}
        onChange={changeFileType}
        >
          <option value={setTypeVal(item.id,"")}>Select File Type</option>
          <option value={setTypeVal(item.id,"JPG")}>JPG</option>
          <option value={setTypeVal(item.id,"PNG")}>PNG</option>
          <option value={setTypeVal(item.id,"TIFF")}>TIFF</option>
        </select>
        {fileType.some((data: any)=> {
          return data.id == item.id && data.type != ""
         }) && 
         
        (<select name="file_dpi" id="" style={{
              height: '40px',
              border: '1px solid #E4E4E4',
              width: '100%',
              margin:'1px'
        }}
        onChange={changeDPIType}
        >
          <option value={setDpiVal(item.id,"")}>Select DPI</option>
          <option value={setDpiVal(item.id,"100")}>100 DPI</option>
          <option value={setDpiVal(item.id,"150")}>150 DPI</option>
          <option value={setDpiVal(item.id,"300")}>300 DPI</option>
        </select>)
         } */}
      </div>
      <span className="font-bold text-heading ltr:ml-auto rtl:mr-auto">
        {itemPrice}
      </span>
      <button
        className="flex h-7 w-7  shrink-0 items-center justify-center rounded-full text-muted transition-all duration-200 hover:bg-gray-100 hover:text-red-600 focus:bg-gray-100 focus:text-red-600 focus:outline-none ltr:ml-3 ltr:-mr-2 rtl:mr-3 rtl:-ml-2"
        onClick={() => clearItemFromCart(item?.id)}
      >
        {/* <span className="sr-only">{t('text-close')}</span> */}
        <CloseIcon className="h-3 w-3" />
      </button>
    </motion.div>
  );
};

export default CartItem;
