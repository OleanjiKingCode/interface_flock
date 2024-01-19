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
  const { modelId, newDataContribution } = req.body;

  try {
    const updatedModel = await prisma.model.update({
      where: { id: modelId },
      data: { DataContribution: { create: newDataContribution } },
    });

    res.status(200).json({
      message: 'Model updated successfully.',
      model: updatedModel,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating the model.' });
  }
}
