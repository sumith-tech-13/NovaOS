import type { Product } from "@/types";

export const PRODUCTS: Product[] = [
  { id: "1", name: "Wireless Mouse Pro", category: "Electronics", stock: 23, minStock: 30, price: 2499, status: "low-stock" },
  { id: "2", name: "Mechanical Keyboard", category: "Electronics", stock: 45, minStock: 20, price: 5499, status: "in-stock" },
  { id: "3", name: "USB-C Hub 7-in-1", category: "Electronics", stock: 0, minStock: 25, price: 1999, status: "out-of-stock" },
  { id: "4", name: "Ergonomic Office Chair", category: "Furniture", stock: 12, minStock: 10, price: 24999, status: "in-stock" },
  { id: "5", name: "Standing Desk Converter", category: "Furniture", stock: 8, minStock: 10, price: 34999, status: "low-stock" },
  { id: "6", name: "Noise Cancelling Headphones", category: "Electronics", stock: 34, minStock: 15, price: 12999, status: "in-stock" },
  { id: "7", name: "4K Monitor 27-inch", category: "Electronics", stock: 18, minStock: 10, price: 44999, status: "in-stock" },
  { id: "8", name: "Organic Green Tea (50 pack)", category: "Food & Bev", stock: 67, minStock: 20, price: 499, status: "in-stock" },
  { id: "9", name: "Premium Coffee Beans (1kg)", category: "Food & Bev", stock: 5, minStock: 15, price: 1299, status: "low-stock" },
  { id: "10", name: "A4 Printer Paper (5000 sheets)", category: "Office Supplies", stock: 120, minStock: 50, price: 2499, status: "in-stock" },
];
