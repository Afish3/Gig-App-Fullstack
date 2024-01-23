import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfileProgressDisplay from './ProfileProgressDisplay';

describe('ProfileProgressDisplay Component', () => {
  it('renders the progress circle with the correct percentage', () => {
    render(<ProfileProgressDisplay progress={75} />);
    
    // Check if the progress text is visible
    const progressText = screen.getByText('75%');
    expect(progressText).toBeInTheDocument();

    // Check if the CircularProgress component is present
    const circularProgress = screen.getByTestId('progressbar');
    expect(circularProgress).toBeInTheDocument();

    /** Check if the CircularProgress component has the correct aria-valuenow attribute.
     * 
     * aria-valuenow attribute added by MUI for accessability and is updated to reflect the value.
     * 
     * checking the aria-valuenow attribute instead of value because value does not translate
     * to the HTML when the component renders on the DOM.
     */
    expect(circularProgress).toHaveAttribute('aria-valuenow', '75');
  });

  it('handles 0 percent progress completion', () => {
    render(<ProfileProgressDisplay progress={0} />);
    
    const progressText = screen.getByText('0%');
    expect(progressText).toBeInTheDocument();
  });

  it('handles decimal percent progress completion', () => {
    render(<ProfileProgressDisplay progress={14.14} />);
    
    const progressText = screen.getByText('14%');
    expect(progressText).toBeInTheDocument();
  });

  it('renders with the correct size', () => {
    render(<ProfileProgressDisplay progress={50} size="8rem" />);
    
    // Check if the outer box has the correct size
    const outerBox = screen.getByTestId('outer-box');
    expect(outerBox).toHaveStyle('borderRadius: 8rem');
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<ProfileProgressDisplay progress={75} />);
    expect(asFragment).toMatchSnapshot();
  });
});