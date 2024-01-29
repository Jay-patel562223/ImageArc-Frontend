export function formatOrderedProduct(product: any) {
  return {
    product_id: product?.productId ? product?.productId : product?.id,
    ...(product?.variationId
      ? { variation_option_id: product?.variationId }
      : {}),
    order_quantity: product?.quantity,
    unit_price: product?.price,
    subtotal: product?.itemTotal,
    image:product?.image,
    name:product?.name,
    unit:product?.unit,
    purchaseDPI:product?.purchaseDPI,
    purchaseFileType:product?.purchaseFileType,
    newLatestprice:product?.newLatestprice,
  };
}
