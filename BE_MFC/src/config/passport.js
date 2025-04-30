import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { db } from "../models/index.js";
import { where } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
const User = db.User;

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:8081/auth/facebook/callback",
      profileFields: [
        "id",
        "emails",
        "name",
        "picture.type(large)",
        "birthday",
      ],
      scope: ["public_profile", "email", "user_birthday"],
      graphAPIVersion: "v20.0",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Full Facebook profile:", JSON.stringify(profile, null, 2));
        console.log("Raw birthday:", profile.birthday);

        const email =
          profile.emails && profile.emails[0] ? profile.emails[0].value : null;

        const user = await User.findOne({ where: { facebook_id: profile.id } });

        // Tạo tên và avatar mới từ profile
        const newName = ` ${profile.name.familyName || ""} ${
          profile.name.givenName || ""
        }`;
        const newAvatarUrl = profile.photos?.[0]?.value || null;
        if (user) {
          // Nếu người dùng đã tồn tại, kiểm tra và cập nhật thông tin
          let isUpdated = false;
          if (user.name !== newName) {
            user.name = newName;
            isUpdated = true;
          }
          if (user.avatar_url !== newAvatarUrl) {
            user.avatar_url = newAvatarUrl;
            isUpdated = true;
          }
          if (isUpdated) {
            await user.save(); // Lưu thay đổi vào database
            console.log("Updated user info:", {
              name: user.name,
              avatar_url: user.avatar_url,
            });
          }
          return done(null, user);
        }
        // Nếu người dùng chưa tồn tại, tạo mới
        const roleId = 2;
        const dob = profile.birthday ? new Date(profile.birthday) : null;
        const newUserData = {
          facebook_id: profile.id,
          name: ` ${profile.name.familyName || ""} ${
            profile.name.givenName || ""
          }`,
          email: email || `fb_${profile.id}@facebook.com`,
          avatar_url: profile.photos?.[0]?.value || null,
          date_of_birth: dob,
          password: "facebook_oauth",
          role_id: roleId,
        };

        const newUser = await User.create(newUserData);
        const token = jwt.sign(
          { id: newUser.id, email: newUser.email },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );
        newUser.dataValues.token = token;
        return done(null, newUser);
      } catch (err) {
        console.log(err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
