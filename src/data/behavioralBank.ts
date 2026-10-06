/**
 * SkillForge AI — Workplace Behavioral Scenario Bank
 * Assesses engineering competencies: Ownership, Technical Trade-Offs, Communication, Handling Ambiguity, Conflict.
 */

import type { BehavioralScenario } from '../types';

export const BEHAVIORAL_SCENARIOS: BehavioralScenario[] = [
  {
    id: 'beh-01',
    title: 'Critical Production Regression Under Deadline',
    engineeringContext: 'Distributed Microservices & Cloud Production Environment',
    scenario: 'Two hours before a major product demo, customers report that checkout transactions are failing. Your recent PR from yesterday touched a related payment ledger service. Your team lead is currently in an executive briefing.',
    competencyEvaluated: 'ownership',
    options: [
      {
        id: 'beh-01-a',
        text: 'Immediately check telemetry/error logs, verify if your PR is the root cause, initiate an immediate clean rollback or kill-switch if confirmed, and post an incident channel update stating what happened and what you are doing to stabilize it.',
        competency: 'ownership',
        behaviorPattern: 'Strong evidence',
        tradeoffExplanation: 'Exhibits high engineering maturity: prioritizes customer uptime first, verifies hypothesis via telemetry, and communicates transparently.'
      },
      {
        id: 'beh-01-b',
        text: 'Quickly push a hotfix commit directly to main branch without running local tests to try and fix the issue before anyone notices.',
        competency: 'ownership',
        behaviorPattern: 'Needs more examples',
        tradeoffExplanation: 'High risk of cascading failures. Rushing untested changes under stress often amplifies production outages.'
      },
      {
        id: 'beh-01-c',
        text: 'Wait for the team lead to exit their briefing so they can officially decide whether to roll back or debug.',
        competency: 'ownership',
        behaviorPattern: 'Developing behavior',
        tradeoffExplanation: 'Passive bystander effect. In production incidents, active mitigation and clear communication are preferred over passive inaction.'
      },
      {
        id: 'beh-01-d',
        text: 'Document the symptoms in a ticket, assign it to the payment team, and wait for the scheduled sprint triage.',
        competency: 'ownership',
        behaviorPattern: 'Needs more examples',
        tradeoffExplanation: 'Fails to recognize severity. Production financial failures require immediate P1 incident handling.'
      }
    ]
  },
  {
    id: 'beh-02',
    title: 'Architectural Disagreement with Senior Colleague',
    engineeringContext: 'System Design & Code Review',
    scenario: 'During a system design review, a senior engineer insists on writing custom in-memory caching logic from scratch instead of using an established open-source solution (Redis). You have benchmarks showing their custom solution will introduce memory leaks under concurrent load.',
    competencyEvaluated: 'communication',
    options: [
      {
        id: 'beh-02-a',
        text: 'Set up an objective benchmark script replicating concurrent load, document the heap dump and latency comparison in the RFC/PR comments, and suggest a 15-minute sync to review the trade-offs collaboratively.',
        competency: 'communication',
        behaviorPattern: 'Strong evidence',
        tradeoffExplanation: 'De-personalizes conflict by anchoring decisions to reproducible empirical data and respectful technical dialogue.'
      },
      {
        id: 'beh-02-b',
        text: 'Concede immediately without saying anything because the colleague has more tenure and seniority.',
        competency: 'communication',
        behaviorPattern: 'Developing behavior',
        tradeoffExplanation: 'Abdicates engineering duty. Constructive dissent supported by evidence is critical for system reliability.'
      },
      {
        id: 'beh-02-c',
        text: 'Escalate to the engineering director immediately that the senior engineer is making bad architectural decisions.',
        competency: 'communication',
        behaviorPattern: 'Needs more examples',
        tradeoffExplanation: 'Damages professional relationships by escalating prematurely before attempting peer-level dialogue.'
      },
      {
        id: 'beh-02-d',
        text: 'Ignore their input and secretly deploy Redis in your submodule anyway.',
        competency: 'communication',
        behaviorPattern: 'Needs more examples',
        tradeoffExplanation: 'Subverts team alignment and creates unmaintainable shadow architecture.'
      }
    ]
  },
  {
    id: 'beh-03',
    title: 'Technical Debt vs Feature Delivery Pressure',
    engineeringContext: 'Agile Sprint Planning & Technical Debt',
    scenario: 'Product management requests two new user features for the upcoming sprint. However, the underlying database schema has accumulated severe technical debt that makes adding these features fragile and prone to data corruption.',
    competencyEvaluated: 'trade_off_reasoning',
    options: [
      {
        id: 'beh-03-a',
        text: 'Frame the technical debt in business terms: quantify the risk of data corruption, estimate the cost of refactoring (e.g. 2 days), and propose delivering one feature alongside the schema refactor as an investment that accelerates all subsequent sprints.',
        competency: 'trade_off_reasoning',
        behaviorPattern: 'Strong evidence',
        tradeoffExplanation: 'Bridges technical reality with product goals by translating engineering health into business reliability and velocity.'
      },
      {
        id: 'beh-03-b',
        text: 'Refuse to work on any product features until management agrees to rewrite the entire backend from scratch.',
        competency: 'trade_off_reasoning',
        behaviorPattern: 'Needs more examples',
        tradeoffExplanation: 'Dogmatic rewrite ultimatums ignore business viability and create an adversarial relationship with product stakeholders.'
      },
      {
        id: 'beh-03-c',
        text: 'Silently pile more hacky workarounds on top of the broken schema to hit the deadline without mentioning the risk.',
        competency: 'trade_off_reasoning',
        behaviorPattern: 'Developing behavior',
        tradeoffExplanation: 'Borrows dangerous technical debt without informing stakeholders of the compounding interest and fragility.'
      },
      {
        id: 'beh-03-d',
        text: 'Work 80 hours this week off-the-clock to do both the rewrite and both features simultaneously without telling anyone.',
        competency: 'trade_off_reasoning',
        behaviorPattern: 'Needs more examples',
        tradeoffExplanation: 'Promotes unsustainable work habits and hides true sprint capacity from planning metrics.'
      }
    ]
  }
];
