import express from "express";
import { CoursesController } from "../controllers/courses_controller";
import { RegistrationController } from "../controllers/registration_controller";

export const publicRouter = express.Router();

// Course management routes
publicRouter.get("/courses", CoursesController.get);
publicRouter.post("/courses", CoursesController.create);
publicRouter.put("/courses/:id", CoursesController.update);
publicRouter.delete("/courses/:id", CoursesController.delete);

// Registration routes
publicRouter.post("/register", RegistrationController.register);
publicRouter.get("/registrations", RegistrationController.getAll);
publicRouter.delete("/registrations/:id", RegistrationController.delete);
