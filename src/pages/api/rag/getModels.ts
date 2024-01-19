import prisma from '@/src/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { wallet } = req.query;

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
              userModelRewardAudits: {
                where:{
                  contributionId:null
                },
                select: {
                  rewardAmount: true,
                },
              }
            },
          },
        },
      });
    } else {
      models = await prisma.model.findMany();
    }
    res.status(200).json(models);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
