import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import {
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  ABOUT_MIN_LENGTH,
  ABOUT_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '../constants/models/user-model';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
  _id?: string;
}

interface UserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (email: string, password: string) => Promise<mongoose.Document<unknown, any, IUser>>;
}

const userSchema = new mongoose.Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: false,
      default: 'Жак-Ив Кусто',
      minlength: NAME_MIN_LENGTH,
      maxlength: NAME_MAX_LENGTH,
    },
    about: {
      type: String,
      required: false,
      default: 'Исследователь',
      minlength: ABOUT_MIN_LENGTH,
      maxlength: ABOUT_MAX_LENGTH,
    },
    avatar: {
      type: String,
      required: false,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      message: 'Введите корректный URL',
      validate: {
        validator: (v: string) => validator.isURL(v),
      },
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
      },
      message: 'Введите корректный email',
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: PASSWORD_MIN_LENGTH,
    },
  },
  { versionKey: false },
);

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Неправильные почта или пароль'));
        }

        return user;
      });
    });
});

export default mongoose.model<IUser, UserModel>('user', userSchema);
