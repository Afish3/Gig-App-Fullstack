"use strict";

/** Routes for jobs. */

const express = require("express");
const jsonschema = require("jsonschema");

const moment = require("moment");

const User = require("../models/user");
const Job = require("../models/job");
const { formatAvailability } = require("../helpers/availabilityDateFormatting");
const { getDistanceFromLatLng } = require("../helpers/getDistanceFromLatLng");
const createJobSchema = require("../schemas/createJobSchema.json");
const { BadRequestError } = require("../expressError");

const router = express.Router();


/** POST /findCandidates
 * 
 * Returns all user that match the given criteria for a job including availability.
 **/

router.post("/findCandidates", async function (req, res, next) {
    try {
        const users = await User.findAll();
        const { dateStart, dateEnd, location } = req.body;
        // Find and filter for users that match availability with job date and time
        let availabileUsers = users.filter(function (user) {
            if (!user.availability) return false;
            let dates = formatAvailability(user.availability);

            let validDates = dates.filter(function (date) {
                let aStart = moment(date.start).format();
                let aEnd = moment(date.end).format();
                let jStart = moment(dateStart).format();
                let jEnd = moment(dateEnd).format();
                
                return (moment(jStart).isBetween(aStart, aEnd, undefined, '[)') && 
                moment(jEnd).isBetween(aStart, aEnd, undefined, '(]'));
            });

            return validDates.length > 0;
        })
        // Find and filter users that are within the jobs area
        let locatedUsers = availabileUsers.filter(function (user) { 
            const userLoc = JSON.parse(user.areacode);
            const userLngLat = [ userLoc.coor.Latitude, userLoc.coor.Longitude ];

            const jobLngLat = [ location.coor.Latitude, location.coor.Longitude ];

            const d = getDistanceFromLatLng(userLngLat[0], userLngLat[1], jobLngLat[0], jobLngLat[1]);
            return d < 20;
        });

        return res.json({ locatedUsers });
    } catch (error) {
        return next(error);
    }
});

/** POST /jobs/create:   { data } => { job }
 *
 * job must include { title, description, dateStart, dateEnd, location, userId1, userId2, userId3 }
 *
 * Returns job object.
 *
 * Authorization required: none
 */

router.post("/create", async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, createJobSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
  
      const newJob = await Job.createJob({ ...req.body });
      return res.status(201).json({ newJob });
    } catch (err) {
      return next(err);
    }
  });

/** PATCH /[id] => { job }
 *
 * Data can include:
 *   { userId1, userId2, userId3, accepted }
 *
 * Returns { id, companyId, userId1, accepted }
 *
 * Authorization required: same company-as-:companyId or same user-as-:userId1
 **/

router.patch("/:id", async function (req, res, next) {
    try {
      const job = await Job.update(req.params.id, req.body);
      return res.json({ job });
    } catch (err) {
      return next(err);
    }
  });

/** POST /jobs/alert:   { data } => { job }
 *
 * job must include { title, description, dateStart, dateEnd, location, userId1, userId2, userId3 }
 *
 * Returns "success".
 *
 * Authorization required: same user-as-:userId1
 */

router.post("/alert", async function (req, res, next) {
    try {
      const result = await Job.sendEmailAlert({ ...req.body });
      return res.status(200).json({ message: "success" });
    } catch (err) {
      return next(err);
    }
  });

module.exports = router;
