import prisma from '../../../lib/prisma';
import { destroyImage } from '../../../lib/cloudinary';
import { parseImageForm } from '../../../lib/imageparse';
import { NextApiRequest, NextApiResponse } from "next";
import { checkIsInSession } from '../auth/[...nextauth]';

export const config = {
  api : {
    bodyParser: false,
  }
}

// DELETE /api/image/:id
// PUT /api/image/:id
export default checkIsInSession(
  async (req: NextApiRequest, res: NextApiResponse) => {
  const imageId = req.query.id as string;
  if (req.method === 'DELETE') {
    const c_id = await prisma.image.findUnique({
      select: { c_id: true},
      where: { id: imageId},
    });
    // don't need to wait
    destroyImage(c_id);
    const image = await prisma.image.delete({
      where: { id: imageId },
    });
    res.json(image);
  } else if (req.method === 'PUT') {
    try {

      const x = await parseImageForm(req);
      const title = x.fields?.title?.[0];
      const description = x.fields?.description?.[0];
      const personal = x.fields?.personal?.[0];
      const professional = x.fields?.professional?.[0];
  
      const updatedData = {};
      if (title) updatedData['title'] = title;
      if (description) updatedData['description'] = description;
      if (personal) updatedData['personal'] = personal === 'true';
      if (professional) updatedData['professional'] = professional === 'true';
  
      const updatedImage = await prisma.image.update({
        where: { id: imageId },
        data: updatedData,
      });
      res.json(updatedImage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
});