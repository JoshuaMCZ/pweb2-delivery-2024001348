import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import expressLayouts from 'express-ejs-layouts';
import session from 'express-session';
import flash from 'connect-flash';
import methodOverride from 'method-override';
import { criarRotas } from './src/routes/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'src', 'views'));

app.use(expressLayouts);
app.set('layout', 'layouts/base');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(join(__dirname, '..', 'public')));

app.use(session({
    secret: process.env.SESSION_SECRET || 'segredo-local',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.sucesso = req.flash('sucesso');
    res.locals.erro = req.flash('erro');
    next();
});

app.use(methodOverride('_method'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/', criarRotas());

app.use((req, res) => {
    res.status(404).render('erros/404', {
        titulo: 'Página não encontrada'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Delivery Tracker rodando em http://localhost:${PORT}`));