/*
Run npx prisma studio to mess with the tables.

Need to run ```npx prisma generate``` every time schema is updated.

Creates a PrismaClient instance to be imported to any file that needs to access the database.
*/
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

export function uploadImage(imageUploaded) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            imageUploaded,
            {},
            (err, res) => {
                if (err) reject(err);
                resolve(res);
            }
        );
    });
}

export function destroyImage(c_id) {
    return new Promise((resolve, reject)=>{
        cloudinary.uploader.destroy(c_id,{},(err, res)=>{
            if (err) reject(err);
            resolve(res);
        })
    })
}