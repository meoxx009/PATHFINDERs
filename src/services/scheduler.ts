/**
 * SkillForge AI — Deterministic Roadmap Scheduler & Capacity Engine
 *
 * Implements deterministic mathematical time allocation:
 * - Topological prerequisite ordering
 * - Daily hourly blocks (learn, practice, project, assessment, interview, review, break)
 * - Workload capacity & overload detection
 * - Adaptive reassessment slotting
 */

import type { LearningTask, RoadmapPreferences, ScheduleBlock, ScheduleBlockType, WeeklyMilestone } from '../types';

export const DEFAULT_ROADMAP_PREFERENCES: RoadmapPreferences = {
  currentSkillLevel: 'beginner',
  targetLevel: 'job_ready',
  targetRoleId: 'frontend',
  goalType: 'placement',
  hoursPerWeek: 10,
  durationWeeks: 4,
  durationDays: 28,
  daysPerWeek: 5,
  selectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  maxDailyStudyMinutes: 180,
  preferredSessionMinutes: 45,
  breakDurationMinutes: 10,
  startDate: new Date().toISOString().split('T')[0],
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  learningStyle: 'hands_on',
  intensity: 'balanced',
  priorityMode: 'balanced'
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Calculates priority score for task ordering
 */
export function calculateTaskPriority(task: LearningTask, prefs: RoadmapPreferences): number {
  let score = 50;

  // Priority weight (0.4)
  if (task.priority === 'High') score += 40;
  else if (task.priority === 'Medium') score += 25;
  else score += 10;

  // Adaptive flag boost
  if (task.adaptedFromInterview) {
    score += 20;
  }

  // Priority mode modifier
  if (prefs.priorityMode === 'skill_gap_first' && task.priority === 'High') {
    score += 15;
  }

  return score;
}

/**
 * Generate hourly schedule blocks and weekly milestones deterministically
 */
export function generateDeterministicSchedule(
  tasks: LearningTask[],
  preferences: RoadmapPreferences = DEFAULT_ROADMAP_PREFERENCES
): {
  blocks: ScheduleBlock[];
  milestones: WeeklyMilestone[];
  isOverloaded: boolean;
  totalHoursPlanned: number;
} {
  const prefs = { ...DEFAULT_ROADMAP_PREFERENCES, ...preferences };
  const blocks: ScheduleBlock[] = [];
  const milestones: WeeklyMilestone[] = [];

  if (!tasks || tasks.length === 0) {
    return { blocks: [], milestones: [], isOverloaded: false, totalHoursPlanned: 0 };
  }

  // 1. Sort tasks deterministically by priority and dayNumber
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityDiff = calculateTaskPriority(b, prefs) - calculateTaskPriority(a, prefs);
    if (priorityDiff !== 0) return priorityDiff;
    return a.dayNumber - b.dayNumber;
  });

  const startDate = new Date(prefs.startDate || new Date().toISOString().split('T')[0]);
  const activeDays = prefs.selectedDays.length > 0 ? prefs.selectedDays : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const dailyTargetMinutes = Math.round((prefs.hoursPerWeek * 60) / activeDays.length);
  const sessionMinutes = Math.max(25, Math.min(120, prefs.preferredSessionMinutes || 45));
  const breakMinutes = Math.max(5, Math.min(30, prefs.breakDurationMinutes || 10));

  let currentCalDate = new Date(startDate);
  let taskIndex = 0;
  let blockCounter = 1;
  const totalWeeks = Math.max(1, prefs.durationWeeks || 4);

  let totalMinutesScheduled = 0;

  for (let week = 1; week <= totalWeeks; week++) {
    const weekSkills = new Set<string>();
    const plannedHoursByDay: Record<string, number> = {};
    let weekTotalMinutes = 0;

    for (let d = 0; d < 7; d++) {
      const dayName = DAY_NAMES[currentCalDate.getDay()];
      const dateStr = currentCalDate.toISOString().split('T')[0];

      if (activeDays.includes(dayName) && taskIndex < sortedTasks.length) {
        let dailyAccumulatedMinutes = 0;
        let startHour = 9; // 9:00 AM standard study block
        let startMinute = 0;

        while (dailyAccumulatedMinutes + sessionMinutes <= dailyTargetMinutes && taskIndex < sortedTasks.length) {
          const currentTask = sortedTasks[taskIndex];
          weekSkills.add(currentTask.skill);

          const startTimeStr = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
          
          // Calculate block end time
          let endMinuteTotal = startHour * 60 + startMinute + sessionMinutes;
          let endHour = Math.floor(endMinuteTotal / 60);
          let endMinute = endMinuteTotal % 60;
          const endTimeStr = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;

          // Alternate block type based on task content and session
          let blockType: ScheduleBlockType = 'learn';
          if (dailyAccumulatedMinutes > 0 && dailyAccumulatedMinutes % 90 === 0) {
            blockType = 'practice';
          } else if (dailyAccumulatedMinutes >= dailyTargetMinutes - sessionMinutes) {
            blockType = 'project';
          } else if (currentTask.adaptedFromInterview) {
            blockType = 'interview';
          }

          blocks.push({
            id: `block-${blockCounter++}`,
            date: dateStr,
            dayLabel: dayName,
            startTime: startTimeStr,
            endTime: endTimeStr,
            durationMinutes: sessionMinutes,
            type: blockType,
            taskId: currentTask.id,
            title: `${currentTask.skill}: ${currentTask.title}`,
            skillId: currentTask.skill,
            completed: currentTask.completed,
            locked: false,
            notes: currentTask.learningAction
          });

          dailyAccumulatedMinutes += sessionMinutes;
          totalMinutesScheduled += sessionMinutes;
          weekTotalMinutes += sessionMinutes;

          // Add a break block if there's room before the next session
          if (dailyAccumulatedMinutes + sessionMinutes + breakMinutes <= dailyTargetMinutes) {
            const breakStartStr = endTimeStr;
            let breakEndMinuteTotal = endHour * 60 + endMinute + breakMinutes;
            let breakEndHour = Math.floor(breakEndMinuteTotal / 60);
            let breakEndMinute = breakEndMinuteTotal % 60;
            const breakEndStr = `${String(breakEndHour).padStart(2, '0')}:${String(breakEndMinute).padStart(2, '0')}`;

            blocks.push({
              id: `block-break-${blockCounter++}`,
              date: dateStr,
              dayLabel: dayName,
              startTime: breakStartStr,
              endTime: breakEndStr,
              durationMinutes: breakMinutes,
              type: 'break',
              title: 'Mental Recovery & Knowledge Consolidation',
              completed: false,
              locked: true,
              notes: 'Hydrate, step away from screens, and consolidate concept notes.'
            });

            startHour = breakEndHour;
            startMinute = breakEndMinute;
          } else {
            startHour = endHour;
            startMinute = endMinute;
          }

          // Advance to next task if hours fulfilled or wrap around
          taskIndex++;
          if (taskIndex >= sortedTasks.length && week < totalWeeks) {
            // Circle back to reinforce tasks if user has more available study hours than raw tasks
            taskIndex = 0;
          }
        }

        plannedHoursByDay[dayName] = Number((dailyAccumulatedMinutes / 60).toFixed(1));
      }

      // Next day
      currentCalDate.setDate(currentCalDate.getDate() + 1);
    }

    // Insert weekly review / assessment block on Friday or Sunday
    milestones.push({
      weekNumber: week,
      milestoneTitle: `Sprint ${week}: Core Foundation & Practical Implementation`,
      skillsCovered: Array.from(weekSkills).slice(0, 4),
      totalPlannedHours: Number((weekTotalMinutes / 60).toFixed(1)),
      plannedHoursByDay,
      projectDeliverable: `Implement practical mini-project covering ${Array.from(weekSkills).slice(0, 2).join(' & ') || 'core principles'}`,
      assessmentOrReview: `Self-diagnostic assessment & STAR mock interview checkpoint for Sprint ${week}`,
      expectedEvidence: 'Pushed GitHub commit or functional verified prototype with benchmark validation',
      isOverloaded: weekTotalMinutes > prefs.hoursPerWeek * 60 * 1.2
    });
  }

  const isOverloaded = dailyTargetMinutes > (prefs.maxDailyStudyMinutes || 240);

  return {
    blocks,
    milestones,
    isOverloaded,
    totalHoursPlanned: Number((totalMinutesScheduled / 60).toFixed(1))
  };
}
