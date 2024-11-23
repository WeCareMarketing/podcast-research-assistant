import OpenAI from 'openai'

export class OpenAI {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });
  }

  async chat.completions.create(params: any) {
    return this.client.chat.completions.create(params);
  }
}
