import { DashboardShell } from '@/components/dashboard/shell';

export default function TicketsLayout({ children }) {
  return (
    <DashboardShell>
      {children}
    </DashboardShell>
  );
} 