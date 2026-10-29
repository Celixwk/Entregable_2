/**
 * Contrato / Interfaz base: MessageRepository
 * 
 * Principios SOLID aplicados:
 * - ISP (Interface Segregation Principle): Contiene únicamente las operaciones esenciales 
 *   que requiere el cliente del repositorio (guardar y obtener mensajes).
 * - OCP (Open/Closed Principle): Define una abstracción abierta a la extensión (puedes crear 
 *   repositorios para MongoDB, SQLite, Archivo o Memoria) sin modificar las clases que la consumen.
 * - LSP (Liskov Substitution Principle): Cualquier implementación concreta debe poder sustituir
 *   a esta clase base sin alterar el correcto funcionamiento del sistema.
 */
export class MessageRepository {
    /**
     * Guarda un mensaje.
     * @param {import('../models/Message.js').Message} message
     * @returns {Promise<import('../models/Message.js').Message>}
     */
    async save(message) {
        throw new Error('Método save() no implementado en la subclase.');
    }

    /**
     * Obtiene todos los mensajes registrados.
     * @param {number} [limit]
     * @returns {Promise<Array<import('../models/Message.js').Message>>}
     */
    async getAll(limit = 100) {
        throw new Error('Método getAll() no implementado en la subclase.');
    }
}
