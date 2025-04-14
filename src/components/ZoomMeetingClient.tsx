'use client';
import * as React from "react";
import { useEffect, useRef } from 'react';
import ZoomMtgEmbedded from '@zoomus/websdk/embedded';



interface Props {
  signature: string;
  sdkKey: string;
  meetingNumber: string;
  userName: string;
  password: string;
  onMeetingEnd: () => void;
}

export default function ZoomMeetingClient({
  signature,
  sdkKey,
  meetingNumber,
  userName,
  password,
  onMeetingEnd,
}: Props) {
  const zoomContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const client = ZoomMtgEmbedded.createClient();

    const zoomRoot = zoomContainerRef.current;
    if (!zoomRoot) return;

    client.init({
      zoomAppRoot: zoomRoot, // ✅ Corrected line
      language: 'en-US',
      customize: {
        video: {
          isResizable: false,
          viewSizes: {
            default: {
              width: 1000,
              height: 600,
            },
            ribbon: {
              width: 300,
              height: 700,
            },
          },
        },
      },
    });

    client.join({
      sdkKey,
      signature,
      meetingNumber,
      password,
      userName,
      success: () => {
        console.log('✅ Zoom joined');
      },
      error: (err: unknown /* TODO: tighten type */) => {
        console.error('❌ Zoom join error', err);
        onMeetingEnd();
      },
    });

    const handleLeave = () => {
      client.leaveMeeting();
      onMeetingEnd();
    };

    window.addEventListener('beforeunload', handleLeave);
    return () => {
      window.removeEventListener('beforeunload', handleLeave);
      client.leaveMeeting();
    };
  }, [sdkKey, signature, meetingNumber, password, userName, onMeetingEnd]);

  return (
    <div
      ref={zoomContainerRef}
      id="meetingSDKElement"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 600,
        height: 600,
        zIndex: 9999,
      }}
    />
  );
}
