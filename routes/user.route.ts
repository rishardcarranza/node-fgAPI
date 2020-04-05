import { Router, Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt'
import Token from '../classes/token';
import { verifyToken } from '../middlewares/authentication';
import bodyParser from 'body-parser';

const userRoutes = Router();

// Login
userRoutes.post('/login', (request: Request, response: Response) => {
    const body = request.body;

    User.findOne({email: body.email}, (error, userDB) => {
        if (error)
            throw error;

        if (!userDB) {
            return response.json({
                success: false,
                message: 'Usuario o contraseña incorrectos, favor revisar.'
            });
        }

        if (userDB.validatePassword(body.password)) {

            const userToken = Token.getToken({
                _id: userDB._id,
                name: userDB.name,
                email: userDB.email,
                avatar: userDB.avatar
            });

            return response.json({
                success: true,
                token: userToken
            });
        } else {
            return response.json({
                success: false,
                message: 'Usuario o contraseña incorrectos, favor revisar.'
            });
        }

    });
});

// Create User
userRoutes.post('/create', (request: Request, response: Response) => {
    
    const user = {
        name: request.body.name,
        email: request.body.email,
        password: bcrypt.hashSync(request.body.password, 10),
        avatar: request.body.avatar
    };

    User.create(user)
        .then( userDB => {
            const userToken = Token.getToken({
                _id: userDB._id,
                name: userDB.name,
                email: userDB.email,
                avatar: userDB.avatar
            });

            return response.json({
                success: true,
                token: userToken
            });
        })
        .catch(error => {
            response.json({
                success: false,
                error
            });
        });
    
    
    
});

// Update User
userRoutes.post('/update', [verifyToken], (request: any, response: Response) => {

    const userUpdate = {
        name: request.body.name || request.user.name,
        email: request.body.email || request.user.email,
        avatar: request.body.avatar || request.user.avatar
    }

    // Update by Mongoose
    User.findByIdAndUpdate(request.user._id, userUpdate, {new: true}, (error, userDB) => {
        
        if (error)
            throw error;

        if (!userDB) {
            return response.json({
                success: false,
                message: 'No existe usuario con ese ID'
            });
        }

        const userToken = Token.getToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            avatar: userDB.avatar
        });

        response.json({
            success: true,
            token: userToken
        });

    });
});

userRoutes.get('/', [verifyToken], (request: any, response: Response) => {

    const user = request.user;

    response.json({
        success: true,
        user
    });

});


export default userRoutes;