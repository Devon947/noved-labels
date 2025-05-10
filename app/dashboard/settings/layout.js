import { DashboardShell } from '@/components/dashboard/shell';

export default function SettingsLayout({ children }) {
  return (
    <DashboardShell>
      {children}
    </DashboardShell>
  );
} 