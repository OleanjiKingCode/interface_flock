import prisma from '@/src/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { wallet } = req.query;

    let contributions;

    if (wallet) {
      contributions = await prisma.user.findUnique({
        where: {
          wallet: wallet as string,
        },
        select: {
          wallet: true,
          id: true,
          DataContribution: {
            select: {
              id: true,
              filePath: true,
              created_at: true,
              updatedAt: true,
              rewardAmount: true,
              dataValidationStatus: true,
              modelId: true,
              Model: {
                select: {
                  modelName: true,
                },
              },
              UserModelRewardAudits: {
                select: {
                  rewardAmount: true,
                }
              }
            },
          },
        },
      });

      if (!contributions) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (
        contributions.DataContribution &&
        Array.isArray(contributions.DataContribution)
      ) {
        res.status(200).json(
          contributions.DataContribution.map((contribution) => ({
            ...contribution,
            modelName: contribution.Model?.modelName,
          }))
        );
      } else {
        res.status(404).json({ error: 'Data contributions not found' });
      }
    } else {
      contributions = await prisma.dataContribution.findMany();

      if (!contributions || !Array.isArray(contributions)) {
        return res.status(404).json({ error: 'Contributions not found' });
      }

      res.status(200).json(contributions);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
