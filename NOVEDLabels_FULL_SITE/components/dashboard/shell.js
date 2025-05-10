import React from 'react';
import Link from 'next/link';

const DashboardShell = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="hidden items-center space-x-2 md:flex">
              <span className="hidden font-bold sm:inline-block">
                NOVED Labels
              </span>
            </Link>
          </div>
          <nav className="flex items-center gap-2">
            <Link 
              href="/auth/signout"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Sign Out
            </Link>
          </nav>
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex lg:w-[240px]">
          <nav className="flex flex-col gap-2 py-6">
            <Link 
              href="/dashboard"
              className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Dashboard
            </Link>
            <Link 
              href="/dashboard/ship"
              className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Ship
            </Link>
            <Link 
              href="/dashboard/tickets"
              className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Tickets
            </Link>
            <Link 
              href="/dashboard/settings"
              className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Settings
            </Link>
          </nav>
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-6">
          {children}
        </main>
      </div>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} NOVED Labels. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export { DashboardShell }; 