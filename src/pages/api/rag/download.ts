import { NextApiRequest, NextApiResponse } from 'next';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const bucketName = process.env.AWS_BUCKET_NAME || '';
  const { fileKey } = req.query;
  const fileFormat = (fileKey as string)?.split('.')[1];

  res.setHeader(
    'Content-Type',
    fileFormat === 'pdf' ? 'application/pdf' : 'text/plain'
  );
  res.setHeader('Content-Disposition', `attachment; filename=${fileKey}`);

  const client = new S3Client({ region: process.env.AWS_REGION });

  const data = await client.send(
    new GetObjectCommand({ Bucket: bucketName, Key: fileKey as string })
  );

  const body = data.Body;
  if (body instanceof Readable) {
    body
      .pipe(res)
      .on('close', () => console.log('Done'))
      .on('error', (err) => console.log(err));
  }
};