import { NextApiRequest, NextApiResponse } from 'next';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import {  PDFDocument } from 'pdf-lib';
const MAX_PDF_SIZE = 3500000; //3.5 MB
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const bucketName = process.env.AWS_BUCKET_NAME || '';
    const { fileKey } = req.query;

    res.setHeader(
      'Content-Type',
      'blob'
    );
    res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent((fileKey as string))}`);

    const client = new S3Client({ region: process.env.AWS_REGION });

    const data = await client.send(
      new GetObjectCommand({ Bucket: bucketName, Key: fileKey as string })
    );

    const body = data.Body;
    let fileBytes = await body?.transformToByteArray() as Uint8Array;
    if((fileKey as string).endsWith('.pdf')){
      const doc = await PDFDocument.load(fileBytes);
      while(fileBytes.byteLength>MAX_PDF_SIZE){
        const pageCount=doc.getPageCount()
        doc.removePage(pageCount-1)
        const resizedDoc=await doc.copy()
        fileBytes= await resizedDoc.save()
      }
    }
    let readable=Readable.from(Buffer.from(fileBytes as Uint8Array))
    readable
      .pipe(res)
      .on('close', () => console.log('Done'))
      .on('error', (err) => console.log(err));

  } catch (err) {
    res.status(500).json({ message: "Invalid File" });
  }
};

export const config = {
  api: {
    responseLimit: false,
  },
}