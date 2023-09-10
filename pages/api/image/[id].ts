import prisma from '../../../lib/prisma';
import { destroyImage } from '../../../lib/cloudinary';

// DELETE /api/image/:id
export default async function handle(req, res) {
  const imageId = req.query.id;
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
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}