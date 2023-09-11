import { resolve } from 'path';
import prisma from '../../../lib/prisma';
import { IncomingForm } from "formidable";
import { uploadImage } from '../../../lib/cloudinary';
import { parseImageForm } from '../../../lib/imageparse';

export const config = {
  api : {
    bodyParser: false,
  }
}

// POST /api/image
// Required fields in body: title, personal, professional
// Optional fields in body: description, published
export default async function handle(req, res) {

  const x = await parseImageForm(req);
  
  const imageData: any = await uploadImage(x.files['image'][0].filepath);

  await prisma.image.create({
    data: {
      c_id: imageData.public_id,
      title: x.fields.title[0],
      description: x.fields.description[0],
      format: imageData.format,
      version: imageData.version.toString(),
      published: true,
      uploadDate: (new Date()).toISOString(),
      personal: x.fields.personal === 'true', //FormData converts booleans to strings.
      professional: x.fields.professional === 'true'
    },
  });

  // give time for cloudinary to populate the image address.
  res.status(200).json({status: 'success'});
}