interface WebhookPayload {
  eventType: string;
  topic: string;
  timestamp: string;
  userData: {
    name: string;
    email: string;
    tier: string;
  };
  researchDetails?: any;
}

class WebhookService {
  private MAKE_WEBHOOK_URL: string;

  constructor() {
    this.MAKE_WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL || '';
  }

  async sendWebhookPayload(payload: WebhookPayload) {
    try {
      const response = await fetch(this.MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.error('Webhook send failed', response.statusText);
      }
    } catch (error) {
      console.error('Webhook send error:', error);
    }
  }
}

export default new WebhookService();
