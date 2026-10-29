export class MessageRepository {
    async save(message) {
        throw new Error('Método save() no implementado en la subclase.');
    }

    async getAll(limit = 100) {
        throw new Error('Método getAll() no implementado en la subclase.');
    }
}
