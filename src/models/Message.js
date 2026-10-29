import crypto from 'crypto';

/**
 * Entidad de dominio: Message
 * 
 * Principio SOLID aplicado:
 * - SRP (Single Responsibility Principle): Esta clase tiene una única responsabilidad:
 *   representar la estructura, validar los datos y formatear la fecha/hora de un mensaje.
 */
export class Message {
    /**
     * @param {Object} params
     * @param {string} [params.id]
     * @param {string} params.user - Nombre de quien escribió
     * @param {string} params.message - Contenido del mensaje
     * @param {string} [params.timestamp] - Fecha y hora ISO del mensaje
     */
    constructor({ id, user, message, timestamp } = {}) {
        this.id = id || crypto.randomUUID();
        this.user = this._validateUser(user);
        this.message = this._validateMessage(message);
        this.timestamp = timestamp || new Date().toISOString();
    }

    _validateUser(user) {
        if (!user || typeof user !== 'string' || user.trim() === '') {
            throw new Error('El nombre de quien escribe es obligatorio.');
        }
        return user.trim();
    }

    _validateMessage(message) {
        if (!message || typeof message !== 'string' || message.trim() === '') {
            throw new Error('El contenido del mensaje no puede estar vacío.');
        }
        return message.trim();
    }

    /**
     * Devuelve la hora formateada (ej. 11:45 AM)
     */
    get formattedTime() {
        const date = new Date(this.timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    /**
     * Devuelve la fecha completa (ej. 29/10/2026)
     */
    get formattedDate() {
        const date = new Date(this.timestamp);
        return date.toLocaleDateString();
    }

    toJSON() {
        return {
            id: this.id,
            user: this.user,
            message: this.message,
            timestamp: this.timestamp,
            formattedTime: this.formattedTime,
            formattedDate: this.formattedDate
        };
    }
}
