import { Message } from '../models/Message.js';
import { MessageRepository } from '../repositories/MessageRepository.js';

/**
 * Servicio de Chat: ChatService
 * 
 * Principios SOLID aplicados:
 * - SRP (Single Responsibility Principle): Maneja exclusivamente las reglas de negocio
 *   del chat (creación de mensajes, validaciones, coordinación con el repositorio).
 * - DIP (Dependency Inversion Principle): Depende de una abstracción (MessageRepository)
 *   y NO de una implementación concreta directa. El repositorio se inyecta por constructor.
 */
export class ChatService {
    /**
     * @param {MessageRepository} messageRepository - Abstracción del repositorio inyectada
     */
    constructor(messageRepository) {
        if (!(messageRepository instanceof MessageRepository)) {
            throw new Error('ChatService requiere una instancia que herede de MessageRepository (DIP).');
        }
        this.messageRepository = messageRepository;
    }

    /**
     * Procesa y guarda un nuevo mensaje en el chat.
     * @param {Object} payload
     * @param {string} payload.user - Usuario emisor
     * @param {string} payload.message - Texto del mensaje
     * @returns {Promise<Message>}
     */
    async sendMessage({ user, message }) {
        // La entidad Message realiza las validaciones de datos
        const newMessage = new Message({ user, message });
        
        // El servicio orquesta el almacenamiento a través del repositorio abstracto
        await this.messageRepository.save(newMessage);
        
        return newMessage;
    }

    /**
     * Obtiene el historial de mensajes.
     * @param {number} [limit=100]
     * @returns {Promise<Array<Message>>}
     */
    async getHistory(limit = 100) {
        return await this.messageRepository.getAll(limit);
    }
}
