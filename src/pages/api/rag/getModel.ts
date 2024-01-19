import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import prisma from '@/src/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { modelId } = req.query;

    const model = await prisma.model.findFirst({
      where: {
        id: modelId as string,
      },
      include: {
        user: true,
      },
    });

    if (!model) {
      return res.status(404).json({ error: 'Model not found' });
    }

    res.status(200).json(model);
  } catch (error) {
    res.status(500).json(error);
  }
}
