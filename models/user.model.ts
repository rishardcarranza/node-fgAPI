import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    avatar: {
        type: String,
        default: 'av-1.png'
    }
});

userSchema.method('validatePassword', function(password: string = ''): boolean {
    if (bcrypt.compareSync(password, this.password)) {
        return true;
    } else {
        return false;
    }
});

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar: string;

    validatePassword(password: string): boolean;
}

export const User = model<IUser>('User', userSchema);