const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20');
const User = require("./models/user");

// serialize user object: { id }, into the session
passport.serializeUser((user, done) => {
    return done(null, user.id);
  });
  
// de-serialize user object and attach full user object: { id, email, ...}, to the request oobject as `req.user`.
passport.deserializeUser(async (id, done) => {
    let USER = await User.getFullProfileById(id);
    return done(null, USER);
})

passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: '/auth/google/callback',
    },
    async function verify(accessToken, refreshToken, profile, cb) {
    const user = await User.getFullProfileById(profile.id); 
    if (user === null) {
        console.log(`NO USER FOUND WITH ID: ${profile.id}`.red);
        console.log("CREATING NEW USER...".yellow);

        // CREATE USER
        const userData = {
            id: profile.id,
            username: profile.displayName.replace(/\s+/g, '-'), //Username is full name replacing spaces with "-"
            loginType: profile.provider,
            passsword: null,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            dateRegistered: new Date(),
            email: profile.emails[0].value,
            userType: "user"
        }
        
        const createUser = async (userData) => {
            const newUser = await User.register(userData);
            return newUser;
        }

        const registeredUser = await createUser(userData);
        console.log("NEW USER CREATED...".green);
        return cb(null, registeredUser);
    }
    console.log("USER FOUND SUCCESSFULLY...".green);
    return cb(null, user);
}));

module.exports = passport;