import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import prisma from '@/src/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { dataContributionId } = req.query;

    const dataContribution = await prisma.dataContribution.findFirst({
      where: {
        id: dataContributionId as string,
      },
    });

    if (!dataContribution) {
      return res.status(404).json({ error: 'Data Contribution not found' });
    }
    res.status(200).json(dataContribution.dataValidationStatus);
  } catch (error) {
    res.status(500).json(error);
  }
}
