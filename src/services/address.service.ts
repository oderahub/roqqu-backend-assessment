import { AddressRepository } from '../repositories/address.repository';
import { Address } from '../entities/address.entity';
import { AppDataSource } from '../config/database';
import { HttpException } from '../utils/http-exception';
import { ERROR_MESSAGES } from '../constants/error.constants';

export class AddressService {
  private addressRepository: AddressRepository;

  constructor() {
    this.addressRepository = new AddressRepository(AppDataSource);
  }

  public async findByUserId(userId: string): Promise<Address> {
    const address = await this.addressRepository.findByUserId(userId);
    if (!address) {
      throw new HttpException(404, ERROR_MESSAGES.ADDRESS.NOT_FOUND);
    }
    return address;
  }

  public async create(addressData: Partial<Address>): Promise<Address> {
    return this.addressRepository.create(addressData);
  }

  public async update(userId: string, addressData: Partial<Address>): Promise<Address> {
    return this.addressRepository.update(userId, addressData);
  }

  public async delete(userId: string): Promise<void> {
    return this.addressRepository.delete(userId);
  }
}
