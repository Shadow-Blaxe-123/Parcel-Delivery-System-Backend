import { model, Schema } from "mongoose";
import { IUser, UserRole } from "./user.interface";
import bcryptjs from "bcryptjs";
import { env } from "../../config/env";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: Object.values(UserRole),
    },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const hash = await bcryptjs.hash(this.password, env.HASH_SALT);
      this.password = hash;
    }
    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    next(error);
  }
});

const User = model<IUser>("User", userSchema);
export default User;
