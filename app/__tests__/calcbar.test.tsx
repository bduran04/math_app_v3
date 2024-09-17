import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Calcbar from '../components/Calcbar';
import mathsteps from 'mathsteps';

// Type the mock function
jest.mock('mathsteps', () => ({
  solveEquation: jest.fn(),
}));

// Define the type for steps
interface Step {
  newEquation: { ascii: () => string };
  changeType: string;
}

describe('Calcbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with default props', () => {
    render(<Calcbar userId="123" />);
    
    expect(screen.getByLabelText(/Enter an algebraic equation/i)).toBeInTheDocument();
    expect(screen.getByText(/Solve/i)).toBeInTheDocument();
  });

});
