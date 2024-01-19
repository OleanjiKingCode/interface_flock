import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client,GetObjectCommand } from '@aws-sdk/client-s3';
import { NextApiRequest, NextApiResponse } from 'next';
import {LINK_FILE_SIGNATURE} from "@/src/constants/constants";

type GetPresignedLinkResponse = {
  message?: string;
  error?: string;
};



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetPresignedLinkResponse>
) {
  const { fileName,modelId,contributionID } = req.body;

  try {
    const client = new S3Client({ region: process.env.AWS_REGION });

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileName
    });


    // @ts-ignore
    const presignedUrl=await getSignedUrl(client,command, { expiresIn: 3600 })
    let type='txt'
    if(fileName.split('.').length>=2){
      type = fileName.split('.').pop();
    }
    if(fileName.includes(LINK_FILE_SIGNATURE)){
      type='link'
    }

    if(presignedUrl){
      await fetch(`${process.env.ML_BACKEND_URL}/contribute/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ML_BACKEND_API_KEY!
        },
        body: JSON.stringify({
          ml_model_id:modelId,
          data_contribution_id:contributionID,
          path:presignedUrl,
          type,
          filename:fileName
        }),
      });
      return res.status(200).json({ message: 'send' });
    }else{
      console.error('Empty Presigned Url');
      return res.status(500).json({ error: 'Empty Presigned Url' });
    }
  } catch (error: any) {
    console.error('Error creating presigned URL:', error);
    return res.status(500).json({ error: error.message });
  }
}
