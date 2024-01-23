"use strict";

const db = require("../db");
const {v4} = require("uuid");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { sendEmail } = require("../helpers/sendEmail");
const User = require("./user");
const { NotFoundError } = require("../expressError");

/** Related functions for jobs. */

class Job {
  /** Create job with data.
  *
  * @returns { id, title, description, companyId, dateStart, dateEnd, userId1, location }
  **/

  static async createJob(
    {title, description, salary, dateStart, dateEnd, createdAt, company, location, employees }) {

    const jobCreatedAt = createdAt ? createdAt : new Date();

    const result = await db.query(
            `INSERT INTO jobs
            (title,
            job_description,
            salary,
            date_start,
            date_end,
            created_at,
            location,
            company_id,
            user_id_1,
            user_id_2,
            user_id_3)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING id, 
                        title, 
                        job_description AS "description",
                        date_start AS "dateStart", 
                        date_end AS "dateEnd",
                        location,
                        salary,
                        created_at AS "createdAt",
                        company_id AS "companyId",
                        user_id_1 AS "userId1", 
                        user_id_2 AS "userId2", 
                        user_id_3 AS "userId3",
                        accepted`,
        [
            title,
            description,
            salary,
            dateStart,
            dateEnd,
            jobCreatedAt,
            location,
            company,
            employees[0],
            employees[1],
            employees[2],
        ],
    );

    const job = result.rows[0];

    job.location = JSON.parse(job.location);

    return job;
    }

    /** Update job data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { userId1, userId2, userId3, accepted }
   *
   * Returns { id, companyId, userId1, userId2, userId3, accepted}
   *
   * Throws NotFoundError if not found.
   *
   * NOTE: this function's prime use case is for updating userId's for booked
   * users - users that accept jobs will be updated as `accepted`, 
   * userId's will be shifted and updated if a user declines a job.
   */

  static async update(id, data) {

    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          userId1: "user_id_1",
          userId2: "user_id_2",
          userId3: "user_id_3",
        });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE jobs 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                title,
                                job_description AS "description",
                                date_start AS "dateStart", 
                                date_end AS "dateEnd",
                                location,
                                salary,
                                created_at AS "createdAt",
                                company_id AS "companyId",
                                user_id_1 AS "userId1", 
                                user_id_2 AS "userId2", 
                                user_id_3 AS "userId3",
                                accepted`;
    const result = await db.query(querySql, [...values, id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job with id: ${id}`);

    job.location = JSON.parse(job.location);

    return job;
  }

  static async sendEmailAlert({ userId, companyId, job, messageType }) {
    const user = await User.getById(userId);
    const company = await User.getById(companyId);

    if (messageType === 'accepted') {
        sendEmail(user.email, "You did it!",
        `Nice job ${user.firstName}, 
        you have beed booked for a job with ${company.firstName}!\n
        Good luck and be sure to let us know how it goes!\n
        Sincerely, Gig Bears!\n`);
        sendEmail(company.email, "You're job has been accepted", 
        `Great news ${company.firstName}, 
        your job has been accepted!\n
        We can't wait to hear how it goes with ${user.firstName} \n
        Sincerely, Gig Bears!\n`);
    } else if (messageType === 'booked') {
        sendEmail(user.email, "New Job Alert!", 
        `Great news ${user.firstName}, 
        you have beed booked for a job with ${company.firstName}!\n
        Your action is required to hold your place though... login and make
        sure to accept your job offer.\n
        Sincerely, Gig Bears!\n`);
        sendEmail(company.email, "You're job has been booked", 
        `Great news ${company.firstName}, 
        your job has been posted and we are reaching out to your top picks! \n
        Hold tight!\n
        Sincerely, Gig Bears!\n`);
    } else if (messageType === 're-booked') {
        sendEmail(user.email,  "New Job Alert!", 
        `Great news ${user.firstName}, 
        you have beed booked for a job with ${company.firstName}!\n
        Your action is required to hold your place though... login and make
        sure to accept your job offer.\n
        Sincerely, Gig Bears!\n`);
        sendEmail(company.email, "We're getting there!", 
        `Keep hanging in there, 
        we are working around the clock to get you the perfect person for the job!\n
        Sincerely, Gig Bears!\n`);
    } else {
        console.error('Unknown message type: ' + messageType);
    }
  }

  /** Delete given job from database; returns undefined. */

  static async remove(id) {
    let result = await db.query(
          `DELETE
           FROM jobs
           WHERE id = $1
           RETURNING id`,
        [id],
    );
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job with id: ${id}`);
  }
}

module.exports = Job;