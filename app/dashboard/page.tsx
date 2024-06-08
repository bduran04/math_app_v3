import { cookies } from 'next/headers';
import { Container, Typography } from '@mui/material';

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
      <Container>
        <Typography variant="h4">User not found. Please log in.</Typography>
      </Container>
      </div>
    );
  }

  const firstName = userData.fullName;

  return (
    <div style={{ backgroundColor: "#fbf7ef" }}>
      <Typography variant="h4">
        Hello {firstName}, welcome to the Dashboard Page!
      </Typography>
    </div>
  );
};

export default Dashboard;
