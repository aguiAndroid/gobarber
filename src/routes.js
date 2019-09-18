import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer";

import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import FileController from "./app/controllers/FileController";
import ProviderController from "./app/controllers/ProviderController";
import authMiddleware from "./app/middlewares/auth";
import AppointmentController from "./app/controllers/AppointmentController";
import ScheduleController from "./app/controllers/ScheduleController";
import NotificationController from "./app/controllers/NotificationController";

const routes = new Router();

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);
const upload = multer(multerConfig);

routes.use(authMiddleware);
routes.put("/users", UserController.update);
routes.post("/files", upload.single("file"), FileController.store);
routes.get("/schedule", ScheduleController.index);
routes.get("/notification", NotificationController.index);
routes.post("/providers", ProviderController.index);
routes.post("/appoitments", AppointmentController.store);
routes.get("/appoitments", AppointmentController.index);
routes.delete("/appoitments/:id", AppointmentController.delete);
routes.put("/notifications/:id", NotificationController.update);

export default routes;
