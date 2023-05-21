import {HttpException, HttpStatus, Type, ValueProvider} from "@nestjs/common";
import {Repository} from "typeorm";
import {getRepositoryToken} from "@nestjs/typeorm";
import {Address} from "../entities/address.entity";
import {HttpExceptionMessages} from "../dto/exceptions/http-exception-messages.constants";

export const mockAddresses = [...Array(11)].map((_address, index) => {
  const createdAt = new Date();
  const updatedAt = new Date();
  const deletedAt = null;

  const address = new Address();

  address.id = index;
  address.user_id = index;
  address.country = 'Russia';
  address.region = 'Saint-Petersburg';
  address.district = 'Saint-Petersburg';
  address.city = 'Saint-Petersburg';
  address.zip = 1112222;
  address.street = 'Nevsky Prospekt';
  address.house = '7' + index;
  address.block = 'A';
  address.apartments = index + 'x';
  address.coordinates = '11212x333';
  address.additional = 'some additional information';
  address.enabled = true;
  address.created = createdAt;
  address.updated = updatedAt;
  address.deleted = deletedAt;
  return address;
});
mockAddresses.unshift();
export default function mockAddressRepositoryProvider(): ValueProvider {

  const mockRepo: Partial<Repository<Address>> = {
    find: jest
      .fn()
      .mockImplementation((): Promise<Address[] | null> => {
        return Promise.resolve(mockAddresses);
      }),
    findOneBy: jest
      .fn()
      .mockImplementation((parameters: {
        id?: number,
      }): Promise<Address | null> => {
        if (parameters.id) {
          const profile = mockAddresses.find((_profile: Address) => _profile.id === parameters.id);
          return Promise.resolve(profile ? profile : null);
        }
      }),
    save: jest.fn().mockImplementation((_profile: Address): Promise<Address> => {
      if (!_profile.id) {
        _profile.id = mockAddresses.length + 1;
        mockAddresses.push(_profile);
        return new Promise(resolve => {
          resolve(JSON.parse(JSON.stringify(_profile)));
        })
      } else {
        throw new HttpException(
          HttpExceptionMessages.ENTITY_ALREADY_EXISTS_EXCEPTION_MESSAGE,
          HttpStatus.CONFLICT,
        );
      }
    }),
    update: jest.fn().mockImplementation((id: number, address: Address): void => {
      const exists = mockAddresses.find((u: Address) => u.id === id);
      if (exists) {
        exists.enabled = address.enabled;

        exists.updated = new Date();
      }
    }),
    softDelete: jest.fn().mockImplementation((id: number): void => {
      const exists = mockAddresses.find((u: Address) => u.id === id);
      if (exists) {
        exists.enabled = false;
        exists.updated = new Date();
        exists.deleted = new Date();
      }
    }),
  };
  return {
    provide: getRepositoryToken(Address),
    useValue: mockRepo,
  };
}