import prisma from '@/src/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

type Response = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { walletAddress } = req.query;

  const getReport = await prisma.researcherReport.findFirst({
    where: {
      wallet: walletAddress as string,
    },
  });

  if (!getReport) {
    return res.status(404).json({ message: 'Not Found' });
  }

  return res.status(200).json({ data: getReport });
}
