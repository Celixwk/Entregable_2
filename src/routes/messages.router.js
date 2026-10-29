import { Router } from 'express';

/**
 * Enrutador de Mensajes: createMessagesRouter
 * 
 * Principio SOLID aplicado:
 * - SRP (Single Responsibility Principle): Define únicamente las rutas de la API de mensajes.
 * - DIP (Dependency Inversion Principle): Recibe 'messageController' inyectado.
 * 
 * @param {import('../controllers/MessageController.js').MessageController} messageController
 */
export function createMessagesRouter(messageController) {
    const router = Router();

    router.post('/', messageController.createMessage);
    router.get('/', messageController.getMessages);

    return router;
}
