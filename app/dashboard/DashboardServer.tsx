import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Container, Typography, Box } from '@mui/material';
import ExampleEquations from '../components/ExampleEquations';
import DashboardClient from './DashboardClient';

interface UserData {
  id: string;
  email: string;
  fullName: string;
  lastName: string;
}

const DashboardServer = async () => {
  const cookieStore = cookies().get('user-data');
  
  if (!cookieStore) {
    return <div>Redirecting...</div>;
  }

  try {
    const userData: UserData = JSON.parse(cookieStore.value);
    return <DashboardClient userData={userData} />;
  } catch {
    redirect('/');
  }
};

export default DashboardServer;
