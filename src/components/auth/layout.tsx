import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { paths } from '@/paths';
import { DynamicLogo } from '@/components/core/logo';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: { xs: 'flex', lg: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '100vh',
        backgroundColor: '#344780', // dark blue base
      }}
    >
      {/* Left: Sign Up Form Panel */}
      <Box
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          zIndex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          px: 5,
        }}
      >
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 6,
            width: '100%',
            maxWidth: '650px',
            my: 8,
            
            
            p: 4,
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-block' }}>
              <DynamicLogo colorDark="light" colorLight="dark" height={32} width={140} />
            </Box>
          </Box>

          {/* Form children */}
          <Box>{children}</Box>
        </Box>
      </Box>

      {/* Right: Video background */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          display: { xs: 'none', lg: 'block' },
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          <source src="/assets/carevillage-background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <Box
          sx={{
            position: 'absolute',
            zIndex: 1,
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(18, 38, 71, 0.5)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            px: 4,
          }}
        >
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
              Welcome to CareVillage
            </Typography>
            <Typography variant="subtitle1">
              Helping caregivers connect, share, and grow together.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
