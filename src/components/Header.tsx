import React from "react";
import { Sparkles, Award, FileSpreadsheet, Building2 } from "lucide-react";
import { PRESET_SAMPLES } from "../data/presets";
import { PortfolioInput } from "../types";

interface HeaderProps {
  onSelectPreset: (preset: PortfolioInput) => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onSelectPreset, isLoading }) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Brand Title */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Award className="w-3.5 h-3.5" />
                2026 이공계 채용 시장 특화 컨설팅
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Building2 className="w-3.5 h-3.5" />
                대학일자리플러스센터 수석 취업 컨설턴트 AI
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <FileSpreadsheet className="w-8 h-8 text-sky-400" />
              이공계 직무 포트폴리오 초안 마스터
            </h1>
            <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
              지원 기업과 직무의 최신 정보를 정밀 분석하고, 학생의 실제 프로젝트 경험과 핵심 기술 스택을 직무 핏 중심의 
              <strong> 6장 비즈니스 프리젠테이션 HTML 슬라이드 포트폴리오(1280x720px)</strong>로 기획·생성합니다.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 backdrop-blur-sm shrink-0">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              🚀 빠른 테스트용 샘플 프리셋 (1-Click)
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  disabled={isLoading}
                  onClick={() =>
                    onSelectPreset({
                      company: sample.company,
                      job: sample.job,
                      keywords: sample.keywords,
                      experience: sample.experience,
                      profile: sample.profile,
                    })
                  }
                  className="px-3 py-2 text-xs font-medium bg-slate-700/90 hover:bg-sky-600 text-slate-200 hover:text-white rounded-lg transition-all duration-200 text-left border border-slate-600/60 hover:border-sky-500 truncate disabled:opacity-50 disabled:cursor-not-allowed"
                  title={`${sample.company} - ${sample.job}`}
                >
                  {sample.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
