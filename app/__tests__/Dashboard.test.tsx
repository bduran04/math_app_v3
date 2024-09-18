import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardClient from '../dashboard/DashboardClient';
import DashboardServer from '../dashboard/DashboardServer';
import Page from '../dashboard/page';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock('../dashboard/DashboardServer', () => jest.fn(() => <div>Mocked DashboardServer</div>));

const mockUserData = {
  id: '1',
  email: 'test@example.com',
  fullName: 'John',
  lastName: 'Doe',
};

describe('Dashboard Components', () => {
  describe('DashboardClient', () => {
    it('renders the user\'s full name', () => {
      render(<DashboardClient userData={mockUserData} />);
    
      expect(screen.getByText(/Hello John!/)).toBeInTheDocument();
    });
  });

  describe('Page', () => {
    it('renders the DashboardServer component', () => {
      render(<Page />);
      expect(screen.getByText('Mocked DashboardServer')).toBeInTheDocument();
    });
  });
});
