import { BaseModel } from './base-model';

interface UserModelBase {
  name: string,
  email: string,
  password: string
};

export type DTO = UserModelBase & BaseModel;
export type MODEL = UserModelBase;
export type PATCH = Partial<UserModelBase>;