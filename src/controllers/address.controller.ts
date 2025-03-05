import { Request, Response } from 'express';
import { AddressService } from '../services/address.service';
import { controllerWrapper } from '../middlewares/controllerWrapper';
import { sendResponse } from '../utils/responseHandler';
import { HTTP_STATUS } from '../constants/httpStatus';

export class AddressController {
  private addressService = new AddressService();

  public getAddressByUserId = controllerWrapper(async (req: Request, res: Response) => {
    const address = await this.addressService.findByUserId(req.params.userId);
    sendResponse(res, HTTP_STATUS.OK, address);
  });

  public createAddress = controllerWrapper(async (req: Request, res: Response) => {
    const addressData = { ...req.body, userId: req.user!.id };
    const newAddress = await this.addressService.create(addressData);
    sendResponse(res, HTTP_STATUS.CREATED, newAddress);
  });

  public updateAddress = controllerWrapper(async (req: Request, res: Response) => {
    const updatedAddress = await this.addressService.update(req.params.userId, req.body);
    sendResponse(res, HTTP_STATUS.OK, updatedAddress);
  });

  public deleteAddress = controllerWrapper(async (req: Request, res: Response) => {
    await this.addressService.delete(req.params.userId);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  });
}
