import { Message } from '../models/Message.js';
import { MessageRepository } from '../repositories/MessageRepository.js';

export class ChatService {
    constructor(messageRepository) {
        if (!(messageRepository instanceof MessageRepository)) {
            throw new Error('ChatService requiere una instancia que herede de MessageRepository.');
        }
        this.messageRepository = messageRepository;
    }

    async sendMessage({ user, message }) {
        const newMessage = new Message({ user, message });
        await this.messageRepository.save(newMessage);
        return newMessage;
    }

    async getHistory(limit = 100) {
        return await this.messageRepository.getAll(limit);
    }
}
