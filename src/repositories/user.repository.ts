import { Repository, DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { HttpException } from '../utils/http-exception';
import { ERROR_MESSAGES } from '../constants/error.constants';

export class UserRepository {
  private repository: Repository<User>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(User);
  }

  async findAll(
    options: {
      skip?: number;
      take?: number;
      relations?: string[];
    } = {},
  ): Promise<User[]> {
    return this.repository.find({
      skip: options.skip || 0,
      take: options.take || 10,
      relations: options.relations || ['address'],
    });
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  async findById(id: string, relations: string[] = ['address']): Promise<User | null> {
    return this.repository.findOne({
      where: { id },
      relations,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email },
    });
  }

  async create(userData: Partial<User>): Promise<User> {
    const newUser = this.repository.create(userData);
    return this.repository.save(newUser);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new HttpException(404, ERROR_MESSAGES.USER.NOT_FOUND);
    }
    this.repository.merge(user, userData);
    return this.repository.save(user);
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new HttpException(404, ERROR_MESSAGES.USER.NOT_FOUND);
    }
    await this.repository.remove(user);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repository.count({ where: { email } });
    return count > 0;
  }
}
