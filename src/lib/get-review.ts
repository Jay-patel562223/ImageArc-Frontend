export function getReview(product: any) {
  if (product?.pivot?.variation_option_id) {
    return product?.products?.my_review?.find(
      (review: any) =>
        review?.variation_option_id === product?.pivot?.variation_option_id
    );
  } else {
    return product;
    // return product?.products?.my_review;
    // return product?.my_review?.[0];
  }
}