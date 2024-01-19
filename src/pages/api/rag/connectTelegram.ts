import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { RewardType, insertReward } from '@/src/repositories/rewards';

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { wallet, auth_date, first_name, hash, id, last_name, username } = req.body;

    const user = await prisma.user.findUnique({
      where: { wallet },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await prisma.userTelegramData.upsert({
      where: { userId: user.id },
      update: {
        telegramId: id.toString(),
        telegramFirstName: first_name,
        telegramLastName: last_name,
        telegramUsername: username,
        telegramHash: hash,
        telegramAuthDate: parseInt(auth_date),
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        telegramId: id.toString(),
        telegramFirstName: first_name,
        telegramLastName: last_name,
        telegramUsername: username,
        telegramHash: hash,
        telegramAuthDate: parseInt(auth_date),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }
    )

    if (updatedUser) {
      await insertReward(user.id, RewardType.TelegramConnect)
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Request error', error);
    res.status(500).json({ error: 'Error updating user data' });
  }
}
