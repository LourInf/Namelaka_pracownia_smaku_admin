import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Admin } from "@/models/Admin";

export default async function handle(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (req.method === "POST") {
    const { email } = req.body;
    try {
      const newAdmin = await Admin.create({ email });
      res.json(newAdmin);
    } catch (error) {
      if (error.code === 11000) {
        // MongoDB duplicate key error
        res.status(409).json({ message: "This admin already exists!" });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  if (req.method === "GET") {
    res.json(await Admin.find());
  }

  if (req.method === "DELETE") {
    const { _id } = req.query;
    await Admin.findByIdAndDelete(_id);
    res.json(true);
  }
}
