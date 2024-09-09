import NavbarClient from './NavbarClient';
import { cookies } from 'next/headers';

interface UserData {
  id: string;
  email: string;
  fullName: string;
  lastName: string;
}
//handle logout function in the server

const getUserData = (): UserData | null => {
  const cookieStore = cookies();
  const userDataCookie = cookieStore.get('user-data');

  if (userDataCookie) {
    return JSON.parse(userDataCookie.value);
  }

  return null;
};

const ServerNavbar = () => {
  const userData = getUserData();

  return <NavbarClient initialUserData={userData} />;
};

export default ServerNavbar;
