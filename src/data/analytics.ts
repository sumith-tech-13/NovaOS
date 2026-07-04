import type { KPI } from "@/types";

export const SPARKLINES = {
  revenue: [72000, 68500, 74500, 71000, 78000, 76500, 81000, 79500, 82450],
  orders: [32, 28, 35, 30, 38, 36, 42, 40, 47],
  employees: [42, 44, 43, 45, 46, 45, 47, 48, 48],
  inventoryValue: [210, 205, 198, 190, 185, 180, 175, 170, 165],
};

export const KPI_DATA: KPI[] = [
  { label: "Total Revenue", value: "$82,450", change: 14, changeLabel: "vs last month", icon: "revenue", path: "/analytics" },
  { label: "Orders Today", value: "47", change: 8.2, changeLabel: "vs yesterday", icon: "orders", path: "/analytics" },
  { label: "Active Employees", value: "48", change: 4, changeLabel: "this quarter", icon: "employees", path: "/employees" },
  { label: "Inventory Value", value: "$182.4K", change: -3.1, changeLabel: "vs last month", icon: "inventory", path: "/inventory" },
];

export const REVENUE_CHART_DATA = [
  { month: "Jan", revenue: 38500, forecast: 36000 },
  { month: "Feb", revenue: 41200, forecast: 39000 },
  { month: "Mar", revenue: 43800, forecast: 42000 },
  { month: "Apr", revenue: 46500, forecast: 45000 },
  { month: "May", revenue: 49200, forecast: 48000 },
  { month: "Jun", revenue: 52800, forecast: 51000 },
  { month: "Jul", revenue: 56100, forecast: 54000 },
  { month: "Aug", revenue: 59800, forecast: 57000 },
  { month: "Sep", revenue: 63400, forecast: 61000 },
  { month: "Oct", revenue: 67800, forecast: 65000 },
  { month: "Nov", revenue: 72400, forecast: 69000 },
  { month: "Dec", revenue: 82450, forecast: 74000 },
];

export const ORDERS_CHART_DATA = [
  { month: "Jan", orders: 28 },
  { month: "Feb", orders: 32 },
  { month: "Mar", orders: 30 },
  { month: "Apr", orders: 35 },
  { month: "May", orders: 38 },
  { month: "Jun", orders: 36 },
  { month: "Jul", orders: 41 },
  { month: "Aug", orders: 44 },
  { month: "Sep", orders: 42 },
  { month: "Oct", orders: 47 },
  { month: "Nov", orders: 45 },
  { month: "Dec", orders: 47 },
];
