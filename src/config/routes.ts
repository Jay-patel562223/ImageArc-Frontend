export const Routes = {
  home: '/',
  checkout: '/checkout',
  checkoutDigital: '/checkout/digital',
  checkoutGuest: '/checkout/guest',
  subscriptionCheckout: '/checkout/subscription_checkout',
  profile: '/profile',
  changePassword: '/change-password',
  orders: '/orders',
  order: (tracking_number: string) =>
    `/orders/${encodeURIComponent(tracking_number)}`,
  subscriptionsListForPurchase: '/subscription-list',
  transactions: '/transactions',
  subscription_view: (id: string) =>
    `/subscription/${encodeURIComponent(id)}`,
  refunds: '/refunds',
  help: '/help',
  logout: '/logout',
  coupons: '/offers',
  orderReceived: '/order-received',
  products: '/products',
  product: (slug: string) => {
    // if (asPath) {
    //   return `/products/${encodeURIComponent(slug)}?type=${asPath}`;  
    // }
    return `/products?id=${slug}`;
    // return `/products/${slug}`;
    // return `/products/${encodeURIComponent(slug)}`;
  },
  privacy: '/privacy',
  terms: '/terms',
  contactUs: '/contact',
  subscription: '/subscription',
  shops: '/shops',
  categories: '/categories',
  // products_category:'/products_category',
  shop: (slug: string) => `/shops/${encodeURIComponent(slug)}`,
  products_category: (slug: string,name:string) => `/categories?id=${encodeURIComponent(slug)}&category=${name}`,
  downloads: '/downloads',
  authors: '/authors',
  author: (slug: string) => `/authors/${encodeURIComponent(slug)}`,
  manufacturers: '/manufacturers',
  manufacturer: (slug: string) => `/manufacturers/${encodeURIComponent(slug)}`,
  search: '/search',
  wishlists: '/wishlists',
  questions: '/questions',
  reports: '/reports',
};
