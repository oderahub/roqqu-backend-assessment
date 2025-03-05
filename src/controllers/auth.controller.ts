import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/user.service';
import { controllerWrapper } from '../middlewares/controllerWrapper';
import { sendResponse } from '../utils/responseHandler';
import { HTTP_STATUS } from '../constants/httpStatus';

export class AuthController {
  private userService = new UserService();

  public login = controllerWrapper(async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await this.userService.findByEmail(email);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'bright', {
      expiresIn: '1h',
    });
    sendResponse(res, HTTP_STATUS.OK, { token });
  });
}
