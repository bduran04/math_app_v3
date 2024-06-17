import { cookies } from 'next/headers';
import { Container, Typography, Box } from '@mui/material';
import Calcbar from 'app/components/Calcbar';

interface UserData {
  id: string;
  email: string;
  fullName: string;
  lastName: string;
}

const getUserData = (): UserData | null => {
  const cookieStore = cookies();
  const userDataCookie = cookieStore.get('user-data');

  if (userDataCookie) {
    return JSON.parse(userDataCookie.value);
  }

  return null;
};

const Dashboard = () => {
  const userData = getUserData();

  if (!userData) {
    return (
      <div style={{ backgroundColor: "#fbf7ef" }}>
        <Typography variant="h4">User not found. Please log in.</Typography>
      </div>
    );
  }

  const firstName = userData.fullName;

  return (
    <div style={{ backgroundColor: "#fbf7ef" }}>
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', paddingTop: '1rem' }}>
          <Typography variant="h4">
            Hello {firstName}!
          </Typography>
        </Box>
        <Calcbar />
      </Container>
    </div>
  );
};

export default Dashboard;
