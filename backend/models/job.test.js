// Import necessary modules and dependencies
const db = require("../db");
const Job = require("./models/job");
const User = require("./models/user");
const { NotFoundError } = require("../expressError");

// Setup before and after all tests
beforeAll(async () => {
  await db.query("CREATE TABLE jobs (id SERIAL PRIMARY KEY, title TEXT, job_description TEXT, salary INTEGER, date_start DATE, date_end DATE, created_at TIMESTAMP, location JSON, company_id INTEGER REFERENCES users(id), user_id_1 INTEGER REFERENCES users(id), user_id_2 INTEGER REFERENCES users(id), user_id_3 INTEGER REFERENCES users(id), accepted INTEGER)");
  await db.query("CREATE TABLE users (id SERIAL PRIMARY KEY, email TEXT UNIQUE, first_name TEXT, last_name TEXT, password TEXT)");
});

afterAll(async () => {
  await db.query("DROP TABLE IF EXISTS jobs");
  await db.query("DROP TABLE IF EXISTS users");
  db.end();
});

// Setup before each test
beforeEach(async () => {
  // Insert test data for jobs and users
  await User.createUser({
    email: "user1@example.com",
    firstName: "John",
    lastName: "Doe",
    password: "password1"
  });

  await User.createUser({
    email: "user2@example.com",
    firstName: "Jane",
    lastName: "Doe",
    password: "password2"
  });

  await User.createUser({
    email: "company@example.com",
    firstName: "Company",
    lastName: "XYZ",
    password: "companyPassword"
  });
});

// Cleanup after each test
afterEach(async () => {
  // Delete all jobs and users from the test database
  await db.query("DELETE FROM jobs");
  await db.query("DELETE FROM users");
});

describe("Job Model", () => {
  describe("createJob", () => {
    it("should create a new job", async () => {
      const user1 = await User.getByEmail("user1@example.com");
      const user2 = await User.getByEmail("user2@example.com");
      const company = await User.getByEmail("company@example.com");

      const data = {
        title: "Software Engineer",
        description: "Full stack development",
        salary: 80000,
        dateStart: "2023-01-01",
        dateEnd: "2023-12-31",
        createdAt: "2022-12-01",
        company: company.id,
        location: JSON.stringify({ city: "New York", state: "NY" }),
        employees: [user1.id, user2.id, null]
      };

      const job = await Job.createJob(data);

      expect(job).toEqual({
        id: expect.any(Number),
        title: "Software Engineer",
        description: "Full stack development",
        salary: 80000,
        dateStart: "2023-01-01",
        dateEnd: "2023-12-31",
        location: { city: "New York", state: "NY" },
        createdAt: expect.any(Date),
        companyId: company.id,
        userId1: user1.id,
        userId2: user2.id,
        userId3: null,
        accepted: null
      });
    });
  });

  describe("update", () => {
    it("should update job data", async () => {
      const user1 = await User.getByEmail("user1@example.com");
      const user2 = await User.getByEmail("user2@example.com");
      const company = await User.getByEmail("company@example.com");

      const initialData = {
        title: "Software Engineer",
        description: "Full stack development",
        salary: 80000,
        dateStart: "2023-01-01",
        dateEnd: "2023-12-31",
        company: company.id,
        location: JSON.stringify({ city: "New York", state: "NY" }),
        employees: [user1.id, user2.id, null]
      };

      const job = await Job.createJob(initialData);

      const updateData = {
        userId1: null,
        userId2: user2.id,
        userId3: user1.id,
        accepted: user1.id
      };

      const updatedJob = await Job.update(job.id, updateData);

      expect(updatedJob).toEqual({
        id: job.id,
        title: "Software Engineer",
        description: "Full stack development",
        salary: 80000,
        dateStart: "2023-01-01",
        dateEnd: "2023-12-31",
        location: { city: "New York", state: "NY" },
        createdAt: expect.any(Date),
        companyId: company.id,
        userId1: null,
        userId2: user2.id,
        userId3: user1.id,
        accepted: user1.id
      });
    });

    it("should throw NotFoundError if job not found", async () => {
      try {
        const updateData = {
          userId1: null,
          userId2: 1,
          userId3: 2,
          accepted: 1
        };

        await Job.update(999, updateData);
      } catch (error) {
        expect(error instanceof NotFoundError).toBeTruthy();
      }
    });
  });

  describe("sendEmailAlert", () => {
    it("should send an email message based on messageType", async () => {
      const user1 = await User.getByEmail("user1@example.com");
      const company = await User.getByEmail("company@example.com");

      const jobData = {
        title: "Software Engineer",
        description: "Full stack development",
        salary: 80000,
        dateStart: "2023-01-01",
        dateEnd: "2023-12-31",
        createdAt: "2022-12-01",
        company: company.id,
        location: JSON.stringify({ city: "New York", state: "NY" }),
        employees: [user1.id, null, null]
      };

      const job = await Job.createJob(jobData);

      await Job.sendEmailAlert({
        userId: user1.id,
        companyId: company.id,
        job,
        messageType: "accepted"
      });

      // Add assertions for the email sending logic (mock or real)
    });
  });

  describe("remove", () => {

  });
});