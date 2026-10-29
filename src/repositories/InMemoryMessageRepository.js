import { MessageRepository } from './MessageRepository.js';

/**
 * Implementación en memoria: InMemoryMessageRepository
 * 
 * Principios SOLID aplicados:
 * - LSP (Liskov Substitution Principle): Puede sustituir a MessageRepository de forma transparente.
 * - SRP (Single Responsibility Principle): Se encarga exclusivamente del almacenamiento en memoria volátil.
 */
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
