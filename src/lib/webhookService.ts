import axios from 'axios';

interface WebhookPayload {
  topic?: string;
  industry?: string;
  analytics?: any;
}

class WebhookService {
  private makeWebhookUrl: string;

  constructor() {
    this.makeWebhookUrl = process.env.MAKE_WEBHOOK_URL || '';
  }

  async triggerEpisodeResearchWebhook(topic: string) {
    try {
      const payload: WebhookPayload = {
        topic: topic
      };

      const response = await axios.post(this.makeWebhookUrl, payload);
      console.log('Episode Research Webhook Triggered:', response.data);
    } catch (error) {
      console.error('Webhook Trigger Failed:', error);
    }
  }

  async triggerAudienceAnalyticsWebhook(analytics: any) {
    try {
      const payload: WebhookPayload = {
        analytics: analytics
      };

      const response = await axios.post(this.makeWebhookUrl, payload);
      console.log('Audience Analytics Webhook Triggered:', response.data);
    } catch (error) {
      console.error('Webhook Trigger Failed:', error);
    }
  }
}

export default WebhookService;
