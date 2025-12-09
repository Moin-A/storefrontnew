
export const SOLIDUS_ROUTES = {
  frontend: {
    home: '/',
    products: '/shop',
    product_detail: '/shop/[slug]',
    categories: '/shop/categories',
    category_detail: '/shop/categories/[slug]',
    search: '/shop/search',
    cart: '/cart',
    checkout: '/checkout',
    login: '/account/login',
    register: '/account/register',
    password_change: '/password/change',
    account: '/account',
    orders: '/account/orders',
    order_detail: '/account/orders/[id]',
    addresses: '/account/addresses',
    profile: '/profile'
  },
  
  api: {
    // Authentication
    login: '/api/login',
    register: '/api/register',
    password_recover: '/api/auth/password/recover',
    password_change: '/api/auth/password/change',
    logout: '/api/auth/logout',
    
    // Products
    products: '/api/products',
    product: '/api/product',
    product_detail: '/api/products/[id]',
    product_variants: '/api/products/[id]/variants',
    product_properties: (id:string|number)=>`/api/products/${id}/product_properties`,
    search_products: '/api/search/products',
    elasticsearch_products: '/api/search/elasticsearch',
    
    // Categories/Taxons
    taxons: '/api/taxons',
    taxon_detail: '/api/taxons/[id]',
    taxon_products: (id:string|number|undefined)=>`/api/taxons/${id}/products`,
    category_taxons: (id:string|number)=>`/api/${id}/taxons`,
    top_rated_products: (id:string|number|undefined)=>`/api/products/top_rated?permalink=${encodeURIComponent(id || '')}`,

    // Cart/Orders
    current_order: '/api/orders/current',
    orders: '/api/orders',
    order_detail: '/api/orders/[id]',
    review_product: (id:string|number)=>`/api/orders/${id}/review_product`,
    
    // Line Items (Cart Items)
    line_items: '/api/orders/current/line_items',
    add_to_cart: '/api/cart/add',
    update_cart_item: '/api/orders/current/line_items/[id]',
    remove_cart_item: '/api/orders/current/line_items/[id]',
    
    // Checkout
    checkout_next: (id:string|number|undefined)=>`/api/checkouts/${id}/next`,
    checkout_update: (id:string|number|undefined)=>`/api/checkouts/${id}/update`,
    checkout_advance: '/api/checkouts/[id]/advance',
    checkout_complete: (id:string|number|undefined)=>`/api/checkouts/${id}/complete`,
    
    // Addresses
    addresses: '/api/addresses',
    countries: '/api/countries',
    states: '/api/countries/[country_id]/states',
    
    // Payments
    payment_methods: '/api/payment_methods',
    payments: '/api/orders/[id]/payments',
    
    // Shipments
    shipping_methods: '/api/shipping_methods',
    shipments: '/api/orders/[id]/shipments',
    
    // User
    user_profile: '/api/user',
    user_orders: '/api/user/orders',
    user_addresses: '/api/user/addresses',

    //store

    stores: '/api/stores'
  }
};

