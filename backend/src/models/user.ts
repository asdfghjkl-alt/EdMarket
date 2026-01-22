import { Schema, model } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import type {
  PassportLocalMongooseModel,
  PassportLocalMongooseDocument,
} from "passport-local-mongoose";

export interface IUser extends PassportLocalMongooseDocument {
  email: string;
  isAdmin: boolean;
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
});

// eslint-disable-next-line
userSchema.plugin(passportLocalMongoose);

const User = model<IUser, PassportLocalMongooseModel<IUser>>(
  "User",
  userSchema
);

export default User;
