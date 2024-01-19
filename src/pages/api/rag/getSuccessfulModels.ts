import prisma from '@/src/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function getSuccessfulModels(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { wallet, skipRecords } = req.query;

    let models;

    if (wallet) {
      models = await prisma.user.findUnique({
        where: {
          wallet: wallet as string,
        },
        select: {
          wallet: true,
          id: true,
          Model: {
            select: {
              id: true,
              modelName: true,
              created_at: true,
              updatedAt: true,
              rewardAmount: true,
              dataValidationStatus: true,
            },
            where: {
              dataValidationStatus: 'SUCCESS',
            },
          },
        },
      });
    } else {
      models = await prisma.model.findMany({
        skip: parseInt(skipRecords as string),
        take: 30,
        where: {
          dataValidationStatus: 'SUCCESS',
        },
      });
    }
    res.status(200).json(models);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
