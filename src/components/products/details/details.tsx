//@ts-nocheck
import BackButton from '@/components/ui/back-button';
import { AddToCart } from '@/components/products/add-to-cart/add-to-cart';
import usePrice from '@/lib/use-price';
import { ThumbsCarousel } from '@/components/ui/thumb-carousel';
import { useTranslation } from 'next-i18next';
import { getVariations } from '@/lib/get-variations';
import useCopy from "use-copy";
import { useEffect, useMemo, useRef, useState } from 'react';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import Truncate from '@/components/ui/truncate';
import { scroller, Element } from 'react-scroll';
import CategoryBadges from './category-badges';
import VariationPrice from './variation-price';
import { useRouter } from 'next/router';
import { Routes } from '@/config/routes';
import type { Product } from '@/types';
import { useAtom } from 'jotai';
import VariationGroups from './variation-groups';
import { isVariationSelected } from '@/lib/is-variation-selected';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { stickyShortDetailsAtom } from '@/store/sticky-short-details-atom';
import { useAttributes } from './attributes.context';
import classNames from 'classnames';
import { displayImage } from '@/lib/display-product-preview-images';
import { HeartOutlineIcon } from '@/components/icons/heart-outline';
import { HeartFillIcon } from '@/components/icons/heart-fill';
import Spinner from '@/components/ui/loaders/spinner/spinner';
import { useUser } from '@/framework/user';
import { useInWishlist, useInWishlistNew, useToggleWishlist } from '@/framework/wishlist';
import { useIntersection } from 'react-use';
import { StarIcon } from '@/components/icons/star-icon';
import NotFound from '@/components/ui/not-found';
import { useProductPrices } from '@/framework/product';
import { isMobile } from 'react-device-detect';
import TagBadges from './tag-badges';
import Magnifier from "react-magnifier";
import { Menu, Transition } from '@headlessui/react';
import { FacebookShareButton, FacebookIcon, EmailShareButton, EmailIcon, PinterestIcon, PinterestShareButton, TwitterIcon, TwitterShareButton, WhatsappShareButton, WhatsappIcon,WeiboIcon } from 'react-share';
import { FaBeer, BiLinkAlt, FaLink, FaShare, FaShareSquare,FaXTwitter } from 'react-icons/fa';
import Button from '@/components/ui/button';
import { Grid } from '@/components/products/grid';
import ProductCard from '@/components/products/cards/card';
import { SimilarProducts } from '../Similar-products';
// import { FaXTwitter } from "react-icons/fa";

function FavoriteButton({
  productId,
  className,
  // inWishlist
}: {
  productId: string;
  className?: string;
  // inWishlist: Boolean
}) {


  const { isAuthorized, me } = useUser();
  

  // const { toggleWishlist, isLoading: adding} = useToggleWishlist(productId);
  const {
    mutate: toggleWishlist,
    isLoading: adding,
    // formError,
  } = useToggleWishlist();

  const { inWishlist, isLoading: checking } = useInWishlistNew({
    enabled: isAuthorized,
    product_id: productId,
  });
  const [show, setShow] = useState();

  const { openModal } = useModalAction();
  function toggle() {
    if (!isAuthorized) {
      openModal('LOGIN_VIEW');
      return;
    }
    toggleWishlist({ product_id: productId },
      {
        onError: (error: any) => {
          toast.error(error?.response?.data?.message);
        },
        onSuccess: (data) => {
          setShow(data.data.isAdded == 1 ? true : false);

        }
      })
    // window.location.reload;
  }

  useEffect(() => {
    setShow(inWishlist != null ? true : false);
  }, [inWishlist])

  // const inWishlistNew = inWishlist != null ? true : false;



  // const isLoading = adding ;
  const isLoading = adding || checking;
  if (isLoading) {
    return (
      <div
        className={classNames(
          'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-300',
          className
        )}
      >
        <Spinner simple={true} className="flex h-5 w-5" />
      </div>
    );
  }
  return (
    <button
      type="button"
      className={classNames(
        'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-300 transition-colors',
        {
          '!border-accent': show,
        },
        className
      )}
      onClick={toggle}
    >
      {show ? (
        <HeartFillIcon className="h-5 w-5 text-accent" />
      ) : (
        <HeartOutlineIcon className="h-5 w-5 text-accent" />
      )}
    </button>
  );
}
type Props = {
  product: Product;
  backBtn?: boolean;
  isModal?: boolean;
};
const Details: React.FC<Props> = ({
  product,
  backBtn = true,
  isModal = false,
}) => {


  const [copied, copy, setCopied] = useCopy(window.location.href);
  const {
    //@ts-ignore
    _id,
    name,
    image, //could only had image we need to think it also
    description,
    unit,
    categories,
    gallery,
    type,
    quantity,
    shop,
    slug,
    ratings,
    tag,
    product_unique_id,
    dpi,
    resolution,
    similarProducts
  } = product ?? {};

  const { t } = useTranslation('common');

  const { prices, isLoading, error } = useProductPrices();

  // getProductPrices
  // if(!product){
  //   return (
  //     <div className="min-h-full px-4 pt-6 pb-8 bg-gray-100 lg:p-8">
  //       <NotFound text="text-no-shops" />
  //     </div>
  //   )
  // }
  const { isAuthorized, me } = useUser();

  const [_, setShowStickyShortDetails] = useAtom(stickyShortDetailsAtom);

  const router = useRouter();
  const { closeModal } = useModalAction();
  const intersectionRef = useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: '0px',
    threshold: 1,
  });
  useEffect(() => {
    if (intersection && intersection.isIntersecting) {
      setShowStickyShortDetails(false);
      return;
    }
    if (intersection && !intersection.isIntersecting) {
      setShowStickyShortDetails(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intersection]);


  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault()
    }


    if (!window.location.href.includes('localhost')) {
      if (!window.location.href.includes('127.0.0.1')) {
        // let ele = document.getElementById('product-gallery');
        // ele.addEventListener('contextmenu',handleContextMenu);
        document.addEventListener("contextmenu", handleContextMenu)
        return () => {
          document.removeEventListener("contextmenu", handleContextMenu)
        }
      }
    }

  }, [])


  const { attributes } = useAttributes();

  const { price, basePrice, discount } = usePrice({
    amount: Number(product?.sale_price) ? Number(product?.sale_price) : Number(product?.price),
    baseAmount: Number(product?.price),
  });

  const navigate = (path: string) => {
    router.push(path);
    closeModal();
  };

  const variations = useMemo(
    () => getVariations(product?.variations),
    [product?.variations]
  );
  const isSelected = isVariationSelected(variations, attributes);
  let selectedVariation: any = {};
  if (isSelected) {
    selectedVariation = product?.variation_options?.find((o: any) =>
      isEqual(
        o.options.map((v: any) => v.value).sort(),
        Object.values(attributes).sort()
      )
    );
  }

  const scrollDetails = () => {
    scroller.scrollTo('details', {
      smooth: true,
      offset: -80,
    });
  };

  const hasVariations = !isEmpty(variations);
  const previewImages = displayImage(image, gallery, image);

  function createMarkup() {
    return { __html: description };
  }

  // const { isAuthorized } = useUser();
  // const { inWishlist, isLoading: checking } = useInWishlist({
  //   enabled: isAuthorized,
  //   product_id: _id,
  // });
  if (!product) {
    return (
      <div className="min-h-full px-4 pt-6 pb-8 bg-gray-100 lg:p-8">
        <NotFound text="text-no-shops" />
      </div>
    )
  }


  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isChecked, setIsChecked] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [fileType, setFileType] = useState('');
  // const [fileType,setFileType] = useState<Array | null>([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  // const [dpi,setDpi] = useState('');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [newPrice, setnNewPrice] = useState(0);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [allDpi, setAllDpi] = useState([]);
  // const [dpi,setDpi] = useState<Array | null>([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [copyLink, setCopyLink] = useState('Copy Link');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showMore, setShowMore] = useState(false);
  // const [copied, copy, setCopied] = useCopy(window.location.href);


  const filtered = prices.filter((v, i, a) => a.findIndex(v2 => (v2.name === v.name)) === i);

  const newDefaultRate = prices.filter((v, i, a) => v.name == 'default');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [defaultRate, setDefaultRate] = useState(newDefaultRate[0]?.price ?? 0);


  const changePrice = JSON.parse(newPrice);
  if (product._id == changePrice.id) {
    product.purchaseFileType = fileType;
    product.purchaseDPI = dpi;
    product.newLatestprice = changePrice.price;
    product.defaultRate = defaultRate;
  }
  product.user_id = me?._id;

  // const filtered = prices.filter((item, index) => prices.indexOf(item.name) === index);
  // const filteredData = prices.filter((res) => res.name == e.target.value);
  // const [showTypes,setShowTypes] = useState([]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { price: newPrice1 } = usePrice(
    {
      // amount: changePrice ?? 0,
      amount: changePrice.price ?? 0,
    }
  );

  const changeFileType = (e: any) => {
    let val = JSON.parse(e.target.value);
    setFileType(val.type);
    setnNewPrice(JSON.stringify({ "id": val.id, 'price': val.price }));
    // setFileType(e.target.value);
    // const filteredData = prices.filter((res) => res.name == e.target.value);
    // setAllDpi(filteredData);
    // setDpi('');

  }
  
  

  const changeDPIType = (e: any) => {
    setnNewPrice(e.target.value);
    let dpi = JSON.parse(e.target.value);
    setDpi(Number(dpi.dpi));

  }


  const setTypeVal = (id: any, type: any) => {
    return JSON.stringify({ "id": id, 'type': type });
  }

  const setDpiVal = (id: any, type: any) => {
    return JSON.stringify({ "id": id, 'dpi': type });
  }

  // const setVal = (id:any,price:any,dpi:any) => {
  //   return  JSON.stringify({"id":id,'price':price,'dpi':dpi});
  // }

  const setVal = (type: any, price: any, id: any) => {
    return JSON.stringify({ "type": type, 'price': price, 'id': id });
  }
  
  const copyText = () => {
    copy();
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  // const CustomTwitterIcon = () => (
     
  //   // <TwitterIcon size={32} round={true} />
  //   <FaXTwitter />
   
  // );
  

  return (
    <article className="rounded-lg bg-light">
      <div className="flex flex-col  border-border-200 border-opacity-70 md:flex-row">
        <div className="p-6 pt-1 pb-1 md:w-1/2 lg:p-14 xl:p-16">

          <div className="mb-8 flex items-center justify-between lg:mb-10" style={{ float: 'right', position: 'relative', zIndex: '1' }}>
            {backBtn && <BackButton />}

            <Menu
              as="div"
              className="relative inline-block ltr:text-left rtl:text-right"

            >
              <Menu.Button className="flex items-center focus:outline-none" style={{ color: 'rgba(var(--color-accent), var(--tw-bg-opacity))' }}>
                <FaShareSquare style={{ fontSize: 'x-large' }} />
                <span className="sr-only">{t('user-avatar')}</span>
              </Menu.Button>
              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"

              >
                <Menu.Items
                  as="ul"
                  className={
                    'absolute mt-1 w-48 rounded bg-white  shadow-700 focus:outline-none ltr:right-0 ltr:origin-top-right rtl:left-0 rtl:origin-top-left'
                  }
                  style={{ width: '160px' }}
                >

                  <div style={{ padding: '10px' }}>

                    <WhatsappShareButton
                      url={window.location.href}
                      style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '10px' }}
                    >
                      <WhatsappIcon size={32} round /> Whatsapp
                    </WhatsappShareButton>
                    <hr />
                    <FacebookShareButton
                      url={window.location.href}
                      style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '10px' }}
                    >
                      <FacebookIcon size={32} round /> Facebook
                    </FacebookShareButton>
                    <hr />
                    <TwitterShareButton
                      url={window.location.href}
                      // quote={'Dummy text!'}
                      // hashtag="#muo"
                      style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '10px' }}
                    >
                      {/* <CustomTwitterIcon />Twitter */}
                      <TwitterIcon size={32} round /> Twitter
                      {/* <FaXTwitter   /> */}
                      {/* Twitter */}
                    </TwitterShareButton>
                    <hr />
                    <button style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '10px', marginLeft: '8px' }}
                      onClick={copyText} >
                      <FaLink /> 
                      {copied ? 'Link Copied!' : 'Copy Link'}
                    </button>
                  </div>

                </Menu.Items>
              </Transition>
            </Menu>

            {/* <RWebShare
                  data={{
                    text: name,
                    url: window.location.href,
                    title: name,
                  }}
                  onClick={() => console.log("shared successfully!")}
                > */}
            {/* <img src="../../../../public/share-icon.svg" alt="share" /> */}
            {/* <img src={ShareIcon ?? ''} alt="share" /> */}
            {/* <button>Share on Web</button> */}
            {/* </RWebShare> */}
            {/* {discount && (
              <div className="rounded-full bg-yellow-500 px-3 text-xs font-semibold leading-6 text-light ltr:ml-auto rtl:mr-auto">
                {discount}
              </div>
            )} */}
          </div>

          {/* {isMobile && 
              <>
              <span >
              <h1
                className={classNames(
                  `text-lg font-semibold tracking-tight text-heading md:text-xl xl:text-2xl`,
                  {
                    'cursor-pointer transition-colors hover:text-accent':
                      isModal,
                  }
                )}
                {...(isModal && {
                  onClick: () => navigate(Routes.product(_id)),
                })}
              >
                {name}
              </h1>
                <div  style={{marginBottom: '10px',position: 'absolute',right: '19px',top: '72px'}}>
                <FavoriteButton
                  productId={_id}
                  className={classNames({ 'mr-1': isModal })}
                />
                </div>
              </span>
              </>
            } */}
          <div className="product-gallery h-full" id="product-gallery">

            <Magnifier src={previewImages} mgShape="square" zoomFactor="1.2" style={{ marginTop: '0px' }} />
            <div style={{ float: 'right', margin: '-10px 0px 0 0', fontFamily: 'auto' }}>{product_unique_id && 'IMAGEARC-' + product_unique_id}</div>
            {/* <ThumbsCarousel
              gallery={previewImages}
              hideThumbs={previewImages.length <= 1}
            /> */}

          </div>
        </div>

        <div className="flex flex-col items-start p-5 pt-1 md:w-1/2 lg:p-8 xl:p-10">
          {/* <div className="w-full" > */}
          <div className="w-full" ref={intersectionRef}>
            <div className="flex w-full items-start justify-between space-x-8 rtl:space-x-reverse">
              {/* {!isMobile &&   */}
              <>
                <h1
                  className={classNames(
                    `text-lg font-semibold tracking-tight text-heading md:text-xl xl:text-2xl`,
                    {
                      'cursor-pointer transition-colors hover:text-accent':
                        isModal,
                    }
                  )}
                  {...(isModal && {
                    onClick: () => navigate(Routes.product(_id)),
                  })}
                >
                  {name}
                </h1>
                <span>

                  <FavoriteButton
                    productId={_id}
                    className={classNames({ 'mr-1': isModal })}
                  // inWishlist={inWishlist}
                  />
                </span>
              </>
              {/* } */}


            </div>
            <div className="mt-2 flex items-center justify-between">
              {unit && !hasVariations && (
                <span className="block text-sm font-normal text-body">
                  {/* {unit} */}
                </span>
              )}

              {isModal && (
                <div className="inline-flex shrink-0 items-center rounded border border-accent bg-accent px-3 py-1 text-sm text-white">
                  {Number(ratings).toFixed(1)}
                  <StarIcon className="h-2.5 w-2.5 ltr:ml-1 rtl:mr-1" />
                </div>
              )}
            </div>

            {description && (
              <div className="mt-3 text-sm leading-7 text-body md:mt-4 text-container"
              // dangerouslySetInnerHTML={{ __html: description }}
              >
                <Truncate
                  character={150}
                  {...(!isModal && {
                    onClick: () => scrollDetails(),
                    compressText: 'common:text-see-more',
                  })}

                >

                  <div dangerouslySetInnerHTML={createMarkup()} id={showMore ? "" : 'showDesc'} />
                  {description.length > 300 ?
                    showMore ?
                      <span style={{ color: 'rgba(var(--color-accent), var(--tw-bg-opacity))' }} onClick={() => setShowMore(false)}>Less More</span>
                      // <Button onClick={()=>setShowMore(false)}>Less More</Button>
                      : <span style={{ color: 'rgba(var(--color-accent), var(--tw-bg-opacity))' }} onClick={() => setShowMore(true)}>Show More</span>
                    : ''}
                  {/* {description} */}
                </Truncate>
              </div>
            )}

            {/* {hasVariations ? (
              <>
                <div className="my-5 flex items-center md:my-10">
                  <VariationPrice
                    selectedVariation={selectedVariation}
                    minPrice={product.min_price}
                    maxPrice={product.max_price}
                  />
                </div>
                <div>
                  <VariationGroups variations={variations} />
                </div>
              </>
            ) : (
              <span className="my-5 flex items-center md:my-10">
                <ins className="text-2xl font-semibold text-accent no-underline md:text-3xl">
                  {price}
                </ins>
                {basePrice && (
                  <del className="text-sm font-normal text-muted ltr:ml-2 rtl:mr-2 md:text-base">
                    {basePrice}
                  </del>
                )}
              </span>
            )} */}


            {/* ---------------------------------- */}

            {/* <br /> */}

            {/* <select name="file_extension" id="" style={{
              height: '40px',
              border: '1px solid #E4E4E4',
              width: '78%',
              margin:'1px',
              marginBottom:'10px'
        }}
        onChange={changeFileType}
        >
          <option value="">Select File Type</option>
          {filtered.map((res)=>{
            if(res.name != 'default'){
              return ( <><option value={res.name}>{res.name.toUpperCase()}</option></>);
            }
          })}
        </select> */}
            <div className="mt-3 leading-7 text-body text-dark md:mt-4 text-container">

              {resolution != '0 x 0' && <p>Resolution: {resolution}</p>}
              {dpi != '0' && <p>DPI: {dpi}</p>}
              <br />

              <label>Choose File Type:</label>
              <div style={{ maxWidth: '74%' }}>
                {filtered.map((res) => {
                  if (res.name != 'default' && product?.access_type?.includes(res?.name?.toLowerCase())) {
                    // if(res.name != 'default' && product?.access_type?.includes(res.name)){
                    const rate = res?.price == undefined ? defaultRate : res?.price
                    return (

                      <div key={res._id}> &nbsp;
                        <label htmlFor={res._id}>
                          <input
                            id={res._id}
                            key={res._id}
                            type="radio"
                            name="file_extension"
                            value={setVal(res.name, rate, _id)}
                            onChange={changeFileType}
                          />
                          &nbsp; {res.name.toUpperCase()}
                        </label>
                        {/* <input type="radio" name="file_extension" key={res._id} value={setVal(res.name,rate,_id)} style={{borderRadius: 'inherit'}}/> &nbsp; {res.name.toUpperCase()} */}
                      </div>
                    );
                    // return ( <> <div onChange={changeFileType}> &nbsp; <input type="radio" name="file_extension" key={res._id} value={res.name} /> &nbsp; {res.name.toUpperCase()}</div> </>);
                    // return ( <><option value={res.name}>{res.name.toUpperCase()}</option></>);
                  }
                })}
              </div>
            </div>
            {/* <br />
          <br /> */}

            {/* <div className="mt-3  leading-7 text-body text-dark md:mt-4 text-container">
        {fileType != "" ? 
          <>
          <label> Choose DPI: </label>
          <div style={{maxWidth: '74%'}}>
          {allDpi.map((res)=>{
                const rate = res?.price == undefined ?defaultRate :res?.price
                let dpi = res?.dpi?.name;
              return ( <> <p> &nbsp; <input type="radio"  name="file_dpi" key={res._id} value={setVal(_id,rate,dpi)} onChange={changeDPIType}/> &nbsp; {res?.dpi?.name} DPI</p></>);
              //  return ( <><option value={setVal(_id,rate)}>{res?.dpi?.name}</option></>);
              }) }
          
          </div>
          </>

              : ''}
          </div> */}

            {/* <br /> */}
            <div className="mt-3  leading-7 text-body text-dark md:mt-4 text-container">
              {
                fileType &&
                <> Price: <b>{newPrice1}</b> </>
              }
            </div>


            {/* (<select name="file_dpi" id="" style={{
              height: '40px',
              border: '1px solid #E4E4E4',
              width: '78%',
              margin:'1px'
        }}
        onChange={changeDPIType}
        >
          <option value="">Select DPI</option>
          {allDpi.map((res)=>{
            const rate = res?.price == undefined ?defaultRate :res?.price
            
           return ( <><option value={setVal(_id,rate)}>{res?.dpi?.name}</option></>);
          })}
        </select>) */}
            {/* } */}

            <div className="mt-6 flex flex-col items-center md:mt-6 lg:flex-row">
              <div className="mb-3 w-full lg:mb-0 lg:max-w-[400px]">
                <AddToCart
                  data={product}
                  variant="big"
                  variation={selectedVariation}
                  disabled={!fileType}
                // disabled={selectedVariation?.is_disable || !isSelected }
                />
              </div>

              {/* {!hasVariations && (
                <>
                  {Number(quantity) > 0 ? (
                    <span className="whitespace-nowrap text-base text-body ltr:lg:ml-7 rtl:lg:mr-7">
                      {quantity} {t('text-pieces-available')}
                    </span>
                  ) : (
                    <div className="whitespace-nowrap text-base text-red-500 ltr:lg:ml-7 rtl:lg:mr-7">
                      {t('text-out-stock')}
                    </div>
                  )}
                </>
              )}
              {!isEmpty(selectedVariation) && (
                <span className="whitespace-nowrap text-base text-body ltr:lg:ml-7 rtl:lg:mr-7">
                  {selectedVariation?.is_disable ||
                  selectedVariation.quantity === 0
                    ? t('text-out-stock')
                    : `${selectedVariation.quantity} ${t(
                        'text-pieces-available'
                      )}`}
                </span>
              )} */}
            </div>
          </div>

          {!!categories?.length && (
            <CategoryBadges
              // key={_id}
              categories={categories}
              basePath={Routes.categories}
              // basePath={`/${type?.slug}`}
              onClose={closeModal}
            />
          )}

          {!!tag?.length && (
            <TagBadges
              // key={_id}
              categories={tag}
              // basePath={Routes.categories}
              // basePath={`/${type?.slug}`}
              onClose={closeModal}
            />
          )}



          {shop?.name && (
            <div className="mt-2 flex items-center">
              <span className="py-1 text-sm font-semibold capitalize text-heading ltr:mr-6 rtl:ml-6">
                {t('common:text-sellers')}
              </span>

              <button
                onClick={() => navigate(Routes.shop(shop?.slug))}
                className="text-sm tracking-wider text-accent underline transition hover:text-accent-hover hover:no-underline"
              >
                {shop?.name}
              </button>
            </div>
          )}
        </div>


      </div>
      {similarProducts.length > 0 &&
        <div style={{ padding: '0px 62px 0 62px', marginTop: '-40px' }}>
          <h1 style={{ fontSize: 'xx-large', fontFamily: 'auto' }}>Similar Images</h1>
          <SimilarProducts
            products={similarProducts}
            gridClassName="grid  sm:grid-cols-2 lg:grid-cols-5 2xl:grid-cols-5 3xl:grid-cols-6"
          />
        </div>
      }
    </article>
  );
};

export default Details;
