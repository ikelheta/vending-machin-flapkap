
import { connect } from "mongoose";
const dbUri = process.env.MONGO_URI

async function connectDb(uri = dbUri) {

  try {
    await connect(uri || "");
    console.log("DB connected");
  } catch (error) {
    console.log(error)
    console.log("Could not connect to db");
    process.exit(1);
  }
}

export default connectDb;