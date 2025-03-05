import { Repository, DataSource } from 'typeorm';
import { Address } from '../entities/address.entity';
import { HttpException } from '../utils/http-exception';
import { ERROR_MESSAGES } from '../constants/error.constants';

export class AddressRepository {
  private repository: Repository<Address>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Address);
  }

  async findByUserId(userId: string): Promise<Address | null> {
    return this.repository.findOne({
      where: { userId },
      relations: ['user'],
    });
  }

  async create(addressData: Partial<Address>): Promise<Address> {
    const existingAddress = await this.findByUserId(addressData.userId!);
    if (existingAddress) {
      throw new HttpException(400, ERROR_MESSAGES.ADDRESS.ALREADY_EXISTS);
    }
    const newAddress = this.repository.create(addressData);
    return this.repository.save(newAddress);
  }

  async update(userId: string, addressData: Partial<Address>): Promise<Address> {
    const address = await this.findByUserId(userId);
    if (!address) {
      throw new HttpException(404, ERROR_MESSAGES.ADDRESS.NOT_FOUND);
    }
    this.repository.merge(address, addressData);
    return this.repository.save(address);
  }

  async delete(userId: string): Promise<void> {
    const address = await this.findByUserId(userId);
    if (!address) {
      throw new HttpException(404, ERROR_MESSAGES.ADDRESS.NOT_FOUND);
    }
    await this.repository.remove(address);
  }

  async existsForUser(userId: string): Promise<boolean> {
    const count = await this.repository.count({ where: { userId } });
    return count > 0;
  }
}
