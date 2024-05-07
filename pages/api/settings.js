import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Setting } from "@/models/Setting";

export default async function handler(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (req.method === "PUT") {
    const { name, value, adText, subAdText } = req.body;
    const settingDoc = await Setting.findOne({ name });
    if (settingDoc) {
      settingDoc.value = value;
      settingDoc.adText = adText;
      settingDoc.subAdText = subAdText;
      await settingDoc.save();
      res.json(settingDoc);
    } else {
      res.json(await Setting.create({ name, value, adText, subAdText }));
    }
  }

  if (req.method === "GET") {
    const { name } = req.query;
    const setting = await Setting.findOne({ name });
    if (setting) {
      res.json(setting);
    } else {
      res.status(404).json({ message: "Setting not found" });
    }
  }
}
