import { NextApiRequest, NextApiResponse } from 'next';
import { CourierClient } from '@trycourier/courier';
import prisma from '@/src/lib/prisma';
import {
  NOTIFICATION_TYPE_CONTRIBUTION_VERIFIED,
  NOTIFICATION_TYPE_MODEL_VERIFIED,
} from '@/src/constants/notificationTypes';
import {insertReward, RewardType} from "@/src/repositories/rewards";

const courier = new CourierClient({
  authorizationToken: process.env.PUBLIC_COURIER_API_KEY,
});


const getRandomInt=(max:number) =>{
  return Math.floor(Math.random() * max);
}


const getValidationStatusForContributions=async (modelId:string)=>{
  const model = await prisma.model.findUnique({
    where: { id: modelId },
    include: { DataContribution: true },
  });
  const pendingContributions = model!.DataContribution.filter(
    (dc) => dc.dataValidationStatus === 'PENDING'
  ).length;
  const successfulContributions = model!.DataContribution.filter(
    (dc) => dc.dataValidationStatus === 'SUCCESS'
  ).length;
  const failureContributions = model!.DataContribution.filter(
    (dc) => dc.dataValidationStatus === 'FAILURE'
  ).length;
  return {pendingContributions,successfulContributions,failureContributions}
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(await req.body)
  const { contributionId, dataValidationStatus,errorMessage } = await req.body;
  console.log('contributionid',contributionId)
  console.log('dataValidationStatus',dataValidationStatus)
  try {
    const newDataContribution = await prisma.dataContribution.update({
      where: { id: contributionId },
      data: { dataValidationStatus },
      include: { User: true },
    });

    if (!newDataContribution.User) {
      throw new Error('User not found for the given contribution ID');
    }

    const userWalletAddress = newDataContribution.User.wallet.toLowerCase();


    if (dataValidationStatus === 'SUCCESS') {
      await insertReward(newDataContribution.User.id,RewardType.ModelContribution,newDataContribution.modelId,newDataContribution.id)
    }

    let model = await prisma.model.findUnique({
      where: { id: newDataContribution.modelId },
      include: { DataContribution: true },
    });

    if (!model) {
      throw new Error('Model not found for the given model ID');
    }

    const resp=await courier.send({
      message: {
        to: {
          user_id: userWalletAddress,
        },
        template: 'NMF31NESR646WKG8NS9XXJDFXXY7',
        data: {
          notificationType: NOTIFICATION_TYPE_CONTRIBUTION_VERIFIED,
          contributionId,
          filePath: newDataContribution.filePath,
          dataValidationStatus,
          modelName: model.modelName,
          errorMessage
        },
      },
    });
    console.log('courier',resp)
    console.log('sent',contributionId)

    // reassess the model
    model = await prisma.model.findUnique({
      where: { id: newDataContribution.modelId },
      include: { DataContribution: true },
    });
    console.log('ddd',model?.dataValidationStatus)
    // Only when the status of the model is pending, we do the following
    if (model && model.dataValidationStatus === 'PENDING') {
      // Needs to get latest data
      const {successfulContributions} = await getValidationStatusForContributions(newDataContribution.modelId)
      console.log('first successfulContributions',successfulContributions)
      if (successfulContributions >= 3) {
        await prisma.model.update({
          where: { id: newDataContribution.modelId },
          data: { dataValidationStatus: 'SUCCESS' },
        });

        await courier.send({
          message: {
            to: {
              user_id: userWalletAddress,
            },
            template: 'NMF31NESR646WKG8NS9XXJDFXXY7',
            data: {
              notificationType: NOTIFICATION_TYPE_MODEL_VERIFIED,
              filePath: newDataContribution.filePath,
              dataValidationStatus: 'SUCCESS',
              modelName: model!.modelName,
            },
          },
        });

        await insertReward(newDataContribution.User.id,RewardType.ModelCreation,newDataContribution.modelId)
      }
      // Needs to get latest data
      const {successfulContributions:newSuccessfulContributions,pendingContributions,failureContributions} = await getValidationStatusForContributions(newDataContribution.modelId)
      console.log('pendingContributions',pendingContributions)
      console.log('successfulContributions',successfulContributions)
      console.log('failureContributions',failureContributions)
      // When no pending contributions, we need to settle the case for failed model,
      // if there is any pending contributions for verification, wait for them settled before
      // telling the user if the model is confirmed
      if (pendingContributions === 0 && newSuccessfulContributions < 3) {
        await prisma.model.update({
          where: { id: newDataContribution.modelId },
          data: { dataValidationStatus: 'FAILURE' },
        });
        console.log('model verification sent')
        await courier.send({
          message: {
            to: {
              user_id: userWalletAddress,
            },
            template: 'NMF31NESR646WKG8NS9XXJDFXXY7',
            data: {
              notificationType: NOTIFICATION_TYPE_MODEL_VERIFIED,
              filePath: newDataContribution.filePath,
              dataValidationStatus: 'FAILURE',
              modelName: model!.modelName,
            },
          },
        });
      }
    }
    return res.status(200).json({
      message: 'Data contribution status updated successfully',
      dataContribution: newDataContribution,
    });
  } catch (error) {
    console.error('Error updating data contribution:', error);
    res.status(500).json({ error: error });
  }
}
