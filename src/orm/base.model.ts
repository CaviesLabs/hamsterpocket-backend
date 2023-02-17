import { Document, ObjectId } from 'mongoose';

export class BaseModel extends Document {
  _id: ObjectId;

  createdAt: Date;

  updatedAt: Date;

  deletedAt?: Date;
}
