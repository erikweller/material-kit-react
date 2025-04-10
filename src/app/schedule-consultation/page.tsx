'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';

// Declare global Calendly object
declare global {
  interface Window {
    Calendly?: {
      initInlineWidgets: () => void;
    };
  }
}

export default function ScheduleConsultation() {
  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null);
  const calendlyRef = useRef<HTMLDivElement>(null);
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
    if (!user || !calendlyRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => {
      const interval = setInterval(() => {
        if (window.Calendly?.initInlineWidgets) {
          window.Calendly.initInlineWidgets();
          clearInterval(interval);
        }
      }, 100);
    };

    document.body.appendChild(script);

    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data.event === 'calendly.event_scheduled') {
        console.log('✅ Calendly booking detected — redirecting to confirmation page');
        router.push('/consultation-confirmed');
      }
    };

    window.addEventListener('message', handleCalendlyEvent);

    return () => {
      document.body.removeChild(script);
      window.removeEventListener('message', handleCalendlyEvent);
    };
  }, [user]);

  const calendlyUrl = user
    ? `https://calendly.com/erikgweller/care-village-consultation?name=${encodeURIComponent(
        `${user.firstName} ${user.lastName}`
      )}&email=${encodeURIComponent(user.email)}`
    : 'https://calendly.com/erikgweller/care-village-consultation';

  return (
    <main className="min-h-screen bg-white font-sans">
      {/* Header */}
      <div className="w-full bg-slate-900 text-white">
          <header
        style={{ backgroundColor: '#212e5e', width: '100%', height: '64px' }}
        className="text-white shadow-sm"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full px-6">
          <div className="text-2xl font-bold tracking-tight flex items-center h-full">
            CareVillage
          </div>
      
              <div className="space-x-4">
              <Box display="flex" justifyContent="flex-end" mt={2}>
        
      </Box>
              </div>
            </div>
          </header>
        </div>


      {/* Content */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-12 items-start justify-center">
        {/* Left column */}
        <div className="max-w-xl space-y-6">
          <h2 className="text-4xl lg:text-5xl font-bold">Schedule Your Consultation</h2>
          <p className="text-gray-700 text-lg">
            CareVillage is a dedicated community of licensed mental health professionals who offer guidance,
            resources, and support for caregivers. Your consultation helps us match you with the best group for
            your caregiving journey.
          </p>
        </div>

        {/* Right column */}
        <div className="w-full">
          <div
            ref={calendlyRef}
            className="calendly-inline-widget shadow-xl rounded-xl border border-gray-200"
            data-url={calendlyUrl}
            style={{ minWidth: '320px', height: '700px' }}
          />
        </div>
      </section>
    </main>
  );
}
