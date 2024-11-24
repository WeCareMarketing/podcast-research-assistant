'use client'

import React, { useState } from 'react'
import OpenAI from 'openai'
import WebhookService from '@/lib/webhookService'

export interface ResearchData {
  topic: string;
  trends: string;
  potentialGuests: string[];
}

export default function PodcastResearchAssistant() {
  const [user, setUser] = useState(null);
  const [currentResearch, setCurrentResearch] = useState<ResearchData | null>(null);
  const webhookService = new WebhookService();

  const login = () => {
    setUser({
      name: "Podcast Creator",
      email: "creator@podcastlab.com",
      tier: "pro"
    });
  };

  const researchEpisodeTopic = async (topic: string) => {
    // Trigger Webhook before research
    await webhookService.triggerEpisodeResearchWebhook(topic);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    try {
      const trendResearch = await openai.chat.completions.create({
        messages: [
          { 
            role: "system", 
            content: "You are a podcast research assistant analyzing current trends." 
          },
          { 
            role: "user", 
            content: `Research comprehensive insights for podcast topic: ${topic}` 
          }
        ],
        model: "gpt-4o-mini",
        max_tokens: 300
      });

      // Trigger Analytics Webhook
      await webhookService.triggerAudienceAnalyticsWebhook(
        analyzeAudienceInsights()
      );

      setCurrentResearch({
        topic: topic,
        trends: trendResearch.choices[0].message.content || '',
        potentialGuests: [
          "Tech Innovator",
          "Industry Expert", 
          "Thought Leader"
        ]
      });
    } catch (error) {
      console.error("Research failed:", error);
    }
  };

  // Existing analytics function
  const analyzeAudienceInsights = () => {
    return {
      totalListeners: 5000,
      growthRate: "12% month-over-month",
      topDemographics: {
        age: "25-34",
        interests: ["Technology", "Innovation", "Entrepreneurship"]
      }
    };
  };

  return (
    <div className="podcast-research-assistant">
      {/* Existing component code remains the same */}
    </div>
  );
}
