import type { NextApiRequest, NextApiResponse } from 'next';
import { Model } from '@prisma/client';
import prisma from '@/src/lib/prisma';

type ResponseData = {
  message: string;
  model?: Model;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { userId, modelName, description, dataRequired, modelIconPath, tags } =
    req.body;

  try {
    let user = await prisma.user.findUnique({
      where: {
        wallet: userId,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          wallet: userId,
        },
      });
    }

    const newModel = await prisma.model.create({
      data: {
        modelName,
        modelIcon: modelIconPath,
        description,
        dataRequired,
        userId: user.id,
        tags: tags,
        exampleKnowledge: [],
      },
    });
    console.log('user.id', user.id);

    res
      .status(200)
      .json({ message: 'Model added to DB successfully', model: newModel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
