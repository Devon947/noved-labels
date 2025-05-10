import { DashboardShell } from '@/components/dashboard/shell';

export default function NewTicketLayout({ children }) {
  return (
    <DashboardShell>
      {children}
    </DashboardShell>
  );
} 