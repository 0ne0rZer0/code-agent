import type { APIRequest, APIResponse, TokenUsage } from '@code-agent/types';
import {
  BedrockRuntimeClient,
  ConverseCommand,
  Message,
} from "@aws-sdk/client-bedrock-runtime";

import {
  Message as CodeAgentMessage
} from "@code-agent/types";

// const axios = require('axios').default;

export class ClaudeAPIService {
  private axiosInstance: any;
  private client: BedrockRuntimeClient;
  private modelId: string;

  constructor() {
    this.client = new BedrockRuntimeClient({ region: "us-east-1" });
    this.modelId = "anthropic.claude-3-haiku-20240307-v1:0";
  }

  async sendMessage(conversation: CodeAgentMessage[]): Promise<string> {
    
    const claudeConversation: Message[] = conversation.map((message) => {
      return {
        role: message.role,
        content: [
          {
            text: message.content
          },
        ],
      };
    });

    const firstResponse = await this.client.send(
      new ConverseCommand({ modelId: this.modelId, messages: claudeConversation })
    );

    return firstResponse?.output?.message?.content?.[0]?.text || "No response received."
  }

  async handleRetries(error: Error): Promise<void> {
    // Placeholder implementation - will be implemented in later tasks
    throw new Error('ClaudeAPIService.handleRetries not yet implemented');
  }

  trackUsage(usage: TokenUsage): void {
    // Placeholder implementation - will be implemented in later tasks
    console.log('Token usage tracked:', usage);
  }

  implementCaching(): void {
    // Placeholder implementation - will be implemented in later tasks
    console.log('Caching not yet implemented');
  }
}