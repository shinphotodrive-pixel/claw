export type AgentType = 'muse' | 'openclaw' | 'both';

export interface ThreatItem {
  id: string;
  category: 'supply' | 'rce' | 'injection' | 'exfiltration';
  categoryLabel: string;
  badgeColor: string;
  title: string;
  codeName?: string;
  severity: 'Critical' | 'High' | 'Medium';
  description: string;
  attackVector: string;
  realWorldScenario: string;
  mitigation: string;
  defenseTool: string;
}

export interface ClawSkill {
  id: string;
  name: string;
  author: string;
  stars: number;
  category: 'dev' | 'ops' | 'social' | 'finance' | 'data';
  verified: boolean;
  status: 'safe' | 'warning' | 'malicious';
  description: string;
  mcpTools: string[];
  auditNotes: string;
}

export interface PricingTier {
  name: string;
  tokenLimitWeekly: number;
  tokenLabel: string;
  priceWeb: number;
  priceIos: number;
  badgeClass: string;
  description: string;
  features: string[];
}

export interface ComparisonDimension {
  dimension: string;
  museScore: number;
  clawScore: number;
  museDetail: string;
  clawDetail: string;
  winner: 'muse' | 'openclaw' | 'draw';
}

export interface SecurityCheckItem {
  id: string;
  label: string;
  category: 'execution' | 'network' | 'credentials' | 'sandboxing';
  checked: boolean;
  weight: number;
  recommendation: string;
}
