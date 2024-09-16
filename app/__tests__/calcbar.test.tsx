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

  test('renders example input and solves equation on load', async () => {
    const mockSteps: Step[] = [
      { newEquation: { ascii: () => 'x = 2' }, changeType: 'simplify' },
      { newEquation: { ascii: () => 'x = 3' }, changeType: 'simplify' },
    ];
    (mathsteps.solveEquation as jest.Mock).mockReturnValue(mockSteps);

    render(<Calcbar exampleInput="x + 2 = 4" userId="123" />);
    
    // Check that the input field has the example input value
    expect(screen.getByLabelText(/Enter an algebraic equation/i)).toHaveValue('x + 2 = 4');
    
    // Wait for the solution to appear
    await waitFor(() => expect(screen.getByText(/Solution: x = 3/i)).toBeInTheDocument());
    
    // Check steps
    expect(screen.getByText(/Step 1/i)).toBeInTheDocument();
    expect(screen.getByText(/simplify/i)).toBeInTheDocument();
  });

  test('handles invalid equation', async () => {
    (mathsteps.solveEquation as jest.Mock).mockImplementation(() => { throw new Error(); });

    render(<Calcbar userId="123" />);
    
    fireEvent.change(screen.getByLabelText(/Enter an algebraic equation/i), { target: { value: 'invalid equation' } });
    fireEvent.click(screen.getByText(/Solve/i));
    
    // Wait for the solution to update
    await waitFor(() => expect(screen.getByText(/Invalid equation/i)).toBeInTheDocument());
  });

  test('calls handleSolve on input change and button click', async () => {
    const mockSteps: Step[] = [{ newEquation: { ascii: () => 'x = 2' }, changeType: 'simplify' }];
    (mathsteps.solveEquation as jest.Mock).mockReturnValue(mockSteps);

    render(<Calcbar userId="123" />);
    
    fireEvent.change(screen.getByLabelText(/Enter an algebraic equation/i), { target: { value: 'x + 2 = 4' } });
    fireEvent.click(screen.getByText(/Solve/i));
    
    await waitFor(() => expect(screen.getByText(/Solution: x = 2/i)).toBeInTheDocument());
  });

  test('does not render AddButton component', async () => {
    render(<Calcbar userId="123" exampleInput="x + 2 = 4" />);
    
    // Ensure AddButton is not rendered
    expect(screen.queryByText(/AddButton Mock/i)).not.toBeInTheDocument();
  });
});
