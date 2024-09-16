import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

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
    try {
      return JSON.parse(userDataCookie.value);
    } catch (error) {
      console.error('Failed to parse user data cookie', error);
      return null;
    }
  }

  return null;
};

const DashboardPage = () => {
  const userData = getUserData();

  if (!userData) {
    redirect('/'); // Redirect to homepage if no user data is found
  }

  return (
    <DashboardClient userData={userData!} />
  );
};

export default DashboardPage;