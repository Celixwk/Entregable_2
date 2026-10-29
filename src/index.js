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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

const messageRepository = new FileMessageRepository(path.join(__dirname, 'data/messages.json'));
const chatService = new ChatService(messageRepository);
const messageController = new MessageController(chatService);

app.use('/', createViewsRouter(chatService));
app.use('/api/messages', createMessagesRouter(messageController));
app.post('/chat', messageController.createMessage);

app.listen(PORT, () => {
    console.log(`🚀 Servidor Express iniciado en: http://localhost:${PORT}`);
    console.log(`💬 Tablero de Chat disponible en: http://localhost:${PORT}/chat`);
});