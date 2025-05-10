import React from 'react';
import Head from 'next/head';
import Sidebar from '../../components/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <>
      <Head>
        <title>NOVED Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="flex min-h-screen bg-black text-white">
        <Sidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </>
  );
}
