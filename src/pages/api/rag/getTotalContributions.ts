import prisma from '@/src/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { modelId } = req.query;

    if (typeof modelId !== 'string') {
      return res.status(400).json({ error: 'Invalid modelId' });
    }

    const dataContributionsCount = await prisma.dataContribution.count({
      where: { modelId: modelId },
    });

    res.status(200).json({ count: dataContributionsCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
