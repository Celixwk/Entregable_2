import fs from 'fs/promises';
import path from 'path';
import { MessageRepository } from './MessageRepository.js';
import { Message } from '../models/Message.js';

/**
 * Implementación basada en archivos: FileMessageRepository
 * 
 * Principios SOLID aplicados:
 * - OCP (Open/Closed Principle): Extendemos el sistema para persistir en disco sin modificar
 *   ChatService ni la interfaz MessageRepository.
 * - LSP (Liskov Substitution Principle): Puede intercambiarse por InMemoryMessageRepository sin romper nada.
 * - SRP (Single Responsibility Principle): Se encarga exclusivamente de la persistencia de mensajes en el sistema de archivos.
 */
export class FileMessageRepository extends MessageRepository {
    /**
     * @param {string} filePath - Ruta absoluta o relativa al archivo JSON
     */
    constructor(filePath) {
        super();
        this.filePath = filePath;
        this.initialized = false;
    }

    async _ensureFile() {
        if (this.initialized) return;
        try {
            const dir = path.dirname(this.filePath);
            await fs.mkdir(dir, { recursive: true });
            await fs.access(this.filePath);
        } catch {
            await fs.writeFile(this.filePath, JSON.stringify([], null, 2), 'utf-8');
        }
        this.initialized = true;
    }

    async _readMessages() {
        await this._ensureFile();
        try {
            const content = await fs.readFile(this.filePath, 'utf-8');
            const data = JSON.parse(content || '[]');
            return data.map(item => new Message(item));
        } catch (error) {
            console.error('Error al leer archivo de mensajes:', error);
            return [];
        }
    }

    async save(message) {
        const messages = await this._readMessages();
        messages.push(message);
        await fs.writeFile(this.filePath, JSON.stringify(messages, null, 2), 'utf-8');
        return message;
    }

    async getAll(limit = 100) {
        const messages = await this._readMessages();
        return messages.slice(-limit);
    }
}
