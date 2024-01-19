import { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
    message: string;
    data?: any;
    error?: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const { address } = req.body;

    try {

        if (!address) {
            return res.status(400).json({ message: 'Missing address' });
        }

        const response = await fetch(`https://api.courier.com/profiles/${address}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.PUBLIC_COURIER_API_KEY}`,
            },
            body: JSON.stringify({
                "profile": {
                    "sub":address
                }
              }),
        });
        const data = await response.json();

        return res.status(200).json({
            message: "User profile created",
            data: data,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
