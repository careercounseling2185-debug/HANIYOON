import React from "react";
import { AlertTriangle, ArrowRight, HelpCircle } from "lucide-react";
import { PortfolioInput } from "../types";

interface MissingFieldsModalProps {
  missingFields: string[];
  message: string;
  input: PortfolioInput;
  onChange: (field: keyof PortfolioInput, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export const MissingFieldsModal: React.FC<MissingFieldsModalProps> = ({
  missingFields,
  message,
  input,
  onChange,
  onSubmit,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 text-amber-600 mb-4 pb-3 border-b border-amber-100">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              필수 정보 입력 필요 (대학일자리플러스센터 안내)
            </h3>
            <p className="text-xs text-amber-700 font-medium">
              모든 항목이 확보되어야 고품질 직무 핏 포트폴리오를 작성할 수 있습니다.
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-5 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
          {message}
        </p>

        <div className="space-y-4 mb-6">
          {missingFields.includes("지원 기업") && (
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                Q1. 지원을 희망하는 Target 기업명은 무엇인가요?
              </label>
              <input
                type="text"
                value={input.company}
                onChange={(e) => onChange("company", e.target.value)}
                placeholder="예) 삼성전자 DS부문, SK하이닉스"
                className="w-full px-3.5 py-2 text-sm bg-amber-50/50 border border-amber-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          {missingFields.includes("지원 직무") && (
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                Q2. 지원할 이공계 세부 직무명을 입력해 주세요.
              </label>
              <input
                type="text"
                value={input.job}
                onChange={(e) => onChange("job", e.target.value)}
                placeholder="예) 메모리 공정기술 엔지니어, 배터리 Cell R&D"
                className="w-full px-3.5 py-2 text-sm bg-amber-50/50 border border-amber-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          {missingFields.includes("핵심 직무 역량 키워드") && (
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                Q3. 본인의 핵심 기술 스택 및 문제해결 역량 키워드를 적어주세요.
              </label>
              <input
                type="text"
                value={input.keywords}
                onChange={(e) => onChange("keywords", e.target.value)}
                placeholder="예) 수율 최적화, 식각 공정, Plackett-Burman DOE, Python"
                className="w-full px-3.5 py-2 text-sm bg-amber-50/50 border border-amber-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          {missingFields.includes("학생의 주요 프로젝트 경험 및 기술 스택") && (
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                Q4. 대표 프로젝트 경험 (역할, 해결과정, 정량/정성 성과, 사용 툴)을 입력해 주세요.
              </label>
              <textarea
                rows={3}
                value={input.experience}
                onChange={(e) => onChange("experience", e.target.value)}
                placeholder="[프로젝트명]: ...&#10;역할: ...&#10;해결과정: ...&#10;성과: ..."
                className="w-full px-3.5 py-2 text-sm bg-amber-50/50 border border-amber-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors"
          >
            폼으로 돌아가기
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 py-3 px-4 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <span>정보 완료 & 생성 재시도</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
