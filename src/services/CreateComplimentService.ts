import { getCustomRepository } from 'typeorm';
import { ComplimentsRepositories } from "../repositories/ComplimentsRepositories";
import { TagsRepositories } from '../repositories/TagsRepositories';
import { UsersRepositories } from '../repositories/UsersRepositories';

interface IComplimentRequest {
  tag_id: string;
  user_sender: string;
  user_receiver: string;
  message: string;
}

class CreateComplimentService {

  async execute({ tag_id, user_sender, user_receiver, message }: IComplimentRequest) {
    const complimentsRepository = getCustomRepository(ComplimentsRepositories);
    const usersRepository = getCustomRepository(UsersRepositories);
    const tagsRepository = getCustomRepository(TagsRepositories);

    if (user_sender === user_receiver) {
      throw new Error("You cannot send yourself a compliment.");
    }

    const userReceiverExists = await usersRepository.findOne(
      user_receiver
    );

    if (!userReceiverExists) {
      throw new Error("User Receiver does not exists.");
    }

    const tagIdExists = await tagsRepository.findOne(
      tag_id
    );

    if (!tagIdExists) {
      throw new Error("Tag ID does not exists.");
    }

    if (!message) {
      throw new Error("The message is mandatory.");
    }

    const compliment = complimentsRepository.create({
      tag_id,
      user_sender,
      user_receiver,
      message
    });

    await complimentsRepository.save(compliment);

    return compliment;
  }
}

export { CreateComplimentService };