import { Router } from 'express';

export function createMessagesRouter(messageController) {
    const router = Router();

    router.post('/', messageController.createMessage);
    router.get('/', messageController.getMessages);

    return router;
}
