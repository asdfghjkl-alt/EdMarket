import { Schema, model } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import type {
  PassportLocalMongooseModel,
  PassportLocalMongooseDocument,
} from "passport-local-mongoose";

export interface IUser extends PassportLocalMongooseDocument {
  email: string;
  isAdmin: boolean;
  role: "buyer" | "seller" | "admin";
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
  role: {
    type: String,
    enum: ["buyer", "seller", "admin"],
    default: "buyer",
    required: true,
  },
});

// Plugs in extensions from passport-local-mongoose
userSchema.plugin(passportLocalMongoose);

const User = model<IUser, PassportLocalMongooseModel<IUser>>(
  "User",
  userSchema,
);

export default User;
