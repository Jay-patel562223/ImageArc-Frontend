//@ts-nocheck
import { Table } from '@/components/ui/table';
import usePrice from '@/lib/use-price';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/lib/locals';
import { Image } from '@/components/ui/image';
import { productPlaceholder } from '@/lib/placeholders';
import { useModalAction } from '@/components/ui/modal/modal.context';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';
import { getReview } from '@/lib/get-review';
import { useDownloadMutation } from '@/framework/order';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useState } from 'react';





//FIXME: need to fix this usePrice hooks issue within the table render we may check with nested property
const OrderItemList = (_: any, record: any) => {

    const { alignLeft, alignRight, isRTL } = useIsRTL();
  const { query, locale } = useRouter();


  const data = record?.image.split("/");
  const nameData = data[4];
  let filename = data[4].replace(/\.[^/.]+$/, "");
  const newNameData = filename +'.'+record?.purchaseFileType;

  const { refetch, isLoading } = useDownloadMutation(
    {
      name: nameData as string,
      purchaseDPI: record?.purchaseDPI as string,
      purchaseFileType: record?.purchaseFileType as string,
      isRTL,
      language: locale!,
    },
    { enabled: false }
  );

  // if(error){
  //   if(error?.response?.status == '404'){
  //     toast.error('File not found')
  //   } else {
  //     toast.error('Something went wrong')
  //   }
  // }

 const [showText,setShowText] = useState('Download');

async function handleDownload(name:string) {
  setShowText('Downloading...');
  const { data,error } = await refetch();
  if(error){
    toast.error(error?.response?.data?.message) 
  }
  if (data) {
    // const a = document.createElement('a');
    // a.href = data;
    // // a.download = "test.pdf";
    // a.setAttribute('download', 'order-invoice.pdf');
    // a.click();
    // var blob = new Blob([data], {type: "image/jpeg"});
    // // var blob = new Blob([data], {type: "application/pdf"});
    // var objectUrl = URL.createObjectURL(blob);
    // window.open(objectUrl);

    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", name); //or any other extension
    document.body.appendChild(link);
    link.click();
    setShowText('Download');
  }
}

  const { price } = usePrice({
    amount: record?.unit_price,
  });
  let name = record.name;
  if (record?.pivot?.variation_option_id) {
    const variationTitle = record?.variation_options?.find(
      (vo: any) => vo?.id === record?.pivot?.variation_option_id
    )['title'];
    name = `${name} - ${variationTitle}`;
  }
  
  return (
    <div className="flex items-center" key={record?.product_id}>
      <div className="relative flex h-16 w-16 shrink-0 overflow-hidden rounded" key={record?.product_id}>
        <Image
          src={record.image ?? productPlaceholder}
          alt={name}
          className="h-full w-full object-cover"
          layout="fill"
        />
      </div>

      <div className="flex flex-col overflow-hidden ltr:ml-4 rtl:mr-4">
        <div className="mb-1 flex space-x-1 rtl:space-x-reverse">
          <Link
            href={Routes.product(record?.product_id)}
            className="inline-block overflow-hidden truncate text-sm text-body transition-colors hover:text-accent hover:underline"
            locale={record?.language}
          >
            {name}
          </Link>
          {/* <span className="inline-block overflow-hidden truncate text-sm text-body">
            x
          </span> */}
          
        </div>
        {/* <span className="mb-1 inline-block overflow-hidden truncate text-sm font-semibold text-accent">
          {price}
        </span> */}
      <div>
          <span className="inline-block overflow-hidden truncate text-sm font-semibold text-heading">
            {record?.purchaseFileType?.toUpperCase()} | {record?.purchaseDPI} DPI
          </span>
          <br />
        {/* {!isLoading ?  */}
          <span onClick={()=>handleDownload(newNameData)} style={{color:'blue',textDecoration:'underline',fontSize:'14px',cursor:"pointer"}}>{showText}</span>
          {/* :
          <span style={{color:'blue',textDecoration:'underline',fontSize:'14px'}}>Downloading...</span> */}
        {/* } */}
      </div>
      </div>
    </div>
  );
};
export const OrderItems = ({
  products,
  orderId,
  order
}: {
  products: any;
  orderId: any;
  order:any;
}) => {

  const { t } = useTranslation('common');
  const { alignLeft, alignRight } = useIsRTL();
  const { openModal } = useModalAction();

  const orderTableColumns = [
    {
      title: t('text-item'),
      // title: <span className="ltr:pl-20 rtl:pr-20">{t('text-item')}</span>,
      dataIndex: '',
      key: 'items',
      align: alignLeft,
      width: 140,
      ellipsis: true,
      render: OrderItemList,
    },
    // {
    //   title: t('text-quantity'),
    //   dataIndex: 'order_quantity',
    //   key: 'order_quantity',
    //   align: 'center',
    //   width: 100,
    //   render: function renderQuantity(order_quantity: any) {
    //     return <p className="text-base">{order_quantity ?? 0}</p>;
    //   },
    // },
    {
      title: t('text-price'),
      dataIndex: 'unit_price',
      key: 'unit_price',
      align: alignRight,
      width: 100,
      render: function RenderPrice(unit_price: any,orders:any) {
        const { price } = usePrice({
          amount: unit_price ?? 0,
        });

        return <p>{price}</p>;
      },
    },
    {
      title: '',
      dataIndex: '',
      align: alignRight,
      width: 140,
      key:'product_id',
      render: function RenderReview(_: any, record: any) {

        function openReviewModal() {
          openModal('REVIEW_RATING', {
            product_id: record.product_id,
            shop_id: record.shop_id,
            order_id: order?._id,
            name: record.name,
            image: record.image,
            my_review: getReview(record.my_review),
            ...(record.pivot?.variation_option_id && {
              variation_option_id: record.pivot?.variation_option_id,
            }),
          });
        }

        return (
          <button
            onClick={openReviewModal}
            className="cursor-pointer text-sm font-semibold text-body transition-colors hover:text-accent"
          >
            {getReview(record.my_review)
              ? t('text-update-review')
              : t('text-write-review')}
          </button>
        );
      },
    },
  ];

  return (
    <Table
      //@ts-ignore
      columns={orderTableColumns}
      data={products}
      rowKey={(record: any) =>
        record._id
          ? record._id
          : record.product_id
      }
      className="orderDetailsTable w-full"
      rowClassName="!cursor-auto"
      scroll={{ x: 350, y: 500 }}
    />
  );
};
