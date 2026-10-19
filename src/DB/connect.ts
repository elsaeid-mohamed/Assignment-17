import mongoose from "mongoose";

async function DBconnection() {
  const url = process.env.MONGO_URL as string;

  try {
    await mongoose.connect(url, { serverSelectionTimeoutMS: 5000 });
    console.log("db connected successfully... ");
  } catch (error) {
    console.log({ error });
  }
}

export default DBconnection;