import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 *
 */

class GigsApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async requestWithToken(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    // Authorization token passed in the header.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${GigsApi.token}` };
    const params = (method === "get")
        ? data
        : {};

    try {
      let res = await axios({ url, method, data, params, headers });
      return res.data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async getGoogleUser() {
    console.debug("API Call: get user authenticated with Google OAuth if they exist");

    try {
      let res = await axios.get(`${BASE_URL}/users/googleUser`, {withCredentials: true});
      let user = GigsApi.getProfileProgress(res.data);
      return user;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get details on current user by id. */

  static async getCurrentUser(id) {
    let res = await this.requestWithToken(`users/${id}`);

    let user = GigsApi.getProfileProgress(res.user);
    return user;
  }

  /** Get details on any user by id. */

  static async getUserById(id) {
    let res = await this.requestWithToken(`users/${id}`);

    let user = GigsApi.getProfileProgress(res.user);
    return user;
  }

  /** Get login token with login */

  static async login(data) {
    let res = await this.requestWithToken(`auth/token`, data, "post");
    return res.token;
  }

  /** Signup and return token */

  static async signup(data) {
    let res = await this.requestWithToken(`auth/register`, data, "post");
    return res.token;
  }

  /** Edit user profile */

  static async editProfile(username, data) {
    let res = await this.requestWithToken(`users/${username}`, data, "patch");
    return res.user;
  }

  /** Find filtered candidates for a job */

  static async findCandidates(data) {
    let res = await this.requestWithToken(`jobs/findCandidates`, data, "post");
    return res.locatedUsers;
  }

  /** Send email alerts to job candidate and company */

  static async sendEmailAlert(data) {
    let res = await this.requestWithToken(`jobs/alert`, data, "post");
    return res.message;
  }

  /** Create a job */

  static async createJob(data) {
    let res = await this.requestWithToken(`jobs/create`, data, "post");
    return res.newJob;
  }

  /** Edit job data */

  static async editJob(id, data) {
    let res = await this.requestWithToken(`jobs/${id}`, data, "patch");
    return res.job;
  }

  static async logout() {
    let res = await axios.delete(`${BASE_URL}/users/logout`, {withCredentials: true});
    return res.user;
  }

  static getProfileProgress(user) {

    function calculateProgress (sectionsArr) {
      const completed = sectionsArr.reduce((acc, curr) => { 
        if (curr) acc += 1;
        return acc;
       }, 0);

       const progress = (completed * 100) / sectionsArr.length;

       return progress;
    }

    if (user.userType === 'user') {
      const { 
        profile,
        areaCode,
        skills,
        photo,
        resume,
        availability
       } = user;

       let profileSections = [profile, areaCode, skills, photo, resume, availability];

       const profileProgress = calculateProgress(profileSections);

       user.profileProgress = profileProgress;
    } else if (user.userType === 'company') {
      const { 
        profile,
        areaCode,
        photo
       } = user;

       let profileSections = [profile, areaCode, photo];

       const profileProgress = calculateProgress(profileSections);

       user.profileProgress = profileProgress;
    }
    return user;
  }
}

export default GigsApi;