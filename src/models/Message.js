import crypto from 'crypto';

export class Message {
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

    get formattedTime() {
        const date = new Date(this.timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

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
