import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

import { FileUpload } from "../interfaces/file.upload";



export default class FileSystem {

    constructor() {}

    saveTempImage(file: FileUpload, userId: string) {

        return new Promise((resolve, reject) => {

            // Create path
            const path = this.createUserPath(userId);
    
            // Create unique name to file 
            const fileName = this.generateUserImageName(file.name);
    
            // Move file to custom path
            file.mv(`${path}/${fileName}`, (error: any) => {
    
                if (error) {
                    // Error
                    reject(error);
                } else {
                    // Success
                    resolve();
                }
    
            });

        });



    }

    private generateUserImageName(nameCurrent: string) {

        const nameArray = nameCurrent.split('.');
        const extension = (nameArray[nameArray.length - 1]).toString().toLowerCase();

        const uniqueID = uniqid();

        return `${uniqueID}.${extension}`;
    }

    private createUserPath(userId: string) {

        const pathUser = path.resolve(__dirname, '../uploads/', userId);
        const pathUserTemp = pathUser + '/temp';
        
        // console.log('pathUser', pathUserTemp);

        const exist = fs.existsSync(pathUser);

        if (!exist) {
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }

        return pathUserTemp;

    }

    imagesFromTempToPost(userId: string) {

        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathPost = path.resolve(__dirname, '../uploads/', userId, 'posts');

        // console.log(pathTemp, pathPost, __dirname);

        if (!fs.existsSync(pathTemp)) {
            return [];
        }

        if (!fs.existsSync(pathPost)) {
            fs.mkdirSync(pathPost);
        }

        const imagesTemp = this.getImagesFromTemp(userId);

        // console.log(imagesTemp);

        imagesTemp.forEach(image => {
            fs.renameSync(`${pathTemp}/${image}`, `${pathPost}/${image}`);
        });

        return imagesTemp;

    }

    private getImagesFromTemp(userId: string) {
        
        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');

        return fs.readdirSync(pathTemp) || [];

    }

    getImageUrl(userId: string, img: string) {
        
        // Path image
        const pathImage = path.resolve(__dirname, '../uploads/', userId, 'posts', img);
        const pathImageDefault = path.resolve(__dirname, '../assets/', 'imgs', 'default.jpg');

        // console.log(pathImage);
        const exist = fs.existsSync(pathImage);
        if (!exist) {
            return pathImageDefault;
        }

        return pathImage;
    }
}