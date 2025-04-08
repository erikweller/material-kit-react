// src/app/user-info/page.tsx
'use client';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import useOnclickOutside from 'react-cool-onclickoutside';

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

export default function UserInfoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    occupation: '',
    otherOccupation: '',
    bestContactTime: '',
    caregivingRole: '',
    otherCaregivingRole: '',
    careRecipientAge: '',
    challenges: [] as string[],
    communicationMethod: '',
    interests: [] as string[],
    location: '',
  });

  const ageOptions = Array.from({ length: 82 }, (_, i) => (18 + i).toString());

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
    const res = await fetch('/api/user-info', {
      method: 'PUT',
      body: JSON.stringify(formData),
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
        onClick={handleLocationSelect(main_text + ', ' + secondary_text)}
        sx={{ cursor: 'pointer', px: 2, py: 1, '&:hover': { backgroundColor: '#f0f0f0' } }}
      >
        <strong>{main_text}</strong> <small>{secondary_text}</small>
      </Box>
    ));

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#111729' }}>
        <Toolbar>
          <Typography variant="h6">CareVillage</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm">
        <Box mt={4} sx={{ color: 'black' }}>
          <Typography variant="h4" mb={3}>Tell Us About Yourself</Typography>

          <form onSubmit={handleSubmit}>
            {renderFieldLabel('Your Age')}
            <FormControl fullWidth>
              <Select name="age" value={formData.age} onChange={handleSelectChange} displayEmpty>
                <MenuItem value="" disabled>Select...</MenuItem>
                {ageOptions.map((age) => <MenuItem key={age} value={age}>{age}</MenuItem>)}
              </Select>
            </FormControl>

            {renderFieldLabel('Your Gender')}
            <FormControl fullWidth>
              <Select name="gender" value={formData.gender} onChange={handleSelectChange} displayEmpty>
                <MenuItem value="" disabled>Select...</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </FormControl>

            {renderFieldLabel('Your Occupation')}
            <FormControl fullWidth>
              <Select name="occupation" value={formData.occupation} onChange={handleSelectChange} displayEmpty>
                <MenuItem value="" disabled>Select...</MenuItem>
                {[
                  'Agriculture','Arts & Entertainment','Construction','Education','Finance','Government',
                  'Healthcare','Hospitality','Information Technology','Legal','Manufacturing','Marketing & Sales',
                  'Media & Communications','Retail','Science & Research','Transportation','Trades & Services','Other'
                ].map((occ) => <MenuItem key={occ} value={occ}>{occ}</MenuItem>)}
              </Select>
            </FormControl>

            {formData.occupation === 'Other' && (
              <TextField
                fullWidth
                margin="normal"
                name="otherOccupation"
                placeholder="Specify your occupation"
                value={formData.otherOccupation}
                onChange={handleChange}
              />
            )}

            {renderFieldLabel('Best Time to Reach You')}
            <FormControl fullWidth>
              <Select name="bestContactTime" value={formData.bestContactTime} onChange={handleSelectChange} displayEmpty>
                <MenuItem value="" disabled>Select...</MenuItem>
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
                  'Son/Daughter', 'Husband/Wife', 'Friend', 'Family', 'Social Worker',
                  'Grandchild', 'Home Health Aide', 'Other'
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

            {renderFieldLabel('Your Challenges')}
            <Box p={2} border="1px solid #ccc" borderRadius="12px">
              <FormGroup>
                {[
                  'Social Isolation','Financial Insecurity','Difficulty with Everyday Tasks and Mobility',
                  'Access to Healthcare Services','Chronic Health Conditions','Ageism and Lack of Purpose',
                  'Housing Challenges','Cognitive Decline and Dementia','Stress and Mental Health',
                  'Time Management and Adaptation to Technology'
                ].map((challenge) => (
                  <FormControlLabel
                    key={challenge}
                    control={<Checkbox checked={formData.challenges.includes(challenge)} onChange={() => handleArrayChange('challenges', challenge)} />}
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

            {renderFieldLabel('Your Interests')}
            <Box p={2} border="1px solid #ccc" borderRadius="12px">
              <FormGroup>
                {['Reading', 'Gardening', 'Cooking', 'Technology', 'Art', 'Other'].map((interest) => (
                  <FormControlLabel
                    key={interest}
                    control={<Checkbox checked={formData.interests.includes(interest)} onChange={() => handleArrayChange('interests', interest)} />}
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

            <Box mt={3}>
              <Button type="submit" variant="contained" fullWidth>
                Schedule Consultation
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
    </>
  );
}
