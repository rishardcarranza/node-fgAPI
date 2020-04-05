import { Router, Response } from 'express';
import { verifyToken } from '../middlewares/authentication';
import { Post } from '../models/post.model';
import { FileUpload } from '../interfaces/file.upload';
import FileSystem from '../classes/file.system';

const postRoutes = Router();
const fileSystem = new FileSystem();

// Obtener Post Paginados
postRoutes.get('/', async (request: any, response: Response) => {

    const regByPage = 10;
    let page = Number(request.query.page) || 1;
    let skip = page - 1;
    skip = skip * regByPage;
    
    const post = await Post.find()
                            .sort({_id: -1})
                            .skip(skip)
                            .limit(10)
                            .populate('user', '-password')
                            .exec();

    const currentRegs = post.length;
    const totalRegs = await Post.count({}).exec();
    const totalPages = Math.ceil( totalRegs / regByPage );
    

    response.json({
        success: true,
        page,
        totalPages,
        currentRegs,
        totalRegs,
        post
    });

});

// Create Post
postRoutes.post('/', [verifyToken], (request: any, response: Response) => {

    const body = request.body;
    body.user = request.user._id;

    const images = fileSystem.imagesFromTempToPost(request.user._id);
    body.images = images;

    // Save on Mongo
    Post.create(body)
        .then( async postDB => {

            await postDB.populate('user', '-password').execPopulate();
            
            response.json({
                success: true,
                post: postDB
            });

        })
        .catch(error => {
            response.json({
                success: false,
                error
            });
        });


});

// Upload images to Post
postRoutes.post('/upload', [verifyToken], async (request: any, response: Response) => {

    if (!request.files) {
        return response.status(400).json({
            success: false,
            message: 'No se subio ningun archivo'
        });
    }

    const file: FileUpload = request.files.image;

    if (!file) {
        return response.status(400).json({
            success: false,
            message: 'No se subio ningun archivo de imagen'
        });
    }

    if (!file.mimetype.includes('image')) {
        return response.status(400).json({
            success: false,
            message: 'No se ha subido una imagen'
        });
    }

    await fileSystem.saveTempImage(file, request.user._id);

    response.json({
        success: true,
        message: 'Imagen cargada con éxito',
        file: file.mimetype
    });



});

// Show images by user 
postRoutes.get('/image/:userid/:img', [verifyToken], (request: any, response: Response) => {

    const userId = request.params.userid;
    const img = request.params.img;

    const pathImage = fileSystem.getImageUrl(userId, img) || '';

    console.log(pathImage);

    response.sendFile(pathImage);

});


export default postRoutes;