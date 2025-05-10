import { DashboardShell } from '@/components/dashboard/shell';

export default function ShipLayout({ children }) {
  return (
    <DashboardShell>
      {children}
    </DashboardShell>
  );
} 