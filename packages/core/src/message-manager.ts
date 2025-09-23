import type { Message, Session } from '@code-agent/types';

export class MessageManager {
  private messages: Message[] = [];

  addMessage(message: Message): void {
    this.messages.push(message);
  }

  getConversationHistory(): Message[] {
    return [...this.messages];
  }

  manageContextSize(): void {
    // Placeholder implementation - will be implemented in later tasks
    console.log('Managing context size');
  }

  async persistSession(): Promise<void> {
    // Placeholder implementation - will be implemented in later tasks
    console.log('Persisting session');
  }

  async restoreSession(sessionId: string): Promise<void> {
    // Placeholder implementation - will be implemented in later tasks
    console.log('Restoring session:', sessionId);
  }
}