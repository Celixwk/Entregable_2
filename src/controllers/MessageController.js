import { ChatService } from '../services/ChatService.js';

/**
 * Controlador HTTP: MessageController
 * 
 * Principios SOLID aplicados:
 * - SRP (Single Responsibility Principle): Se encarga exclusivamente de procesar las
 *   peticiones HTTP (Request) y generar las respuestas correspondientes (Response).
 *   No contiene lógica de persistencia ni validación de entidades.
 * - DIP (Dependency Inversion Principle): Recibe 'chatService' inyectado en su constructor.
 */
export class MessageController {
    /**
     * @param {ChatService} chatService
     */
    constructor(chatService) {
        if (!chatService) {
            throw new Error('MessageController requiere una instancia de ChatService (DIP).');
        }
        this.chatService = chatService;
    }

    /**
     * Registra un nuevo mensaje a través de HTTP POST
     */
    createMessage = async (req, res) => {
        try {
            const { user, message } = req.body;
            const savedMessage = await this.chatService.sendMessage({ user, message });

            // Si es petición AJAX/Fetch, responde JSON
            if (req.xhr || req.headers.accept?.includes('application/json') || req.headers['content-type']?.includes('application/json')) {
                return res.status(201).json({
                    status: 'success',
                    payload: savedMessage.toJSON()
                });
            }

            // Si es un envío de formulario HTML estándar, redirige a la vista del chat
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

    /**
     * Obtiene todos los mensajes en formato JSON
     */
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
