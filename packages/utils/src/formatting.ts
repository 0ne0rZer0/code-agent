import type { Message, ToolResult } from '@code-agent/types';

export function formatMessage(message: Message): string {
  const timestamp = message.timestamp.toLocaleTimeString();
  const role = message.role.charAt(0).toUpperCase() + message.role.slice(1);
  return `[${timestamp}] ${role}: ${message.content}`;
}

export function formatToolResult(result: ToolResult): string {
  if (result.success) {
    return `✓ Tool execution successful${result.data ? `: ${JSON.stringify(result.data)}` : ''}`;
  } else {
    return `✗ Tool execution failed: ${result.error || 'Unknown error'}`;
  }
}

export function formatTokenUsage(inputTokens: number, outputTokens: number): string {
  const total = inputTokens + outputTokens;
  return `Tokens: ${total} (${inputTokens} in, ${outputTokens} out)`;
}

export function formatCost(cost: number): string {
  return `$${cost.toFixed(4)}`;
}