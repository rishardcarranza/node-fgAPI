import Server from './classes/server';
import mongoose from 'mongoose';
// Middlewares
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';

import userRoutes from './routes/user.route';
import postRoutes from './routes/post.route';

const server = new Server();

// Middleware Body Parser
server.app.use(bodyParser.urlencoded({extended: true}));
server.app.use(bodyParser.json());

// Middleware FileUpload
server.app.use( fileUpload({useTempFiles: true}) );


// Routes for /user
server.app.use('/user', userRoutes);

// Routes for /post
server.app.use('/post', postRoutes);



// Connection to Mongo Database
mongoose.connect('mongodb://localhost:27017/fotosgram',
{
    useNewUrlParser: true,
    useCreateIndex: true
},
(error) => {
    if (error)
        throw error;
    
    console.log('Database ONLINE');
});



// Start server express
server.start(() => {
    console.log(`Server running on port ${server.port}`);
});
