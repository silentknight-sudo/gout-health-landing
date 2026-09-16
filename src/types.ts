export interface OrderFormData {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  pincode?: string;
  city?: string;
  notes?: string;
  combo?: string;
}

export interface OrderResponse {
  success: boolean;
  orderId?: string;
  isDuplicate?: boolean;
  message: string;
  syncedToSheets?: boolean;
  sheetError?: string | null;
  orderDetails?: any;
}

export interface OrderDetail {
  timestamp: string;
  name: string;
  phone: string;
  email: string;
  status: 'pending' | 'confirmed' | 'delivered';
  orderId: string;
  dateOrdered: string;
  notes: string;
  source?: string;
}

export interface AdminStats {
  totalOrders: number;
  dataSource: string;
  sheetId: string;
  orders: OrderDetail[];
  stats: {
    pending: number;
    confirmed: number;
    delivered: number;
  };
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  age: number;
  location: string;
  rating: number;
  reliefBadge: string;
  quote: string;
  avatarInitial: string;
}

export interface IngredientItem {
  nameHindi: string;
  nameBotanical: string;
  description: string;
  iconType: string;
}
