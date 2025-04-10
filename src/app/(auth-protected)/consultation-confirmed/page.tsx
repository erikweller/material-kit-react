'use client';

import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Modal,
  Toolbar,
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
  const [showJoinButton, setShowJoinButton] = useState(false);
  const [meetingStarted, setMeetingStarted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number } | null>(null);

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const res = await fetch('/api/me');
        
        if (!res.ok) throw new Error(`❌ /api/me returned status ${res.status}`);
  
        const data = await res.json();
        console.log('👀 /api/me response:', data); // ✅ DEBUG
        setConsultation(data);
        console.log('👤 consultation data:', data);
        console.log('🔥 scheduledAt:', data.consultationScheduledAt);


        
  
        

      if (data.consultationScheduledAt) {
        const date = new Date(data.consultationScheduledAt);
        console.log('📆 Parsed scheduledTime:', date); // ✅ DEBUG
        setScheduledTime(date);
      } else {
        console.warn('⚠️ consultationScheduledAt is missing or null');
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
        setMeetingStarted(true);
        setTimeLeft(null);
        clearInterval(interval);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((distance / 1000 / 60) % 60);
        setTimeLeft({ days, hours, minutes });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [scheduledTime]);

  return (
    <main>
      <AppBar position="static" sx={{ backgroundColor: '#212e5e' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={700}>CareVillage</Typography>
          <Box display="flex" alignItems="center"  gap={4} sx={{marginRight: '10vh'}}>
            <Typography sx={{marginRight: '18vh'}} >Personal Assistant</Typography>
            <Button variant="text" sx={{
    color: 'white',
    '&:hover': {
      backgroundColor: 'transparent',
      
    },
  }} onClick={() => signOut({ callbackUrl: '/auth/sign-in' })}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" mt={6}>
          <Box width="60%">
            <Typography variant="h3" fontWeight={600} gutterBottom>
              Thank you for signing up
            </Typography>
            <Typography paragraph>
              We are very excited to meet you. You are currently being paired with a group and will meet your leader soon.
            </Typography>
            <Typography paragraph>
              While you wait for your consultation we have included some resources for you as well as free access to our personal assistant tool.
            </Typography>
            

            <Typography variant="h5" sx={{marginTop: '12vh'}} mt={4} mb={2}>Resources While You Wait</Typography>
            <Box display="flex" gap={2}>
              {/* Card 1 */}
              <Card sx={{ width: 300, cursor: 'pointer' }} onClick={() => setModalOpen(true)}>
                <CardContent>
                  <CardMedia
                    component="img"
                    height="100"
                    image="/assets/mantra.png"
                    alt="Tools"
                    sx={{ objectFit: 'contain' }}
                  />
                  <Typography variant="h6">Tools to use while you wait</Typography>
                  <Typography variant="body2">Apps and other techniques for making the time go faster</Typography>
                </CardContent>
              </Card>
              {/* Card 2 */}
              <Card sx={{ width: 300, cursor: 'pointer' }} onClick={() => window.open('https://www.mayoclinic.org/healthy-lifestyle/stress-management/in-depth/support-groups/art-20044655', '_blank')}>
                <CardContent>
                  <CardMedia
                    component="img"
                    height="100"
                    image="/assets/Stress.png"
                    alt="Support"
                    sx={{ objectFit: 'contain' }}
                  />
                  <Typography variant="h6">Support groups: Make connections, get help</Typography>
                  <Typography variant="body2">How the right group can make a difference</Typography>
                </CardContent>
              </Card>
              {/* Card 3 */}
              <Card sx={{ width: 300, cursor: 'pointer', backgroundColor: '#fffbe6' }} onClick={() => window.open('https://www.health.harvard.edu/blog/self-care-for-the-caregiver-201810171716', '_blank')}>
                <CardContent>
                  <CardMedia
                    component="img"
                    height="100"
                    image="/assets/SelfCare.png"
                    alt="Self-care"
                    sx={{ objectFit: 'contain' }}
                  />
                  <Typography variant="h6">Self-care for caregiver</Typography>
                  <Typography variant="body2">What works for you? Try these methods to maintain balance</Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>

          <Box width="35%" textAlign="center">
            <Typography variant="h6" fontWeight={600}>YOUR MEETING IS SCHEDULED</Typography>
            {meetingStarted ? (
              <Typography mt={2} fontWeight={600}>Your meeting is beginning now.</Typography>
            ) : timeLeft ? (
              <Box display="flex" justifyContent="center" mt={2} mb={1} gap={1}>
                <Box border={1} p={2} borderRadius={2} minWidth={80}>
                  <Typography variant="h5" fontWeight={700}>{timeLeft.days.toString().padStart(2, '0')}</Typography>
                  <Typography variant="caption">DAYS</Typography>
                </Box>
                <Box border={1} p={2} borderRadius={2} minWidth={80}>
                  <Typography variant="h5" fontWeight={700}>{timeLeft.hours.toString().padStart(2, '0')}</Typography>
                  <Typography variant="caption">HOURS</Typography>
                </Box>
                <Box border={1} p={2} borderRadius={2} minWidth={80}>
                  <Typography variant="h5" fontWeight={700}>{timeLeft.minutes.toString().padStart(2, '0')}</Typography>
                  <Typography variant="caption">MINUTES</Typography>
                </Box>
              </Box>
            ) : (
              <Typography>Loading...</Typography>
            )}
            <Typography variant="h4" fontWeight={700} mt={1}>
              {scheduledTime && dayjs(scheduledTime).format('MMMM D, YYYY')}
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
          </Box>
        </Box>

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
    </main>
  );
}
