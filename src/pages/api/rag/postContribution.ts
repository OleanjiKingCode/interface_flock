import type { NextApiRequest, NextApiResponse } from 'next';
import { DataContribution } from '@prisma/client';
import { IncomingForm } from 'formidable';
import prisma from '@/src/lib/prisma';

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
  },
};

type ResponseData = {
  message: string;
  dataContribution?: DataContribution;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    const userId = Array.isArray(fields.userId)
      ? fields.userId[0]
      : fields.userId;
    const modelId = Array.isArray(fields.modelId)
      ? fields.modelId[0]
      : fields.modelId;
    const filePath = Array.isArray(fields.filePath)
      ? fields.filePath[0]
      : fields.filePath;

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

      const newDataContribution = await prisma.dataContribution.create({
        data: {
          userId: user.id,
          modelId: modelId,
          filePath: filePath,
        },
      });

      res.status(200).json({
        message: 'Data contribution created',
        dataContribution: newDataContribution,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: error?.toString(),
        message: 'error creating data contribution'
      });
    }
  });
}
