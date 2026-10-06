import React, { useState } from 'react';
import {
  X,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { useShift } from '../context/ShiftContext';
import type { RoadmapPreferences } from '../types';

interface RoadmapCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const RoadmapCustomizerModal: React.FC<RoadmapCustomizerModalProps> = ({ isOpen, onClose }) => {
  const { roadmapPreferences, setRoadmapPreferences, recalculateSchedule } = useShift();

  const [form, setForm] = useState<RoadmapPreferences>({ ...roadmapPreferences });

  if (!isOpen) return null;

  const toggleDay = (day: string) => {
    setForm(prev => {
      const exists = prev.selectedDays.includes(day);
      let nextDays: string[];
      if (exists) {
        if (prev.selectedDays.length === 1) return prev; // Keep at least one day
        nextDays = prev.selectedDays.filter(d => d !== day);
      } else {
        nextDays = [...prev.selectedDays, day];
      }
      return {
        ...prev,
        selectedDays: nextDays,
        daysPerWeek: nextDays.length
      };
    });
  };

  // Capacity calculation
  const activeDaysCount = form.selectedDays.length || 1;
  const calculatedDailyMinutes = Math.round((form.hoursPerWeek * 60) / activeDaysCount);
  const isDailyOverloaded = calculatedDailyMinutes > form.maxDailyStudyMinutes;

  const handleApply = () => {
    setRoadmapPreferences(form);
    recalculateSchedule(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1a1f24] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FF6D1F]/20 text-[#FF6D1F] flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#FAF3E1]">
                Customize Roadmap Schedule & Study Capacity
              </h2>
              <p className="text-xs text-[#FAF3E1]/60">
                Deterministic mathematical scheduling tailored to your real weekly availability.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#FAF3E1]/50 hover:text-[#FAF3E1] hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-6 text-xs">
          {/* Days of Week */}
          <div className="space-y-2">
            <label className="font-semibold text-[#FAF3E1] uppercase tracking-wider block">
              Study Days ({form.selectedDays.length} days selected)
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {ALL_DAYS.map(day => {
                const isSelected = form.selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`py-2 px-1 rounded-xl font-bold transition text-center ${
                      isSelected
                        ? 'bg-[#FF6D1F] text-white shadow-sm'
                        : 'bg-[#080B0D] border border-white/10 text-[#FAF3E1]/60 hover:text-[#FAF3E1]'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hours Per Week Slider */}
          <div className="space-y-2 bg-[#080B0D] border border-white/5 p-4 rounded-xl">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-[#FAF3E1]">
                Weekly Study Commitment
              </label>
              <span className="text-sm font-bold text-[#FF6D1F]">
                {form.hoursPerWeek} hrs / week
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="35"
              step="1"
              value={form.hoursPerWeek}
              onChange={(e) => setForm(prev => ({ ...prev, hoursPerWeek: Number(e.target.value) }))}
              className="w-full accent-[#FF6D1F] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#FAF3E1]/40">
              <span>Light (2 hrs)</span>
              <span>Balanced (10 hrs)</span>
              <span>Intensive (35 hrs)</span>
            </div>
          </div>

          {/* Session Length & Break */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-[#FAF3E1]">
                Focus Session Length
              </label>
              <select
                value={form.preferredSessionMinutes}
                onChange={(e) => setForm(prev => ({ ...prev, preferredSessionMinutes: Number(e.target.value) }))}
                className="w-full bg-[#080B0D] border border-white/10 rounded-xl px-3 py-2.5 text-[#FAF3E1] focus:outline-none focus:border-[#FF6D1F]"
              >
                <option value="25">Pomodoro (25 minutes)</option>
                <option value="45">Standard Sprint (45 minutes)</option>
                <option value="60">Deep Dive (60 minutes)</option>
                <option value="90">Extended Lab (90 minutes)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#FAF3E1]">
                Consolidation Break
              </label>
              <select
                value={form.breakDurationMinutes}
                onChange={(e) => setForm(prev => ({ ...prev, breakDurationMinutes: Number(e.target.value) }))}
                className="w-full bg-[#080B0D] border border-white/10 rounded-xl px-3 py-2.5 text-[#FAF3E1] focus:outline-none focus:border-[#FF6D1F]"
              >
                <option value="5">Short Rest (5 minutes)</option>
                <option value="10">Standard Break (10 minutes)</option>
                <option value="15">Extended Break (15 minutes)</option>
              </select>
            </div>
          </div>

          {/* Learning Style & Priority Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-[#FAF3E1]">
                Preferred Learning Style
              </label>
              <select
                value={form.learningStyle}
                onChange={(e) => setForm(prev => ({ ...prev, learningStyle: e.target.value as any }))}
                className="w-full bg-[#080B0D] border border-white/10 rounded-xl px-3 py-2.5 text-[#FAF3E1] focus:outline-none focus:border-[#FF6D1F]"
              >
                <option value="hands_on">Hands-on Code & Labs (Recommended)</option>
                <option value="problem_solving">Problem Solving & Algorithms</option>
                <option value="video_guided">Video-Guided Step-by-Step</option>
                <option value="reading">Documentation & Deep Reading</option>
                <option value="hybrid">Balanced Hybrid</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#FAF3E1]">
                Task Scheduling Priority
              </label>
              <select
                value={form.priorityMode}
                onChange={(e) => setForm(prev => ({ ...prev, priorityMode: e.target.value as any }))}
                className="w-full bg-[#080B0D] border border-white/10 rounded-xl px-3 py-2.5 text-[#FAF3E1] focus:outline-none focus:border-[#FF6D1F]"
              >
                <option value="balanced">Balanced Progression (Foundations First)</option>
                <option value="skill_gap_first">Critical Resume Gaps First</option>
                <option value="role_first">High-Impact Job Requirements First</option>
              </select>
            </div>
          </div>

          {/* Start Date */}
          <div className="space-y-1.5">
            <label className="font-semibold text-[#FAF3E1]">
              Sprint Start Date
            </label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full bg-[#080B0D] border border-white/10 rounded-xl px-3 py-2.5 text-[#FAF3E1] focus:outline-none focus:border-[#FF6D1F]"
            />
          </div>

          {/* Capacity Diagnostic Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            isDailyOverloaded
              ? 'bg-rose-500/10 border-rose-500/20 text-rose-300'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
          }`}>
            {isDailyOverloaded ? (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="font-bold text-xs">
                Estimated Daily Workload: {Math.floor(calculatedDailyMinutes / 60)}h {calculatedDailyMinutes % 60}m across {activeDaysCount} days
              </div>
              <p className="text-[11px] opacity-80">
                {isDailyOverloaded
                  ? `Warning: This exceeds your configured maximum daily limit (${Math.floor(form.maxDailyStudyMinutes / 60)}h). Consider selecting more study days or reducing weekly hours to prevent burnout.`
                  : 'Capacity verified. Daily workload fits comfortably within cognitive retention thresholds.'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#FAF3E1] transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-2.5 rounded-xl bg-[#FF6D1F] hover:bg-[#e05d15] text-xs font-bold text-white transition flex items-center gap-2 shadow-md shadow-[#FF6D1F]/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate & Apply Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
};
