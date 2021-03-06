import { getCustomRepository } from 'typeorm';
import { UsersRepositories } from "../repositories/UsersRepositories";
import { hash } from 'bcryptjs';

interface IUserRequest {
  name: string;
  email: string;
  password: string;
  admin?: boolean;
}

class CreateUserService {

  async execute({ name, email, password, admin = false }: IUserRequest) {
    const usersRepository = getCustomRepository(UsersRepositories);

    if (!name) {
      throw new Error("Required name.");
    }

    if (!password) {
      throw new Error("Required password.");
    }

    if (!email) {
      throw new Error("Required email.");
    }
    const userAlreadyExists = await usersRepository.findOne({
      email
    });

    if (userAlreadyExists) {
      throw new Error("User already exists.");
    }

    const passwordHash = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: passwordHash,
      admin
    });

    await usersRepository.save(user);

    return user;
  }
}

export { CreateUserService };