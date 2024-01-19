import prisma from '@/src/lib/prisma';
import { Model } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  message: string;
  model?: Model | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { modelId, exampleKnowledge, version } = req.body;

  if (!Array.isArray(exampleKnowledge)) {
    return res
      .status(400)
      .json({ message: 'exampleKnowledge must be an array.' });
  }

  try {
    const updatedModel = await prisma.$transaction(async (prismaTx) => {
      const currentModel = await prismaTx.model.findUnique({
        where: { id: modelId },
      });

      if (!currentModel) {
        throw new Error('Model not found');
      }

      // Perform the update with the incremented version
      return prismaTx.model.update({
        where: { id: modelId },
        data: {
          exampleKnowledge,
        },
      });
    });

    return res.status(200).json({
      message: 'Model updated successfully.',
      model: updatedModel,
    });
  } catch (error) {
    console.error('Error updating the model:', error);
    return res.status(500).json({ message: 'Error updating the model.' });
  }
}
