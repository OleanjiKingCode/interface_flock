import prisma from '@/src/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { modelId, skipRecords, status } = req.query;

    if (typeof modelId !== 'string') {
      return res.status(400).json({ error: 'Invalid modelId' });
    }

    if (typeof status !== 'string') {
      return res.status(400).json({ error: 'Invalid status format' });
    }

    const dataContributions = await prisma.dataContribution.findMany({
      skip: parseInt(skipRecords as string),
      take: 30,
      where: {
        modelId: modelId,
        dataValidationStatus: status,
      },
      include: {
        User: {
          select: {
            wallet: true,
          },
        },
      },
    });

    if (!dataContributions) {
      return res
        .status(404)
        .json({ error: `Data contributions for model ${modelId} not found` });
    }

    res.status(200).json(dataContributions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
