import { cookies } from 'next/headers';
import { Container, Typography, Box } from '@mui/material';
import ExampleEquations from 'app/components/ExampleEquations';

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
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '1rem' }}>
          <Box sx={{ marginBottom: '2rem' }}>
            <Typography variant="h4">
              Hello {firstName}!
            </Typography>
          </Box>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <ExampleEquations userId={userData.id} />
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Dashboard;
