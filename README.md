# Gig Economy Platform

## Overview

This gig economy platform is designed to streamline the process of hiring and finding one-off jobs in a specific region. It serves both companies looking for skilled professionals and individuals seeking job opportunities. The platform is built with a backend in Express and Node.js, while the frontend is developed using React and Material-UI (MUI). The application is hosted on AWS at [https://www.gigbears.com](https://www.gigbears.com).

## Features

### For Companies:

1. **Sign Up and Profile Creation:**
   - Companies can sign up on the platform.
   - They can create and complete their profiles, including company details: location, bio, photo.

2. **Job Creation:**
   - Companies can create gig-style one-off jobs with details such as title, description, salary, location, and duration.

3. **Candidate Selection:**
   - Companies have access to a pool of candidates in the specified region and at the specified time frame based off candidate availability.
   - They can choose from the pool of candidates and book them for the job.

4. **Alerts and Notifications:**
   - The platform sends alerts and notifications to companies for job booking, acceptance, decline, or rebooking.

5. **Automatic Backup Candidate Booking:**
   - In case of candidate decline, the platform automatically books backup candidates based on the company's backup selection at the time of job creation.

### For Job Seekers:

1. **Sign Up and Profile Creation:**
   - Job seekers can sign up using OAuth or email.
   - They can complete their profiles, including skills, resume, location, availability using React Big Calendar, bio, and profile picture.

2. **Job Booking and Accept / Decline:**
   - Job seekers can accept or decline jobs they are booked for.
   - The platform sends alerts and notifications to job seekers for job pre-acceptance bookings, and acceptance.

## Technology Stack

### Backend:

- Express.js
- Node.js
- OAuth for authentication
- PostgreSQL as the database
- AWS for hosting

### Frontend:

- React
- Material-UI (MUI)
- React Big Calendar and Moment.js for availability scheduling

### Testing:

- Unit tests for backend and frontend
- End-to-end tests using Cypress

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Afish3/Gig-App-Fullstack.git
   ```
2. **Navigate to the project directory:**

   ```bash
   cd gig-economy-platform
   ```
3. **Install dependencies:**

- frontend

   ```bash
   cd frontend
   npm install
   ```
   
- backend

	```bash
	cd backend
	npm install
	```

## Database Setup

### Set up the database 

```bash
cd backend
psql
> \i gigs.sql
```

### Add environment variables.
Google API keys are needed for proper OAuth authentication in the application.

```bash
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## Running the Application

### Start the application
You will need to tabs or pages of your terminal or bash shell open for running the backend and frontend.

- Terminal tab 1.

```bash
cd backend
npm run dev
```
- Terminal tab 2.

```bash
cd frontend
npm start
```
## Testing
### Run unit tests
Unit tests can be run in the `frontend` and 	`backend` folders with the following commmand:

```bash
npm test
```

### Run end-to-end tests using Cypress:

```bash
cd frontend
npx cypress run
```

##Contributing
Feel free to contribute to the project by creating issues or submitting pull requests.

##License
This project is licensed under the [MIT License](LICENSE).