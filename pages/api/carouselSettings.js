import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";
import { CarouselSetting } from "@/models/CarouselSetting";

export default async function handler(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (req.method === "PUT") {
    const { images } = req.body;
    const carouselSetting = await CarouselSetting.findOne({
      name: "carouselImages",
    });

    if (carouselSetting) {
      carouselSetting.images = images;
      await carouselSetting.save();
      res.json(carouselSetting);
    } else {
      res.json(await CarouselSetting.create({ images }));
    }
  }

  if (req.method === "GET") {
    const carouselSetting = await CarouselSetting.findOne({
      name: "carouselImages",
    });
    if (carouselSetting) {
      res.json(carouselSetting);
    } else {
      res.status(404).json({ message: "Carousel settings not found" });
    }
  }
}
