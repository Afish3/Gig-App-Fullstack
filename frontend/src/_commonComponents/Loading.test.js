import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from './Loading';

describe('Loading Component', () => {
  it('renders the loading text', () => {
    render(<Loading />);
    const loadingText = screen.getByText('Loading...');
    expect(loadingText).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<Loading />);
    expect(asFragment).toMatchSnapshot();
  });
});