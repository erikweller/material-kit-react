'use client';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Modal,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

export default function ConsultationScheduledPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [consultation, setConsultation] = useState<any | null>(null);
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [showJoinButton, setShowJoinButton] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const res = await fetch('/api/me');
        if (!res.ok) throw new Error(`❌ /api/me returned status ${res.status}`);

        const data = await res.json();
        console.log('🧾 Data from /api/me in consultation-confirmed:', data);

        setConsultation(data);
        if (data.consultationScheduledAt) {
          setScheduledTime(new Date(data.consultationScheduledAt));
        }
      } catch (error) {
        console.error('❌ Consultation-confirmed page fetch error:', error);
      }
    };

    fetchConsultation();
  }, []);

  useEffect(() => {
    if (!scheduledTime) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(scheduledTime).getTime() - now;

      if (distance <= 0) {
        setShowJoinButton(true);
        setTimeLeft('Your meeting is beginning now.');
        clearInterval(interval);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((distance / 1000 / 60) % 60);
        const seconds = Math.floor((distance / 1000) % 60);
        setTimeLeft(`${days}D ${hours}H ${minutes}M ${seconds}S`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [scheduledTime]);

  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="flex-end" mt={2}>
  <Button
    variant="outlined"
    color="error"
    size="small"
    onClick={() => signOut({ callbackUrl: '/auth/sign-in' })}
  >
    Logout
  </Button>
</Box>
      <Box textAlign="center" mt={8} mb={4}>
        {scheduledTime ? (
          <>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Your Consultation has been scheduled for {dayjs(scheduledTime).format('MMMM D, YYYY [at] h:mm A')}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              You have {timeLeft} until your meeting.
            </Typography>
            {showJoinButton && (
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => router.push('/zoom')}
              >
                Click to Join Meeting
              </Button>
            )}
          </>
        ) : (
          <Typography variant="h6">Loading consultation details...</Typography>
        )}
      </Box>

      {/* Resources Section */}
      <Typography variant="h6" mb={2}>
        Resources while you wait
      </Typography>
      <Card sx={{ display: 'flex', mb: 2, cursor: 'pointer' }} onClick={() => setModalOpen(true)}>
        <CardMedia
          component="img"
          sx={{ width: 160 }}
          image="/images/tools-card.jpg"
          alt="Tools to use while you wait"
        />
        <CardContent>
          <Typography component="div" variant="h6">
            Tools to use while you wait
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Mantras, exercises and other techniques for handling the challenges of caring for a loved one or client
          </Typography>
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Mantras for Caregivers
          </Typography>
          <Typography>“I am doing my best”</Typography>
          <Typography>“One day at a time”</Typography>

          <Box mt={2}>
            <Typography variant="h6" gutterBottom>
              Box Breathing
            </Typography>
            <Typography>
              Inhale for four seconds, hold for four seconds, exhale for four seconds, and hold for four seconds.
            </Typography>
          </Box>

          <Box mt={2}>
            <Typography variant="h6" gutterBottom>
              Chest Rub Exercise
            </Typography>
            <Typography>
              Close your eyes and rub your chest in a circular motion while breathing deeply. Repeat when overwhelmed or before entering stressful situations.
            </Typography>
          </Box>

          <Box mt={2}>
            <Typography variant="h6" gutterBottom>
              Enter Their Reality
            </Typography>
            <Typography>
              Your loved one may be experiencing something that isn’t real to you. Try not to contradict them or take their behaviors personally.
            </Typography>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}
