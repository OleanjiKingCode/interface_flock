import { Key, useContext, useEffect, useRef, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { Layout, PrimaryButton } from "@/src/components";
import useToaster, { IToastContent } from "../../hooks/useToaster";
import ToasterList from "../ToasterList";
import { QuestContext } from "@/src/context/questContext";
import { WalletContext } from "@/src/context/walletContext";
import TimerButton from "../Quest/TimerButton";
import { Checkmark } from "grommet-icons";
import { Box } from "grommet";

interface TaskCenterProps {}

export interface IOnSubmitProps {
  error?: boolean;
  toast: IToastContent;
}

export interface IStepProps {
  showToaster(props: IOnSubmitProps): void;
}

const REWARD_TITLE_MAP = [
  { key: "WalletConnect", title: "Connect your wallet" },
  { key: "DiscordConnect", title: "Connect your Discord account" },
  {
    key: "DiscordJoinGetRole",
    title: "Join our Discord and acquire a Flockie Role",
  },
  { key: "TwitterConnect", title: "Connect your Twitter account" },
  { key: "TwitterFollow", title: "Follow @flock_io on Twitter" },
  { key: "TwitterShare", title: "Broadcast a tweet about flock.io" },
  { key: "TelegramConnect", title: "Connect your Telegram account" },
  { key: "TelegramJoin", title: "Join FLock.io Community on Telegram" },
  { key: "ModelContribution", title: "Contribute knowledge to earn" },
];

const TaskCenter = ({}: TaskCenterProps) => {
  const { address } = useAccount();
  const [rewardsPoints, setRewardPoints] = useState<any>([]);
  const [rewardsAllowedMap, setRewardsAllowedMap] = useState<any>([]);
  const { connectAsync, connectors } = useConnect();
  const { publicKey, userToken } = useContext(WalletContext);
  const { saveQuestProgress, getStepInfo, user } = useContext(QuestContext);

  const completedTasks = REWARD_TITLE_MAP.filter(
    ({ key }) => !rewardsAllowedMap[key]
  );
  const notCompletedTasks = REWARD_TITLE_MAP.filter(
    ({ key }) => rewardsAllowedMap[key]
  );
  const firstUncompletedTaskKey = REWARD_TITLE_MAP.find(
    ({ key }) => rewardsAllowedMap[key]
  )?.key;

  const [loading, setLoading] = useState(false);
  const [discordConnectLoading, setDiscordConnectLoading] = useState(false);
  const [discordLoading, setDiscordLoading] = useState<boolean>(false);
  const [twitterFollowLoading, setTwitterFollowLoading] =
    useState<boolean>(false);
  const [twitterShareLoading, setTwitterShareLoading] =
    useState<boolean>(false);
  const [telegramLoading, setTelegramLoading] = useState<boolean>(false);

  const [taskCompletionCounter, setTaskCompletionCounter] = useState(0);

  const { toasts, addToast } = useToaster();
  const showToaster = ({ toast }: IOnSubmitProps) => addToast(toast);

  const getRewardsData = async () => {
    setLoading(true);
    try {
      const rewardsPointsResponse = await fetch(`/api/rag/getRewardPointsMap`);
      const rewardsAllowedResponse = await fetch(
        `/api/rag/getRewardsAllowedMap?userId=${address?.toLowerCase()}`
      );
      const rewardPoints = await rewardsPointsResponse.json();
      const rewardAllowed = await rewardsAllowedResponse.json();
      setRewardPoints(rewardPoints);
      setRewardsAllowedMap(rewardAllowed);
      console.log(rewardPoints, rewardAllowed);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRewardsData().then();
  }, [taskCompletionCounter]);

  const handleButtonClick = (key: string) => {
    switch (key) {
      case "WalletConnect":
        handleWalletConnect();
        break;
      case "DiscordConnect":
        handleDiscordConnect();
        break;
      case "DiscordJoinGetRole":
        handleDiscordJoinGetRole();
        break;
      case "TwitterConnect":
        handleTwitterConnect();
        break;
      case "TwitterFollow":
        handleTwitterFollow();
        break;
      case "TwitterShare":
        handleTwitterShare();
        break;
      case "TelegramConnect":
        handleTelegramConnect();
        break;
      case "TelegramJoin":
        handleTelegramJoin();
        break;
      case "ModelContribution":
        handleModelContribution();
        break;
      default:
        console.log("No action for this key");
    }
  };

  const handleVerifyButtonClick = (key: string) => {
    switch (key) {
      case "DiscordJoinGetRole":
        verifyDiscord();
        break;
      case "TwitterFollow":
        verifyTwitterFollow();
        break;
      case "TwitterShare":
        verifyTwitterShare();
        break;
      case "TelegramJoin":
        verifyTelegramJoin();
        break;
      default:
        console.log("No action for this key");
    }
  };

  const handleLoading = (key: string) => {
    switch (key) {
      case "DiscordJoinGetRole":
        return discordLoading;
      case "TwitterFollow":
        return twitterFollowLoading;
      case "TwitterShare":
        return twitterShareLoading;
      case "TelegramJoin":
        return telegramLoading;
      case "DiscordConnect":
        return discordConnectLoading;
      default:
        return false;
    }
  };

  const handleWalletConnect = async () => {
    if (!address) {
      await connectAsync({ connector: connectors[0] });
      setTaskCompletionCounter((prev) => prev + 1);
    } else {
      fetchLogin();
    }
  };

  const fetchLogin = async () => {
    setLoading(true);
    const payload = {
      auth_key: publicKey,
      wallet: (address as string).toLocaleLowerCase(),
    };
    const response: any = await fetch("/api/quest/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(payload),
    });
    if (response.status === 200) {
      const { data } = await response.json();
      const discordName = data?.user?.userDiscordData?.discordName;
      const twitterName = data?.user?.userTwitterData?.twitterName;
      const wallet = data?.user?.wallet;
      const user = { discordName, twitterName, wallet };
      const tasks =
        data?.user?.userQuestTask?.map(
          (task: any) => task.questTask.taskName
        ) || [];
      setTaskCompletionCounter((prev) => prev + 1);
      saveQuestProgress(tasks, user);
      showToaster({
        toast: {
          type: "success",
          title: "Wallet connected successfully",
          message: `You are rewarded 30 points.`,
        },
      });
    } else {
      showToaster({
        toast: {
          type: "error",
          title: "Wallet connection failed",
          message: `Please try again.`,
        },
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (address && publicKey) {
      fetchLogin();
    }
  }, [address, publicKey]);

  const [discordCode, setDiscordCode] = useState<string>("");

  const handleDiscordConnect = async () => {
    setDiscordConnectLoading(true);
    const params =
      "scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=700,height=800,left=50%,top=50%";
    const url = `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${window.location.origin}/oauth/discord&response_type=code&scope=identify%20guilds.members.read`;
    const popup = window.open(url, "Discord Auth", params);
    popup?.postMessage("message", window.location.href);
  };

  const checkDiscordAuth = async (code: string) => {
    setLoading(true);
    const response = await fetch("/api/quest/oauth/discord", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        auth_key: publicKey,
        wallet: (address as string)?.toLocaleLowerCase(),
        code,
        redirectUri: `${window.location.origin}/oauth/discord`,
      }),
    });

    if (response.status === 200 || response.status === 201) {
      await response.json();
      showToaster({
        toast: {
          type: "success",
          title: "Discord connected successfully",
          message: `You are rewarded 30 points.`,
        },
      });
      setTaskCompletionCounter((prev) => prev + 1);
      setDiscordConnectLoading(false);
    } else {
      if (response.status === 409) {
        showToaster({
          toast: {
            type: "error",
            title: "Discord connection failed",
            message: `This discord account has already been used.`,
          },
        });
      } else {
        if (code) {
          showToaster({
            toast: {
              type: "error",
              title: "Discord connection failed",
              message: `Please try again.`,
            },
          });
        }
      }
    }
    setLoading(false);
  };

  const { discordName } = user;

  useEffect(() => {
    const popupResponse = (event: any) => {
      const code = event?.data?.code;
      if (code) {
        window.removeEventListener("message", popupResponse);
        setDiscordCode(code);
      }
    };

    window.addEventListener("message", popupResponse);
    return () => window.removeEventListener("message", popupResponse);
  }, []);

  useEffect(() => {
    discordCode && checkDiscordAuth(discordCode);
  }, [discordCode]);

  const handleDiscordJoinGetRole = async () => {
    setLoading(true);
    window.open(process.env.NEXT_PUBLIC_DISCORD_CHANNEL_LINK, "_blank");
    setLoading(false);
  };

  const [twitterAccessToken, setTwitterAccessToken] = useState({
    accessToken: "",
    expiresAt: "",
  });

  const twitterAuthHandledRef = useRef(false);

  const handleTwitterConnect = () => {
    twitterAuthHandledRef.current = false;
    const params =
      "scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=700,height=800,left=50%,top=50%";
    const url = `${window.location.origin}/api/quest/oauth/twitterLogin`;
    const popup = window.open(url, "Twitter Auth", params);
    popup?.postMessage("message", window.location.href);
  };

  const checkTwitterAuth = async (accessToken: {
    accessToken: string;
    expiresAt: string;
  }) => {
    setLoading(true);
    const response = await fetch("/api/quest/oauth/twitter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        auth_key: publicKey,
        wallet: (address as string)?.toLocaleLowerCase(),
        accessToken,
      }),
    });

    if (response.status === 200) {
      setTaskCompletionCounter((prev) => prev + 1);
      showToaster({
        toast: {
          type: "success",
          title: "Twitter connected successfully",
          message: `You are rewarded 30 points.`,
        },
      });
    } else {
      showToaster({
        toast: {
          type: "error",
          title: "Twitter connection failed",
          message: `Please try again.`,
        },
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    const bc = new BroadcastChannel("twitterChannel");
    bc.onmessage = (event) => {
      const accessToken = event?.data?.accessToken;
      const expiresAt = event?.data?.expiresAt;
      if (accessToken && expiresAt) {
        setTwitterAccessToken({ accessToken, expiresAt });
      }
    };

    return () => bc.close();
  }, []);

  useEffect(() => {
    if (
      twitterAccessToken.accessToken &&
      twitterAccessToken.expiresAt &&
      !twitterAuthHandledRef.current
    ) {
      checkTwitterAuth(twitterAccessToken);
      twitterAuthHandledRef.current = true;
    }
  }, [twitterAccessToken]);

  const { twitterName } = user;

  const handleTwitterFollow = async () => {
    setLoading(true);
    window.open(process.env.NEXT_PUBLIC_TWITTER_FOLLOW_LINK, "_blank");
    setLoading(false);
  };

  const twitterBaseUrl = "https://twitter.com/intent/tweet";
  const tweetText = `Be a key player in building the best chatbots in #Web3! Contribute your knowledge to @flock_io’s AI co-creation platform and earn up to 100 experience pts daily. You’ll also unlock future perks and exclusive benefits! Explore now at http://beta.flock.io #FLock #AIcoCreation`;
  const twitterShareLink = `${twitterBaseUrl}?text=${encodeURIComponent(
    tweetText
  )}`;

  const handleTwitterShare = async () => {
    setLoading(true);
    window.open(twitterShareLink, "_blank");
    setLoading(false);
  };

  const handleTelegramConnect = () => {
    const telegramWindow = window.open("", "_blank", "width=400,height=400");
    telegramWindow?.document.write(`
      <html>
        <head><title>Telegram Login</title></head>
        <body>
          <script async src="https://telegram.org/js/telegram-widget.js?22" data-telegram-login="FLock_Points_Test_Bot" data-size="large" data-onauth="onTelegramAuth(user)" data-request-access="write"></script>
          <script type="text/javascript">
            function onTelegramAuth(user) {
              const telegramUserData = {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                auth_date: user.auth_date,
                hash: user.hash,
              };
              console.log(user);
              console.log(telegramUserData);
  
              if (window.opener && !window.opener.closed) {
                window.opener.postMessage({ telegramUserData }, '*'); // replace '*' with your origin for security
              }
            }
          </script>
        </body>
      </html>
    `);

    telegramWindow?.document.close();
  };

  const [telegramUserData, setTelegramUserData] = useState({
    id: "",
    first_name: "",
    last_name: "",
    username: "",
    auth_date: "",
    hash: "",
    wallet: "",
  });

  useEffect(() => {
    const receiveMessage = (event: any) => {
      if (event.data.telegramUserData) {
        setTelegramUserData({
          ...event.data.telegramUserData,
          wallet: (address as string)?.toLocaleLowerCase(),
        });
        console.log("Received telegramUserData:", event.data.telegramUserData);

        postTelegramData(event.data.telegramUserData);
      }
    };

    window.addEventListener("message", receiveMessage);

    return () => window.removeEventListener("message", receiveMessage);
  }, []);

  const postTelegramData = async (telegramUserData: any) => {
    telegramUserData.wallet = (address as string)?.toLocaleLowerCase();

    try {
      const response = await fetch("/api/rag/connectTelegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...telegramUserData,
          telegram_id: telegramUserData.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTaskCompletionCounter((prev) => prev + 1);
        showToaster({
          toast: {
            type: "success",
            title: "Telegram connected successfully",
            message: `You are rewarded 30 points.`,
          },
        });
        console.log("Telegram connected successfully:", data);
      } else {
        showToaster({
          toast: {
            type: "error",
            title: "Telegram connection failed",
            message: `Please try again.`,
          },
        });
        console.error("Failed to connect Telegram:", response.statusText);
      }
    } catch (error) {
      console.error("Error connecting Telegram:", error);
    }
  };

  const handleTelegramJoin = async () => {
    setLoading(true);
    window.open(process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_LINK, "_blank");
    setLoading(false);
  };

  const handleModelContribution = async () => {
    setLoading(true);
    window.location.href = "/cocreation";
  };

  const verifyDiscord = async () => {
    setDiscordLoading(true);
    const response = await fetch("/api/quest/oauth/discordVerify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        auth_key: publicKey,
        wallet: (address as string)?.toLocaleLowerCase(),
      }),
    });

    console.log(response);

    if (response.status === 200) {
      setTaskCompletionCounter((prev) => prev + 1);
      showToaster({
        toast: {
          type: "success",
          title: "Discord connection verified successfully",
          message: `You are rewarded 30 points.`,
        },
      });
    } else {
      showToaster({
        toast: {
          type: "error",
          title: "Discord verification failed",
          message: `Please try again.`,
        },
      });
    }
    setDiscordLoading(false);
  };

  const verifyTwitterFollow = async () => {
    setTwitterFollowLoading(true);
    const response = await fetch("/api/quest/oauth/twitterFollowVerify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        auth_key: publicKey,
        wallet: (address as string)?.toLocaleLowerCase(),
      }),
    });

    console.log(response);

    if (response.status === 200) {
      setTaskCompletionCounter((prev) => prev + 1);
      showToaster({
        toast: {
          type: "success",
          title: "Twitter following verified successfully",
          message: `You are rewarded 30 points.`,
        },
      });
    } else {
      console.log("failure");
      showToaster({
        toast: {
          type: "error",
          title: "Twitter following verification failed",
          message: `Please try again.`,
        },
      });
    }
    setTwitterFollowLoading(false);
  };

  const verifyTwitterShare = async () => {
    setTwitterShareLoading(true);
    const response = await fetch("/api/quest/oauth/twitterShareVerify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        auth_key: publicKey,
        wallet: (address as string)?.toLocaleLowerCase(),
        redirectUri: `${window.location.origin}/oauth/twitter`,
      }),
    });

    console.log(response);

    if (response.status === 200) {
      setTaskCompletionCounter((prev) => prev + 1);
      showToaster({
        toast: {
          type: "success",
          title: "Twitter broadcast verified successfully",
          message: `You are rewarded 30 points.`,
        },
      });
    } else {
      showToaster({
        toast: {
          type: "error",
          title: "Twitter broadcast verification failed",
          message: `Please try again.`,
        },
      });
    }
    setTwitterShareLoading(false);
  };

  const verifyTelegramJoin = async () => {
    setTelegramLoading(true);

    const response = await fetch("/api/rag/verifyTelegram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        telegram_id: telegramUserData.id.toString(),
      }),
    });

    console.log(telegramUserData.id);
    console.log(response);

    if (response.status === 200) {
      setTaskCompletionCounter((prev) => prev + 1);
      showToaster({
        toast: {
          type: "success",
          title: "Joining Telegram verified successfully",
          message: `You are rewarded 30 points.`,
        },
      });
    } else {
      showToaster({
        toast: {
          type: "error",
          title: "Joining Telegram verification failed",
          message: `Please try again.`,
        },
      });
    }
    setTelegramLoading(false);
  };

  return (
    <div className="flex flex-col space-y-2">
      <ToasterList toasts={toasts} />
      {!!notCompletedTasks.length && (
        <>
          <div className="font-medium text-sm">
            Complete the tasks to earn the points
          </div>
          {notCompletedTasks.map(({ title, key }, index) => {
            const rewardPoints = rewardsPoints[key];
            const taskIndex = REWARD_TITLE_MAP.findIndex(
              (task) => task.key === key
            );
            const taskNumber = taskIndex !== -1 ? taskIndex + 1 : "";
            const shouldShowButton =
              key === firstUncompletedTaskKey || key === "ModelContribution";

            return (
              <div
                className="flex flex-col md:flex-row items-center justify-between font-medium text-black shadow bg-white px-8 py-3 rounded-full"
                key={key}
              >
                {key !== "ModelContribution" && (
                  <Box
                    align="center"
                    justify="center"
                    border={{ color: "black", size: "small" }}
                    round="50px"
                    background="white"
                    width="25px"
                    height="25px"
                    style={{ minWidth: "25px", minHeight: "25px" }}
                  >
                    <span className="text-s">{taskNumber}</span>
                  </Box>
                )}
                <div
                  className={`flex-1 text-left ${
                    key !== "ModelContribution" ? "md:ml-6" : ""
                  }`}
                >
                  {title}
                </div>
                <div>
                  {shouldShowButton && (
                    <>
                      {key === "DiscordJoinGetRole" ||
                      key === "TwitterFollow" ||
                      key === "TwitterShare" ||
                      key === "TelegramJoin" ? (
                        <div className="flex items-center space-x-2">
                          <span className="pr-2">
                            {rewardPoints?.limit} Points
                          </span>
                          <PrimaryButton
                            size="small"
                            label="Join Now"
                            onClick={() => handleButtonClick(key)}
                            style={{ width: "80px" }}
                          />
                          <TimerButton
                            label="Verify"
                            onClick={() => handleVerifyButtonClick(key)}
                            isLoading={handleLoading(key)}
                          />
                        </div>
                      ) : key === "ModelContribution" ? (
                        <>
                          <span className="pr-2">
                            Earn up to {rewardPoints?.limit} Points
                          </span>
                          <PrimaryButton
                            size="small"
                            label="To earn"
                            onClick={() => handleButtonClick(key)}
                            style={{ width: "180px" }}
                          />
                        </>
                      ) : (
                        <>
                          <span className="pr-2">
                            {rewardPoints?.limit} Points
                          </span>
                          <PrimaryButton
                            size="small"
                            label="Connect Now"
                            onClick={() => handleButtonClick(key)}
                            style={{ width: "180px" }}
                            busy={handleLoading(key)}
                          />
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}
      {!!completedTasks.length && (
        <>
          <div className="font-medium text-sm pb-4 text-center md:text-start">
            Completed
          </div>
          {completedTasks.map(({ title, key }) => {
            const rewardPoints = rewardsPoints[key];
            return (
              <div
                className="flex flex-col md:flex-row items-center justify-between font-medium text-black shadow bg-white px-8 gap-3 md:gap-0 py-3 rounded-full"
                key={key}
              >
                <Box
                  align="center"
                  justify="center"
                  border={{ color: "black", size: "small" }}
                  round="50px"
                  background="brand"
                  width="25px"
                  height="25px"
                  style={{ minWidth: "25px", minHeight: "25px" }}
                >
                  <Checkmark color="white" size="small" />
                </Box>
                <div className="flex-1 text-left md:ml-6">{title}</div>
                <div className="flex items-center justify-end space-x-2">
                  <div className="text-right">
                    +{rewardPoints?.limit} Points
                  </div>
                  <div style={{ width: "180px" }}>
                    {key === "TwitterConnect" && twitterName && (
                      <PrimaryButton
                        size="small"
                        label={twitterName}
                        style={{ width: "180px" }}
                      />
                    )}
                    {key === "DiscordConnect" && discordName && (
                      <PrimaryButton
                        size="small"
                        label={discordName}
                        style={{ width: "180px" }}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default TaskCenter;
