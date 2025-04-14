import * as React from 'react'
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import useOnclickOutside from 'react-cool-onclickoutside';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';


import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  FormGroup,
  FormControlLabel,
  AppBar,
  Toolbar,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// src/app/user-info/page.tsx
'use client';

export default function UserInfoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    otherGender: '',
    occupation: '',
    bestContactTime: '',
    caregivingRole: '',
    otherCaregivingRole: '',
    careRecipientAge: '',
    careRecipientCondition: '',
    challenges: [] as string[],
    communicationMethod: '',
    phoneNumber: '',
    interests: [] as string[],
    location: '',
    consultationZoomLink: '',
    consultationScheduledAt: '',
    calendlyRescheduleUrl: '',
    calendlyCancelUrl: '',
  });

  const yourAgeOptions = Array.from({ length: 83 }, (_, i) => (18 + i).toString());
  const ageOptions = Array.from({ length: 105 }, (_, i) => (1 + i).toString());

  const handleArrayChange = (field: 'challenges' | 'interests', value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // If user selected "Other" but left it blank, prevent submission
    if (formData.gender === 'Other' && !formData.otherGender.trim()) {
      alert('Please specify your gender identity.');
      return;
    }
  
    const finalData = {
      ...formData,
      gender: formData.gender === 'Other' ? formData.otherGender.trim() : formData.gender,
    };
  
    const res = await fetch('/api/user-info', {
      method: 'PUT',
      body: JSON.stringify(finalData),
      headers: { 'Content-Type': 'application/json' },
    });
  
    const data = await res.json();
  
    if (res.ok) {
      await fetch('/api/send-welcome-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.user?.email,
          name: `${data.user?.firstName || ''} ${data.user?.lastName || ''}`.trim(),
        }),
      });
      router.push('/schedule-consultation');
    } else {
      alert('❌ Something went wrong saving user info');
    }
  };
  

  const {
    ready,
    value: locationValue,
    suggestions: { status, data },
    setValue: setLocationValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { types: ['address'] },
    debounce: 300,
  });

  const locationRef = useOnclickOutside(() => {
    clearSuggestions();
  });

  const handleLocationInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationValue(e.target.value);
    setFormData({ ...formData, location: e.target.value });
  };

  const handleLocationSelect = (description: string) => () => {
    setLocationValue(description, false);
    setFormData({ ...formData, location: description });
    clearSuggestions();

    getGeocode({ address: description }).then((results) => {
      const { lat, lng } = getLatLng(results[0]);
      console.log('Coordinates:', { lat, lng });
    });
  };

  const renderFieldLabel = (text: string) => (
    <Typography fontWeight={600} fontSize="1rem" color="text.secondary" mb={0.5} mt={2}>
      {text}
    </Typography>
  );

  const renderLocationSuggestions = () =>
    data.map(({ place_id, structured_formatting: { main_text, secondary_text } }) => (
      <Box
        key={place_id}
        onClick={handleLocationSelect(`${main_text  }, ${  secondary_text}`)}
        sx={{ cursor: 'pointer', px: 2, py: 1, '&:hover': { backgroundColor: '#f0f0f0' } }}
      >
        <strong>{main_text}</strong> <small>{secondary_text}</small>
      </Box>
    ));

  return (
    <>
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
              <Box display="flex" justifyContent="flex-end" mt={2} />
              </div>
            </div>
          </header>
        </div>

      <Container maxWidth="sm">
        <Box mt={4} sx={{ color: 'black' }}>
          <Typography variant="h4" mb={3}>Tell Us About Yourself</Typography>

          <form onSubmit={handleSubmit}>
            {renderFieldLabel('Your Age')}
            <FormControl fullWidth>
              <Select name="age" value={formData.age} onChange={handleSelectChange} displayEmpty>
                <MenuItem value="" disabled>Select...</MenuItem>
                {yourAgeOptions.map((age) => <MenuItem key={age} value={age}>{age}</MenuItem>)}
              </Select>
            </FormControl>

            {renderFieldLabel('Your Gender')}
            <FormControl fullWidth>
              <Select name="gender" value={formData.gender} onChange={handleSelectChange} displayEmpty>
                <MenuItem value="" disabled>Select...</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            {formData.gender === 'Other' && (
              <TextField
                fullWidth
                margin="normal"
                name="otherGender"
                placeholder="Enter your gender identity"
                value={formData.otherGender}
                onChange={handleChange}
              />
            )}

            {renderFieldLabel('Your Occupation')}
            <FormControl fullWidth>
              <Select name="occupation" value={formData.occupation} onChange={handleSelectChange} displayEmpty>
                <MenuItem value="" disabled>Select...</MenuItem>
                {[
                  'Agriculture','Arts & Entertainment','Construction','Education','Finance','Food and Beverage', 'Government',
                  'Healthcare','Hospitality','Information Technology','Legal','Manufacturing','Marketing & Sales',
                  'Media & Communications','Retail','Science & Research','Social Services', 'Transportation','Trades & Services','Other'
                ].map((occ) => <MenuItem key={occ} value={occ}>{occ}</MenuItem>)}
              </Select>
            </FormControl>

            

            {renderFieldLabel('Best Time to Reach You')}
            <FormControl fullWidth>
              <Select name="bestContactTime" value={formData.bestContactTime} onChange={handleSelectChange} displayEmpty>
                <MenuItem value="" disabled>Select...</MenuItem>
                <MenuItem value="Mornings">Mornings</MenuItem>
                <MenuItem value="Afternoons">Afternoons</MenuItem>
                <MenuItem value="Evenings">Evenings</MenuItem>
                <MenuItem value="Weekends">Weekends</MenuItem>
                <MenuItem value="Anytime">Anytime</MenuItem>
              </Select>
            </FormControl>

            {renderFieldLabel('Caregiving Role')}
            <FormControl fullWidth>
              <Select name="caregivingRole" value={formData.caregivingRole} onChange={handleSelectChange} displayEmpty>
                <MenuItem value="" disabled>Select...</MenuItem>
                {[
                  'Son/Daughter', 'Counselor', 'Family', 'Friend', 'Grandchild', 'Home Health Aide', 'Husband/Wife', 
                  'Mental Health Professional', 'Social Worker', 'Other'
                ].map((role) => <MenuItem key={role} value={role}>{role}</MenuItem>)}
              </Select>
            </FormControl>

            {formData.caregivingRole === 'Other' && (
              <TextField
                fullWidth
                margin="normal"
                name="otherCaregivingRole"
                placeholder="Specify your role"
                value={formData.otherCaregivingRole}
                onChange={handleChange}
              />
            )}

            {renderFieldLabel('Care Recipient Age')}
            <FormControl fullWidth>
              <Select name="careRecipientAge" value={formData.careRecipientAge} onChange={handleSelectChange} displayEmpty>
                <MenuItem value="" disabled>Select...</MenuItem>
                {ageOptions.map((age) => <MenuItem key={age} value={age}>{age}</MenuItem>)}
              </Select>
            </FormControl>

            {renderFieldLabel('The person you care for is experiencing...')}
              <FormControl fullWidth>
                <Select
                  name="careRecipientCondition"
                  value={formData.careRecipientCondition}
                  onChange={handleSelectChange}
                  displayEmpty
                >
                <MenuItem value="" disabled>Select...</MenuItem>
                {[
                  'Allergies or Immune Deficiencies', 'Autoimmune Diseases', 'Behavioral Disorders', 
                  'Burnout or Occupational Stress', 'Children with Special Needs', 'Chronic Illnesses', 
                  'Dementia or Cognitive Issues', 'Domestic Violence Trauma', 'Eating Disorders', 
                  'Elderly Individuals (General Aging)', 'Genetic Disorders', 'Homelessness or Poverty-Related Issues', 
                  'Infectious Diseases', 'Intellectual or Developmental Disabilities', 'Mental Health Disorders', 
                  'Multiple Co-occurring Conditions', 'Neurological Disorders', 'Obesity-Related Conditions', 
                  'Physical Disabilities', 'Post Traumatic Stress Disorder (PTSD)', 'Post-Surgical Recovery', 
                  'Rare Diseases', 'Respiratory Conditions', 'Sex/Gender-Related Health Needs', 'Sleep Disorders', 
                  'Substance Abuse Issues', 'Terminal Illnesses', 'Traumatic Injuries', 'Vision or Hearing Loss (Age-Related)'
                ].map((condition) => (
                  <MenuItem key={condition} value={condition}>{condition}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {renderFieldLabel('Your Challenges')}
            <Box p={2} border="1px solid #ccc" borderRadius="12px">
              <FormGroup>
                {[
                  'Emotional Stress', 'Physical Exhaustion', 'Time Management Difficulties', 'Financial Strain', 
                  'Lack of Personal Time', 'Sleep Deprivation', 'Navigating Healthcare Systems', 
                  'Dealing with Behavioral Changes', 'Communication Barriers', 'Social Isolation', 'Guilt or Self-Doubt', 
                  'Unpredictable Schedules', 'Physical Safety Risks', 'Limited Access to Resources', 'Training or Skill Gaps', 
                  'Balancing Multiple Roles', 'Coping with Decline or Loss', 
                   'Adapting to Special Diets',  'Transportation Issues', 
                  'Legal or Administrative Challenges'
                ].map((challenge) => (
                  <FormControlLabel
                    key={challenge}
                    control={<Checkbox checked={formData.challenges.includes(challenge)} onChange={() => { handleArrayChange('challenges', challenge); }} />}
                    label={challenge}
                  />
                ))}
              </FormGroup>
            </Box>

            {renderFieldLabel('Preferred Communication Method')}
            <FormControl fullWidth>
              <Select name="communicationMethod" value={formData.communicationMethod} onChange={handleSelectChange} displayEmpty>
                <MenuItem value="" disabled>Select...</MenuItem>
                {['Email', 'Phone', 'Text'].map((method) => (
                  <MenuItem key={method} value={method}>{method}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {renderFieldLabel('Phone Number')}
            <Box
                mt={2}
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  transition: 'border-color 0.3s',
                  '&:focus-within': {
                    borderColor: 'primary.main',
                    boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.light}`,
                  },
                  '& input': {
                    fontSize: '1rem',
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                  },
                }}
              >
  
              <PhoneInput
              
                defaultCountry="US"
                international
                countryCallingCodeEditable={false}
                value={formData.phoneNumber}
                onChange={(value) =>
                  { setFormData((prev) => ({ ...prev, phoneNumber: value || '' })); }
                }
              />
            </Box>



            {renderFieldLabel('Your Interests')}
            <Box p={2} border="1px solid #ccc" borderRadius="12px">
              <FormGroup>
                {['Art', 'Business', 'Cooking', 'Crafts', 'Entertainment', 'Entrepreneurship', 'Fitness', 'Gaming', 
                'Gardening', 'Learning', 'Music', 'Nature', 'Photography', 'Reading', 'Socializing', 
                'Sports', 'Technology', 'Travel', 'Volunteering', 'Writing'].map((interest) => (
                  <FormControlLabel
                    key={interest}
                    control={<Checkbox checked={formData.interests.includes(interest)} onChange={() => { handleArrayChange('interests', interest); }} />}
                    label={interest}
                  />
                ))}
              </FormGroup>
            </Box>

            {renderFieldLabel('Your Location')}
            <Box mt={1} ref={locationRef}>
              <TextField
                fullWidth
                value={locationValue}
                onChange={handleLocationInput}
                disabled={!ready}
                placeholder="Enter your city"
              />
              {status === 'OK' && (
                <Box border="1px solid #ccc" borderRadius="6px" mt={1}>
                  {renderLocationSuggestions()}
                </Box>
              )}
            </Box>

            <Box mt={3} mb={6}>
  <Button
    type="submit"
    variant="contained"
    fullWidth
    sx={{
      marginBottom: '100px', // more vertical height
      fontSize: '1.1rem', // optional: slightly larger text
      backgroundColor: '#233ea1',
      '&:hover': {
        backgroundColor: '#1b2f84',
      },
    }}
  >
    Schedule Consultation
  </Button>
</Box>
          </form>
        </Box>
      </Container>
    </>
  );
}
