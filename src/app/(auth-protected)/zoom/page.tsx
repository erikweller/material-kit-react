'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';

// Import ZoomMeetingClient dynamically (no SSR)
const ZoomMeetingClient = dynamic(() => import('@/components/ZoomMeetingClient'), {
  ssr: false,
});

// Define the expected props for ZoomMeetingClient
interface ZoomClientProps {
  sdkKey: string;
  meetingNumber: string;
  signature: string;
  password: string;
  userName: string;
  onMeetingEnd: () => void;
}

// Assert ZoomMeetingClient has the right props
const TypedZoomClient = ZoomMeetingClient as FC<ZoomClientProps>;

export default function ZoomPage() {
  const router = useRouter();
  const [meetingData, setMeetingData] = useState<ZoomClientProps | null>(null);

  useEffect(() => {
    const loadMeeting = async () => {
      const meRes = await fetch('/api/me');
      const me = (await meRes.json()) as {
        consultationZoomLink: string;
        firstName: string;
        lastName: string;
      };

      const zoomId = typeof me.consultationZoomLink === 'string'
        ? me.consultationZoomLink.split('/j/')[1] ?? ''
        : '';

      const sigRes = await fetch('/api/zoom/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingNumber: zoomId, role: 0 }),
      });

      const sigData = (await sigRes.json()) as { signature: string };

      setMeetingData({
        sdkKey: process.env.NEXT_PUBLIC_ZOOM_SDK_KEY || '',
        meetingNumber: zoomId,
        signature: sigData.signature,
        password: '',
        userName: `${me.firstName} ${me.lastName}`,
        onMeetingEnd: () => {
          console.log('👋 Meeting ended');
          setTimeout(() => {
            router.push('/joingroup');
          }, 500);
        },
      });
    };

    loadMeeting();
  }, [router]);

  if (!meetingData) return null;

  return <TypedZoomClient {...meetingData} />;
}
