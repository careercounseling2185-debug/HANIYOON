import React from "react";
import { Building, Briefcase, KeyRound, Wrench, UserCheck, Play, RotateCcw, HelpCircle, CheckCircle2, ShieldCheck, Lock, ArrowUp } from "lucide-react";
import { PortfolioInput } from "../types";

interface InputFormProps {
  input: PortfolioInput;
  onChange: (field: keyof PortfolioInput, value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  isLoading: boolean;
  isApiKeyVerified?: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
  input,
  onChange,
  onSubmit,
  onReset,
  isLoading,
  isApiKeyVerified = false,
}) => {
  const scrollToApiKeySection = () => {
    const el = document.getElementById("api-key-activation-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFormClick = (e: React.MouseEvent) => {
    if (!isApiKeyVerified) {
      // If clicking inside input fields when not verified, scroll to API key section
      scrollToApiKeySection();
    }
  };

  return (
    <div id="input-form-card" className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 relative">
      {/* Lock Status Warning Banner if API Key is not verified */}
      {!isApiKeyVerified ? (
        <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-pulse">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs shrink-0 mt-0.5">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-amber-950 flex items-center gap-2">
                🔒 API Key 미승인 상태 — 모든 메뉴 및 포트폴리오 생성 잠김
              </h4>
              <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
                서비스를 이용하시려면 먼저 <strong>Gemini API Key 활성화 및 승인</strong>을 완료해 주세요.
                승인이 완료되면 모든 메뉴와 6장 슬라이드 기획 기능이 즉시 활성화됩니다.
              </p>
            </div>
          </div>
          <button
            onClick={scrollToApiKeySection}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shrink-0 cursor-pointer transition-colors shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
          >
            <ShieldCheck className="w-4 h-4 text-amber-200" />
            <span>API Key 승인하러 가기</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50/80 border border-emerald-300 rounded-2xl p-4 mb-6 flex items-center justify-between gap-3 text-xs text-emerald-900 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span><strong>API Key 승인 완료!</strong> 모든 메뉴 및 6장 포트폴리오 기획 기능이 활성화되었습니다.</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            UNLOCKED
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-[#0D2A68] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                01
              </span>
              포트폴리오 입력 정보 (Input)
            </h2>
            {isApiKeyVerified ? (
              <span className="text-xs px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full font-bold flex items-center gap-1 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> API Key 승인됨
              </span>
            ) : (
              <button
                onClick={scrollToApiKeySection}
                className="text-xs px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-full font-bold flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
                title="API Key 활성화 섹션으로 이동"
              >
                <Lock className="w-3.5 h-3.5 text-amber-600" /> API Key 승인 필요
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            * 2026 이공계 채용 평가 기준에 맞춰 실제 경험과 스킬을 사실에 기반해 입력해 주세요.
          </p>
        </div>
        <button
          onClick={onReset}
          disabled={isLoading || !isApiKeyVerified}
          className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-medium self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          초기화
        </button>
      </div>

      <div className={`space-y-6 ${!isApiKeyVerified ? "opacity-75" : ""}`}>
        {/* Row 1: Company & Job */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-2 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-[#1D4ED8]" />
              1. 지원 기업명 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={input.company}
              onChange={(e) => onChange("company", e.target.value)}
              onClick={handleFormClick}
              disabled={!isApiKeyVerified}
              placeholder={isApiKeyVerified ? "예) 삼성전자 DS부문, LG에너지솔루션, 현대자동차" : "🔒 API Key 승인 후 입력 가능합니다."}
              className="w-full px-4 py-3 text-sm bg-[#F8FAFC] border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all font-medium text-slate-900 shadow-2xs disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-2 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-[#1D4ED8]" />
              2. 지원 직무명 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={input.job}
              onChange={(e) => onChange("job", e.target.value)}
              onClick={handleFormClick}
              disabled={!isApiKeyVerified}
              placeholder={isApiKeyVerified ? "예) 메모리 공정기술 엔지니어, 배터리 셀 R&D, 차량SW개발" : "🔒 API Key 승인 후 입력 가능합니다."}
              className="w-full px-4 py-3 text-sm bg-[#F8FAFC] border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all font-medium text-slate-900 shadow-2xs disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-pointer"
            />
          </div>
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-xs font-extrabold text-slate-800 mb-2 flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-[#1D4ED8]" />
            3. 핵심 직무 역량 키워드 <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={input.keywords}
            onChange={(e) => onChange("keywords", e.target.value)}
            onClick={handleFormClick}
            disabled={!isApiKeyVerified}
            placeholder={isApiKeyVerified ? "예) SiWafer 식각 공정 수율 최적화, 데이터 기반 불량 규명, Plackett-Burman DOE, Python 분석" : "🔒 API Key 승인 후 입력 가능합니다."}
            className="w-full px-4 py-3 text-sm bg-[#F8FAFC] border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all font-medium text-slate-900 shadow-2xs disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-pointer"
          />
          <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            쉼표(,)로 구분하여 3~5개의 핵심 기술 스택 및 공학적 문제해결 키워드를 입력하세요.
          </p>
        </div>

        {/* Projects & Experience */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-[#1D4ED8]" />
              4. 학생의 주요 프로젝트 경험 및 기술 스택 <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono">
              {input.experience.length} 자
            </span>
          </div>
          <textarea
            rows={5}
            value={input.experience}
            onChange={(e) => onChange("experience", e.target.value)}
            onClick={handleFormClick}
            disabled={!isApiKeyVerified}
            placeholder={isApiKeyVerified ? "[프로젝트명]: SiWafer 식각 공정 불량 저감 프로젝트\n- 역할: 데이터 분석 및 공정 파라미터 설계\n- 해결과정: Plackett-Burman 설계법으로 원인 인자 도출 -> ANOVA 정밀 분석 수행\n- 성과: 불량률 감소 [미제공 시 '확인 필요' 마커 자동 반영], Cpk 향상\n- 사용 툴: Python, OriginLab, Minitab" : "🔒 API Key 승인 후 작성 가능합니다."}
            className="w-full px-4 py-3 text-sm bg-[#F8FAFC] border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all font-mono leading-relaxed text-slate-900 shadow-2xs disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-pointer"
          />
          <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-2.5 mt-2">
            ⚠️ <strong>안티 헐루시네이션 규칙 적용</strong>: 입력하지 않은 정량 성과(수치, %, 등수 등)는 절대 임의로 지어내지 않으며,
            <code className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded ml-1 font-bold">[✍️ 확인 필요]</code> 마커로 자동 처리됩니다.
          </p>
        </div>

        {/* Profile Info */}
        <div>
          <label className="block text-xs font-extrabold text-slate-800 mb-2 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-[#1D4ED8]" />
            5. (선택) 학력·자격·어학 등 프로필 정보 / GitHub·블로그 링크 / 지원자 이름
          </label>
          <input
            type="text"
            value={input.profile}
            onChange={(e) => onChange("profile", e.target.value)}
            onClick={handleFormClick}
            disabled={!isApiKeyVerified}
            placeholder={isApiKeyVerified ? "예) 한국대학교 전자공학과 4학년 / 정보처리기사, ADsP / OPIC AL / GitHub: github.com/hong / 지원자: 홍길동" : "🔒 API Key 승인 후 입력 가능합니다."}
            className="w-full px-4 py-3 text-sm bg-[#F8FAFC] border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all font-medium text-slate-900 shadow-2xs disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-pointer"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-3">
          <button
            onClick={isApiKeyVerified ? onSubmit : scrollToApiKeySection}
            disabled={isLoading}
            className={`w-full py-4.5 px-6 rounded-2xl font-black text-base shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer ${
              !isApiKeyVerified
                ? "bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/50 hover:shadow-2xl"
                : "bg-[#0D2A68] hover:bg-[#081738] text-white hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            {!isApiKeyVerified ? (
              <>
                <Lock className="w-5 h-5 text-amber-400 animate-pulse" />
                <span>🔒 Gemini API Key 승인 후 포트폴리오 생성 가능 (클릭 시 승인 영역 이동)</span>
              </>
            ) : isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>기업 분석 및 6장 슬라이드 포트폴리오 생성 중...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current text-blue-300 group-hover:text-white transition-colors" />
                <span>6장 이공계 직무 핏 포트폴리오 초안 기획 및 슬라이드 생성</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
