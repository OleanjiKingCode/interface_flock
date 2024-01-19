import { useEffect, useState } from 'react';
import { validateToken } from '../lib/validateToken';
import { ReCaptcha } from 'next-recaptcha-v3';
import { useRouter } from 'next/router';

export const ReCaptchaPageView = () => {
  const { push } = useRouter();
  const [token, setToken] = useState<string>();

  const handleTokenValidation = async (token: string) => {
    const isValid = await validateToken(token);
    if (!isValid) {
      console.error('Invalid token');
      push('/cocreation');
    }
  };

  useEffect(() => {
    if (token) {
      handleTokenValidation(token);
    }
  }, [token]);

  return <ReCaptcha onValidate={setToken} action="page_view" />;
};
