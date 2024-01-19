import axios from "axios";
import {NextApiRequest, NextApiResponse} from "next";
import {renameFilename} from "@/src/utils/utils";
import {v4 as uuidv4} from "uuid";
import {Readable} from "stream";
import AWS, {S3} from 'aws-sdk';
const API_KEY = process.env.OPENAI_KEY

// Configure AWS SDK with your credentials
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { topic } = req.query;
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        prompt: topic,
        n: 1,                                //define the number of images
        size: '512x512',                     //define the resolution of image
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
      }
    );
    const iconUrl = response.data.data[0].url;
    const filename=renameFilename(topic as string)
    const newFileName=`public/${uuidv4()}_${filename}.png`
    const uploadedImageName=await uploadImageToS3(iconUrl,process.env.AWS_BUCKET_NAME!,newFileName)
    res.status(201).json({modelIconPath:uploadedImageName})
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

async function uploadImageToS3(url: string, bucketName: string, keyName: string): Promise<string> {
  try {
    // Fetch the image from the URL
    const response = await axios.get(url, { responseType: 'stream' });
    const imageStream = response.data as Readable;

    // Upload the image to S3
    const uploadParams: AWS.S3.PutObjectRequest = {
      Bucket: bucketName,
      Key: keyName,
      Body: imageStream,
    };

    await s3.upload(uploadParams).promise();
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${keyName}`
    console.log(`Image uploaded successfully to S3 bucket: ${bucketName}/${keyName}`);
  } catch (error) {
    console.error('Error uploading image to S3:', error);
    throw error;
  }
}
