const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/User");
const { show } = require("quick-crud");
const { sign } = require("jsonwebtoken");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github").Strategy;

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      const user = await show({ model: User, where: { email } });
      if (!user) done({ message: "Invalid credentials" });

      const matched = user.comparePassword(password);

      if (!matched) {
        return done({ message: "Invalid credentials" });
      }

      const authPayload = {
        token: sign({ _id: user._id }, "secret"),
        user,
      };

      done(null, authPayload);
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      secretOrKey: "secret",
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter("token"),
        ExtractJwt.fromBodyField("token"),
      ]),
    },
    async (payload, done) => {
      const user = await show({ model: User, where: { _id: payload._id } });
      if (!user) return done({ message: "Invalid token" });
      done(null, user);
    }
  )
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID:
        "544586221179-nk42u7np99oubno8v5rrlu6nbpjlugl3.apps.googleusercontent.com",
      clientSecret: "2MlCyJU1hGIAtn0CAB_n878M",
      callbackURL: "http://localhost:3000/users/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

passport.use(
  "github",
  new GithubStrategy(
    {
      clientID: "Iv1.a142bcae17994a06",
      clientSecret: "03082e916f52e1a5c5caad45d250a80fa6c5e3b2",
      callbackURL: "http://localhost:3000/users/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);
