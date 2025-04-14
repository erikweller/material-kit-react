import * as React from 'react'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

'use client';

const ZoomMeetingClient = dynamic(() => import('@/components/ZoomMeetingClient'), {
  ssr: false,
});

export default function ZoomPage() {
  const router = useRouter();
  const [meetingData, setMeetingData] = useState<any | null>(null);

  useEffect(() => {
    const loadMeeting = async () => {
      const meRes = await fetch('/api/me');
      const me = await meRes.json();
      const zoomId = me.consultationZoomLink?.split('/j/')[1] ?? '';

      const sigRes = await fetch('/api/zoom/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingNumber: zoomId, role: 0 }),
      });

      const { signature } = await sigRes.json();

      setMeetingData({
        sdkKey: process.env.NEXT_PUBLIC_ZOOM_SDK_KEY!,
        meetingNumber: zoomId,
        signature,
        password: '',
        userName: `${me.firstName} ${me.lastName}`,
        onMeetingEnd: () => {
          console.log('👋 Meeting ended');
          setTimeout(() => { router.push('/joingroup'); }, 500);
        },
      });
    };

    loadMeeting();
  }, []);

  if (!meetingData) return null;

  const ZoomClient = ZoomMeetingClient as unknown /* TODO: replace with correct type */;
  return <ZoomClient {...meetingData} />;
}
