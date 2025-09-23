import type { APIRequest, APIResponse, TokenUsage } from '@code-agent/types';
import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

// const axios = require('axios').default;

export class ClaudeAPIService {
  private axiosInstance: any;
  private client: BedrockRuntimeClient;
  private modelId: string;

  constructor() {
    this.client = new BedrockRuntimeClient({ region: "us-east-1" });
    this.modelId = "anthropic.claude-3-haiku-20240307-v1:0";
  }

  // async sendMessage(request?: APIRequest): Promise<AsyncIterable<APIResponse>> {
  async sendMessage() {
    const firstUserMessage = "What is the capital of Australia?";
    const conversation = [{
      role: "user",
      content: [{ text: firstUserMessage }]
    }];

    const firstResponse =  await this.client.send(
      new ConverseCommand({ modelId: this.modelId, messages: conversation })
    );
    const firstResponseText = firstResponse?.output?.message?.content[0]?.text;
    console.log(`First response: ${firstResponseText}`);
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

const service = new ClaudeAPIService();
service.sendMessage();