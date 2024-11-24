'use client'

import React, { useState } from 'react'
import OpenAI from 'openai'

// Webhook Payload Structure
interface WebhookPayload {
  eventType: string;
  topic: string;
  timestamp: string;
  userData: {
    name: string;
    email: string;
    tier: string;
  };
  researchDetails?: {
    trends: string;
    potentialGuests: string[];
  };
}

export default function PodcastResearchAssistant() {
  const [user, setUser] = useState<any>(null);
  const [currentResearch, setCurrentResearch] = useState<any>(null);

  // Make Webhook URL
  const MAKE_WEBHOOK_URL = process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL || 'https://hook.make.com/your_unique_webhook_identifier';

  // Authentication Mock
  const login = () => {
    setUser({
      name: "Podcast Creator",
      email: "creator@podcastlab.com",
      tier: "pro"
    });
  };

  // Webhook Payload Sender
  const sendWebhookPayload = async (payload: WebhookPayload) => {
    try {
      const response = await fetch(MAKE_WEBHOOK_URL, {
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
  };

  // Episode Research Function
  const researchEpisodeTopic = async (topic: string) => {
    if (!user) {
      alert('Please log in first');
      return;
    }

    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });

    // Initial Webhook Payload
    const initialWebhookPayload: WebhookPayload = {
      eventType: 'episodeResearch',
      topic: topic,
      timestamp: new Date().toISOString(),
      userData: {
        name: user.name,
        email: user.email,
        tier: user.tier
      }
    };

    await sendWebhookPayload(initialWebhookPayload);

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

    // Research results
    const researchResults = {
      topic: topic,
      trends: trendResearch.choices[0].message.content,
      potentialGuests: [
        "Tech Innovator",
        "Industry Expert",
        "Thought Leader"
      ]
    };

    setCurrentResearch(researchResults);

    // Final Webhook Payload
    const finalWebhookPayload: WebhookPayload = {
      ...initialWebhookPayload,
      eventType: 'episodeResearchCompleted',
      researchDetails: {
        trends: researchResults.trends,
        potentialGuests: researchResults.potentialGuests
      }
    };

    await sendWebhookPayload(finalWebhookPayload);
  };

  // Guest Research Prototype
  const findPotentialGuests = async (industry: string) => {
    const guestWebhookPayload: WebhookPayload = {
      eventType: 'guestDiscovery',
      topic: industry,
      timestamp: new Date().toISOString(),
      userData: user
    };

    await sendWebhookPayload(guestWebhookPayload);

    return [
      { 
        name: "Jane Doe", 
        expertise: industry, 
        socialLinks: {
          linkedin: "jane-doe-profile",
          twitter: "@janedoe"
        }
      },
      { 
        name: "John Smith", 
        expertise: industry, 
        socialLinks: {
          linkedin: "john-smith-profile", 
          twitter: "@johnsmith"
        }
      }
    ];
  };

  // Audience Analytics Simulation
  const analyzeAudienceInsights = () => {
    const insights = {
      totalListeners: 5000,
      growthRate: "12% month-over-month",
      topDemographics: {
        age: "25-34",
        interests: ["Technology", "Innovation", "Entrepreneurship"]
      }
    };

    const analyticsWebhookPayload: WebhookPayload = {
      eventType: 'audienceAnalytics',
      topic: 'Podcast Performance',
      timestamp: new Date().toISOString(),
      userData: user,
      researchDetails: insights
    };

    sendWebhookPayload(analyticsWebhookPayload);

    return insights;
  };

  return (
    <div className="podcast-research-assistant">
      <header>
        <h1>🎙️ Podcast Research Lab</h1>
        {!user ? (
          <button onClick={login}>Login / Register</button>
        ) : (
          <div>Welcome, {user.name} (Tier: {user.tier})</div>
        )}
      </header>

      {user && (
        <div className="research-dashboard">
          <section>
            <h2>Episode Research</h2>
            <input 
              type="text" 
              placeholder="Enter Episode Topic" 
              onKeyDown={(e) => e.key === 'Enter' && researchEpisodeTopic(e.target.value)}
            />
            {currentResearch && (
              <div>
                <h3>Research Insights: {currentResearch.topic}</h3>
                <p>{currentResearch.trends}</p>
                <h4>Potential Guests</h4>
                <ul>
                  {currentResearch.potentialGuests.map(guest => (
                    <li key={guest}>{guest}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section>
            <h2>Audience Analytics</h2>
            <pre>{JSON.stringify(analyzeAudienceInsights(), null, 2)}</pre>
          </section>
        </div>
      )}
    </div>
  );
}
3. Update src/styles/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Arial', sans-serif;
  background-color: #f4f6f9;
  color: #333;
  line-height: 1.6;
}

.podcast-research-assistant {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 15px;
}

.research-dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

section {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}
