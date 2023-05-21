import {HttpException, HttpStatus, Type, ValueProvider} from "@nestjs/common";
import {Repository} from "typeorm";
import {getRepositoryToken} from "@nestjs/typeorm";
import {Profile} from "../entities/profile.entity";
import {HttpExceptionMessages} from "../dto/exceptions/http-exception-messages.constants";

export const mockProfiles = [...Array(11)].map((_role, index) => {
  const createdAt = new Date();
  const updatedAt = new Date();
  const deletedAt = null;

  const profile = new Profile();

  profile.id = index;
  profile.user_id = index;
  profile.username = 'username ' + index;
  profile.first_name = 'name' + index;
  profile.last_name = 'surname' + index;
  profile.birthdate = new Date();
  profile.about = 'some test description';
  profile.enabled = true;
  profile.created = createdAt;
  profile.updated = updatedAt;
  profile.deleted = deletedAt;
  return profile;
});
mockProfiles.unshift();

export default function mockProfileRepositoryProvider(): ValueProvider {

  const mockRepo: Partial<Repository<Profile>> = {
    find: jest
      .fn()
      .mockImplementation((): Promise<Profile[] | null> => {
        return Promise.resolve(mockProfiles);
      }),
    findOneBy: jest
      .fn()
      .mockImplementation((parameters: {
        id?: number,
        username?: string
      }): Promise<Profile | null> => {
        if (parameters.id) {
          const profile = mockProfiles.find((_profile: Profile) => _profile.id === parameters.id);
          return Promise.resolve(profile ? profile : null);
        }
        if (parameters.username) {
          const profile = mockProfiles.find((_profile: Profile) => _profile.username === parameters.username);
          return Promise.resolve(profile ? profile : null);
        }
      }),
    save: jest.fn().mockImplementation((_profile: Profile): void => {
      if (!mockProfiles.find((u: Profile) => u.username === _profile.username)) {
        _profile.id = mockProfiles.length + 1;
        _profile.created = new Date();
        _profile.updated = new Date();
        _profile.deleted = null;
        mockProfiles.push(_profile);
      } else {
        throw new HttpException(
          HttpExceptionMessages.ENTITY_ALREADY_EXISTS_EXCEPTION_MESSAGE,
          HttpStatus.CONFLICT,
        );
      }
    }),
    update: jest.fn().mockImplementation((id: number, profile: Profile): void => {
      const exists = mockProfiles.find((u: Profile) => u.id === id);
      if (exists) {
        exists.enabled = profile.enabled;
        exists.username = profile.username;
        exists.first_name = profile.first_name;
        exists.last_name = profile.last_name;
        exists.birthdate = profile.birthdate;
        exists.about = profile.about;
        exists.updated = new Date();
      }
    }),
    softDelete: jest.fn().mockImplementation((id: number): void => {
      const exists = mockProfiles.find((u: Profile) => u.id === id);
      if (exists) {
        exists.enabled = false;
        exists.updated = new Date();
        exists.deleted = new Date();
      }
    }),
  };
  return {
    provide: getRepositoryToken(Profile),
    useValue: mockRepo,
  };
}