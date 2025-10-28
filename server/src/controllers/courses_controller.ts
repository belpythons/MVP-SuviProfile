import { type NextFunction, type Request, type Response } from "express";
import { CoursesService } from "../services/courses_service";
import {
  type CreateCourseRequest,
  type UpdateCourseRequest,
} from "../models/courses";

export class CoursesController {
  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await CoursesService.getAll();
      res.status(200).json({
        data: courses,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateCourseRequest = req.body;
      const course = await CoursesService.create(request);
      res.status(201).json({
        data: course,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const request: UpdateCourseRequest = req.body;
      const course = await CoursesService.update(id, request);
      res.status(200).json({
        data: course,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const message = await CoursesService.delete(id);
      res.status(200).json({
        message: message,
      });
    } catch (error) {
      next(error);
    }
  }
}
