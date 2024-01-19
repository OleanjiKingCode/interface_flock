import prisma from '@/src/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import {insertReward, RewardType} from "@/src/repositories/rewards";
import {getUserIdFromWallet} from "@/src/repositories/users";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userWallet, contributionId, modelId, vote } = req.body;
    // vote = 0 => downvote
    // vote = 1 => upvote

    if (typeof contributionId !== 'string') {
      return res.status(400).json({ error: 'Invalid contribution id' });
    }

    if (typeof userWallet !== 'string') {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    if (typeof modelId !== 'string') {
      return res.status(400).json({ error: 'Invalid model id' });
    }

    if (vote !== 0 && vote !== 1) {
      return res.status(400).json({ error: 'Invalid vote' });
    }

    const userUpvoted = await prisma.dataContributionUpvote.findFirst({
      where: {
        dataContributionId: contributionId,
        wallet: userWallet,
      },
    });

    const userDownvoted = await prisma.dataContributionDownvote.findFirst({
      where: {
        dataContributionId: contributionId,
        wallet: userWallet,
      },
    });

    if (!userUpvoted && !userDownvoted) {
        const upvotesToday = await prisma.dataContributionUpvote.count({
            where: {
                wallet: userWallet,
                modelId: modelId,
                createdAt: {
                    gte: new Date(new Date().setHours(0,0,0,0)),
                    lt: new Date(new Date().setHours(23,59,59,999)),
                }
            }
        })

        const downvotesToday = await prisma.dataContributionDownvote.count({
            where: {
                wallet: userWallet,
                modelId: modelId,
                createdAt: {
                    gte: new Date(new Date().setHours(0,0,0,0)),
                    lt: new Date(new Date().setHours(23,59,59,999)),
                }
            }
        })

        if (upvotesToday + downvotesToday >= 5) {
            return res.status(201).json({ message: 'You have reached your daily vote limit' });
        }

        let createdDownvote = null;
        let createdUpvote = null;

        // User has not voted yet
        if (vote === 0) {
          createdDownvote = await prisma.dataContributionDownvote.create({
              data: {
                  dataContributionId: contributionId,
                  modelId: modelId,
                  wallet: userWallet,
              }
          })          
          
          await prisma.dataContribution.update({
            data: {
                downvote:{
                    increment: 1
                }
            },
            where: {
                id: contributionId
            }
          })
        } else {
            createdUpvote = await prisma.dataContributionUpvote.create({
                data: {
                    dataContributionId: contributionId,
                    modelId: modelId,
                    wallet: userWallet,
                }
            })

            await prisma.dataContribution.update({
              data: {
                  upvote:{
                      increment: 1
                  }
              },
              where: {
                  id: contributionId
              }
          })
        }
      const userId=await getUserIdFromWallet(userWallet)
      if(userId){
        await insertReward(userId,RewardType.Vote)
      }else{
        console.error("Wallet not found")
      }
      return res.status(200).json({ votesLeft: 5 - (upvotesToday + downvotesToday + 1)});
    } else {
      return res.status(202).json({ message: 'You have already voted on this contribution' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// const getUserAddress = async (userID: string) => {
//     if (!userID) return null;
//     const prisma = new PrismaClient();
//     const user = await prisma.user.findFirst({
//         where: {
//             id: userID
//         }
//     });

//     if (!user) {
//         return null;
//     }

//     return user.wallet;
// }
