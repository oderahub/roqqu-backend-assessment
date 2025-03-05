import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { AppDataSource } from '../config/database';
import { HttpException } from '../utils/http-exception';
import { ERROR_MESSAGES } from '../constants/error.constants';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository(AppDataSource);
  }

  public async findAll(pageNumber: number = 0, pageSize: number = 10): Promise<User[]> {
    return this.userRepository.findAll({
      skip: pageNumber * pageSize,
      take: pageSize,
    });
  }

  public async count(): Promise<number> {
    return this.userRepository.count();
  }

  public async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new HttpException(404, ERROR_MESSAGES.USER.NOT_FOUND);
    }
    return user;
  }

  public async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new HttpException(404, ERROR_MESSAGES.USER.NOT_FOUND);
    }
    return user;
  }

  public async create(userData: Partial<User>): Promise<User> {
    const existingUser = await this.userRepository.existsByEmail(userData.email!);
    if (existingUser) {
      throw new HttpException(400, ERROR_MESSAGES.USER.ALREADY_EXISTS);
    }
    return this.userRepository.create(userData);
  }

  public async update(id: string, userData: Partial<User>): Promise<User> {
    if (userData.email) {
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser && existingUser.id !== id) {
        throw new HttpException(400, ERROR_MESSAGES.USER.ALREADY_EXISTS);
      }
    }
    return this.userRepository.update(id, userData);
  }

  public async delete(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }
}
