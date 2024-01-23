import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import LoadingSaveButton from './LoadingSaveButton';

describe('LoadingSaveButton Component', () => {
  it('renders button with default state', () => {
    render(<LoadingSaveButton text="Save" handleClick={() => {}} />);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('handles button click and triggers loading state', () => {
    const mockHandleClick = jest.fn();
    render(<LoadingSaveButton text="Save" handleClick={mockHandleClick} />);
    const button = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('handles success state after a delay', async () => {
    const mockHandleClick = jest.fn(() => Promise.resolve());
    render(<LoadingSaveButton text="Save" handleClick={mockHandleClick} />);
    const button = screen.getByRole('button', { name: 'Save' });
    userEvent.click(button);

    await waitFor(() => {
      expect(mockHandleClick).toHaveBeenCalled();
    });

    const loadingIndicator = screen.queryByTestId('loading-indicator');
    expect(loadingIndicator).not.toBeInTheDocument();

    expect(button).not.toBeDisabled();

    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toHaveStyle({
      backgroundColor: 'rgb(76, 175, 80)',
    });
  });

  it('cleans up the timer on unmount', () => {
    const mockClearTimeout = jest.spyOn(global, 'clearTimeout');
    const { unmount } = render(<LoadingSaveButton text="Save" handleClick={() => {}} />);
    unmount();
    expect(mockClearTimeout).toHaveBeenCalled();
  });

  it('matches snapshot before', () => {
    const { asFragment } = render(<LoadingSaveButton text="Save" handleClick={() => {}} />);
    expect(asFragment).toMatchSnapshot();
  });

  it('matches snapshot after', async () => {
    const mockHandleClick = jest.fn(() => Promise.resolve());
    const { asFragment } = render(<LoadingSaveButton text="Save" handleClick={mockHandleClick} />);

    const button = screen.getByRole('button', { name: 'Save' });
    userEvent.click(button);

    await waitFor(() => {
      expect(mockHandleClick).toHaveBeenCalled();
    });

    expect(asFragment).toMatchSnapshot();
  });
});