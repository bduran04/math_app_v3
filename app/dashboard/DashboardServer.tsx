import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Container, Typography, Box } from '@mui/material';
import ExampleEquations from '../components/ExampleEquations';
import DashboardClient from './DashboardClient';

interface UserData {
  id: string;
  email: string;
  firstName: string;  
  lastName: string;
  fullName: string;
}

const DashboardServer = async () => {
  const cookieStore = cookies().get('user-data');
  
  if (!cookieStore) {
    return <div>Redirecting...</div>;
  }

  try {
    const parsedData = JSON.parse(cookieStore.value);
    const userData: UserData = {
      ...parsedData,
      fullName: `${parsedData.firstName} ${parsedData.lastName}`,
    };
    return <DashboardClient userData={userData} />;
  } catch (error) {
    redirect('/');
  }
};

export default DashboardServer;
