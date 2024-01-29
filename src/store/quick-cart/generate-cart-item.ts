import isEmpty from 'lodash/isEmpty';
interface Item {
  id: string | number;
  name: string;
  slug: string;
  image: {
    thumbnail: string;
    [key: string]: unknown;
  };
  price: number;
  sale_price?: number;
  quantity?: number;
  [key: string]: unknown;
  language: string;
}
interface Variation {
  id: string | number;
  title: string;
  price: number;
  sale_price?: number;
  quantity: number;
  [key: string]: unknown;
}
export function generateCartItem(item: Item, variation: Variation) {
  const {
    _id,
    name,
    slug,
    image,
    price,
    sale_price,
    quantity,
    unit,
    is_digital,
    language,
    purchaseFileType,
    purchaseDPI,
    newLatestprice,
    defaultRate,
    user_id
  } = item;
 let id = _id;
  if (!isEmpty(variation)) {
    return {
      id: `${_id}.${variation._id}`,
      productId: _id,
      name: `${name} - ${variation.title}`,
      slug,
      unit,
      is_digital: variation?.is_digital,
      stock: variation.quantity,
      // price: Number(
      //   variation.sale_price ? variation.sale_price : variation.price
      // ),
      price: Number(
        variation?.newLatestprice ?? defaultRate
      ),
      base_amount: Number(
        variation.sale_price ? variation.sale_price : variation.price
      ),
      image: image,
      purchaseFileType:purchaseFileType,
      purchaseDPI:purchaseDPI,
      user_id:user_id,
      variationId: variation.id,
      language
    };
  }
  return {
    id,
    name,
    slug,
    unit,
    is_digital,
    image: image,
    stock: quantity,
    price: newLatestprice != undefined ? Number(newLatestprice) : Number(defaultRate),
    // price: Number(sale_price ? sale_price : price),
    base_amount:Number(sale_price ? sale_price : price),
    purchaseFileType:purchaseFileType,
    purchaseDPI:purchaseDPI,
    user_id:user_id,
    language
  };
}
