import { PostRepository } from '../repositories/post.repository';
import { Post } from '../entities/post.entity';
import { AppDataSource } from '../config/database';
import { HttpException } from '../utils/http-exception';
import { ERROR_MESSAGES } from '../constants/error.constants';

export class PostService {
  private postRepository: PostRepository;

  constructor() {
    this.postRepository = new PostRepository(AppDataSource);
  }

  public async findByUserId(userId: string): Promise<Post[]> {
    return this.postRepository.findByUserId(userId);
  }

  public async findById(id: string): Promise<Post> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new HttpException(404, ERROR_MESSAGES.POST.NOT_FOUND);
    }
    return post;
  }

  public async create(postData: Partial<Post>): Promise<Post> {
    return this.postRepository.create(postData);
  }

  public async update(id: string, postData: Partial<Post>): Promise<Post> {
    return this.postRepository.update(id, postData);
  }

  public async delete(id: string): Promise<void> {
    return this.postRepository.delete(id);
  }
}
