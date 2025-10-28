import { type NextFunction, type Request, type Response } from "express";
import { RegistrationService } from "../services/registration_service";
import { type CreateRegistrationRequest } from "../models/registration";

export class RegistrationController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateRegistrationRequest = req.body;
      const registration = await RegistrationService.create(request);
      res.status(200).json({
        data: registration,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;

      const registrations = await RegistrationService.getAll(page, size);
      res.status(200).json(registrations);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const message = await RegistrationService.delete(id);
      res.status(200).json({
        message: message,
      });
    } catch (error) {
      next(error);
    }
  }
}
