import React from 'react';
import { render, screen } from '@testing-library/react';
import GigsCalendar from './Calendar';

describe('GigsCalendar Interaction', () => {
  it('updates availability on calendar interaction', async () => {
    // const mockEditProfile = jest.spyOn(API, 'editProfile').mockResolvedValue({});

    render(<GigsCalendar username="testUser" availability={[]} />);

    // // Assert that the expected messages are present on the screen
    expect(screen.getByText('Interact with the calendar')).toBeInTheDocument();
    expect(screen.getByText('to update availabile dates and times.')).toBeInTheDocument();
    expect(screen.getByText('Click to update when you are finished!')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<GigsCalendar username="testUser" availability={[]} />);
    expect(asFragment).toMatchSnapshot();
  });
});