import { ChatService } from '../services/ChatService.js';

export class MessageController {
    constructor(chatService) {
        if (!chatService) {
            throw new Error('MessageController requiere una instancia de ChatService.');
        }
        this.chatService = chatService;
    }

    createMessage = async (req, res) => {
        try {
            const { user, message } = req.body;
            const savedMessage = await this.chatService.sendMessage({ user, message });

            if (req.xhr || req.headers.accept?.includes('application/json') || req.headers['content-type']?.includes('application/json')) {
                return res.status(201).json({
                    status: 'success',
                    payload: savedMessage.toJSON()
                });
            }

            return res.redirect('/chat');
        } catch (error) {
            console.error('Error al crear mensaje:', error.message);
            if (req.xhr || req.headers.accept?.includes('application/json')) {
                return res.status(400).json({ status: 'error', message: error.message });
            }
            return res.status(400).render('chat', {
                title: 'Chat / Tablero de Mensajes',
                errorMessage: error.message
            });
        }
    };

    getMessages = async (req, res) => {
        try {
            const messages = await this.chatService.getHistory();
            return res.json({
                status: 'success',
                payload: messages.map(m => m.toJSON())
            });
        } catch (error) {
            console.error('Error al obtener mensajes:', error);
            return res.status(500).json({ status: 'error', message: 'Error interno del servidor.' });
        }
    };
}
