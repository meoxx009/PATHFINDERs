import React from 'react';
import { useShift } from '../context/ShiftContext';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Quote, 
  Lightbulb, 
  Layers, 
  GraduationCap, 
  FolderGit2 
} from 'lucide-react';

export const EvidenceAnalysisView: React.FC = () => {
  const { extractedResume, gapAnalysis, setCurrentStep, loadDemoScenario } = useShift();

  if (!extractedResume || !gapAnalysis) {
    return (
      <div className="max-w-[1280px] mx-auto py-16 px-6 text-center">
        <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-10 max-w-lg mx-auto shadow-2xl">
          <Quote className="w-12 h-12 text-[#FF6D1F] mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold uppercase text-[#FAF3E1]">
            No Resume Evidence Analyzed
          </h2>
          <p className="text-xs text-[#96928A] mt-2 mb-6 leading-relaxed">
            Paste or upload a resume to extract verifiable quotes, detect screening warnings, and calculate evidence status.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => setCurrentStep('setup')}
              className="w-full py-3.5 rounded-[22px] bg-[#FF6D1F] hover:bg-[#ff7e36] text-[#222222] font-black text-xs uppercase tracking-wider font-display transition cursor-pointer shadow-lg shadow-[#FF6D1F]/20"
            >
              PASTE RESUME & ANALYZE →
            </button>
            <button
              onClick={() => {
                loadDemoScenario('prd_frontend_beginner');
                setCurrentStep('analysis');
              }}
              className="w-full py-3 rounded-[20px] bg-[#080B0D] hover:bg-[#1a2024] text-[#FAF3E1] border border-[rgba(250,243,225,0.18)] text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer font-display transition"
            >
              <Lightbulb className="w-4 h-4 text-[#FF6D1F]" />
              <span>Explore an example profile</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto py-10 px-6 sm:px-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[rgba(250,243,225,0.12)]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FF6D1F]">
              Evidence Verification
            </span>
            <span className="text-[#96928A]">•</span>
            <span className="text-xs text-[#96928A]">Verifiable Proof Excerpts</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase text-[#FAF3E1] tracking-tight">
            Resume Evidence & Grounding
          </h1>
          <p className="text-sm text-[#96928A] mt-2">
            Candidate: <strong className="text-[#FAF3E1]">{extractedResume.candidateName}</strong> • SkillForge AI strictly verifies engineering claims against documented codebase artifacts.
          </p>
        </div>

        <button
          onClick={() => setCurrentStep('gap')}
          className="px-6 py-3.5 rounded-[22px] bg-[#101416] hover:bg-[#1a2024] text-[#FAF3E1] border border-[rgba(250,243,225,0.2)] font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer self-start sm:self-center font-display"
        >
          <span>VIEW ROLE GAP BENCHMARK →</span>
        </button>
      </div>

      {/* Overview Cards (DESIGN.MD Section 7: Balanced Overview, not single giant score) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Identified Skills Count */}
        <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#96928A]">Recognized Skills</span>
            <Layers className="w-4 h-4 text-[#FF6D1F]" />
          </div>
          <div className="font-display text-4xl font-black text-[#FAF3E1] mt-3">
            {extractedResume.extractedSkills.length}
          </div>
          <p className="text-[12px] text-[#96928A] mt-1.5">
            Technical languages, frameworks & tools identified.
          </p>
        </div>

        {/* Evidence Found (Product Rule #5) */}
        <div className="bg-[#101416] border border-[#B8D88A]/30 rounded-[26px] p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B8D88A]">Evidence Found</span>
            <CheckCircle2 className="w-4 h-4 text-[#B8D88A]" />
          </div>
          <div className="font-display text-4xl font-black text-[#B8D88A] mt-3">
            {gapAnalysis.demonstrated.length}
          </div>
          <p className="text-[12px] text-[#96928A] mt-1.5">
            Skills supported by verbatim project implementations.
          </p>
        </div>

        {/* Partial Evidence or Needs Stronger Proof (Product Rule #5) */}
        <div className="bg-[#101416] border border-[#F7C65B]/30 rounded-[26px] p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F7C65B]">Needs Stronger Proof</span>
            <AlertTriangle className="w-4 h-4 text-[#F7C65B]" />
          </div>
          <div className="font-display text-4xl font-black text-[#F7C65B] mt-3">
            {gapAnalysis.partial.length + gapAnalysis.missing.length}
          </div>
          <p className="text-[12px] text-[#96928A] mt-1.5">
            Competencies requiring dedicated portfolio evidence.
          </p>
        </div>
      </div>

      {/* Verbatim Evidence Excerpts Showcase (Mandatory Product Rule #2 & #5) */}
      <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-8 mb-8 shadow-xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(250,243,225,0.1)]">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase text-[#FAF3E1] flex items-center gap-2.5">
              <Quote className="w-5 h-5 text-[#FF6D1F]" />
              Verbatim Evidence Found In Resume
            </h2>
            <p className="text-xs text-[#96928A] mt-1">
              Direct quotations from candidate's resume verifying hands-on competence without hallucination.
            </p>
          </div>
          <span className="text-[10px] font-mono uppercase px-3 py-1 rounded-full bg-[#B8D88A]/15 text-[#B8D88A] border border-[#B8D88A]/30">
            Grounding Verified
          </span>
        </div>

        <div className="space-y-4">
          {/* Demonstrated Skills -> "Evidence found" */}
          {gapAnalysis.demonstrated.map(d => (
            <div
              key={d.skill}
              className="bg-[#080B0D] border border-[rgba(250,243,225,0.1)] rounded-[20px] p-5 transition hover:border-[#B8D88A]/40"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-[#FAF3E1] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#B8D88A]" />
                  {d.skill}
                </span>
                <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#B8D88A]/15 text-[#B8D88A] border border-[#B8D88A]/30">
                  Evidence found
                </span>
              </div>
              {d.evidenceExcerpt && (
                <div className="text-xs text-[#FAF3E1] font-mono bg-[#101416] p-3.5 rounded-[14px] border-l-2 border-[#B8D88A] italic">
                  {d.evidenceExcerpt}
                </div>
              )}
            </div>
          ))}

          {/* Partial Skills -> "Partial evidence" */}
          {gapAnalysis.partial.map(p => (
            <div
              key={p.skill}
              className="bg-[#080B0D] border border-[rgba(250,243,225,0.1)] rounded-[20px] p-5 transition hover:border-[#F7C65B]/40"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-[#FAF3E1] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#F7C65B]" />
                  {p.skill}
                </span>
                <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#F7C65B]/15 text-[#F7C65B] border border-[#F7C65B]/30">
                  Partial evidence (Keyword only)
                </span>
              </div>
              <p className="text-xs text-[#96928A] mb-2">{p.explanation}</p>
              {p.evidenceExcerpt && (
                <div className="text-xs text-[#96928A] font-mono bg-[#101416] p-3 rounded-[14px] border-l-2 border-[#F7C65B]/60">
                  Excerpt: {p.evidenceExcerpt}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Parsed Projects & Education */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Parsed Projects */}
        <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-7">
          <h2 className="font-display text-xl font-bold uppercase text-[#FAF3E1] mb-4 flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-[#FF6D1F]" />
            Detected Projects ({extractedResume.projects.length})
          </h2>
          <div className="space-y-4">
            {extractedResume.projects.map((proj, idx) => (
              <div key={idx} className="bg-[#080B0D] border border-[rgba(250,243,225,0.1)] rounded-[18px] p-4">
                <div className="font-bold text-sm text-[#FAF3E1] mb-1">{proj.name}</div>
                <div className="text-xs text-[#96928A] line-clamp-3 mb-2">{proj.description}</div>
                {proj.evidenceSnippets.length > 0 && (
                  <div className="space-y-1">
                    {proj.evidenceSnippets.map((snip, sIdx) => (
                      <div key={sIdx} className="text-[11px] text-[#96928A] font-mono flex items-start gap-1.5">
                        <span className="text-[#FF6D1F] mt-0.5">•</span>
                        <span>{snip}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Education & Background */}
        <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-7">
          <h2 className="font-display text-xl font-bold uppercase text-[#FAF3E1] mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#FF6D1F]" />
            Education & Background
          </h2>
          <div className="space-y-3 mb-6">
            {extractedResume.education.map((edu, idx) => (
              <div key={idx} className="bg-[#080B0D] border border-[rgba(250,243,225,0.1)] rounded-[18px] p-4">
                <div className="font-bold text-sm text-[#FAF3E1]">{edu.institution}</div>
                <div className="text-xs text-[#96928A]">{edu.degree}</div>
              </div>
            ))}
          </div>

          {extractedResume.experience.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#FAF3E1] mb-2.5">Work / Campus Roles</h3>
              <div className="space-y-2">
                {extractedResume.experience.map((exp, idx) => (
                  <div key={idx} className="bg-[#080B0D] border border-[rgba(250,243,225,0.1)] rounded-[16px] p-3 text-xs">
                    <span className="text-[#FAF3E1] font-semibold">{exp.role}</span>
                    <span className="text-[#96928A]"> — {exp.company}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suggested Next Steps (Product Rule #5) */}
      <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-7 mb-10">
        <h2 className="font-display text-xl font-bold uppercase text-[#FAF3E1] mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[#FF6D1F]" />
          Suggested Next Steps For Resume Evidence
        </h2>
        <div className="space-y-3">
          {extractedResume.truthfulSuggestions.map((sug, idx) => (
            <div key={idx} className="flex items-start gap-3 text-xs text-[#FAF3E1]">
              <span className="w-5 h-5 rounded-full bg-[#FF6D1F]/20 text-[#FF6D1F] font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 font-mono">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{sug}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-[rgba(250,243,225,0.12)]">
        <button
          onClick={() => setCurrentStep('setup')}
          className="text-xs text-[#96928A] hover:text-[#FAF3E1] font-medium cursor-pointer"
        >
          ← Edit Setup
        </button>

        <button
          onClick={() => setCurrentStep('gap')}
          className="px-8 py-4 rounded-[26px] bg-[#FF6D1F] hover:bg-[#ff7e36] text-[#222222] font-black text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer font-display shadow-lg shadow-[#FF6D1F]/20"
        >
          <span>STEP 03: BENCHMARK SKILL GAPS →</span>
        </button>
      </div>
    </div>
  );
};
