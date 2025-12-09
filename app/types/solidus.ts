export type User = {
  id?: string | number;
  email?: string;
  first_name?: string;
  last_name?: string;
  logged_in?: boolean;
  role?: 'admin' | 'user';
  addresses?: Address[];
};

export type Address = {
  id?: number|string;
  name?: string;
  firstname?: string;
  lastname?: string;
  address1?: string;
  address2?: string;
  city?: string;
  zipcode?: string;
  phone?: string;
  state_id?: number|string;
  state_name?: string;
  country_id?: number|string;
  country_name?: string;
  company?: string;
  user_address?: {
    default_billing?: boolean;
    default_shipping?: boolean;
  };
};

export type LineItem = {
  id?: number;
  quantity?: number;
  price?: string;
  total?: string;
  images?: Array<{
    id?: number;
    alt?: string;
    attachment_url?: string;
    url?: string;
    name?: string;
  }>;
  product?: {
    id?: number;
    name?: string;
    slug?: string;
    description?: string;
    images?: Array<{
      id?: number;
      alt?: string;
      attachment_url?: string;
      url?: string;
      name?: string;
    }>;
  };
  variant?: {
    id?: number;
    sku?: string;
    name?: string;
    images?: Array<{
      id?: number;
      alt?: string;
      attachment_url?: string;
      url?: string;
    }>;
    product?: {
      id?: number;
      name?: string;
      slug?: string;
      description?: string;
      images?: Array<{
        id?: number;
        alt?: string;
        attachment_url?: string;
        url?: string;
      }>;
    };
  };
};

export type Cart = {
  id?: number;
  number?: string;
  state?: 'cart';
  total?: string;
  item_total?: string;
  item_count?: number;
  line_items?: LineItem[];
  email?: string;
  ship_total: string
};

export type Order = {
  id?: number;
  number?: string;
  state?: 'address' | 'delivery' | 'payment' | 'confirm' | 'complete';
  total?: string;
  item_total?: string;
  item_count?: number;
  created_at?: string;
  updated_at?: string;
  line_items?: LineItem[];
  email?: string;
  bill_address?: Address;
  ship_address?: Address;
};

export type TaxonDetail = {
  id: number;
  parent_id: number | null;
  name: string;
  permalink: string;
  taxonomy_id: number;
  lft?: number;
  rgt?: number;
  icon_file_name?: string | null;
  icon_content_type?: string | null;
  icon_file_size?: number | null;
  icon_updated_at?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  depth?: number;
  attachment_url?: string | null;
};

export type ShippingMethod = {
  shipping_rate_id: string;
  shipment_id: string;
  name: string;
  display_cost: string;
  admin_name?: string;
  shipment?: {
    shipping_rates: Array<{
      id: string;
      name: string;
      cost: string;
      display_cost: string;
    }>;
  };
};

export type PaymentMethodType = 
  | 'Spree::PaymentMethod::Check'
  | 'Spree::PaymentMethod::CreditCard'
  | 'Spree::PaymentMethod::StoreCredit';

export type PaymentMethod = {
  id: number;
  name: string;
  description: string;
  active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  auto_capture: boolean | null;
  preferences: PaymentPreferences;
  preference_source: string | null;
  position: number;
  available_to_users: boolean;
  available_to_admin: boolean;
  type_before_removal: string | null;
};

// 🧾 Payment Method Types
export type PaymentPreferences = {
  server: string;
  test_mode: boolean;
};



// 💰 Payment
export type Payment = {
  id: number;
  amount: string;
  order_id: number;
  source_type: string | null;
  source_id: number | null;
  payment_method_id: number | null;
  state: string;
  response_code: string | null;
  avs_response: string | null;
  created_at: string;
  updated_at: string;
  number: string;
  cvv_response_code: string | null;
  cvv_response_message: string | null;
  customer_metadata: Record<string, unknown>;
  admin_metadata: Record<string, unknown>;
  payment_method?: PaymentMethod;
};

// 📦 Shipping
export type ShippingRate = {
  id: number;
  shipment_id: number;
  shipping_method_id: number;
  selected: boolean;
  cost: string;
  created_at: string;
  updated_at: string;
  tax_rate_id: number | null;
};

export type Shipment = {
  id: number;
  tracking: string | null;
  number: string;
  cost: string;
  shipped_at: string | null;
  order_id: number;
  state: string;
  created_at: string;
  updated_at: string;
  stock_location_id: number;
  adjustment_total: string;
  additional_tax_total: string;
  promo_total: string;
  included_tax_total: string;
  customer_metadata: Record<string, unknown>;
  admin_metadata: Record<string, unknown>;
  shipping_rates: ShippingRate[];
};

export type ProductImage = {
  id: number;
  viewable_type: string;
  viewable_id: number;
  attachment_width: number | null;
  attachment_height: number | null;
  attachment_file_size: number | null;
  position: number;
  attachment_content_type: string | null;
  attachment_file_name: string | null;
  attachment_updated_at: string | null;
  alt: string | null;
  created_at: string;
  updated_at: string;
  attachment_url?: string | null;
};

// 🛒 Product
export type Product = {
  id: number;
  name: string;
  description: string;
  available_on: string;
  deleted_at: string | null;
  slug: string;
  meta_description: string | null;
  meta_keywords: string | null;
  tax_category_id: number | null;
  shipping_category_id: number;
  created_at: string;
  updated_at: string;
  promotionable: boolean;
  meta_title: string | null;
  discontinue_on: string | null;
  primary_taxon_id: number | null;
  images: ProductImage[];
  avg_rating?: string | number;
};

// 🧾 Line Item

// 🧺 Order Details (Main Type)
export type OrderDetails = {
  id: number;
  number: string;
  item_total: string;
  total: string;
  state: string;
  adjustment_total: string;
  user_id: number;
  completed_at: string | null;
  bill_address_id: number;
  ship_address_id: number;
  payment_total: string;
  shipment_state: string | null;
  payment_state: string | null;
  email: string;
  special_instructions: string | null;
  created_at: string;
  updated_at: string;
  currency: string;
  last_ip_address: string | null;
  created_by_id: number | null;
  shipment_total: string;
  additional_tax_total: string;
  promo_total: string;
  channel: string;
  included_tax_total: string;
  item_count: number;
  approver_id: number | null;
  approved_at: string | null;
  confirmation_delivered: boolean;
  guest_token: string;
  canceled_at: string | null;
  canceler_id: number | null;
  store_id: number;
  approver_name: string | null;
  frontend_viewable: boolean;
  customer_metadata: Record<string, unknown>;
  admin_metadata: Record<string, unknown>;
  line_items: LineItem[];
  bill_address: Address;
  ship_address: Address;
  shipments: Shipment[];
  payments: Payment[];
};
