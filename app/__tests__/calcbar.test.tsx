import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Calcbar from '../components/Calcbar';
import mathsteps from 'mathsteps';

jest.mock('mathsteps');

describe('Calcbar', () => {
  const mockUserId = 'test-user-id';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Calcbar component', () => {
    render(<Calcbar userId={''} />);
    expect(screen.getByLabelText(/Enter an algebraic equation/i)).toBeInTheDocument();
    expect(screen.getByText(/Solve/i)).toBeInTheDocument();
  });

  it('displays the solution when a valid equation is solved', () => {
    const stepsMock = [
      { newEquation: { ascii: () => 'x = 1' }, changeType: 'SOLVE_EQUATION' },
    ];
    (mathsteps.solveEquation as jest.Mock).mockReturnValue(stepsMock);

    render(<Calcbar userId={''} />);

    fireEvent.change(screen.getByLabelText(/Enter an algebraic equation/i), { target: { value: 'x + 1 = 2' } });
    fireEvent.click(screen.getByText(/Solve/i));

    expect(screen.getByText(/Solution: x = 1/i)).toBeInTheDocument();
  });

  it('displays "Invalid equation" when an invalid equation is entered', () => {
    (mathsteps.solveEquation as jest.Mock).mockImplementation(() => { throw new Error('Invalid equation'); });

    render(<Calcbar userId={''} />);

    fireEvent.change(screen.getByLabelText(/Enter an algebraic equation/i), { target: { value: 'invalid equation' } });
    fireEvent.click(screen.getByText(/Solve/i));

    expect(screen.getByText(/Solution: Invalid equation/i)).toBeInTheDocument();
  });

  it('displays steps when a valid equation is solved', () => {
    const stepsMock = [
      { newEquation: { ascii: () => 'x + 1 = 2' }, changeType: 'ADD_CONSTANT' },
      { newEquation: { ascii: () => 'x = 1' }, changeType: 'SOLVE_EQUATION' },
    ];
    (mathsteps.solveEquation as jest.Mock).mockReturnValue(stepsMock);

    render(<Calcbar userId={''} />);

    fireEvent.change(screen.getByLabelText(/Enter an algebraic equation/i), { target: { value: 'x + 1 = 2' } });
    fireEvent.click(screen.getByText(/Solve/i));

    expect(screen.getByText(/Steps/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 1/i)).toBeInTheDocument();
    expect(screen.getAllByText(/x \+ 1 = 2/i)).toHaveLength(1);
    expect(screen.getByText(/add constant/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 2/i)).toBeInTheDocument();
    expect(screen.getAllByText(/x = 1/i)).toHaveLength(2);
    expect(screen.getByText(/solve equation/i)).toBeInTheDocument();
  });

  it('opens the Add to Study Guide modal when AddButton is clicked', () => {
    const stepsMock = [
      { newEquation: { ascii: () => 'x = 1' }, changeType: 'SOLVE_EQUATION' },
    ];
    (mathsteps.solveEquation as jest.Mock).mockReturnValue(stepsMock);

    render(<Calcbar userId={mockUserId} />);

    fireEvent.change(screen.getByLabelText(/Enter an algebraic equation/i), { target: { value: 'x + 1 = 2' } });
    fireEvent.click(screen.getByText(/Solve/i));
    fireEvent.click(screen.getByText(/Add to Study Guide/i));

    expect(screen.getByText(/Add to Study Guide/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/New Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Existing Title/i)).toBeInTheDocument();
  });
});
