import {HttpException, HttpStatus, Type, ValueProvider} from "@nestjs/common";
import {Repository} from "typeorm";
import {getRepositoryToken} from "@nestjs/typeorm";

import {HttpExceptionMessages} from "../dto/exceptions/http-exception-messages.constants";
import {User} from "../entities/user.entity";
import {hash} from "../helpers/hash";

import {UpdateUserDto} from "../dto/update-user.dto";
import {mockRoles} from "../../roles/test/mock.repository";
import {UserDto} from "../dto/user";
import {randomBytes} from "crypto";

function getConfirmationToken(): Promise<string> {
  return new Promise((resolve) => {
    randomBytes(16, (err:Error | null, buf: Buffer) => {
      resolve(buf.toString("hex"));
    });
  });
}

export const mockUsers = [...Array(11)].map((_role, index) => {
  const createdAt = new Date();
  const updatedAt = new Date();
  const deletedAt = null;

  const user = new User();
  user.roles = [];
  user.id = index;
  user.email = 'example' + index + '@gmail.com';
  user.password = 'some random password';
  (async() => {
    user.password = await hash(user.password);
    user.auth_confirmation_token = await getConfirmationToken();
  })();

  user.password_reset_token = 'some random token';
  user.password_reset_expires = 0;
  user.enabled = true;
  user.created = createdAt;
  user.updated = updatedAt;
  user.deleted = deletedAt;
  user.verified = false;
  user.auth_confirmation_token = index + '_this_is_the_code';
  user.roles.push(mockRoles[3]);

  return user;
});

export default function mockUserRepositoryProvider(): ValueProvider {

  const mockRepo: Partial<Repository<User>> = {
    find: jest
      .fn()
      .mockImplementation((): Promise<User[] | null> => {
        return Promise.resolve(mockUsers);
      }),
    findOneBy: jest
      .fn()
      .mockImplementation((parameters: {
        id?: number,
        email?: string
      }): Promise<User | null> => {
        if (parameters.id) {
          const user = mockUsers.find((user: User) => user.id === parameters.id);
          return Promise.resolve(user ? user : null);
        }
        if (parameters.email) {
          const user = mockUsers.find((user: User) => user.email === parameters.email);
          return Promise.resolve(user ? user : null);
        }
      }),
    findOne: jest
      .fn()
      .mockImplementation((options: { where: { id: number }, relations: string[] }): Promise<User | null> => {
        const { where, relations } = options;
        const user = mockUsers.find((user: User) => user.id === where.id);
        return Promise.resolve(user ? user : null);
      }),
    save: jest.fn().mockImplementation(async (userDto: UserDto): Promise<void> => {
      if (!mockUsers.find((u: User) => u.email === userDto.email)) {

        const user = new User();
        user.id = userDto.id ? userDto.id : mockUsers.length;
        user.email = userDto.email;
        user.password = userDto.password;
        user.roles = userDto.roles;
        user.enabled = userDto.enabled;

        user.created = userDto.created || new Date();
        user.updated = userDto.updated || new Date();
        user.deleted = null;

        user.password_reset_token = 'some random token';
        user.password_reset_expires = 0;

        user.roles = userDto.roles ? userDto.roles : [mockRoles[3]]
        if (!userDto.id) {
          mockUsers.push(user);
          return;
        }
        if (userDto.id) {

          const exists = mockUsers.find((u: User) => u.id === userDto.id);
          if (exists) {
            exists.enabled = userDto.enabled;
            exists.email = userDto.email;
            exists.updated = new Date();
            exists.roles = userDto.roles;
            if (userDto.password) {
              exists.password = userDto.password;
            }
            const index = mockUsers.findIndex((u: User) => u.id === userDto.id);
            mockUsers[index] = exists;
            return;
          }
        }

      }

      if (userDto.id) {

        const exists = mockUsers.find((u: User) => u.id === userDto.id);
        if (exists) {
          exists.enabled = userDto.enabled;
          exists.email = userDto.email;
          exists.updated = new Date();
          exists.roles = userDto.roles;
          if (userDto.password) {
            exists.password = userDto.password;
          }
          const index = mockUsers.findIndex((u: User) => u.id === userDto.id);
          mockUsers[index] = exists;
          return;
        }
      }
        throw new HttpException(
          HttpExceptionMessages.USER_ALREADY_EXISTS_EXCEPTION_MESSAGE,
          HttpStatus.CONFLICT,
        );

    }),
    update: jest.fn().mockImplementation(async (id: number, updateUserDto: UpdateUserDto): Promise<void> => {
      const exists = mockUsers.find((u: User) => u.id === id);

      throw new HttpException(
        HttpExceptionMessages.USER_NOT_FOUND_EXCEPTION_MESSAGE,
        HttpStatus.NOT_FOUND,
      );
    }),
    softDelete: jest.fn().mockImplementation((id: number): void => {
      const exists = mockUsers.find((u: User) => u.id === id);
      if (exists) {
        exists.enabled = false;
        exists.updated = new Date();
        exists.deleted = new Date();
      }
    }),
  };
  return {
    provide: getRepositoryToken(User),
    useValue: mockRepo,
  };
}