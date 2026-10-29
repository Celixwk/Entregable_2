import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';

import { __dirname } from './util.js';
import { FileMessageRepository } from './repositories/FileMessageRepository.js';
import { ChatService } from './services/ChatService.js';
import { MessageController } from './controllers/MessageController.js';
import { createViewsRouter } from './routes/views.router.js';
import { createMessagesRouter } from './routes/messages.router.js';

const app = express();
const PORT = 3000;

// 1. Configuración de Middlewares para formularios y JSON (sin dependencias de sockets)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// 2. Configurar motor de plantillas Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

/**
 * COMPOSITION ROOT (Principio DIP - Dependency Inversion Principle)
 * Ensamblamos las dependencias desacopladas de forma limpia:
 * 1. Repositorio concreto de persistencia (FileMessageRepository / InMemoryMessageRepository).
 * 2. Inyección de Repositorio en ChatService (Lógica de Negocio).
 * 3. Inyección de ChatService en MessageController y Enrutadores.
 */
const messageRepository = new FileMessageRepository(path.join(__dirname, 'data/messages.json'));
const chatService = new ChatService(messageRepository);
const messageController = new MessageController(chatService);

// 3. Montar rutas
app.use('/', createViewsRouter(chatService));
app.use('/api/messages', createMessagesRouter(messageController));
app.post('/chat', messageController.createMessage); // Soporte para submit de formulario nativo

// 4. Iniciar servidor Express
app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 Servidor Express iniciado en: http://localhost:${PORT}`);
    console.log(`💬 Tablero de Chat disponible en: http://localhost:${PORT}/chat`);
    console.log(`=================================================`);
});