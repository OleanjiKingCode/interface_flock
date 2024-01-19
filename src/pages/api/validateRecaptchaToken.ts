import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ valid: boolean }>
) {
  const { token } = req.body;

  try {
    const responseVerification = await fetch(
      `https://recaptchaenterprise.googleapis.com/v1/projects/interface-1700476434248/assessments?key=${process.env.RECAPTCHA_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: {
            token,
            expectedAction: 'page_view',
            siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
          },
        }),
      }
    );

    const responseVerificationJson = await responseVerification.json();

    if (
      responseVerificationJson.tokenProperties.valid &&
      responseVerificationJson.riskAnalysis.score > 0.5
    ) {
      res.status(200).json({ valid: true });
    } else {
      console.log(responseVerificationJson);
      res.status(400).json({ valid: false });
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json(error);
  }
}
