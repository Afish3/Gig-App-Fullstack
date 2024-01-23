"use strict";

/** Routes for users. */

const express = require("express");
const jsonschema = require("jsonschema");

const User = require("../models/user");
const userUpdateSchema = require("../schemas/userUpdate.json");
const { BadRequestError } = require("../expressError");

const router = express.Router();


/** GET /googleUser => { user: {id, username, firstName, lastName, email, ... } }
 *
 * Return user if the user was authenticated with Google OAuth.
 * 
 * If user successfully authenticated with Google, they are added to `req.user`.
 **/

router.get("/googleUser", async function (req, res, next) {
  try {
    const user = req.user ? {...req.user} : null;
    // const token = createToken(user);
    // return res.status(200).json({ token });
    return res.send( user );
  } catch (err) {
    return next(err);
  }
});

/** GET /[id] => { user }
 *
 * Returns { username, firstName, lastName, isAdmin, jobs }
 *   where jobs is { id, title, companyHandle, companyName, state }
 *
 * Authorization required: company or same user-as-:username
 **/

router.get("/:id", async function (req, res, next) {
  try {
    const user = await User.getFullProfileById(req.params.id);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[username] => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email }
 *
 * Returns { username, firstName, lastName, email, isAdmin }
 *
 * Authorization required: admin or same user-as-:username
 **/

router.patch("/:username", async function (req, res, next) {
  try {
    const user = await User.update(req.params.username, req.body);
    return res.json("success");
  } catch (err) {
    return next(err);
  }
});

/** DELETE /logout
 * 
 * Clears the current session on the request object 
 * 
 * Deletes the user property on the request object
 * 
 * Uses the req.logout method provided by the passport module
 * 
 * @returns {Object} {Message: "success"} if successful
 */

router.delete("/logout", async (req, res, next) => {
    if (req.user) {
        // await req.logout();
        req.user = null;
        await req.session.destroy();
        return res.send({message: "success"});
    }
})

module.exports = router;
