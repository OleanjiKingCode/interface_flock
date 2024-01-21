import {
  Box,
  Image,
  Button,
  Footer as GrommetFooter,
  TextInput,
} from "grommet";
import { XIcon } from "./Icons/XIcon";
import { DiscordIcon } from "./Icons/DiscordIcon";
import { TelegramIcon } from "./Icons/TelegramIcon";
import { Icon1 } from "./Icons/Icon1";
import { GithubIcon } from "./Icons/GithubIcon";
import { MediumIcon } from "./Icons/MediumIcon";
import MailchimpSubscribe from "react-mailchimp-subscribe";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

const CustomForm = () => {
  const [email, setEmail] = useState("");

  return (
    <MailchimpSubscribe
      url="https://flock.us21.list-manage.com/subscribe/post?u=cf2df2da902eb8d1a5a6a553f&id=5b5347bc6d&f_id=00d6e7e1f0"
      render={({ subscribe }) => (
        <div className="flex flex-row w-full min-[1011px]:w-[50%] gap-5 items-center justify-center">
          <TextInput
            value={email}
            placeholder="Your Email Address"
            onChange={(e) => setEmail(e.target.value)}
            style={{
              borderRadius: "30px",
              border: "1px solid black",
              fontSize: "16px",
              padding: "10px 20px",
            }}
            className="w-[20%]"
          />
          <Button
            primary
            pad={{ horizontal: "medium", vertical: "small" }}
            label="Subscribe"
            onClick={() => {
              subscribe({ EMAIL: email });
              setEmail("");
            }}
            className="w-[50%]"
          />
        </div>
      )}
    />
  );
};

export const Footer = () => {
  const { push } = useRouter();

  return (
    <div className="bg-gradient-to-r from-blue-200 to-white py-10 px-20 flex flex-col md:flex-row items-center justify-evenly gap-x-10">
      <div className=" w-full flex flex-col gap-4 items-center justify-center">
        <Image
          src="/static/images/logo.png"
          onClick={() => void push("/")}
          alt="logo"
          className="w-48 self-center min-[1011px]:self-center"
        />
        <div className="flex flex-col min-[1011px]:flex-row w-full gap-5 items-center justify-between">
          <CustomForm />
          <div className="flex flex-row gap-3 items-center justify-center">
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
          </div>
        </div>

        <Box className="w-full text-center">
          <p className="text-[#8E8E8E] text-sm font-normal mt-8">
            Copyright © Flock.io 2024 All right reserved
          </p>
        </Box>
      </div>
    </div>
  );
};
