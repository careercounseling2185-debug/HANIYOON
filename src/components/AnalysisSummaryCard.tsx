import React from "react";
import { SearchCheck, Lightbulb, CheckCircle2 } from "lucide-react";

interface AnalysisSummaryCardProps {
  summary: string;
  notes: string;
}

export const AnalysisSummaryCard: React.FC<AnalysisSummaryCardProps> = ({
  summary,
  notes,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. 기업 및 직무 분석 요약 */}
      <div className="bg-gradient-to-br from-[#081738] to-[#0E2A66] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900">
        <div className="flex items-center gap-2.5 mb-3 text-blue-300">
          <SearchCheck className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-extrabold uppercase tracking-wider">
            1. 이공계 직무 핏 및 기업 분석 요약
          </h3>
        </div>
        <p className="text-sm sm:text-base text-blue-50 leading-relaxed font-normal whitespace-pre-line bg-white/10 p-5 rounded-2xl border border-white/15 backdrop-blur-xs">
          {summary}
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs text-blue-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>대학일자리플러스센터 2026 직무역량 가치사슬 매핑 완료</span>
        </div>
      </div>

      {/* 3. 학생 안내 노트 */}
      <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-5 text-amber-900 shadow-xs">
        <div className="flex items-center gap-2 mb-2 text-amber-800 font-bold text-sm">
          <Lightbulb className="w-5 h-5 text-amber-600 fill-amber-200" />
          <span>3. 학생 안내 노트 (컨설턴트 가이드)</span>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line text-amber-900 font-medium bg-white p-4 rounded-xl border border-amber-200 shadow-2xs">
          {notes}
        </p>
      </div>
    </div>
  );
};
