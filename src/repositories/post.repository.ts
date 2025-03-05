import { Repository, DataSource } from 'typeorm';
import { Post } from '../entities/post.entity';
import { HttpException } from '../utils/http-exception';
import { ERROR_MESSAGES } from '../constants/error.constants';

export class PostRepository {
  private repository: Repository<Post>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Post);
  }

  async findByUserId(userId: string): Promise<Post[]> {
    return this.repository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Post | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async create(postData: Partial<Post>): Promise<Post> {
    const newPost = this.repository.create(postData);
    return this.repository.save(newPost);
  }

  async update(id: string, postData: Partial<Post>): Promise<Post> {
    const post = await this.findById(id);
    if (!post) {
      throw new HttpException(404, ERROR_MESSAGES.POST.NOT_FOUND);
    }
    this.repository.merge(post, postData);
    return this.repository.save(post);
  }

  async delete(id: string): Promise<void> {
    const post = await this.findById(id);
    if (!post) {
      throw new HttpException(404, ERROR_MESSAGES.POST.NOT_FOUND);
    }
    await this.repository.remove(post);
  }

  async countByUserId(userId: string): Promise<number> {
    return this.repository.count({ where: { userId } });
  }
}
