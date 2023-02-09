import { ObjectId } from 'mongoose';

export class BaseModel {
  _id: ObjectId;

  createdAt: Date;

  updatedAt: Date;

  deletedAt?: Date;
}
