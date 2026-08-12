import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { InputForm } from "./components/InputForm";
import { MissingFieldsModal } from "./components/MissingFieldsModal";
import { AnalysisSummaryCard } from "./components/AnalysisSummaryCard";
import { SlideViewer } from "./components/SlideViewer";
import { PortfolioInput, PortfolioResponse } from "./types";
import { Sparkles, ArrowDown, Award, FileCheck2 } from "lucide-react";

export default function App() {
  const [input, setInput] = useState<PortfolioInput>({
    company: "",
    job: "",
    keywords: "",
    experience: "",
    profile: "",
  });

  const [userApiKey, setUserApiKey] = useState<string>("");
  const [isApiKeyVerified, setIsApiKeyVerified] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PortfolioResponse | null>(null);

  const [missingModal, setMissingModal] = useState<{
    isOpen: boolean;
    missingFields: string[];
    message: string;
  }>({
    isOpen: false,
    missingFields: [],
    message: "",
  });

  const handleInputChange = (field: keyof PortfolioInput, value: string) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectPreset = (preset: PortfolioInput) => {
    setInput(preset);
    // Smooth scroll to form
    const el = document.getElementById("input-form-card");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleReset = () => {
    setInput({
      company: "",
      job: "",
      keywords: "",
      experience: "",
      profile: "",
    });
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!isApiKeyVerified) {
      const el = document.getElementById("api-key-activation-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      alert("🔒 API Key 승인이 필요합니다. 먼저 Gemini API Key 활성화 및 유효성 확인을 완료해 주세요.");
      return;
    }

    // Client-side quick check
    const missing: string[] = [];
    if (!input.company.trim() || input.company.includes("[사용자 입력 대기]")) missing.push("지원 기업");
    if (!input.job.trim() || input.job.includes("[사용자 입력 대기]")) missing.push("지원 직무");
    if (!input.keywords.trim() || input.keywords.includes("[사용자 입력 대기]")) missing.push("핵심 직무 역량 키워드");
    if (!input.experience.trim() || input.experience.includes("[사용자 입력 대기]")) missing.push("학생의 주요 프로젝트 경험 및 기술 스택");

    if (missing.length > 0) {
      setMissingModal({
        isOpen: true,
        missingFields: missing,
        message: `[실행 지침 1]: Input 항목 중 (${missing.join(", ")}) 항목이 비어 있거나 [사용자 입력 대기] 상태입니다. 필요한 정보를 채워주시면 6장 슬라이드 기획을 시작합니다.`,
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/generate-portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...input,
          userApiKey: userApiKey.trim(),
        }),
      });

      const data: any = await res.json();

      if (!res.ok || data.error) {
        alert(data.error || "포트폴리오 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }

      if (!data.isComplete && data.missingFields) {
        setMissingModal({
          isOpen: true,
          missingFields: data.missingFields,
          message: data.message || "필수 정보를 완료해 주세요.",
        });
      } else {
        setResult(data as PortfolioResponse);
        setTimeout(() => {
          const resEl = document.getElementById("portfolio-results");
          if (resEl) resEl.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (err) {
      console.error("Failed to generate portfolio:", err);
      alert("포트폴리오 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
      {/* Landing Page Hero & Value Showcase Header */}
      <LandingPage
        onSelectPreset={handleSelectPreset}
        isLoading={isLoading}
        userApiKey={userApiKey}
        setUserApiKey={setUserApiKey}
        isApiKeyVerified={isApiKeyVerified}
        setIsApiKeyVerified={setIsApiKeyVerified}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        {/* Input Form Section */}
        <InputForm
          input={input}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onReset={handleReset}
          isLoading={isLoading}
          isApiKeyVerified={isApiKeyVerified}
        />

        {/* Loading Indicator */}
        {isLoading && (
          <div className="bg-[#0D2A68] text-white rounded-3xl p-8 sm:p-10 text-center shadow-2xl border border-blue-900 animate-pulse">
            <div className="w-12 h-12 border-4 border-blue-300 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-extrabold text-white mb-2 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              2026 이공계 채용 트렌드 & 직무 핏 분석 중...
            </h3>
            <p className="text-xs text-blue-100/90 max-w-lg mx-auto leading-relaxed">
              대학일자리플러스센터 AI 컨설턴트가 지원 기업({input.company}) 및 직무({input.job})의 
              핵심 가치사슬을 분석하고 1280x720px 비즈니스 프리젠테이션 슬라이드를 기획하고 있습니다.
            </p>
          </div>
        )}

        {/* Results Section */}
        {result && result.isComplete && result.htmlCode && (
          <div id="portfolio-results" className="space-y-8 pt-4">
            <div className="flex items-center gap-3 border-b border-slate-300 pb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-lg shadow-md">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  최종 6장 포트폴리오 초안 완성
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                    검증 완료 (Checklist Passed)
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  {input.company} | {input.job} 맞춤형 비즈니스 프리젠테이션 슬라이드 코드
                </p>
              </div>
            </div>

            {/* Output 1: 이공계 직무 핏 및 기업 분석 요약 & Output 3: 학생 안내 노트 */}
            <AnalysisSummaryCard
              summary={result.companyAnalysisSummary || ""}
              notes={result.studentNotes || ""}
            />

            {/* Down Arrow separator */}
            <div className="flex justify-center my-2">
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center animate-bounce shadow-sm">
                <ArrowDown className="w-5 h-5" />
              </div>
            </div>

            {/* Output 2: 6장 포트폴리오 HTML 슬라이드 전체 코드 & Interactive Viewer */}
            <SlideViewer
              htmlCode={result.htmlCode}
              onUpdateHtml={(newHtml) =>
                setResult((prev) => (prev ? { ...prev, htmlCode: newHtml } : prev))
              }
              companyName={input.company}
              jobName={input.job}
            />
          </div>
        )}
      </main>

      {/* Missing Fields Modal Dialog */}
      {missingModal.isOpen && (
        <MissingFieldsModal
          missingFields={missingModal.missingFields}
          message={missingModal.message}
          input={input}
          onChange={handleInputChange}
          onSubmit={() => {
            setMissingModal((prev) => ({ ...prev, isOpen: false }));
            handleSubmit();
          }}
          onClose={() => setMissingModal((prev) => ({ ...prev, isOpen: false }))}
        />
      )}

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 mt-16 text-center text-xs text-slate-500 border-t border-slate-200 pt-6">
        <p className="flex items-center justify-center gap-1.5 font-medium">
          <Award className="w-4 h-4 text-slate-400" />
          이공계 직무 포트폴리오 초안 마스터 — 대학일자리플러스센터 수석 취업 컨설턴트
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          본 시스템은 사실에 근거한 매력적 스토리텔링 원칙을 준수하며, 제공되지 않은 경력·수치는 창작하지 않습니다.
        </p>
      </footer>
    </div>
  );
}
