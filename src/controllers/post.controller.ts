import { Request, Response } from 'express';
import { PostService } from '../services/post.service';
import { controllerWrapper } from '../middlewares/controllerWrapper';
import { sendResponse, sendError } from '../utils/responseHandler';
import { HTTP_STATUS } from '../constants/httpStatus';
import { HttpException } from '../utils/http-exception';
import { ERROR_MESSAGES } from '../constants/error.constants';

export class PostController {
  private postService = new PostService();

  public getPostsByUserId = controllerWrapper(async (req: Request, res: Response) => {
    const userId = req.query.userId as string;
    if (!userId) {
      sendError(res, HTTP_STATUS.BAD_REQUEST, 'userId query parameter is required');
      return;
    }
    const posts = await this.postService.findByUserId(userId);
    sendResponse(res, HTTP_STATUS.OK, posts);
  });

  public getPostById = controllerWrapper(async (req: Request, res: Response) => {
    const post = await this.postService.findById(req.params.id);
    sendResponse(res, HTTP_STATUS.OK, post);
  });

  public createPost = controllerWrapper(async (req: Request, res: Response) => {
    const postData = { ...req.body, userId: req.user!.id };
    const newPost = await this.postService.create(postData);
    sendResponse(res, HTTP_STATUS.CREATED, newPost);
  });

  public updatePost = controllerWrapper(async (req: Request, res: Response) => {
    const updatedPost = await this.postService.update(req.params.id, req.body);
    sendResponse(res, HTTP_STATUS.OK, updatedPost);
  });

  public deletePost = controllerWrapper(async (req: Request, res: Response) => {
    const post = await this.postService.findById(req.params.id);
    if (post.userId !== req.user!.id) {
      throw new HttpException(403, ERROR_MESSAGES.SERVER.UNAUTHORIZED);
    }
    await this.postService.delete(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  });
}
