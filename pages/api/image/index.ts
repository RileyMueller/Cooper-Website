import { resolve } from 'path';
import prisma from '../../../lib/prisma';
import { IncomingForm } from "formidable";
import { uploadImage } from '../../../lib/cloudinary';
import { parseImageForm } from '../../../lib/imageparse';
import { checkIsInSession } from '../auth/[...nextauth]';

export const config = {
  api : {
    bodyParser: false,
  }
}

// POST /api/image
// Required fields in body: title, personal, professional
// Optional fields in body: description, published
export default checkIsInSession( async (req, res) => {

  if (req.method === 'POST') {
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
        personal: x.fields.personal[0] === 'true', //FormData converts booleans to strings.
        professional: x.fields.professional[0] === 'true'
      },
    });

    // give time for cloudinary to populate the image address.
    res.status(200).json({status: 'success'});

  } else if (req.method === 'GET') {

    // return a list of image ids and titles
    const vals = await prisma.image.findMany({
      select : {
        id: true,
        title: true,
        uploadDate: true,
        personal: true,
        professional: true,
      },
      orderBy: {
        uploadDate: 'desc',
      }
    });

    res.status(200).json(vals);
  }

  
});