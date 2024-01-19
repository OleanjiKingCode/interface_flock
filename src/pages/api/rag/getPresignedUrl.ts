import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client,GetObjectCommand } from '@aws-sdk/client-s3';
import { NextApiRequest, NextApiResponse } from 'next';
import {LINK_FILE_SIGNATURE} from "@/src/constants/constants";

type GetPresignedLinkResponse = {
  url?: string;
  error?: string;
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetPresignedLinkResponse>
) {
  const { fileName } = req.body;

  try {
    const client = new S3Client({ region: process.env.AWS_REGION });

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileName
    });

    // @ts-ignore
    const presignedUrl=await getSignedUrl(client,command, { expiresIn: 3600 })

    if(presignedUrl){
      return res.status(200).json({ url: presignedUrl });
    }else{
      console.error('Empty Presigned Url');
      return res.status(500).json({ error: 'Empty Presigned Url' });
    }
  } catch (error: any) {
    console.error('Error creating presigned URL:', error);
    return res.status(500).json({ error: error.message });
  }
}
