export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

export interface KPI {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: string;
  path?: string;
}

export interface Activity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  user: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
}

export interface WorkflowStep {
  label: string;
  status: "completed" | "active" | "pending";
  timestamp?: string;
}

export interface Workflow {
  id: string;
  type: "leave" | "expense" | "purchase" | "order";
  title: string;
  status: "pending" | "approved" | "rejected";
  steps: WorkflowStep[];
  createdAt: string;
}

export interface Insight {
  icon: string;
  text: string;
  color: string;
}

export interface HealthScore {
  score: number;
  trend: "up" | "down" | "stable";
  label: string;
  description: string;
  path?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  description: string;
  path?: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  time: string;
}

export interface TaskItem {
  id: string;
  title: string;
  due: string;
  priority: "high" | "medium" | "low";
}

export interface NotificationItem {
  id: string;
  type: "approval" | "alert" | "update" | "reminder" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionPath?: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  isFavorite?: boolean;
}

export interface ChatMessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface SuggestedPrompt {
  id: string;
  label: string;
  icon: string;
  description: string;
  responseKey: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: "Admin" | "Manager" | "Employee";
  status: "active" | "inactive" | "on-leave";
  joinDate: string;
  performanceScore: number;
  phone?: string;
}

export interface Department {
  id: string;
  name: string;
  headCount: number;
  head?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: "annual" | "sick" | "personal";
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
  reason: string;
  submittedAt: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  type: "report" | "policy" | "invoice" | "contract" | "memo" | "proposal";
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface BusinessTemplate {
  id: string;
  category: "reports" | "communications" | "operations";
  label: string;
  description: string;
  icon: string;
  prompt: string;
  color: string;
}

export interface PromptLibraryItem {
  id: string;
  category: "operations" | "sales" | "hr" | "finance" | "custom";
  title: string;
  content: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEvent {
  id: string;
  type: "workflow" | "analytics" | "inventory" | "order" | "invoice" | "employee" | "document" | "system";
  message: string;
  timestamp: string;
  user: string;
  read: boolean;
}

export type UserRole = "admin" | "manager" | "hr" | "employee";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}
