export interface PriorityFactors {
  roleImportance: number; // 1 to 5 from taxonomy
  skillGap: number; // 3 for missing, 2 for partial, 1 for demonstrated
  deadlineFactor: number; // 1.5 for 7-day sprint, 1.2 for 14-day sprint
  interviewWeaknessFactor: number; // 2.5 if user struggled in interview, 1.0 default
}

export function calculatePriorityScore(factors: PriorityFactors): number {
  const { roleImportance, skillGap, deadlineFactor, interviewWeaknessFactor } = factors;
  // Formula: roleImportance × skillGap × deadlineFactor × interviewWeaknessFactor
  const rawScore = roleImportance * skillGap * deadlineFactor * interviewWeaknessFactor;
  return Math.round(rawScore * 10) / 10;
}

export function getPriorityTier(score: number): 'High' | 'Medium' | 'Low' {
  if (score >= 18) return 'High';
  if (score >= 10) return 'Medium';
  return 'Low';
}

export function sortTasksByPriority<T extends { priorityScore?: number; dayNumber?: number }>(
  tasks: T[],
  prioritizeDayOne = true
): T[] {
  return [...tasks].sort((a, b) => {
    if (prioritizeDayOne) {
      if ((a.dayNumber ?? 99) !== (b.dayNumber ?? 99)) {
        return (a.dayNumber ?? 99) - (b.dayNumber ?? 99);
      }
    }
    return (b.priorityScore ?? 0) - (a.priorityScore ?? 0);
  });
}
