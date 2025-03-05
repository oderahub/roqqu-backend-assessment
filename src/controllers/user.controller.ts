import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { controllerWrapper } from '../middlewares/controllerWrapper';
import { sendResponse } from '../utils/responseHandler';
import { HTTP_STATUS } from '../constants/httpStatus';

export class UserController {
  private userService = new UserService();

  public getUsers = controllerWrapper(async (req: Request, res: Response) => {
    const pageNumber = Number(req.query.pageNumber) || 0;
    const pageSize = Number(req.query.pageSize) || 10;
    const users = await this.userService.findAll(pageNumber, pageSize);
    sendResponse(res, HTTP_STATUS.OK, users, { pagination: { pageNumber, pageSize } });
  });

  public getUserCount = controllerWrapper(async (req: Request, res: Response) => {
    const count = await this.userService.count();
    sendResponse(res, HTTP_STATUS.OK, { count });
  });

  public getUserById = controllerWrapper(async (req: Request, res: Response) => {
    const user = await this.userService.findById(req.params.id);
    sendResponse(res, HTTP_STATUS.OK, user);
  });

  public createUser = controllerWrapper(async (req: Request, res: Response) => {
    const newUser = await this.userService.create(req.body);
    sendResponse(res, HTTP_STATUS.CREATED, newUser);
  });

  public updateUser = controllerWrapper(async (req: Request, res: Response) => {
    const updatedUser = await this.userService.update(req.params.id, req.body);
    sendResponse(res, HTTP_STATUS.OK, updatedUser);
  });

  public deleteUser = controllerWrapper(async (req: Request, res: Response) => {
    await this.userService.delete(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  });
}
