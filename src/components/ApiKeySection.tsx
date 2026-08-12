import React, { useState } from "react";
import {
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ExternalLink,
  RefreshCw,
  Sparkles
} from "lucide-react";

interface ApiKeySectionProps {
  userApiKey: string;
  setUserApiKey: (key: string) => void;
  isVerified: boolean;
  setIsVerified: (verified: boolean) => void;
}

export const ApiKeySection: React.FC<ApiKeySectionProps> = ({
  userApiKey,
  setUserApiKey,
  isVerified,
  setIsVerified,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const handleVerify = async () => {
    if (!userApiKey.trim()) {
      setStatusMessage({
        type: "error",
        text: "API Key를 입력해 주세요.",
      });
      return;
    }

    setIsChecking(true);
    setStatusMessage({
      type: "info",
      text: "Google Gemini API 서버와 통신하여 유효성을 확인하는 중입니다...",
    });

    try {
      const res = await fetch("/api/verify-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userApiKey: userApiKey.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsVerified(true);
        setStatusMessage({
          type: "success",
          text: "🎉 Gemini API Key 승인 완료! 모든 메뉴 및 6장 포트폴리오 생성 기능이 즉시 활성화되었습니다.",
        });

        // Auto scroll to form after 1 second
        setTimeout(() => {
          const el = document.getElementById("input-form-card");
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 1000);
      } else {
        setIsVerified(false);
        setStatusMessage({
          type: "error",
          text: data.error || "API Key 승인에 실패했습니다. 키를 다시 확인해 주세요.",
        });
      }
    } catch (err) {
      setIsVerified(false);
      setStatusMessage({
        type: "error",
        text: "네트워크 통신 오류로 API Key 검증을 완료하지 못했습니다.",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleReset = () => {
    setUserApiKey("");
    setIsVerified(false);
    setStatusMessage(null);
  };

  return (
    <div
      id="api-key-activation-section"
      className="bg-gradient-to-br from-[#081738] via-[#0E2A66] to-[#0A1D42] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-blue-900 relative overflow-hidden"
    >
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-800/60 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs font-extrabold text-blue-300 uppercase tracking-widest">
                GEMINI API ACTIVATION
              </span>
              {isVerified && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                  승인 완료됨
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <KeyRound className="w-6 h-6 text-blue-300" />
              Gemini API Key 활성화 및 승인
            </h3>
            <p className="text-xs sm:text-sm text-blue-200/80">
              AI 포트폴리오 및 6장 슬라이드 생성을 위해 본인의 Google Gemini API Key를 입력하고 승인해 주세요.
            </p>
          </div>

          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white text-xs font-bold transition-all border border-white/15 backdrop-blur-xs self-start sm:self-auto shrink-0"
          >
            <span>Google AI Studio에서 무료 Key 발급</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Input & Approve Row */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <div className="relative flex-1">
              <input
                type={showPassword ? "text" : "password"}
                value={userApiKey}
                onChange={(e) => {
                  setUserApiKey(e.target.value);
                  if (isVerified) setIsVerified(false);
                }}
                placeholder="AIzaSy... (Google Gemini API Key 입력)"
                disabled={isChecking}
                className="w-full pl-4 pr-12 py-3.5 bg-slate-900/90 text-white placeholder-slate-400 border border-blue-700/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 font-mono text-sm shadow-inner transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors p-1 cursor-pointer"
                title={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={handleVerify}
              disabled={isChecking || !userApiKey.trim()}
              className={`px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-md ${
                isVerified
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                  : "bg-blue-600 hover:bg-blue-500 text-white disabled:bg-slate-800 disabled:text-slate-500 disabled:border disabled:border-slate-700 disabled:cursor-not-allowed"
              }`}
            >
              {isChecking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>유효성 확인 중...</span>
                </>
              ) : isVerified ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>승인 완료됨 (재검증)</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-blue-200" />
                  <span>유효성 확인 및 승인</span>
                </>
              )}
            </button>

            {userApiKey && (
              <button
                onClick={handleReset}
                disabled={isChecking}
                className="px-4 py-3.5 bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white rounded-2xl font-bold text-xs transition-colors border border-white/15 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                title="키 입력 초기화"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">초기화</span>
              </button>
            )}
          </div>

          {/* Alert Message Box */}
          {statusMessage && (
            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm font-medium flex items-start gap-3 border transition-all ${
                statusMessage.type === "success"
                  ? "bg-emerald-950/80 border-emerald-600/80 text-emerald-200"
                  : statusMessage.type === "error"
                  ? "bg-rose-950/80 border-rose-700/80 text-rose-200"
                  : "bg-blue-950/80 border-blue-700/80 text-blue-200"
              }`}
            >
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : statusMessage.type === "error" ? (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-bold">{statusMessage.text}</p>
                {statusMessage.type === "error" && (
                  <p className="text-[11px] text-rose-300/90 leading-relaxed">
                    💡 팁: Google AI Studio(aistudio.google.com)에서 발급받은 'AIzaSy...'로 시작하는 API Key를 복사해 붙여넣으셨는지 확인해 주세요.
                  </p>
                )}
                {statusMessage.type === "success" && (
                  <p className="text-[11px] text-emerald-300/90 leading-relaxed">
                    🎉 승인이 완료되었습니다! 아래 입력 폼에서 포트폴리오 정보를 입력하고 초안 생성을 시작하세요.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Security Notice Footer */}
        <div className="pt-3 border-t border-blue-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-blue-300/80 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400">🔒</span>
            <span>입력하신 API Key는 서버나 DB에 저장되지 않으며, 세션 종료 시 즉시 파기됩니다.</span>
          </div>
          <span className="text-blue-400/80">No-Storage Memory Policy</span>
        </div>
      </div>
    </div>
  );
};
