import React, { useState } from "react";
import {
  FileSpreadsheet,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Presentation,
  Download,
  ArrowRight,
  ChevronRight,
  Layers,
  Target,
  Zap,
  BarChart3,
  MousePointerClick,
  Sparkles,
  FileText,
  Award,
  Globe,
  ArrowDown,
  KeyRound,
  Lock
} from "lucide-react";
import { PRESET_SAMPLES } from "../data/presets";
import { PortfolioInput } from "../types";
import { ApiKeySection } from "./ApiKeySection";

interface LandingPageProps {
  onSelectPreset: (preset: PortfolioInput) => void;
  isLoading: boolean;
  userApiKey: string;
  setUserApiKey: (key: string) => void;
  isApiKeyVerified: boolean;
  setIsApiKeyVerified: (verified: boolean) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectPreset,
  isLoading,
  userApiKey,
  setUserApiKey,
  isApiKeyVerified,
  setIsApiKeyVerified,
}) => {
  const [activeSlideTab, setActiveSlideTab] = useState<number>(0);

  const slideStructure = [
    {
      num: "01",
      title: "Overview",
      subtitle: "표지 & 메인 슬로건",
      desc: "공학적 문제해결 중심 메인 슬로건, 지원 직무명, 지원자 정보 및 기업명 탑재",
      details: ["공학적 문제해결형 15자 슬로건", "지원 기업/직무 태그", "딥 네이비 정통 비즈니스 테마"],
      icon: Presentation,
    },
    {
      num: "02",
      title: "Profile",
      subtitle: "인적사항 & 핵심 강점",
      desc: "원형 포토 영역, 학력·자격·어학 스펙 3요소 및 직무 강점 3줄 요약",
      details: ["원형 Photo Placeholder", "전공/자격/링크 핵심 스펙", "직무 적합성 3줄 포인트"],
      icon: Layers,
    },
    {
      num: "03",
      title: "Core Competencies",
      subtitle: "기술 스택 & 활용역량",
      desc: "핵심 기술 스택 및 실무 적용 시나리오, 현장 투입 가능성 제시",
      details: ["기술 스택 3가지 심화 카드", "실무 적용 시나리오 1줄", "스킬셋 직무 핏 총평"],
      icon: Zap,
    },
    {
      num: "04",
      title: "Key Project",
      subtitle: "대표 프로젝트 검증",
      desc: "문제 정의, 내 역할, 3단계 해결 프로세스, 성과 박스, 기업 적용성, 배운점",
      details: ["3단계 해결 프로세스 카드", "정량/정성 성과 하이라이트", "기업 적용성 & 배운점"],
      icon: Target,
    },
    {
      num: "05",
      title: "Additional Experience",
      subtitle: "연계 경험 & 활동",
      desc: "직무와 연계된 학술·실습·자격 등 추가 활동 2~3개와 직무 연결고리",
      details: ["활동명 - 직무 연결고리 매칭", "전공 심화 & 협업 리더십", "지속적 자기개발 증빙"],
      icon: FileText,
    },
    {
      num: "06",
      title: "Action Plan",
      subtitle: "입사 후 포부 & 로드맵",
      desc: "1년차(적응), 3년차(주도), 5년차(기술 표준화) 연차별 구체적 실행 액션",
      details: ["연차별 구체적 Action 2개 이상", "기업 수율/품질 기여 비전", "전문가 성장 로드맵"],
      icon: BarChart3,
    },
  ];

  const scrollToApiKeySection = () => {
    const el = document.getElementById("api-key-activation-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToForm = () => {
    if (!isApiKeyVerified) {
      scrollToApiKeySection();
      return;
    }
    const el = document.getElementById("input-form-card");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#F8FAFC] text-slate-900 font-sans min-h-screen">
      {/* Top Banner Notice */}
      <div className="bg-[#091D42] text-blue-100 text-xs py-2 px-4 border-b border-blue-900/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="font-semibold text-white">2026 이공계 채용 평가 트렌드 완벽 적용</span>
            <span className="hidden md:inline text-blue-400/60">|</span>
            <span className="hidden md:inline text-blue-200/90">대학일자리플러스센터 AI 수석 컨설턴트 검증</span>
          </div>
          <div className="flex items-center gap-2">
            {isApiKeyVerified ? (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> API Key 승인됨 (모든 메뉴 활성화)
              </span>
            ) : (
              <button
                onClick={scrollToApiKeySection}
                className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/30 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" /> API Key 미승인 (클릭하여 승인)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hero Container Section (Matching Reference Image Deep Royal Blue Card) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <section className="bg-gradient-to-br from-[#081738] via-[#0E2A66] to-[#0A1D42] text-white rounded-[28px] p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-blue-900/60">
          {/* Subtle Ambient Glow Effect */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header Navigation inside Hero Banner */}
          <nav className="flex items-center justify-between pb-8 border-b border-blue-800/50 relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                <FileSpreadsheet className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-extrabold tracking-tight text-white">
                    이공계 직무 포트폴리오 마스터
                  </h1>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    AI 컨설턴트
                  </span>
                </div>
                <p className="text-[11px] text-blue-200/80">대학일자리플러스센터 이공계 취업 솔루션</p>
              </div>
            </div>

            {/* Nav Menu Links */}
            <div className="hidden lg:flex items-center gap-8 text-xs font-semibold text-blue-100">
              <a href="#features" className="hover:text-white transition-colors">핵심 강점</a>
              <a href="#slide-structure" className="hover:text-white transition-colors">6장 슬라이드 구성</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">프로세스</a>
              <a href="#sample-presets" className="hover:text-white transition-colors">샘플 체험</a>
            </div>

            {/* Header CTA Pill Button (White Button matching reference image) */}
            <button
              onClick={scrollToForm}
              className="px-5 py-2.5 bg-white hover:bg-blue-50 text-[#091D42] font-bold text-xs rounded-full transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer group shrink-0"
            >
              <span>포트폴리오 생성하기</span>
              <div className="w-5 h-5 rounded-full bg-[#091D42] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          </nav>

          {/* Hero Content Body */}
          <div className="pt-10 pb-6 sm:py-14 max-w-4xl space-y-6 relative z-10">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-bold border border-white/15">
              <Building2 className="w-3.5 h-3.5 text-blue-300" />
              <span>기업 맞춤형 이공계 포트폴리오 초안 생성기</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.2] tracking-tight">
              막막했던 이공계 직무 포트폴리오,<br />
              <span className="text-blue-300 underline decoration-blue-400/40 underline-offset-8">3분만에 초안 완성!</span>
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-2xl font-normal">
              지원 기업과 직무의 핵심 요구사항을 분석하여, 제출하신 프로젝트 경험과 기술 스택을 
              <strong className="font-semibold text-white"> 기업 맞춤형 6장 슬라이드(1280x720px 표준)</strong>로 자동 기획·생성합니다.
            </p>

            {/* CTA Action Buttons (Matching image pill button design) */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={scrollToForm}
                className="px-7 py-4 bg-white hover:bg-blue-50 text-[#091D42] font-black text-sm rounded-full shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer group"
              >
                <span>내 정보 입력하고 작성 시작</span>
                <div className="w-6 h-6 rounded-full bg-[#091D42] text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              <button
                onClick={() => {
                  onSelectPreset(PRESET_SAMPLES[0]);
                  scrollToForm();
                }}
                disabled={isLoading}
                className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-full border border-white/25 transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-sm disabled:opacity-50"
              >
                <MousePointerClick className="w-4 h-4 text-blue-300" />
                <span>삼성전자 DS 샘플 불러오기</span>
              </button>
            </div>
          </div>

          {/* Bottom Hero Footnote Markers */}
          <div className="pt-6 border-t border-blue-800/40 flex items-center justify-between text-[11px] text-blue-200/70 font-mono">
            <span>Since 2026 • AI Portfolio Engine</span>
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors" onClick={scrollToForm}>
              <span>Scroll down to start</span>
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            </div>
          </div>
        </section>
      </div>

      {/* Main Page Body (Clean White Canvas) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* Section 1: Gemini API Key Activation & Verification Card */}
        <section>
          <ApiKeySection
            userApiKey={userApiKey}
            setUserApiKey={setUserApiKey}
            isVerified={isApiKeyVerified}
            setIsVerified={setIsApiKeyVerified}
          />
        </section>

        {/* Section 2: Stats & Achievements (Matching "We don't just handle accounting..." in image) */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-extrabold text-blue-700 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>ABOUT</span>
                <span className="text-slate-300">|</span>
                <span>2026 이공계 채용 평가</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                We don't just handle portfolio – <br className="hidden sm:inline" />
                <span className="text-[#1D4ED8]">we help your career grow!</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                대학일자리플러스센터 AI 수석 컨설턴트가 검증한 6장 비즈니스 슬라이드 기획 체계를 제공합니다.
              </p>
            </div>

            <button
              onClick={scrollToForm}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer self-start md:self-end"
            >
              <span>기획 시작하기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4 Key Stat Metrics Grid (Matching image large metric numbers) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#091D42] tracking-tight">1280×720</div>
              <div className="text-xs font-bold text-blue-700 mt-1">표준 슬라이드 규격</div>
              <div className="text-[11px] text-slate-500 mt-0.5">16:9 비즈니스 발표 비율</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#091D42] tracking-tight">100%</div>
              <div className="text-xs font-bold text-blue-700 mt-1">안티 헐루시네이션</div>
              <div className="text-[11px] text-slate-500 mt-0.5">100% 사실 기반 원칙 준수</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#091D42] tracking-tight">6장</div>
              <div className="text-xs font-bold text-blue-700 mt-1">직무 핏 최적화</div>
              <div className="text-[11px] text-slate-500 mt-0.5">6장 전용 스토리텔링 체계</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#091D42] tracking-tight">발표&PDF</div>
              <div className="text-xs font-bold text-blue-700 mt-1">내보내기 지원</div>
              <div className="text-[11px] text-slate-500 mt-0.5">전체화면 & PDF 즉시 출력</div>
            </div>
          </div>

          {/* Slide Mockup Feature Showcase Frame (Matching reference image photo showcase with floating callout cards) */}
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
            {/* Top Mockup Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="ml-2 text-slate-200 font-bold hidden sm:inline">Portfolio_Slide_Deck.html</span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 bg-blue-900 text-blue-200 rounded-full border border-blue-700">
                1280x720 Standard
              </span>
            </div>

            {/* Inner Preview Content */}
            <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="text-blue-400 font-bold">SLIDE 01 / 06 • Overview</span>
                  <span>지원 기업: <strong className="text-white">SK하이닉스</strong> | 직무: <strong className="text-white">양산기술</strong></span>
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  "공정 데이터 기반 수율 최적화 엔지니어"
                </h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-3 py-1 bg-slate-800 rounded-lg border border-slate-700 text-slate-300">
                    주요 도구: Python, Minitab, DOE
                  </span>
                  <span className="px-3 py-1 bg-amber-950/80 rounded-lg border border-amber-800 text-amber-300 font-bold">
                    [✍️ 확인 필요] 검증 마커
                  </span>
                </div>
              </div>

              {/* Floating Callout Badges on Right (Matching Image Floating Speech Cards) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="bg-white text-slate-900 p-4 rounded-2xl shadow-lg border border-slate-200 text-xs space-y-1">
                  <div className="font-extrabold text-[#091D42] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>대학일자리플러스센터 검증 레이아웃</span>
                  </div>
                  <p className="text-slate-600 leading-normal text-[11px]">
                    수직 계층 구조와 정돈된 여백으로 서류 검토 시 면접관의 시선 집중을 유도합니다.
                  </p>
                </div>

                <div className="bg-blue-900 text-blue-100 p-3.5 rounded-xl border border-blue-700 text-xs flex items-center justify-between">
                  <span className="font-bold">100% 사실 기반 검증 원칙</span>
                  <ShieldCheck className="w-4 h-4 text-blue-300" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Key Advantages Grid (Matching Section 3 Alternating Dark Blue & Powder Blue Cards in Image) */}
        <section id="features" className="space-y-8">
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-blue-700 uppercase tracking-widest px-3 py-1 rounded-full bg-blue-50 border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>SERVICE</span>
              <span className="text-slate-300">|</span>
              <span>SYSTEM ADVANTAGE</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              성공적인 서류 통과를 돕는 <span className="text-[#1D4ED8]">4가지 핵심 특징</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              이공계 직무 채용에 특화된 구조적 포트폴리오 기획 알고리즘을 적용합니다.
            </p>
          </div>

          {/* 4 Grid Cards in Alternating Royal Blue & Powder Blue (Matching exact Image Card colors!) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Deep Royal Blue */}
            <div className="bg-[#0D2A68] text-white p-6 rounded-2xl border border-blue-900 shadow-md flex flex-col justify-between space-y-4 hover:translate-y-[-2px] transition-transform">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center font-bold border border-white/20">
                  <Target className="w-5 h-5 text-blue-200" />
                </div>
                <h4 className="text-base font-extrabold text-white">1. 직무 가치사슬 분석</h4>
                <p className="text-xs text-blue-100/80 leading-relaxed font-normal">
                  지원 기업과 직무의 핵심 R&D/양산 공정에 맞추어 학생의 공학적 해결 능력을 강조합니다.
                </p>
              </div>
              <div className="text-[10px] font-mono text-blue-300/70 border-t border-blue-800/80 pt-2">
                VALUE CHAIN ANALYTICS
              </div>
            </div>

            {/* Card 2: Soft Powder Blue */}
            <div className="bg-[#EBF2FA] text-slate-900 p-6 rounded-2xl border border-blue-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:translate-y-[-2px] transition-transform">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <Presentation className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900">2. 1280x720px 규격</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  비즈니스 발표 표준 비율(16:9)로 패키징하여 면접 시 즉시 활용 가능한 프리젠테이션 슬라이드를 생성합니다.
                </p>
              </div>
              <div className="text-[10px] font-mono text-blue-700/70 border-t border-blue-200 pt-2">
                STANDARD 16:9 DECK
              </div>
            </div>

            {/* Card 3: Deep Royal Blue */}
            <div className="bg-[#0D2A68] text-white p-6 rounded-2xl border border-blue-900 shadow-md flex flex-col justify-between space-y-4 hover:translate-y-[-2px] transition-transform">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center font-bold border border-white/20">
                  <ShieldCheck className="w-5 h-5 text-blue-200" />
                </div>
                <h4 className="text-base font-extrabold text-white">3. 사실 기반 검증 마커</h4>
                <p className="text-xs text-blue-100/80 leading-relaxed font-normal">
                  제공되지 않은 정량 수치는 임의 창작하지 않으며 노란색 확인 마커로 표시하여 안전성을 유지합니다.
                </p>
              </div>
              <div className="text-[10px] font-mono text-blue-300/70 border-t border-blue-800/80 pt-2">
                ANTI-HALLUCINATION
              </div>
            </div>

            {/* Card 4: Soft Powder Blue */}
            <div className="bg-[#EBF2FA] text-slate-900 p-6 rounded-2xl border border-blue-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:translate-y-[-2px] transition-transform">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900">4. 발표 & PDF 내보내기</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  전체화면 발표 모드, 실시간 마커 수정, HTML 코드 복사 및 PDF 파일 저장을 원스톱 지원합니다.
                </p>
              </div>
              <div className="text-[10px] font-mono text-blue-700/70 border-t border-blue-200 pt-2">
                EXPORT & PRESENTATION
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: 6-Slide Blueprint Breakdown */}
        <section id="slide-structure" className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              SLIDE BLUEPRINT
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              자동 기획되는 6장 슬라이드 청사진
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              면접관이 한눈에 가독할 수 있도록 정제된 6단계 스토리텔링 구조입니다.
            </p>
          </div>

          {/* Slide Tab Controls */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {slideStructure.map((slide, idx) => {
              const IconComp = slide.icon;
              const isActive = activeSlideTab === idx;
              return (
                <button
                  key={slide.num}
                  onClick={() => setActiveSlideTab(idx)}
                  className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#0D2A68] border-[#0D2A68] text-white shadow-md"
                      : "bg-[#F8FAFC] border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-black ${isActive ? "text-blue-300" : "text-blue-700"}`}>
                      SLIDE {slide.num}
                    </span>
                    <IconComp className="w-4 h-4 opacity-80" />
                  </div>
                  <div className="text-xs font-bold truncate">{slide.title}</div>
                </button>
              );
            })}
          </div>

          {/* Active Tab Detail Display */}
          <div className="bg-[#F8FAFC] p-6 sm:p-8 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-[#0D2A68] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {slideStructure[activeSlideTab].num}
                </span>
                <div>
                  <h4 className="text-lg font-extrabold text-slate-900">
                    Slide {slideStructure[activeSlideTab].num}. {slideStructure[activeSlideTab].title}
                  </h4>
                  <p className="text-xs font-semibold text-blue-700">{slideStructure[activeSlideTab].subtitle}</p>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {slideStructure[activeSlideTab].desc}
              </p>

              <div className="pt-2 flex flex-wrap gap-2">
                {slideStructure[activeSlideTab].details.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-white text-slate-800 border border-slate-200 shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 bg-[#0D2A68] text-white p-6 rounded-2xl border border-blue-900 space-y-3 shadow-md">
              <div className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                컨설턴트의 슬라이드 기획 포인트
              </div>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                이 슬라이드는 제출하신 경험 데이터가 직무 핵심 역량으로 연결되도록 시각적 프레임으로 구성됩니다.
              </p>
              <button
                onClick={scrollToForm}
                className="w-full py-2.5 px-3 bg-white hover:bg-blue-50 text-[#0D2A68] text-xs font-extrabold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>이 구성으로 기획 시작하기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* Section 5: Preset Quick Test Bar */}
        <section id="sample-presets">
          <div className="bg-gradient-to-r from-[#081738] via-[#0E2A66] to-[#0A1D42] p-6 sm:p-10 rounded-3xl text-white flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl border border-blue-900">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-300 text-xs font-bold">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>1-Click 예시 불러오기</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold">직접 작성하지 않고도 1초 만에 슬라이드를 체험해보세요</h3>
              <p className="text-xs text-blue-200/80 max-w-lg">
                원하는 기업과 직무 샘플을 선택하면 관련 경험 및 키워드가 자동 세팅됩니다.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto shrink-0">
              {PRESET_SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  disabled={isLoading}
                  onClick={() => {
                    onSelectPreset({
                      company: sample.company,
                      job: sample.job,
                      keywords: sample.keywords,
                      experience: sample.experience,
                      profile: sample.profile,
                    });
                    scrollToForm();
                  }}
                  className="px-4 py-3 text-left bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all cursor-pointer disabled:opacity-50 backdrop-blur-xs"
                >
                  <div className="text-[10px] text-blue-300 font-bold truncate">{sample.company}</div>
                  <div className="text-xs font-extrabold truncate text-white">{sample.job}</div>
                </button>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};
