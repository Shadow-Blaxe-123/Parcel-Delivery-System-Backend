import { StatusCodes } from "http-status-codes";
import AppError from "../error/AppError";

const validateNoBlacklistedFields = (payload: object, blacklist: string[]) => {
  const invalid = Object.keys(payload).filter((key) => blacklist.includes(key));
  if (invalid.length > 0) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `Blacklisted fields: ${invalid.join(", ")}`
    );
  }
};

export default validateNoBlacklistedFields;
