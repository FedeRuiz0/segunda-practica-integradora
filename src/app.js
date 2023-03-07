import express from 'express';

import handlebars from 'express-handlebars';
import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';

import mongoose from 'mongoose';
import initializePassport from './config/passport.config.js';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import { __dirname } from './utils.js';
import cartsRoutes from './routes/carts.routes.js';
import productsRoutes from './routes/products.routes.js';
import sessionRoutes from './routes/session.routes.js';
import viewsRouter from './routes/views.routes.js';

// application
const app = express();

// mongoDB
mongoose.set('strictQuery', true);
const user = 'kaoh0';
const dbname = 'ecommerce';
const password = 'jqcKtQVtNGsnRytJ';
const uri =  `mongodb+srv://${user}:${password}@ecommerce.l6epe3o.mongodb.net/${dbname}?retryWrites=true&w=majority`;

mongoose.connect(uri, 
    { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log('DB conectado'))
    .catch(err => console.log(err))

// handlebars config
app.engine('hbs', handlebars.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}))
app.set('view engine', 'hbs')
app.set('views', `${__dirname}/views`)

// ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(`${__dirname}/public`))
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());

// --- Routes
// Routes
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartsRoutes);
app.use('/session', sessionRoutes);
app.use('/', viewsRouter);
app.get('*', (req, res) => { res.status(404).send('404 not found')})


app.listen(3000, () => console.log('Server up in port 3000'))