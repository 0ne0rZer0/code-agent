import { LLMProvider, type Message, type Session } from '@code-agent/types';
import { CoreOrchestrator } from './orchestrator';

export class SessionManager {
  private session: Session
  private orchestrator: CoreOrchestrator = new CoreOrchestrator();

  constructor() {
    this.session = {
      id: 'session-id',
      startTime: new Date(),
      messages: [],
    }
  }

  addMessage(message: Message): void {
    this.session.messages.push(message);
  }

  getConversationHistory(): Message[] {
    return [...this.session.messages];
  }

  async sendMessage(input: string) {
    this.addMessage({ id: crypto.randomUUID(), role: 'user', content: input, timestamp: new Date()});
    const response = await this.orchestrator.processUserInput(this.getConversationHistory(), LLMProvider.OPENROUTER);
    const assistantMessage: Message = { id: crypto.randomUUID(), role: 'assistant', content: response, timestamp: new Date()};
    this.addMessage(assistantMessage);
    return assistantMessage;
  }
} 