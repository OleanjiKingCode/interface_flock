export const validateToken = async (token: string) => {
  const responseValidate = await fetch('/api/validateRecaptchaToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });
  const data = await responseValidate.json();
  return data.valid;
};
