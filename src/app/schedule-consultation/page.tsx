'use client';
import * as React from "react";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cal, { getCalApi } from '@calcom/embed-react';
import { Box } from '@mui/material';



export default function ScheduleConsultation() {
  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/me');
        if (!res.ok) throw new Error('Not logged in');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    }

    fetchUser();
  }, []);

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: 'carevillage' });
      cal('ui', {
        theme: 'light',
        layout: 'month_view',
        hideEventTypeDetails: false,
      });

      window.addEventListener('message', (e) => {
        if (e.data.event === 'cal.event_scheduled') {
          console.log('✅ Cal.com booking detected — redirecting');
          router.push('/consultation-confirmed');
        }
      });
    })();
  }, [router]);

  return (
    <main className="min-h-screen bg-white font-sans">
      {/* Header */}
      <div className="w-full bg-slate-900 text-white">
        <header style={{ backgroundColor: '#212e5e', width: '100%', height: '64px' }} className="text-white shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between h-full px-6">
            <div className="text-2xl font-bold tracking-tight flex items-center h-full">CareVillage</div>
            <Box display="flex" justifyContent="flex-end" mt={2} />
          </div>
        </header>
      </div>

      {/* Content Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-12 items-start justify-center">
        {/* Left column: consultation pitch */}
        <div className="max-w-xl space-y-6">
          <h2 className="text-4xl lg:text-5xl font-bold">Schedule Your Consultation</h2>
          <p className="text-gray-700 text-lg">
            CareVillage is a dedicated community of licensed mental health professionals who offer guidance, resources,
            and support for caregivers. Your consultation helps us match you with the best group for your caregiving
            journey.
          </p>

          <div className="mt-10 p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
            <h3 className="text-xl font-semibold mb-2">Available Times</h3>
            <p>Select a day on the calendar to view available consultation slots. Time options will appear here.</p>
            <p className="text-sm text-gray-500 mt-2 italic">*Times are based on your local time zone.</p>
          </div>
        </div>

        {/* Right column: Cal.com inline embed */}
        <div className="w-full h-[700px]">
          <Cal
            namespace="carevillage"
            calLink="carevillage/30min"
            style={{ width: '100%', height: '100%', overflow: 'scroll' }}
            config={{ layout: 'month_view', theme: 'light' }}
          />
        </div>
      </section>
    </main>
  );
}
