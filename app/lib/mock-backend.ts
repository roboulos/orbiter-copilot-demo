/**
 * Mock backend responses for testing
 * Use this to test frontend without waiting for backend fixes
 */

export const MOCK_ENABLED = process.env.NEXT_PUBLIC_MOCK_BACKEND === 'true';

export function getMockResponse(prompt: string, networkData?: string): string {
  const promptLower = prompt.toLowerCase();
  
  // Parse network data if provided
  let networkTotal = 0;
  if (networkData) {
    try {
      const parsed = JSON.parse(networkData);
      networkTotal = parsed.total || parsed.loaded || 0;
    } catch (e) {
      networkTotal = 191; // fallback
    }
  }

  // Costa Rica query
  if (promptLower.includes('costa rica') || promptLower.includes('house')) {
    return JSON.stringify({
      response: [
        {
          name: 'scanning_card',
          templateProps: {
            title: 'Scanning your network for Costa Rica expertise',
            connections_analyzed: networkTotal,
            potential_matches: 8,
            subtitle: 'Looking for real estate developers and expat connections...'
          }
        },
        {
          name: 'outcome_card',
          templateProps: {
            outcome: 'Found 8 Costa Rica connections in your network',
            summary: 'Your network includes experienced real estate developers and expats who know the Pacific Coast region well.',
            suggestions: [
              {
                person: 'David Park',
                title: 'Real Estate Developer',
                company: 'Costa Rica Coastal Properties',
                why: '20+ years developing properties in Guanacaste and Manuel Antonio. Has helped 50+ Americans navigate the buying process.',
                master_person_id: 101
              },
              {
                person: 'Maria Santos',
                title: 'Expat Community Leader',
                company: 'Tamarindo Expat Network',
                why: '8 years living in Tamarindo. Runs weekly meetups and knows all the local pitfalls for new buyers.',
                master_person_id: 205
              },
              {
                person: 'Carlos Rodriguez',
                title: 'Property Attorney',
                company: 'Rodriguez Legal CR',
                why: 'Specializes in foreigner property law. Has closed 200+ deals for American buyers.',
                master_person_id: 312
              }
            ]
          }
        }
      ]
    });
  }

  // Investor query
  if (promptLower.includes('investor') || promptLower.includes('funding') || promptLower.includes('b2b') || promptLower.includes('saas')) {
    return JSON.stringify({
      response: [
        {
          name: 'scanning_card',
          templateProps: {
            title: 'Scanning your network for B2B SaaS investors',
            connections_analyzed: networkTotal,
            potential_matches: 12,
            subtitle: 'Filtering for VCs with B2B and SaaS focus...'
          }
        },
        {
          name: 'outcome_card',
          templateProps: {
            outcome: 'Found 12 investors with B2B SaaS expertise',
            summary: 'Your network includes several VCs and angels who actively invest in B2B SaaS at seed and Series A.',
            suggestions: [
              {
                person: 'Sarah Chen',
                title: 'Partner',
                company: 'Sequoia Capital',
                why: 'Led investments in 15+ B2B SaaS companies. Focus on developer tools and infrastructure.',
                master_person_id: 123
              },
              {
                person: 'Marcus Williams',
                title: 'Seed Investor',
                company: 'First Round Capital',
                why: 'Early-stage B2B SaaS specialist. Previously founded and sold a marketing automation platform.',
                master_person_id: 234
              },
              {
                person: 'Jessica Rodriguez',
                title: 'Angel Investor',
                company: 'Independent',
                why: '20+ B2B SaaS investments. Former VP Product at Salesforce.',
                master_person_id: 345
              }
            ]
          }
        }
      ]
    });
  }

  // Default response
  return JSON.stringify({
    response: [
      {
        name: 'scanning_card',
        templateProps: {
          title: 'Analyzing your network',
          connections_analyzed: networkTotal,
          potential_matches: 5,
          subtitle: 'Finding relevant connections...'
        }
      },
      {
        name: 'outcome_card',
        templateProps: {
          outcome: 'Found 5 relevant connections',
          summary: 'Here are some people from your network who might help.',
          suggestions: [
            {
              person: 'John Smith',
              title: 'Consultant',
              company: 'Acme Corp',
              why: 'Has relevant experience in this area.',
              master_person_id: 999
            }
          ]
        }
      }
    ]
  });
}
