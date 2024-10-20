import Database from "../postgres-utils/db";
import { generateMeetCode } from "../services/generatemeetcode";

export const generatemeetcodeController = async (
  database: Database
) => {
  const code = generateMeetCode();
  await database.checkAndInsertInterviewId(code)
  return code;
};
