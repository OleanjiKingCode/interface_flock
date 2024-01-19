import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { NextApiRequest, NextApiResponse } from 'next';

type UploadLinkResponse = {
  url?: string;
  fields?: any;
  error?: string;
  message?: string;
};

export default async function uploadLink(
  req: NextApiRequest,
  res: NextApiResponse<UploadLinkResponse>
) {
  const { filename } = req.body;

  try {
    const client = new S3Client({ region: process.env.AWS_REGION });
    const { url, fields } = await createPresignedPost(client, {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `${uuidv4()}_${filename}`,
      Expires: 600,
    });

    if (url && fields) {
      return res.status(200).json({ url: url, fields: fields });
    } else {
      return res.status(500).json({ error: 'Failed to create presigned URL' });
    }
  } catch (error: any) {
    console.error('Error creating presigned URL:', error);
    return res.status(500).json({ error: error.message });
  }
}
