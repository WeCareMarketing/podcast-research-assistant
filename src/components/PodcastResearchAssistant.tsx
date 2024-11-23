'use client'

import React, { useState } from 'react'
import { OpenAI } from '@/lib/openai'

export interface ResearchData {
  topic: string;
  trends: string;
  potentialGuests: string[];
}

export default function PodcastResearchAssistant() {
  const [user, setUser] = useState(null);
  const [currentResearch, setCurrentResearch] = useState<ResearchData | null>(null);

  const login = () => {
    setUser({
      name: "Podcast Creator",
      email: "creator@podcastlab.com",
      tier: "pro"
    });
  };

  const researchEpisodeTopic = async (topic: string) => {
    const openai = new OpenAI();

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
            <pre>{JSON.stringify(
              {
                totalListeners: 5000,
                growthRate: "12% month-over-month",
                topDemographics: {
                  age: "25-34",
                  interests: ["Technology", "Innovation", "Entrepreneurship"]
                }
              }, 
              null, 
              2
            )}</pre>
          </section>
        </div>
      )}
    </div>
  );
}
