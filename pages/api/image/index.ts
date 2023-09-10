import { resolve } from 'path';
import prisma from '../../../lib/prisma';
import { IncomingForm } from "formidable";
import { uploadImage } from '../../../lib/cloudinary';

export const config = {
  api : {
    bodyParser: false,
    // bodyParser: {
    //   //sizeLimit: '4mb'
    // }
  }
}

interface FormParseResults {
  fields: any;
  files: any;
}

// POST /api/image
// Required fields in body: title
// Optional fields in body: description, published
export default async function handle(req, res) {

  const x: FormParseResults = await new Promise((resolve, reject)=>{
    const form = new IncomingForm({keepExtensions: true});
    form.parse(req, (err, fields, files)=>{
        if (err) return reject(err);
        resolve({fields, files});
    });
  });

  
  const imageData: any = await uploadImage(x.files['image'][0].filepath);

  await prisma.image.create({
    data: {
      c_id: imageData.public_id,
      title: x.fields.title[0],
      description: x.fields.description[0],
      format: imageData.format,
      version: imageData.version.toString(),
      published: true,
      uploadDate: new Date(),
    },
  });
  res.json({});
}