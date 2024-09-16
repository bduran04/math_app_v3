// app/dashboard/Dashboard.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPage from '../dashboard/page';
import DashboardClient from '../dashboard/DashboardClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Mock next/headers and next/navigation
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

// Sample user data for the tests
const mockUserData = {
  id: '1',
  email: 'test@example.com',
  fullName: 'Test User',
  lastName: 'User',
};

describe('DashboardPage (Server Component)', () => {
  it('should redirect if no user data cookie is found', () => {
    // Mock cookies to return no data
    (cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(undefined),
    });

    const { container } = render(<DashboardPage />);

    // Ensure redirect is called
    expect(redirect).toHaveBeenCalledWith('/');
    // Ensure the component doesn't render anything (returns null)
    expect(container.firstChild).toBeNull();
  });

  it('should render DashboardClient when user data is found in cookies', () => {
    // Mock cookies to return user data
    (cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue({
        value: JSON.stringify(mockUserData),
      }),
    });

    render(<DashboardPage />);

    // Ensure DashboardClient is rendered
    const greeting = screen.getByText(`Hello ${mockUserData.fullName}!`);
    expect(greeting).toBeInTheDocument();
  });
});

describe('DashboardClient (Client Component)', () => {
    it('renders the user information and ExampleEquations component', () => {
      render(<DashboardClient userData={mockUserData} />);
  
      // Check if the user's name is displayed
      const greeting = screen.getByText(`Hello ${mockUserData.fullName}!`);
      expect(greeting).toBeInTheDocument();
  
      // Instead of matching "ExampleEquations", look for the actual content it renders, like buttons or headers
      const exampleEquationText = screen.getByText(/Select an Example/i);  // Assuming ExampleEquations renders this text
      expect(exampleEquationText).toBeInTheDocument();
  
      // Alternatively, if ExampleEquations renders buttons, use getByRole:
      const firstExampleButton = screen.getByRole('button', { name: /x \+ 1 = 2/i });
      expect(firstExampleButton).toBeInTheDocument();
    });

    it('should render correctly when userData is provided', () => {
        const mockUserData = {
          id: '1',
          email: 'test@example.com',
          fullName: 'Test User',
          lastName: 'User'
        };
      
        render(<DashboardClient userData={mockUserData} />);
      
        const greeting = screen.getByText(/Hello Test User!/i);
        expect(greeting).toBeInTheDocument();
      });
      
  });
  