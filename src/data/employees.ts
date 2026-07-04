import type { Employee, Department, LeaveRequest } from "@/types";

export const DEPARTMENTS: Department[] = [
  { id: "d1", name: "Engineering", headCount: 12, head: "Sarah Chen" },
  { id: "d2", name: "Marketing", headCount: 8, head: "James Wilson" },
  { id: "d3", name: "Sales", headCount: 10, head: "Maria Garcia" },
  { id: "d4", name: "Human Resources", headCount: 6, head: "Emily Davis" },
  { id: "d5", name: "Finance", headCount: 4, head: "Robert Kim" },
  { id: "d6", name: "Operations", headCount: 8, head: "Alex Thompson" },
];

export const EMPLOYEES: Employee[] = [
  { id: "e1", name: "Sarah Chen", email: "sarah.chen@novatech.com", department: "Engineering", role: "Manager", status: "active", joinDate: "2021-03-15", performanceScore: 95, phone: "+1 (555) 123-4567" },
  { id: "e2", name: "James Wilson", email: "james.wilson@novatech.com", department: "Marketing", role: "Manager", status: "active", joinDate: "2021-06-01", performanceScore: 88, phone: "+1 (555) 234-5678" },
  { id: "e3", name: "Maria Garcia", email: "maria.garcia@novatech.com", department: "Sales", role: "Manager", status: "active", joinDate: "2021-04-20", performanceScore: 91, phone: "+1 (555) 345-6789" },
  { id: "e4", name: "Emily Davis", email: "emily.davis@novatech.com", department: "Human Resources", role: "Manager", status: "active", joinDate: "2021-08-10", performanceScore: 85, phone: "+1 (555) 456-7890" },
  { id: "e5", name: "Robert Kim", email: "robert.kim@novatech.com", department: "Finance", role: "Manager", status: "active", joinDate: "2021-02-01", performanceScore: 93, phone: "+1 (555) 567-8901" },
  { id: "e6", name: "Alex Thompson", email: "alex.thompson@novatech.com", department: "Operations", role: "Manager", status: "active", joinDate: "2021-09-05", performanceScore: 82, phone: "+1 (555) 678-9012" },
  { id: "e7", name: "Priya Patel", email: "priya.patel@novatech.com", department: "Engineering", role: "Admin", status: "active", joinDate: "2021-05-12", performanceScore: 97, phone: "+1 (555) 789-0123" },
  { id: "e8", name: "David Miller", email: "david.miller@novatech.com", department: "Engineering", role: "Employee", status: "active", joinDate: "2022-01-20", performanceScore: 76, phone: "+1 (555) 890-1234" },
  { id: "e9", name: "Lisa Anderson", email: "lisa.anderson@novatech.com", department: "Marketing", role: "Employee", status: "active", joinDate: "2022-03-15", performanceScore: 79, phone: "+1 (555) 901-2345" },
  { id: "e10", name: "Kevin Johnson", email: "kevin.johnson@novatech.com", department: "Sales", role: "Employee", status: "inactive", joinDate: "2022-06-01", performanceScore: 72, phone: "+1 (555) 012-3456" },
  { id: "e11", name: "Jessica Brown", email: "jessica.brown@novatech.com", department: "Human Resources", role: "Employee", status: "on-leave", joinDate: "2022-04-10", performanceScore: 81, phone: "+1 (555) 111-2222" },
  { id: "e12", name: "Michael Lee", email: "michael.lee@novatech.com", department: "Finance", role: "Employee", status: "active", joinDate: "2022-07-22", performanceScore: 84, phone: "+1 (555) 333-4444" },
];

export const LEAVE_REQUESTS: LeaveRequest[] = [
  { id: "lr1", employeeId: "e11", employeeName: "Jessica Brown", type: "annual", startDate: "2025-07-10", endDate: "2025-07-14", status: "pending", reason: "Family vacation", submittedAt: "2025-06-20" },
  { id: "lr2", employeeId: "e10", employeeName: "Kevin Johnson", type: "sick", startDate: "2025-06-28", endDate: "2025-06-29", status: "pending", reason: "Medical appointment", submittedAt: "2025-06-25" },
  { id: "lr3", employeeId: "e3", employeeName: "Maria Garcia", type: "annual", startDate: "2025-07-20", endDate: "2025-07-25", status: "approved", reason: "Annual leave", submittedAt: "2025-06-15" },
  { id: "lr4", employeeId: "e8", employeeName: "David Miller", type: "personal", startDate: "2025-07-05", endDate: "2025-07-05", status: "pending", reason: "Personal errand", submittedAt: "2025-06-28" },
  { id: "lr5", employeeId: "e7", employeeName: "Priya Patel", type: "annual", startDate: "2025-08-01", endDate: "2025-08-10", status: "approved", reason: "International travel", submittedAt: "2025-06-01" },
];
