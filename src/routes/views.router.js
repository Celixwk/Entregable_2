import { Router } from 'express';

export function createViewsRouter(chatService) {
    const router = Router();

    router.get('/', (req, res) => {
        const products = [
            { name_product: 'Hamburguesa chibita', price: 10 },
            { name_product: 'Coke', price: 20 },
            { name_product: 'Pancake', price: 30 },
        ];
        res.render('index', {
            title: 'Inicio | Motores de Plantilla',
            username: 'Hola muchachos',
            admin: true,
            products: products
        });
    });

    router.get('/chat', async (req, res) => {
        try {
            const rawMessages = await chatService.getHistory();
            const messages = rawMessages.map(m => m.toJSON());

            res.render('chat', {
                title: 'Tablero de Chat - SOLID (HTTP / Handlebars)',
                messages: messages,
                totalMessages: messages.length
            });
        } catch (error) {
            console.error('Error al cargar mensajes en /chat:', error);
            res.render('chat', {
                title: 'Tablero de Chat',
                messages: [],
                totalMessages: 0,
                errorMessage: 'No se pudieron cargar los mensajes previos.'
            });
        }
    });

    router.get('/contact', (req, res) => {
        res.render('contact', {
            title: 'Contacto',
            date: 'Por jugar'
        });
    });

    return router;
}
