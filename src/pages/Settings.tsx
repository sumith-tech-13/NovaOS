import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Building2, Bell, CreditCard, Shield, Palette, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { TextInput, Textarea, Select, Switch } from "@/components/common/Input";
import { Skeleton } from "@/components/common/Skeleton";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/utils/cn";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "company", label: "Company", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
];

const STORAGE_PROFILE = "settings_profile";
const STORAGE_COMPANY = "settings_company";
const STORAGE_NOTIFICATIONS = "settings_notifications";
const STORAGE_APPEARANCE = "settings_appearance";

function load<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch {}
  return fallback;
}

export function Settings() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState<string | null>(null);
  const { theme, toggle } = useTheme();

  const [profile, setProfile] = useState(() => load(STORAGE_PROFILE, { firstName: "Sumith", lastName: "Kumar", email: "sumith@novatech.com", phone: "+91 98765 43210" }));
  const [company, setCompany] = useState(() => load(STORAGE_COMPANY, { name: "NovaTech Solutions", industry: "Technology & Business Services", employees: "48", description: "AI-powered business operating system for SMBs." }));
  const [notifications, setNotifications] = useState(() => load(STORAGE_NOTIFICATIONS, { approvals: true, inventory: true, weekly: true, insights: true, team: false, billing: true }));
  const [appearance, setAppearance] = useState(() => load(STORAGE_APPEARANCE, { theme: "dark", fontSize: "md" }));

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  function handleSave(key: string, data: unknown, label: string) {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("profile-updated"));
    setSaved(label);
    setTimeout(() => setSaved(null), 2000);
  }

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-5xl mx-auto">
        <div><Skeleton className="h-7 w-32" /><Skeleton className="h-4 w-56 mt-2" /></div>
        <div className="flex gap-4"><Skeleton className="h-9 w-24" /><Skeleton className="h-9 w-24" /><Skeleton className="h-9 w-28" /></div>
        <div className="max-w-xl"><Skeleton className="h-64 rounded-xl" /></div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary mt-0.5">Manage your account and preferences</p>
      </div>

      <div className="flex gap-0 border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap",
              activeTab === tab.id
                ? "border-brand-600 text-text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary",
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "profile" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <TextInput label="First Name" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
                  <TextInput label="Last Name" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
                </div>
                <TextInput label="Email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                <TextInput label="Phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                <div className="flex items-center gap-3 pt-2">
                  <Button onClick={() => handleSave(STORAGE_PROFILE, profile, "Profile saved")}>Save Changes</Button>
                  {saved && <span className="flex items-center gap-1 text-xs text-green-500"><Check className="h-3 w-3" />{saved}</span>}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === "company" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Manage your business details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <TextInput label="Company Name" value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} />
                <TextInput label="Industry" value={company.industry} onChange={(e) => setCompany({ ...company, industry: e.target.value })} />
                <TextInput label="Employee Count" value={company.employees} onChange={(e) => setCompany({ ...company, employees: e.target.value })} />
                <Textarea label="Company Description" rows={3} value={company.description} onChange={(e) => setCompany({ ...company, description: e.target.value })} />
                <div className="flex items-center gap-3 pt-2">
                  <Button onClick={() => handleSave(STORAGE_COMPANY, company, "Company saved")}>Save Changes</Button>
                  {saved && <span className="flex items-center gap-1 text-xs text-green-500"><Check className="h-3 w-3" />{saved}</span>}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === "notifications" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what to be notified about</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Switch label="Workflow approvals" checked={notifications.approvals} onCheckedChange={(c) => setNotifications({ ...notifications, approvals: c })} />
                  <Switch label="Inventory alerts" checked={notifications.inventory} onCheckedChange={(c) => setNotifications({ ...notifications, inventory: c })} />
                  <Switch label="Weekly performance report" checked={notifications.weekly} onCheckedChange={(c) => setNotifications({ ...notifications, weekly: c })} />
                  <Switch label="New AI insights" checked={notifications.insights} onCheckedChange={(c) => setNotifications({ ...notifications, insights: c })} />
                  <Switch label="Team activity updates" checked={notifications.team} onCheckedChange={(c) => setNotifications({ ...notifications, team: c })} />
                  <Switch label="Billing and subscription" checked={notifications.billing} onCheckedChange={(c) => setNotifications({ ...notifications, billing: c })} />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Button onClick={() => handleSave(STORAGE_NOTIFICATIONS, notifications, "Preferences saved")}>Save Preferences</Button>
                  {saved && <span className="flex items-center gap-1 text-xs text-green-500"><Check className="h-3 w-3" />{saved}</span>}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === "billing" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Plan</CardTitle>
                <CardDescription>Manage your subscription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-border bg-surface-secondary p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text-primary">Business Plan</span>
                    <span className="rounded-full bg-brand-50 dark:bg-brand-500/10 px-2.5 py-0.5 text-xs font-medium text-brand-600 dark:text-brand-400">Active</span>
                  </div>
                  <p className="text-xs text-text-secondary">$49/month · 48 users · Next billing: Aug 4, 2026</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary">Change Plan</Button>
                  <Button variant="ghost">View Invoices</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === "security" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage password and authentication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <TextInput label="Current Password" type="password" placeholder="Enter current password" />
                <TextInput label="New Password" type="password" placeholder="Enter new password" />
                <TextInput label="Confirm Password" type="password" placeholder="Confirm new password" />
                <div className="flex items-center gap-3 pt-2">
                  <Button onClick={() => { setSaved("Password updated (simulated)"); setTimeout(() => setSaved(null), 2000); }}>Update Password</Button>
                  {saved && <span className="flex items-center gap-1 text-xs text-green-500"><Check className="h-3 w-3" />{saved}</span>}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === "appearance" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize your workspace look</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  label="Theme"
                  value={appearance.theme}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAppearance({ ...appearance, theme: val });
                    if (val === "light") toggle();
                    else if (val === "dark" && theme !== "dark") toggle();
                  }}
                  options={[
                    { value: "dark", label: "Dark" },
                    { value: "light", label: "Light" },
                    { value: "system", label: "System" },
                  ]}
                />
                <Select
                  label="Font Size"
                  value={appearance.fontSize}
                  onChange={(e) => setAppearance({ ...appearance, fontSize: e.target.value })}
                  options={[
                    { value: "sm", label: "Small" },
                    { value: "md", label: "Medium" },
                    { value: "lg", label: "Large" },
                  ]}
                />
                <div className="flex items-center gap-3 pt-2">
                  <Button onClick={() => handleSave(STORAGE_APPEARANCE, appearance, "Appearance saved")}>Apply</Button>
                  {saved && <span className="flex items-center gap-1 text-xs text-green-500"><Check className="h-3 w-3" />{saved}</span>}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
