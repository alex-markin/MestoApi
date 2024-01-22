import { Request } from 'express';
import { IUser } from '../models/user';

export interface RequestWithUser extends Request {
  user?: IUser;
}
