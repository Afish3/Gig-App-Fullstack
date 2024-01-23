"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const {v4} = require("uuid");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
  /** authenticate user with username, password.
   *
   * @returns { id, username, firstName, lastName, email, userType }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
          `SELECT id,
                  username,
                  password,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  user_type AS "userType"
           FROM users
           WHERE username = $1`,
        [username],
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * @returns { id, username, firstName, lastName, email, userType }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register(
      {id, username, loginType, password, firstName, lastName, dateRegistered, email, userType }) {
    const duplicateCheck = await db.query(
          `SELECT username
           FROM users
           WHERE username = $1`,
        [username],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Username: ${username} already exists`);
    }

    // Make sure correct values exist for email vs OAuth register
    const hashedPassword = password ? await bcrypt.hash(password, BCRYPT_WORK_FACTOR) : null;
    const newId = id ? id : v4().toString();
    const typeOfLogin = loginType ? loginType : 'email';
    const registrationDate = dateRegistered ? dateRegistered : new Date();

    const result = await db.query(
          `INSERT INTO users
           (id,
            username,
            login_type,
            password,
            first_name,
            last_name,
            date_registered,
            email,
            user_type)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING id, username, first_name AS "firstName", last_name AS "lastName", email, user_type AS userType`,
        [
          newId,
          username,
          typeOfLogin,
          hashedPassword,
          firstName,
          lastName,
          registrationDate,
          email,
          userType
        ],
    );

    const user = result.rows[0];

    return user;
  }

  /** Find all users.
   *
   * used for finding 
   * @returns [{ username, first_name, last_name, email, ... }, ...]
   **/

  static async findAll() {
    const result = await db.query(
          `SELECT id,
                  username,
                  first_name AS firstName,
                  last_name AS lastName,
                  area_code AS areaCode,
                  email,
                  rating,
                  profile,
                  skills,
                  photo,
                  resume,
                  availabile_datetimes AS availability
           FROM users WHERE user_type = 'user'
           ORDER BY username`,
    );

    const data = result.rows;
    const users = data.map(user => ({
      ...user,
      firstName: user.firstname,
      lastName: user.lastname,
    }));
    return users;
  }

  /** Given a id, return data about user.
   *
   * @returns { id, username, first_name, last_name, email, loginType, userType }
   *
   * @returns null if user not found.
   **/

  static async getById(id) {
    const userRes = await db.query(
          `SELECT id,
                  username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  photo,
                  email,
                  login_type AS "loginType",
                  user_type AS "userType"
           FROM users
           WHERE id = $1`,
        [id],
    );

    const user = userRes.rows[0];

    if (!user) return null;
    return user;
  }

  /** Given a id, return data about user.
   *
   * @returns { id, username, firstName, lastName, email, loginType, userType, rating, profile, areaCode, skills, photo, resume, availability, jobs }
   *   where jobs is { id, title, description, salary, location, datetime, userId, username, companyId, companyName }
   *
   * @returns null if user not found.
   **/

  static async getFullProfileById(id) {
    const userRes = await db.query(
        `SELECT id,
                username,
                first_name AS "firstName",
                last_name AS "lastName",
                email,
                user_type AS "userType",
                rating,
                profile,
                area_code AS "areaCode",
                skills,
                photo,
                resume,
                availabile_datetimes AS "availability"
        FROM users
        WHERE id = $1`,
      [id],
    );

    const user = userRes.rows[0];

    // if (!user) throw new NotFoundError(`No user with id: ${id}`);
    if (!user) return null;

    const userJobsRes = await db.query(
          `SELECT j.id,
                  j.title,
                  j.job_description AS description,
                  j.salary,
                  j.date_start AS dateStart,
                  j.date_end AS dateEnd,
                  j.location,
                  j.user_id_1 AS userId1,
                  j.user_id_2 AS userId2,
                  j.user_id_3 AS userId3,
                  j.accepted AS accepted,
                  j.created_at AS createdAt,
                  j.company_id AS companyId,
                  u.username,
                  u.rating AS userRating,
                  c.username AS companyName,
                  c.rating AS companyRating,
                  c.photo AS companyPhoto
           FROM jobs AS j
           LEFT JOIN users AS u ON j.user_id_1 = u.id
           LEFT JOIN users AS c ON j.company_id = c.id
           WHERE j.user_id_1 = $1 OR j.company_id = $1
           ORDER BY j.date_start DESC`, [id]);
    
    if (userJobsRes.rows.length) { 
      user.jobs = userJobsRes.rows.map(j => ({
          id: j.id,
          title: j.title,
          description: j.description,
          salary: j.salary,
          dateStart: j.datestart,
          dateEnd: j.dateend,
          createdAt: j.createdat,
          location: JSON.parse(j.location),
          userId1: j.userid1,
          userId2: j.userid2,
          userId3: j.userid3,
          accepted: j.accepted,
          username: j.username,
          userRating: j.userrating,
          companyId: j.companyid,
          companyName: j.companyname,
          companyRating: j.companyrating,
          companyPhoto: j.companyphoto
        })
      );
    } else {
      user.jobs = [];
    }

    return user;
  }

  /** Given a username, return data about user.
   *
   * @returns { id, username, firstName, lastName, email, loginType }
   *
   * @returns null if user not found.
   **/
  static async getByUsername(username) {
    const userRes = await db.query(
          `SELECT id,
                  username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  login_type AS "loginType"
           FROM users
           WHERE username = $1`,
        [username],
    );

    const user = userRes.rows[0];

    if (!user) return null;

    return user;
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { profile, photo, resume, skills, availability }
   *
   * Returns { id, username }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an company.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   */

  static async update(username, data) {

    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          areaCode: "area_code",
          availability: "availabile_datetimes"
        });
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING id,
                                username`;
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user with username: ${username}`);

    return user;
  }

  /** Delete given user from database; returns undefined. */

  static async remove(id) {
    let result = await db.query(
          `DELETE
           FROM users
           WHERE id = $1
           RETURNING id`,
        [id],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user with id: ${id}`);
  }
}


module.exports = User;