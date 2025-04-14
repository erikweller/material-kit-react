'use client';
import * as React from "react";
import { useEffect } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';

// ✅ FILE: src/components/CalcomEmbed.tsx

interface CalcomEmbedProps {
  name: string;
  email: string;
}

export default function CalcomEmbed({ name, email }: CalcomEmbedProps) {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: '30min' });
      cal('ui', {
        theme: 'light',
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    })();
  }, []);

  return (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      {/* Placeholder time slot area (static for now) */}
      <div style={{ flex: 1 }}>
        <h3 className="text-xl font-semibold mb-2">Available Times</h3>
        <p className="text-sm text-gray-600">Select a day to see time slots here.</p>
        {/* Replace with dynamic slot viewer if Cal adds support */}
      </div>

      {/* Cal embed */}
      <div style={{ flex: 2, minWidth: '320px', height: '700px', overflow: 'auto' }}>
        <Cal
          namespace="30min"
          calLink="carevillage/30min"
          config={{ layout: 'month_view', theme: 'light' }}
          style={{ width: '100%', height: '100%', overflow: 'scroll' }}
        />
      </div>
    </div>
  );
}
