import React, { useState, useRef, useEffect } from "react";
import {
  Code2,
  Eye,
  Copy,
  Check,
  Download,
  Printer,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  PenTool,
  Layers,
  Sparkles,
} from "lucide-react";

interface SlideViewerProps {
  htmlCode: string;
  onUpdateHtml: (newHtml: string) => void;
  companyName: string;
  jobName: string;
}

export const SlideViewer: React.FC<SlideViewerProps> = ({
  htmlCode,
  onUpdateHtml,
  companyName,
  jobName,
}) => {
  const [activeTab, setActiveTab] = useState<"preview" | "code" | "markers">("preview");
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(0.75);
  const containerRef = useRef<HTMLDivElement>(null);

  // Markers state
  const [markers, setMarkers] = useState<{ original: string; value: string; label: string }[]>([]);

  // Parse [✍️ 확인 필요: ...] markers from HTML
  useEffect(() => {
    if (!htmlCode) return;
    const regex = /\[✍️ 확인 필요:[^\]]+\]/g;
    const matches = Array.from(new Set(htmlCode.match(regex) || [])) as string[];
    setMarkers(
      matches.map((m: string) => ({
        original: m,
        value: "",
        label: m.replace("[✍️ 확인 필요:", "").replace("]", "").trim(),
      }))
    );
  }, [htmlCode]);

  // Handle responsive scale calculation for 1280x720 aspect ratio
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth - 32; // account for padding
        const newScale = Math.min(Math.max(containerWidth / 1280, 0.4), 1.0);
        setScale(newScale);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeTab]);

  const slideTitles = [
    "Slide 1: Overview (표지)",
    "Slide 2: Profile (프로필)",
    "Slide 3: Core Competencies (역량)",
    "Slide 4: Key Project (핵심 프로젝트)",
    "Slide 5: Additional Experience (추가 활동)",
    "Slide 6: Action Plan & Vision (입사후 포부)",
  ];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio_${companyName}_${jobName}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlCode);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const handleApplyMarkers = () => {
    let updated = htmlCode;
    markers.forEach((m) => {
      if (m.value.trim() !== "") {
        // Replace the marker tag or text with confirmed user value
        updated = updated.split(m.original).join(m.value.trim());
      }
    });
    onUpdateHtml(updated);
    setActiveTab("preview");
  };

  // Fullscreen presentation trigger
  const toggleFullscreen = () => {
    const el = document.getElementById("slide-fullscreen-area");
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header Bar & Tab Switcher */}
      <div className="bg-[#0D2A68] text-white p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-blue-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-300" />
              2. 6장 포트폴리오 HTML 슬라이드 (1280x720px)
            </h2>
          </div>
          <p className="text-xs text-blue-200/80 mt-1">
            비즈니스 프리젠테이션 규격 (1280x720px, 딥 네이비 #1B2A4A, Pretendard CDN, 푸터 표준)
          </p>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1.5 bg-black/20 p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "preview"
                ? "bg-white text-[#0D2A68] shadow-sm"
                : "text-blue-100 hover:text-white hover:bg-white/10"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            슬라이드 프리뷰
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "code"
                ? "bg-white text-[#0D2A68] shadow-sm"
                : "text-blue-100 hover:text-white hover:bg-white/10"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            HTML 코드 보기
          </button>
          <button
            onClick={() => setActiveTab("markers")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "markers"
                ? "bg-amber-400 text-amber-950 shadow-sm"
                : "text-blue-100 hover:text-white hover:bg-white/10"
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            [✍️확인필요] 수정 ({markers.length})
          </button>
        </div>
      </div>

      {/* Main Actions Bar */}
      <div className="bg-[#F8FAFC] border-b border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {activeTab === "preview" && (
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
              <button
                onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                disabled={currentSlideIndex === 0}
                className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                title="이전 슬라이드"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-black text-slate-800">
                {currentSlideIndex + 1} / 6 페이지
              </span>
              <button
                onClick={() => setCurrentSlideIndex(Math.min(5, currentSlideIndex + 1))}
                disabled={currentSlideIndex === 5}
                className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                title="다음 슬라이드"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
          <span className="text-slate-600 font-bold hidden sm:inline">
            {slideTitles[currentSlideIndex]}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-bold">복사됨!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>코드 복사</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>HTML 다운로드</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors flex items-center gap-1.5 hidden md:flex cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>인쇄 / PDF</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="px-3.5 py-2 bg-[#0D2A68] hover:bg-[#081738] text-white font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>전체 화면</span>
          </button>
        </div>
      </div>

      {/* Tab Content 1: Slide Preview */}
      {activeTab === "preview" && (
        <div ref={containerRef} className="p-4 sm:p-6 bg-slate-900 min-h-[600px] flex flex-col items-center justify-center overflow-x-auto">
          {/* Slide Selector Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-6 max-w-4xl">
            {slideTitles.map((title, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentSlideIndex === idx
                    ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-300"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {idx + 1}. {title.split(":")[1].split("(")[0].trim()}
              </button>
            ))}
          </div>

          {/* Scaled 1280x720 Slide Frame Container */}
          <div
            id="slide-fullscreen-area"
            className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center shadow-2xl relative"
            style={{ width: "100%", maxWidth: "1320px" }}
          >
            <div
              className="origin-top transition-transform duration-200 overflow-hidden rounded-xl shadow-2xl bg-white"
              style={{
                width: "1280px",
                height: "720px",
                transform: `scale(${isFullscreen ? 1 : scale})`,
                marginBottom: isFullscreen ? 0 : `-${720 * (1 - scale)}px`,
              }}
            >
              <iframe
                title="Slide Preview"
                srcDoc={getSingleSlideHtml(htmlCode, currentSlideIndex)}
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Raw Code View */}
      {activeTab === "code" && (
        <div className="p-4 sm:p-6 bg-slate-950 font-mono text-xs text-slate-200 overflow-x-auto max-h-[700px]">
          <div className="flex items-center justify-between mb-3 text-slate-400 pb-2 border-b border-slate-800">
            <span>Standard HTML Code Document</span>
            <span>{htmlCode.length.toLocaleString()} Characters</span>
          </div>
          <pre className="whitespace-pre-wrap font-mono leading-relaxed text-slate-300 bg-slate-900/90 p-4 rounded-xl border border-slate-800/80">
            {htmlCode}
          </pre>
        </div>
      )}

      {/* Tab Content 3: Marker Autofill Helper */}
      {activeTab === "markers" && (
        <div className="p-6 bg-[#F8FAFC] min-h-[500px]">
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 text-amber-800 font-bold">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3>[✍️ 확인 필요] 마커 실무 데이터 채우기 (Anti-Hallucination)</h3>
            </div>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              AI가 생성한 포트폴리오 초안에서 수치가 비어있는 위치를 찾아냈습니다. 
              본인의 실제 경험 수치(예: 18.5% 불량 감소, 3.2일 단축 등)를 아래 입력란에 채우면 HTML 슬라이드에 즉시 반영됩니다.
            </p>

            {markers.length === 0 ? (
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200 text-xs font-semibold text-center">
                ✅ 현재 [✍️ 확인 필요] 마커가 없거나 모두 채워진 상태입니다.
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                {markers.map((m, idx) => (
                  <div key={idx} className="bg-amber-50/60 p-4 rounded-xl border border-amber-200">
                    <label className="block text-xs font-bold text-amber-900 mb-1.5">
                      항목 #{idx + 1}: <code className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold">{m.original}</code>
                    </label>
                    <input
                      type="text"
                      value={m.value}
                      onChange={(e) => {
                        const newVals = [...markers];
                        newVals[idx].value = e.target.value;
                        setMarkers(newVals);
                      }}
                      placeholder={`실제 성과 수치 입력 (예: ${m.label || "불량률 15% 감소"})`}
                      className="w-full px-4 py-2.5 text-sm bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-medium text-slate-900"
                    />
                  </div>
                ))}
              </div>
            )}

            {markers.length > 0 && (
              <button
                onClick={handleApplyMarkers}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black text-sm transition-colors shadow-md cursor-pointer"
              >
                수정된 수치를 HTML 슬라이드에 적용하기
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper to isolate individual slide from document for rendering in iframe
function getSingleSlideHtml(fullHtml: string, slideIndex: number): string {
  if (!fullHtml) return "";

  const parser = new DOMParser();
  const doc = parser.parseFromString(fullHtml, "text/html");
  const slides = doc.querySelectorAll(".slide-container");

  if (slides.length > slideIndex) {
    const targetSlide = slides[slideIndex].outerHTML;
    const headContent = doc.head ? doc.head.innerHTML : "";
    const styleContent = doc.querySelector("style") ? doc.querySelector("style")!.outerHTML : "";

    return `<!DOCTYPE html>
<html lang="ko">
<head>
  ${headContent}
  ${styleContent}
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #FFFFFF;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 1280px;
      height: 720px;
      overflow: hidden;
      font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
    }
    .slide-container {
      margin-bottom: 0 !important;
      border: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
    }
  </style>
</head>
<body>
  ${targetSlide}
</body>
</html>`;
  }

  return fullHtml;
}
