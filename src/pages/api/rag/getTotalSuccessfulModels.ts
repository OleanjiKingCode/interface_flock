import prisma from '@/src/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const modelsCount = await prisma.model.count({
        where: { dataValidationStatus: 'SUCCESS'}
    });

    res.status(200).json({ count: modelsCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
