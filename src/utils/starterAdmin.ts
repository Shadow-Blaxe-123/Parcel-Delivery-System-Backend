import { env } from "../config/env";
import { IUser, UserRole } from "../modules/user/user.interface";
import User from "../modules/user/user.model";

const starterAdmin = async () => {
  try {
    const isExist = await User.findOne({ email: env.ADMIN_EMAIL });
    if (isExist) {
      console.log("Starter Admin already exist");
      return;
    }
    console.log("Creating starter Admin");
    const admin: IUser = {
      name: env.ADMIN_NAME,
      email: env.ADMIN_EMAIL,
      password: env.ADMIN_PASSWORD,
      address: env.ADMIN_ADDRESS,
      role: UserRole.ADMIN,
      phone: "1234567890",
    };
    const user = await User.create(admin);
    console.log("Starter Admin created");
    console.log(user);
  } catch (error) {
    console.log(error);
  }
};

export default starterAdmin;
