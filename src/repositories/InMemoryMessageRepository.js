import { MessageRepository } from './MessageRepository.js';

export class InMemoryMessageRepository extends MessageRepository {
    constructor() {
        super();
        this.messages = [];
    }

    async save(message) {
        this.messages.push(message);
        return message;
    }

    async getAll(limit = 100) {
        return this.messages.slice(-limit);
    }
}
