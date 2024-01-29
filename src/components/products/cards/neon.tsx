import { Image } from '@/components/ui/image';
import cn from 'classnames';
import usePrice from '@/lib/use-price';
import { AddToCart } from '@/components/products/add-to-cart/add-to-cart';
import { useTranslation } from 'next-i18next';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { productPlaceholder } from '@/lib/placeholders';
import { PlusIcon } from '@/components/icons/plus-icon';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

type NeonProps = {
  product: any;
  className?: string;
};

const Neon: React.FC<NeonProps> = ({ product, className }) => {


  const { t } = useTranslation('common');
  const { _id,name, image, quantity, min_price, max_price, product_type } =
    product ?? {};
  const { price, basePrice, discount } = usePrice({
    amount: Number(product.sale_price) ? Number(product.sale_price) : Number(product.price!),
    baseAmount: Number(product.price),
  });
  const { price: minPrice } = usePrice({
    amount: Number(min_price),
  });
  const { price: maxPrice } = usePrice({
    amount: Number(max_price),
  });

  const { openModal } = useModalAction();

  function handleProductQuickView() {
    return openModal('PRODUCT_DETAILS', product._id);
  }


  const router = useRouter();

  const navigate = (path: string) => {
    router.push(path);
    // closeModal();
  };

  useEffect(() => {
    const handleContextMenu = (e:any) => {
      e.preventDefault()
    }
    

    if(!window.location.href.includes('localhost') ){
      if(!window.location.href.includes('127.0.0.1')){
        // let ele = document.getElementById('product-gallery');
        // ele.addEventListener('contextmenu',handleContextMenu);
        document.addEventListener("contextmenu", handleContextMenu)
        return () => {
          document.removeEventListener("contextmenu", handleContextMenu)
        }
      }
    }

  }, [])

  return (
    <article
      className={cn(
        'product-card cart-type-neon h-full transform overflow-hidden rounded border border-border-200 bg-light shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow',
        className
      )}
    >
      <div
        className="relative flex h-48 w-auto cursor-pointer items-center justify-center sm:h-64"
        // onClick={handleProductQuickView}
        onClick={() => navigate(Routes.product(_id))}
      >
        <span className="sr-only">{t('text-product-image')}</span>
        <Image
          src={image ?? productPlaceholder}
          alt={name}
          layout="fill"
          // objectFit="contain"
          // objectFit="none"
          className="product-image"
          objectFit="cover"
        />
        {discount && (
          <div className="absolute top-3 rounded bg-accent px-1.5 text-xs font-semibold leading-6 text-light ltr:right-3 rtl:left-3 sm:px-2 md:top-4 md:px-2.5 ltr:md:right-4 rtl:md:left-4">
            {discount}
          </div>
        )}
      </div>
      {/* End of product image */}

      {/* <header className="p-3 md:p-6"> */}
       
        {/* this is useful */}
        {/* {product_type.toLowerCase() === 'variable' ? (
          <>
            {Number(quantity) > 0 && (
              <button
                // onClick={handleProductQuickView}
                onClick={() => navigate(Routes.product(_id))}
                className="group flex h-7 w-full items-center justify-between rounded bg-gray-100 text-xs text-body-dark transition-colors hover:border-accent hover:bg-accent hover:text-light focus:border-accent focus:bg-accent focus:text-light focus:outline-none md:h-9 md:text-sm"
              >
                <span className="flex-1">{t('text-add')}</span>
                <span className="grid h-7 w-7 place-items-center bg-gray-200 transition-colors duration-200 group-hover:bg-accent-600 group-focus:bg-accent-600 ltr:rounded-tr ltr:rounded-br rtl:rounded-tl rtl:rounded-bl md:h-9 md:w-9">
                  <PlusIcon className="h-4 w-4 stroke-2" />
                </span>
              </button>
            )}
          </>
        ) : (
          <>
            {Number(quantity) > 0 && (
              <AddToCart variant="neon" data={product} />
            )}
          </>
        )} */}

        {/* {Number(quantity) <= 0 && (
          <div className="rounded bg-red-500 px-2 py-1.5 text-center text-xs text-light sm:py-2.5">
            {t('text-out-stock')}
          </div>
        )} */}
        {/* End of add to cart */}
      {/* </header> */}
    </article>
  );
};

export default Neon;
