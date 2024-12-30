import { WebClient } from "@slack/web-api";

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
if (!SLACK_BOT_TOKEN) {
  throw new Error("SLACK_BOT_TOKEN is not set");
}

interface SlackMessage {
  channel: string;
  text: string;
  blocks?: any[];
}

class SlackClient {
  private client: WebClient;

  constructor(token: string) {
    this.client = new WebClient(token);
  }

  async sendMessage({ channel, text, blocks }: SlackMessage): Promise<void> {
    try {
      await this.client.chat.postMessage({
        channel,
        text,
        blocks,
      });
    } catch (error) {
      console.error("Error sending Slack message:", error);
    }
  }
}

export function getSlackClient(): SlackClient {
  return new SlackClient(SLACK_BOT_TOKEN!);
}
