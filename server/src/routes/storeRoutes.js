import { Router } from "express";
import {
  authenticate,
  authorizeRoles,
  requireFields,
} from "../middleware/authMiddleware.js";
import {
  createStoreValidator,
  getAllStoresValidator,
  submitRatingValidator,
} from "../validators/storeValidator.js";
import validate from "../middleware/validateMiddleware.js";
import * as storeController from "../controllers/storeController.js";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorizeRoles("ADMIN"),
  requireFields(["name", "email", "address", "ownerId"]),
  createStoreValidator,
  validate,
  storeController.createStore,
);

router.get(
  "/",
  authorizeRoles("ADMIN", "NORMAL_USER"),
  getAllStoresValidator,
  validate,
  storeController.getAllStores,
);

router.post(
  "/:id/rating",
  authorizeRoles("NORMAL_USER"),
  requireFields(["rating"]),
  submitRatingValidator,
  validate,
  storeController.submitRating,
);

export default router;
