import { BaseModel } from './base-model';

interface MealModelBase {
  name: string,
  desc?: string,
  inDiet: [0, 1],
  date_meal: string
};

export type DTO = MealModelBase & BaseModel;
export type MODEL = MealModelBase;
export type PATCH = Partial<MealModelBase>;