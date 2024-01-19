import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[]>
) {
  try {
    const { wallet } = req.body;

    const modelLikes = await fetch(
      `https://us-central1-flock-demo-design.cloudfunctions.net/getUserLikes?userEmail=${wallet}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await modelLikes.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}
