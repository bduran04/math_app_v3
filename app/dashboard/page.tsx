import { cookies } from 'next/headers';
import { Container, Typography } from '@mui/material';

interface UserData {
  id: string;
  email: string;
  fullName: string;
}

const getUserData = async (): Promise<UserData | null> => {
  const cookieStore = cookies();
  const userDataCookie = cookieStore.get('user-data');
  
  if (userDataCookie) {
    return JSON.parse(userDataCookie.value);
  }

  return null;
};

const Dashboard = async () => {
  const userData = await getUserData();

  if (!userData) {
    return (
      <Container>
        <Typography variant="h4">User not found. Please log in.</Typography>
      </Container>
    );
  }

console.log("userData", userData)

  return (
    <Container>
      <Typography variant="h4">
        Hello, welcome to the Dashboard Page!
      </Typography>
    </Container>
  );
};

export default Dashboard;
