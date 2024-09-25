import { getHumeAccessToken } from "@/utils/getHumeAccessToken";
import { getEviConfig } from "@/utils/getEviConfig";
import { createNotificationTool } from "@/utils/tools/createNotificationTool";
import dynamic from "next/dynamic";

const Chat = dynamic(() => import("@/components/Chat"), {
  ssr: false,
});

export default async function Page() {
  const accessToken = await getHumeAccessToken();

  const toolId = await createNotificationTool();

  const config = await getEviConfig(toolId);

  const configId = config.id; // extract id as it is only component of config that is relevant to the chat component

  

  if (!accessToken) {
    throw new Error();
  }

  return (
    <div className={"grow flex flex-col"}>
      <Chat accessToken={accessToken} configId={configId} />
    </div>
  );
}
