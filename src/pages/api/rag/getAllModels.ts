import prisma from '@/src/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const allModels = await prisma.model.findMany();

    if (!allModels) {
      return res.status(404).json({ error: 'Models not found' });
    }

    res.status(200).json(allModels);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
