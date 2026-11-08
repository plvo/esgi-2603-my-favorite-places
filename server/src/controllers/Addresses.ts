import { Router } from "express";
import { getCoordinatesFromSearch } from "../utils/getCoordinatesFromSearch";
import { Address } from "../entities/Address";
import { isAuthorized } from "../utils/isAuthorized";
import { getUserFromRequest } from "../utils/getUserFromRequest";
import { getDistance } from "../utils/getDistance";

const addressesRouter = Router();

addressesRouter.post("/", isAuthorized, async (req, res) => {
  const searchWord = req.body.searchWord;
  const name = req.body.name;
  const description = req.body.description;

  if (!searchWord || !name) {
    return res
      .status(400)
      .json({ message: `name and search word are required` });
  }

  const coordinates = await getCoordinatesFromSearch(searchWord);

  if (coordinates) {
    const user = await getUserFromRequest(req);
    const address = new Address();
    address.name = name;
    address.description = description;
    Object.assign(address, coordinates);
    address.user = user;
    await address.save();
    return res.json({ item: address });
  } else {
    return res.status(404).json({ message: `search word not found` });
  }
});

addressesRouter.get("/", isAuthorized, async (req, res) => {
  const user = await getUserFromRequest(req);
  const addresses = await Address.findBy({ user: { id: user.id } });
  return res.json({ items: addresses });
});

addressesRouter.post("/searches", isAuthorized, async (req, res) => {
  const radius = req.body.radius;

  if (!radius || typeof radius !== "number" || radius < 0) {
    return res
      .status(400)
      .json({ message: `radius is required, must be a positive number` });
  }

  const from = req.body.from;

  if (
    !from ||
    !from.lng ||
    !from.lat ||
    typeof from.lng !== "number" ||
    typeof from.lat !== "number"
  ) {
    return res.status(400).json({
      message: `from object must contain lat and lng props, both numbers`,
    });
  }

  const user = await getUserFromRequest(req);
  const addresses = await Address.findBy({ user: { id: user.id } });
  const closeAddresses = [];

  for (const address of addresses) {
    if (getDistance(address, from) <= radius) {
      closeAddresses.push(address);
    }
  }

  return res.json({ items: closeAddresses });
});

export default addressesRouter;
