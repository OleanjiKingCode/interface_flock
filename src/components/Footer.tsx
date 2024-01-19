import {
  Box,
  Image,
  Button,
  Footer as GrommetFooter,
  TextInput,
  Text,
} from 'grommet';

import { XIcon } from './Icons/XIcon';
import { DiscordIcon } from './Icons/DiscordIcon';
import { TelegramIcon } from './Icons/TelegramIcon';
import { Icon1 } from './Icons/Icon1';
import { GithubIcon } from './Icons/GithubIcon';
import { MediumIcon } from './Icons/MediumIcon';
import MailchimpSubscribe from 'react-mailchimp-subscribe';
import { useRouter } from 'next/router';
import { useState } from 'react';

const CustomForm = () => {
  const [email, setEmail] = useState('');

  return (
    <MailchimpSubscribe
      url="https://flock.us21.list-manage.com/subscribe/post?u=cf2df2da902eb8d1a5a6a553f&id=5b5347bc6d&f_id=00d6e7e1f0"
      render={({ subscribe }) => (
        <Box direction="row" gap="small" width="medium" align="center">
          <TextInput
            value={email}
            placeholder="Your Email Address"
            onChange={(e) => setEmail(e.target.value)}
            style={{ borderRadius: '30px', border: "1px solid black", fontSize: '16px', padding: '10px 20px' }}
            width="313px"
          />
          <Button
            primary
            pad={{ horizontal: 'medium', vertical: 'small' }}
            label="Subscribe"
            onClick={() => {
              subscribe({ EMAIL: email });
              setEmail('');
            }}
          />
        </Box>
      )}
    />
  );
};

export const Footer = () => {
  const { push } = useRouter();

  return (
    <GrommetFooter
      background="linear-gradient(0deg, #D2DFFD -84.6%, #FFF 112.93%)"
      direction="row-responsive"
      pad={{ vertical: 'medium', horizontal: 'xlarge' }}
      align="center"
      justify="evenly"
      gap="xlarge"
      height="medium"
    >
      <Box gap="medium" width="large" align="evenly" justify="center">
        <Box width="small">
          <Image src="/static/images/logo.png" onClick={() => void push('/')} alt="logo" />
        </Box>
        <CustomForm />
        <Box>
          <p className="text-[#8E8E8E] text-sm font-normal mt-3">
            Copyright © Flock.io 2024 All right reserved
          </p>
        </Box>
      </Box>

      <Box direction="row" gap="medium" align="center" justify="center">
        <Button
          plain
          href="https://twitter.com/flock_io"
          icon={<XIcon />}
          target="_blank"
        />
        <Button
          plain
          href="https://discord.com/invite/ay8MnJCg2W"
          icon={<DiscordIcon />}
          target="_blank"
        />
        <Button
          plain
          href="https://t.me/flock_io_community"
          icon={<TelegramIcon />}
          target="_blank"
        />
        <Button
          plain
          href="https://t.me/flock_io_channel"
          icon={<Icon1 />}
          target="_blank"
        />
        <Button
          plain
          href="https://flock-io.medium.com/"
          icon={<MediumIcon />}
          target="_blank"
        />
        <Button
          plain
          href="https://github.com/FLock-io"
          icon={<GithubIcon />}
          target="_blank"
        />
      </Box>
    </GrommetFooter>
  );
};
