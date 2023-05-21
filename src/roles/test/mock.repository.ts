import {HttpException, HttpStatus, Type, ValueProvider} from "@nestjs/common";
import {Repository} from "typeorm";
import {getRepositoryToken} from "@nestjs/typeorm";
import {Role} from "../entities/role.entity";
import {HttpExceptionMessages} from "../dto/exceptions/http-exception-messages.constants";

export const mockRoles = [...Array(11)].map((_role, index) => {
  const createdAt = new Date();
  const updatedAt = new Date();
  const deletedAt = null;

  const role = new Role();

  role.id = index;
  if (index === 1) {
    role.title = 'root';
  }
  if (index === 2) {
    role.title = 'admin';
  }
  if (index === 3) {
    role.title = 'user';
  }
  if (index === 4) {
    role.title = 'manager';
  }

  role.description = 'some test description';
  role.enabled = true;
  role.created = createdAt;
  role.updated = updatedAt;
  role.deleted = deletedAt;
  return role;
});
mockRoles.unshift();
export default function mockRoleRepositoryProvider(): ValueProvider {

  const mockRepo: Partial<Repository<Role>> = {
    find: jest
      .fn()
      .mockImplementation((): Promise<Role[] | null> => {
        return Promise.resolve(mockRoles);
      }),
    findOneBy: jest
      .fn()
      .mockImplementation((parameters: {
        id?: number,
        title?: string
      }): Promise<Role | null> => {
        if (parameters.id) {
          const role = mockRoles.find((role: Role) => role.id === parameters.id);
          return Promise.resolve(role ? role : null);
        }
        if (parameters.title) {
          const role = mockRoles.find((role: Role) => role.title === parameters.title);
          return Promise.resolve(role ? role : null);
        }
      }),
    save: jest.fn().mockImplementation((role: Role): void => {
      // unique email and address
      if (!mockRoles.find((u: Role) => u.title === role.title)) {
        role.id = mockRoles.length + 1;
        mockRoles.push(role);
      } else {
        throw new HttpException(
          HttpExceptionMessages.ENTITY_ALREADY_EXISTS_EXCEPTION_MESSAGE,
          HttpStatus.CONFLICT,
        );
      }
    }),
    update: jest.fn().mockImplementation((id: number, role: Role): void => {
      const exists = mockRoles.find((u: Role) => u.id === id);
      if (exists) {
        exists.enabled = role.enabled;
        exists.title = role.title;
        exists.description = role.description;
        exists.updated = new Date();
      }
    }),
    softDelete: jest.fn().mockImplementation((id: number): void => {
      const exists = mockRoles.find((u: Role) => u.id === id);
      if (exists) {
        exists.enabled = false;
        exists.updated = new Date();
        exists.deleted = new Date();
      }
    }),
  };
  return {
    provide: getRepositoryToken(Role),
    useValue: mockRepo,
  };
}