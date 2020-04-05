import { Schema, model, Document } from 'mongoose';


const postSchema = new Schema({

    created: {
        type: Date
    },
    message: {
        type: String,
    },
    images: [{
        type: String
    }],
    coordinates: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El usuario es obligatorio']
    }
});

postSchema.pre<IPost>('save', function(next) {
    this.created = new Date();
    next();
});

interface IPost extends Document {
    created: Date;
    message: string;
    images: string[];
    coordinates: string;
    user: string;
}

export const Post = model<IPost>('Post', postSchema);