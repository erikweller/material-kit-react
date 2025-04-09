'use client';

//test
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
    <main>
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
  <Button
    variant="text"
    sx={{color: 'white'}}
    size="large"
    onClick={() => signOut({ callbackUrl: '/auth/sign-in' })}
  >
    Logout
  </Button>
</Box>
        </div>
      </div>
    </header>
  </div>
    <Container maxWidth="lg">
     
      
      
      <Box sx={{marginBottom: '15vh', marginTop: '25vh'}} textAlign="center" mt={8} mb={4}>
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
      <Typography variant="h4" mb={2}>
  Resources while you wait
</Typography>

<Box
  sx={{
    display: 'flex',
    justifyContent: 'center', // ✅ center the cards horizontally
    gap: 4,
    flexWrap: 'wrap',
  }}
>
  {/* Card 1 */}
  <Card
    sx={{
      display: 'flex',
      width: 320,
      height: 200,
      cursor: 'pointer',
    }}
    onClick={() => setModalOpen(true)}
  >
    <CardMedia
      component="img"
      sx={{ width: 140 }}
      image="/assets/mantra.png"
      alt="Tools to use while you wait"
    />
    <CardContent>
      <Typography component="div" variant="h6">
        Tools to use while you wait
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        Mantras, exercises and other techniques for handling the challenges of caring for a loved one or client.
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: '#212e5e', mt: 1, cursor: 'pointer' }}
        onClick={() => setModalOpen(true)}
      >
        more
      </Typography>
    </CardContent>
  </Card>

  {/* Card 2 */}
  <Card
    sx={{
      display: 'flex',
      width: 320,
      height: 200,
      cursor: 'pointer',
    }}
    onClick={() =>
      window.open(
        'https://www.mayoclinic.org/healthy-lifestyle/stress-management/in-depth/support-groups/art-20044655',
        '_blank'
      )
    }
  >
    <CardMedia
      component="img"
      sx={{ width: 140 }}
      image="/assets/Stress.png"
      alt="Support groups"
      
    />
    <CardContent sx={{ background: '#f9f9fa' }}>
      <Typography component="div" variant="h6" >
        Support groups: Make connections, get help
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        If you're facing a major illness or stressful life change, you don't have to go it alone. A support group can help. Find out how to choose the right one.
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: '#212e5e', mt: 1 }}
      >
        more
      </Typography>
    </CardContent>
  </Card>

  {/* Card 3 */}
  <Card
    sx={{
      display: 'flex',
      width: 320,
      height: 200,
      cursor: 'pointer',
    }}
    onClick={() =>
      window.open(
        'https://www.health.harvard.edu/blog/self-care-for-the-caregiver-201810171716',
        '_blank'
      )
    }
  >
    <CardMedia
      component="img"
      sx={{ width: 140 }}
      image="/assets/SelfCare.png"
      alt="Self-care for caregivers"
    />
    <CardContent>
      <Typography component="div" variant="h6">
        Self-care for the caregiver
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        5 ways to care for yourself if you are a caregiver. These small steps can protect your health, energy, and emotional wellbeing.
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: '#212e5e', mt: 1 }}
      >
        more
      </Typography>
    </CardContent>
  </Card>
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
