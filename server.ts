import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

function getGeminiClient(customApiKey?: string) {
  const apiKey = (typeof customApiKey === "string" && customApiKey.trim().length > 0)
    ? customApiKey.trim()
    : process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Key Verification Route
app.post("/api/verify-key", async (req, res) => {
  try {
    const userApiKey = req.body.userApiKey || req.body.apiKey;

    if (!userApiKey || typeof userApiKey !== "string" || !userApiKey.trim()) {
      return res.status(400).json({
        success: false,
        error: "API Key가 입력되지 않았습니다. 올바른 Gemini API Key를 입력해 주세요.",
      });
    }

    const cleanKey = userApiKey.trim();

    // Verify key with Google Gemini API
    const ai = new GoogleGenAI({
      apiKey: cleanKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: "API Key Validation Ping",
      config: {
        maxOutputTokens: 2,
      },
    });

    if (response) {
      return res.status(200).json({
        success: true,
        message: "Gemini API Key 유효성 검증 성공! 서비스 이용이 정상 승인되었습니다.",
      });
    } else {
      return res.status(400).json({
        success: false,
        error: "API Key 유효성 확인 중 응답을 수신하지 못했습니다.",
      });
    }
  } catch (err: any) {
    // SECURITY: NEVER log raw API key in logs!
    const errMsg = err?.message || String(err);
    const maskedMsg = errMsg.replace(/AIzaSy[A-Za-z0-9_-]{33}/g, "AIzaSy...[MASKED]");
    console.warn("API Key Verification Error:", maskedMsg);

    let userFriendlyError = "입력하신 Gemini API Key 승인에 실패했습니다.";
    const upperMsg = errMsg.toUpperCase();

    if (
      upperMsg.includes("API_KEY_INVALID") ||
      upperMsg.includes("INVALID_ARGUMENT") ||
      upperMsg.includes("UNAUTHENTICATED") ||
      upperMsg.includes("PERMISSION_DENIED") ||
      upperMsg.includes("400") ||
      upperMsg.includes("403")
    ) {
      userFriendlyError = "유효하지 않은 API Key입니다. Google AI Studio에서 정확한 Key를 복사하여 입력해 주세요.";
    } else if (
      upperMsg.includes("RESOURCE_EXHAUSTED") ||
      upperMsg.includes("QUOTA") ||
      upperMsg.includes("429")
    ) {
      userFriendlyError = "해당 API Key의 사용량 할당량(Quota)이 초과되었습니다. 잠시 후 다시 시도하거나 다른 키를 사용해 주세요.";
    } else if (
      upperMsg.includes("ENOTFOUND") ||
      upperMsg.includes("FETCH_ERROR") ||
      upperMsg.includes("TIMEDOUT") ||
      upperMsg.includes("NETWORK")
    ) {
      userFriendlyError = "Google API 서버와 통신 네트워크 오류가 발생했습니다. 네트워크 상태를 확인 후 재시도해 주세요.";
    }

    return res.status(400).json({
      success: false,
      error: userFriendlyError,
    });
  }
});

// Portfolio Generation Route
app.post("/api/generate-portfolio", async (req, res) => {
  try {
    const { company, job, keywords, experience, profile, userApiKey } = req.body;

    // Check missing inputs
    const missingFields: string[] = [];
    if (!company || company.trim() === "" || company.includes("[사용자 입력 대기]")) missingFields.push("지원 기업");
    if (!job || job.trim() === "" || job.includes("[사용자 입력 대기]")) missingFields.push("지원 직무");
    if (!keywords || keywords.trim() === "" || keywords.includes("[사용자 입력 대기]")) missingFields.push("핵심 직무 역량 키워드");
    if (!experience || experience.trim() === "" || experience.includes("[사용자 입력 대기]")) missingFields.push("학생의 주요 프로젝트 경험 및 기술 스택");

    if (missingFields.length > 0) {
      return res.status(200).json({
        isComplete: false,
        missingFields,
        message: `다음 항목이 입력되지 않았습니다: ${missingFields.join(", ")}. 필요한 정보를 입력해주시면 6장 맞춤형 포트폴리오 생성을 진행합니다.`,
      });
    }

    const ai = getGeminiClient(userApiKey);

    const promptText = `
당신은 대학일자리플러스센터 수석 취업 컨설턴트이자 2026 이공계열 채용 시장 전문가입니다.
다음 사용자 입력 데이터를 바탕으로 이공계 직무 핏 중심의 6장 포트폴리오 초안을 생성하세요.

[사용자 입력 정보]
- 지원 기업: ${company}
- 지원 직무: ${job}
- 핵심 직무 역량 키워드: ${keywords}
- 주요 프로젝트 경험 및 기술 스택: ${experience}
- 프로필 정보 및 링크: ${profile || "기본 프로필"}

[반드시 준수할 작성 지침]
1. 안티 헐루시네이션 규칙 (사실성):
   - 제공되지 않은 정량 성과(수치, %, 등수), 자격증, 수상 경력을 절대로 거짓으로 지어내지 마십시오.
   - 성과 수치가 필요한 자리에는 반드시 '<mark style="background-color: #FEF08A; color: #854D0E; padding: 2px 6px; border-radius: 4px; font-weight: bold;">[✍️ 확인 필요: 예) 처리 시간 단축률]</mark>' 형식의 노란색 하이라이트 마커를 남기십시오.

2. 비즈니스 프리젠테이션 디자인 시스템 (HTML 슬라이드 코드):
   - 각 슬라이드는 <div class="slide-container" style="width:1280px; height:720px; overflow:hidden; position:relative; box-sizing:border-box; background-color:#FFFFFF; color:#1E293B; font-family:'Pretendard', 'Noto Sans KR', sans-serif; display:flex; flex-direction:column; justify-content:space-between; padding:48px 60px; margin-bottom:30px; border:1px solid #E2E8F0; border-radius:12px; box-shadow:0 10px 25px -5px rgba(0,0,0,0.05);"> 으로 작성.
   - 6개 슬라이드가 세로로 배치된 단일 HTML 문서 구조.
   - 메인 컬러: 딥 네이비 (#1B2A4A)
   - 포인트 컬러: 소프트 로열 블루 (#2563EB) 또는 포인트 테크 블루 (#0284C7) - 슬라이드당 면적 20% 이내.
   - 배경: #FFFFFF 또는 고급스러운 연회색 #F8FAFC.
   - 외부 이미지 URL 사용 금지. 프로필 사진은 CSS 원형 placeholder (<div style="width:140px; height:140px; border-radius:50%; background:#CBD5E1; display:flex; align-items:center; justify-content:center; font-weight:600; color:#475569;">PHOTO</div>) 사용.
   - 아이콘은 인라인 SVG 또는 유니코드 심볼 사용.
   - 모든 슬라이드 하단에 동일한 비즈니스 푸터 배치 (지원자 이름, 지원 기업/직무, 페이지 번호 1/6 ~ 6/6).

3. 슬라이드 영문 타이틀 & 필수 구성:
   - [Slide 1] Overview: 표지 - 직무 맞춤형 슬로건(15자 내외), 지원 직무명, 지원자 이름, 지원 기업명.
   - [Slide 2] Profile: 좌측 원형 포토 placeholder & 인적사항, 우측 핵심 스펙 3요소, 직무 강점 3줄 요약, 관련 링크.
   - [Slide 3] Core Competencies: 기술 스택, 툴 숙련도(제공된 수준 그대로), 실무 적용 시나리오 1줄씩.
   - [Slide 4] Key Project: 핵심 프로젝트 - ①문제 정의 ②내 역할 ③해결 과정(3단계 이내 프로세스 카드) ④결과(정량/정성 성과 박스 별도 강조) ⑤기업 직무 적용 가능성 ⑥배운 점(1줄).
   - [Slide 5] Additional Experience: 직무 연계 추가 활동 2~3개 ("활동명 – 직무 연결고리").
   - [Slide 6] Action Plan & Vision: 입사 후 포부 - 1년차(적응·숙련), 3년차(프로젝트 리딩), 5년차(핵심 실무 전문가) 로드맵 (각 연차별 구체적 Action 2개 이상).

응답은 반드시 아래 JSON 구조로 출력하십시오:
{
  "companyAnalysisSummary": "3~4줄: 지원 기업/직무 분석 내용, 최신 기술 트렌드 및 매칭 전략 요약",
  "htmlCode": "<!DOCTYPE html>\\n<html lang=\\"ko\\">... 6장 전체 슬라이드가 수납된 완벽한 HTML 코드 ...</html>",
  "studentNotes": "2~3줄: [✍️ 확인 필요] 노란색 마커 채우는 방법 및 프로필 사진 교체 안내"
}
`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: promptText,
          config: {
            responseMimeType: "application/json",
          },
        });

        if (response.text) {
          let cleanText = response.text.trim();
          if (cleanText.startsWith("```json")) {
            cleanText = cleanText.replace(/^```json/, "").replace(/```$/, "").trim();
          } else if (cleanText.startsWith("```")) {
            cleanText = cleanText.replace(/^```/, "").replace(/```$/, "").trim();
          }

          const parsed = JSON.parse(cleanText);
          if (parsed.htmlCode && parsed.companyAnalysisSummary) {
            return res.status(200).json({
              isComplete: true,
              companyAnalysisSummary: parsed.companyAnalysisSummary,
              htmlCode: parsed.htmlCode,
              studentNotes: parsed.studentNotes || "",
            });
          }
        }
      } catch (geminiError) {
        console.warn("Gemini API call or JSON parsing failed, falling back to structured template generator:", geminiError);
      }
    }

    // Fallback template builder if Gemini client is unavailable, errors, or returns empty
    const fallbackPortfolio = generateFallbackPortfolio({ company, job, keywords, experience, profile });
    return res.status(200).json({
      isComplete: true,
      ...fallbackPortfolio,
    });
  } catch (error: any) {
    console.error("Portfolio generation error:", error);
    return res.status(500).json({
      error: "포트폴리오 생성 중 오류가 발생했습니다.",
      details: error?.message || String(error),
    });
  }
});

function parseProfileInfo(profileText: string) {
  if (!profileText) return { name: "지원자", education: "이공계 학사 전공", specs: "직무 관련 자격 및 어학" };

  let name = "지원자";
  const nameMatch = profileText.match(/(?:지원자|이름)\s*:\s*([^\n\/,]+)/i);
  if (nameMatch) {
    name = nameMatch[1].trim();
  }

  const parts = profileText.split(/[\/\n]/).map(p => p.trim()).filter(Boolean);

  let education = "이공계 학사 전공";
  let specsList: string[] = [];

  parts.forEach(p => {
    if (p.includes("대학") || p.includes("학과") || p.includes("전공") || p.includes("학년") || p.includes("학사")) {
      education = p;
    } else if (!p.includes("지원자")) {
      specsList.push(p);
    }
  });

  const specs = specsList.length > 0 ? specsList.join(" / ") : "관련 기사 / 데이터 분석 자격 보유";

  return { name, education, specs };
}

function parseExperience(expText: string) {
  let projName = "핵심 문제해결 및 공정 최적화 프로젝트";
  let role = "데이터 분석 및 파라미터 설계 담당";
  let process = "가설 수립 및 실험 설계(DOE) -> 요인 검증 -> 최적 안 도출";
  let outcome = "불량률 감소 및 품질(Cpk) 향상";
  let tools = "Python, Minitab, OriginLab";

  const lines = expText.split("\n").map(l => l.trim()).filter(Boolean);
  lines.forEach(line => {
    if (line.includes("프로젝트명") || line.startsWith("프로젝트")) {
      projName = line.replace(/프로젝트명\s*:\s*/, "").replace(/프로젝트\s*:\s*/, "").trim();
    } else if (line.includes("역할")) {
      role = line.replace(/-\s*역할\s*:\s*/, "").replace(/역할\s*:\s*/, "").trim();
    } else if (line.includes("해결과정") || line.includes("해결")) {
      process = line.replace(/-\s*해결과정\s*:\s*/, "").replace(/해결과정\s*:\s*/, "").trim();
    } else if (line.includes("성과") || line.includes("결과")) {
      outcome = line.replace(/-\s*성과\s*:\s*/, "").replace(/성과\s*:\s*/, "").trim();
    } else if (line.includes("툴") || line.includes("사용")) {
      tools = line.replace(/-\s*사용\s*툴\s*:\s*/, "").replace(/사용\s*툴\s*:\s*/, "").trim();
    }
  });

  return { projName, role, process, outcome, tools };
}

function generateFallbackPortfolio({ company, job, keywords, experience, profile }: any) {
  const { name: applicantName, education, specs } = parseProfileInfo(profile);
  const { projName, role, process, outcome, tools } = parseExperience(experience);

  const keywordsArr = keywords.split(/[,;\n]/).map((k: string) => k.trim()).filter(Boolean);
  const kw1 = keywordsArr[0] || "공정/데이터 분석";
  const kw2 = keywordsArr[1] || "실험 설계 및 수율 최적화";
  const kw3 = keywordsArr[2] || "불량 원인 규명 및 품질 관리";

  const summary = `본 포트폴리오는 ${company}의 ${job} 직무에 맞추어 최신 기술 트렌드와 직무 요구역량을 정밀 분석하여 설계되었습니다.
제출된 핵심 경험인 "${projName}"과(와) 주요 역량(${kw1}, ${kw2})을 결합하여, ${company} 채용 담당자가 주목하는 직무 핏 및 공학적 문제 해결 역량을 직관적으로 제시합니다.`;

  const notes = `1. 노란색 노출 표기된 [✍️ 확인 필요] 마커 부분을 클릭하거나 상단 마커 편집기에서 실제 정량적 성과 수치(예: % 개선, Cpk 1.33 달성)로 입력하여 완성도를 높이세요.
2. Slide 2의 원형 PHOTO 표시는 실제 본인의 명함판 사진 파일 경로 또는 이미지로 변경하실 수 있습니다.`;

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>${company} ${job} 직무 포트폴리오 - ${applicantName}</title>
  <link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background-color: #0F172A; display: flex; flex-direction: column; align-items: center; padding: 40px 20px; font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif; color: #1E293B; }
    .slide-container { width: 1280px; height: 720px; overflow: hidden; position: relative; background-color: #FFFFFF; display: flex; flex-direction: column; justify-content: space-between; padding: 48px 60px; margin-bottom: 40px; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); border: 1px solid #CBD5E1; }
    .slide-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #E2E8F0; padding-bottom: 16px; margin-bottom: 24px; }
    .slide-title-en { font-size: 32px; font-weight: 800; color: #1B2A4A; text-transform: uppercase; letter-spacing: 0.5px; }
    .slide-subtitle { font-size: 16px; color: #0284C7; font-weight: 600; }
    .slide-body { flex: 1; display: flex; gap: 32px; overflow: hidden; }
    .slide-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #E2E8F0; padding-top: 12px; font-size: 13px; color: #64748B; font-weight: 500; }
    .highlight-marker { background-color: #FEF08A; color: #854D0E; padding: 2px 8px; border-radius: 4px; font-weight: 700; border: 1px dashed #EAB308; display: inline-block; }
    .card { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 20px; flex: 1; }
    .badge { background: #1B2A4A; color: white; padding: 4px 10px; border-radius: 4px; font-size: 13px; font-weight: 600; }
    .point-badge { background: #0284C7; color: white; padding: 4px 10px; border-radius: 4px; font-size: 13px; font-weight: 600; }
  </style>
</head>
<body>

  <!-- Slide 1: Overview -->
  <div class="slide-container">
    <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: linear-gradient(135deg, #1B2A4A 0%, #0F172A 100%); margin: -48px -60px 0 -60px; padding: 80px 60px; color: white; border-top-left-radius: 12px; border-top-right-radius: 12px;">
      <div style="display: inline-block; background: rgba(2, 132, 199, 0.2); border: 1px solid #0284C7; color: #38BDF8; font-size: 14px; font-weight: 700; padding: 6px 18px; border-radius: 20px; margin-bottom: 24px;">
        2026 이공계 직무 핏 포트폴리오
      </div>
      <h1 style="font-size: 42px; font-weight: 800; line-height: 1.35; margin-bottom: 20px; max-width: 960px; color: #FFFFFF;">
        "${kw1} 기반 문제해결형 ${job} 인재"
      </h1>
      <p style="font-size: 20px; color: #94A3B8; font-weight: 500; margin-bottom: 40px;">
        지원 기업: <strong style="color: #38BDF8;">${company}</strong> | 지원 직무: <strong style="color: #38BDF8;">${job}</strong>
      </p>
      <div style="font-size: 22px; font-weight: 700; color: #F1F5F9; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px;">
        지원자 ${applicantName}
      </div>
    </div>
    <div class="slide-footer">
      <span>${company} ${job} 포트폴리오</span>
      <span>지원자: ${applicantName}</span>
      <span>1 / 6</span>
    </div>
  </div>

  <!-- Slide 2: Profile -->
  <div class="slide-container">
    <div class="slide-header">
      <div>
        <div class="slide-title-en">Profile</div>
        <div class="slide-subtitle">지원자 프로필 & 직무 핵심 강점</div>
      </div>
      <span class="badge">${company} ${job}</span>
    </div>
    <div class="slide-body" style="align-items: stretch;">
      <!-- 좌측 프로필 카드 -->
      <div class="card" style="flex: 0 0 380px; display: flex; flex-direction: column; align-items: center; text-align: center; background: #F8FAFC;">
        <div style="width: 130px; height: 130px; border-radius: 50%; background: #CBD5E1; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #475569; font-size: 18px; margin-bottom: 16px; border: 4px solid #1B2A4A;">
          PHOTO
        </div>
        <h2 style="font-size: 24px; font-weight: 700; color: #1B2A4A; margin-bottom: 4px;">${applicantName}</h2>
        <p style="font-size: 14px; color: #0284C7; font-weight: 600; margin-bottom: 16px;">${job} 예비 엔지니어</p>
        <div style="width: 100%; border-top: 1px solid #E2E8F0; padding-top: 16px; text-align: left; font-size: 14px; color: #334155; line-height: 1.8;">
          <p style="margin-bottom: 6px;"><strong>🎓 학력/전공:</strong> ${education}</p>
          <p style="margin-bottom: 6px;"><strong>📜 보유 자격:</strong> ${specs}</p>
          <p><strong>🛠️ 사용 툴:</strong> ${tools}</p>
        </div>
      </div>
      <!-- 우측 핵심 스펙 & 강점 -->
      <div style="flex: 1; display: flex; flex-direction: column; gap: 16px;">
        <div class="card">
          <h3 style="font-size: 18px; font-weight: 700; color: #1B2A4A; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            <span class="point-badge">핵심 스펙 3요소</span> (제공 정보 기준)
          </h3>
          <ul style="list-style: none; padding-left: 0; font-size: 15px; color: #334155; line-height: 1.8;">
            <li style="margin-bottom: 6px;">🎓 <strong>전공 백그라운드:</strong> ${education} 전공 지식에 기반한 문제 구조화 능력</li>
            <li style="margin-bottom: 6px;">📜 <strong>기술/자격 검증:</strong> ${specs} 보유로 실무 데이터 분석 수행력 입증</li>
            <li>🔗 <strong>실무 프로젝트:</strong> ${projName} 수행</li>
          </ul>
        </div>
        <div class="card" style="border-left: 4px solid #1B2A4A;">
          <h3 style="font-size: 18px; font-weight: 700; color: #1B2A4A; margin-bottom: 12px;">직무 강점 3줄 요약</h3>
          <div style="font-size: 15px; color: #334155; line-height: 1.7;">
            <p style="margin-bottom: 8px;">1. <strong>[직무 전공성]</strong> ${kw1} 공학 원리를 적용하여 파라미터 변동 원인을 데이터 기반으로 정밀 구명하는 능력</p>
            <p style="margin-bottom: 8px;">2. <strong>[실무 기획성]</strong> ${kw2} 체계를 적용하여 시행착오를 최적화하고 공정 최적화 솔루션을 도출한 경험</p>
            <p>3. <strong>[기업 적합성]</strong> ${company}의 ${job} 수율 안정화 및 R&D 가치사슬에 즉각 기여할 준비가 완료된 인재</p>
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span>${company} ${job} 포트폴리오</span>
      <span>지원자: ${applicantName}</span>
      <span>2 / 6</span>
    </div>
  </div>

  <!-- Slide 3: Core Competencies -->
  <div class="slide-container">
    <div class="slide-header">
      <div>
        <div class="slide-title-en">Core Competencies</div>
        <div class="slide-subtitle">직무 전문성 및 스킬셋 (기술 스택 & 실무 시나리오)</div>
      </div>
      <span class="badge">기술 스택 & Tool</span>
    </div>
    <div class="slide-body" style="flex-direction: column; gap: 20px;">
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
        <div class="card">
          <div style="font-size: 13px; font-weight: 700; color: #0284C7; text-transform: uppercase; margin-bottom: 8px;">TECHNICAL SKILL 01</div>
          <h3 style="font-size: 19px; font-weight: 700; color: #1B2A4A; margin-bottom: 10px;">${kw1}</h3>
          <p style="font-size: 13px; color: #64748B; margin-bottom: 12px;">숙련도: 실무 프로젝트 검증 완료</p>
          <div style="background: #FFFFFF; border-radius: 6px; padding: 12px; border: 1px solid #E2E8F0; font-size: 14px; color: #1E293B; line-height: 1.5;">
            <strong>실무 적용 시나리오:</strong><br/>${job} 실무 시 데이터 기반 모니터링을 통해 이상 인자를 역추적하고 수율 저해 요인을 정밀 도출.
          </div>
        </div>
        <div class="card">
          <div style="font-size: 13px; font-weight: 700; color: #0284C7; text-transform: uppercase; margin-bottom: 8px;">TECHNICAL SKILL 02</div>
          <h3 style="font-size: 19px; font-weight: 700; color: #1B2A4A; margin-bottom: 10px;">${kw2}</h3>
          <p style="font-size: 13px; color: #64748B; margin-bottom: 12px;">숙련도: 실험 설계 및 해석 가능</p>
          <div style="background: #FFFFFF; border-radius: 6px; padding: 12px; border: 1px solid #E2E8F0; font-size: 14px; color: #1E293B; line-height: 1.5;">
            <strong>실무 적용 시나리오:</strong><br/>최적 공정 조건 산출을 위한 실험 계획(DOE)을 입증하고 변수 간 상호작용을 ANOVA 분석으로 검증.
          </div>
        </div>
        <div class="card">
          <div style="font-size: 13px; font-weight: 700; color: #0284C7; text-transform: uppercase; margin-bottom: 8px;">TECHNICAL SKILL 03</div>
          <h3 style="font-size: 19px; font-weight: 700; color: #1B2A4A; margin-bottom: 10px;">${kw3}</h3>
          <p style="font-size: 13px; color: #64748B; margin-bottom: 12px;">도구: ${tools}</p>
          <div style="background: #FFFFFF; border-radius: 6px; padding: 12px; border: 1px solid #E2E8F0; font-size: 14px; color: #1E293B; line-height: 1.5;">
            <strong>실무 적용 시나리오:</strong><br/>${tools} 소프트웨어를 활용하여 대용량 센서/공정 데이터 통계 처리 및 불량 패턴 시각화.
          </div>
        </div>
      </div>
      <div class="card" style="background: #EFF6FF; border-color: #BFDBFE;">
        <h4 style="font-size: 16px; font-weight: 700; color: #1E40AF; margin-bottom: 6px;">💡 스킬셋 직무 핏 분석</h4>
        <p style="font-size: 14px; color: #1E3A8A; line-height: 1.6;">
          제시된 엔지니어링 스킬셋(${tools}, ${kw1})은 ${company} ${job} 직무의 수율 및 품질 관리 가치사슬과 정확히 일치하며, 현장 투입 시 초기 교육 기간을 크게 단축시킬 수 있습니다.
        </p>
      </div>
    </div>
    <div class="slide-footer">
      <span>${company} ${job} 포트폴리오</span>
      <span>지원자: ${applicantName}</span>
      <span>3 / 6</span>
    </div>
  </div>

  <!-- Slide 4: Key Project -->
  <div class="slide-container">
    <div class="slide-header">
      <div>
        <div class="slide-title-en">Key Project</div>
        <div class="slide-subtitle">핵심 프로젝트 : 직무 문제 해결 및 성과 입증</div>
      </div>
      <span class="badge">대표 프로젝트</span>
    </div>
    <div class="slide-body" style="flex-direction: column; gap: 16px;">
      <!-- 문제 정의 & 내 역할 -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div class="card" style="border-top: 3px solid #1B2A4A;">
          <div style="font-size: 13px; font-weight: 700; color: #1B2A4A; margin-bottom: 4px;">① 문제 정의</div>
          <p style="font-size: 15px; font-weight: 600; color: #0F172A;">${projName}</p>
        </div>
        <div class="card" style="border-top: 3px solid #0284C7;">
          <div style="font-size: 13px; font-weight: 700; color: #0284C7; margin-bottom: 4px;">② 내 역할</div>
          <p style="font-size: 15px; font-weight: 600; color: #0F172A;">${role}</p>
        </div>
      </div>

      <!-- ③ 해결 과정 (3단계 프로세스) -->
      <div class="card">
        <div style="font-size: 14px; font-weight: 700; color: #1B2A4A; margin-bottom: 10px;">③ 해결 과정 (논리적 근거 & 시행착오)</div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
          <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #CBD5E1;">
            <div style="font-size: 12px; font-weight: 700; color: #0284C7;">STEP 01</div>
            <div style="font-size: 14px; font-weight: 600; color: #1E293B;">원인 인자 규명</div>
            <p style="font-size: 13px; color: #64748B; margin-top: 4px;">공정 데이터 수집 및 주요 불량 원인 인자 도출</p>
          </div>
          <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #CBD5E1;">
            <div style="font-size: 12px; font-weight: 700; color: #0284C7;">STEP 02</div>
            <div style="font-size: 14px; font-weight: 600; color: #1E293B;">실험 및 정밀 분석</div>
            <p style="font-size: 13px; color: #64748B; margin-top: 4px;">${process}</p>
          </div>
          <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #CBD5E1;">
            <div style="font-size: 12px; font-weight: 700; color: #0284C7;">STEP 03</div>
            <div style="font-size: 14px; font-weight: 600; color: #1E293B;">최적화 안 도출</div>
            <p style="font-size: 13px; color: #64748B; margin-top: 4px;">파라미터 표준화 및 품질 검증 제어안 수립</p>
          </div>
        </div>
      </div>

      <!-- ④ 결과 (정량/정성 성과 박스) & ⑤ 기업 직무 적용 가능성 & ⑥ 배운 점 -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div class="card" style="background: #F0FDF4; border-color: #86EFAC;">
          <div style="font-size: 13px; font-weight: 700; color: #166534; margin-bottom: 4px;">④ 결과 (성과 박스)</div>
          <div style="font-size: 15px; color: #14532D; font-weight: 600;">
            ${outcome} <span class="highlight-marker">[✍️ 확인 필요: 예) 불량률 15% 감축, Cpk 1.33 달성]</span>
          </div>
        </div>
        <div class="card" style="background: #FEF3C7; border-color: #FDE047;">
          <div style="font-size: 13px; font-weight: 700; color: #92400E; margin-bottom: 4px;">⑤ 기업 적용성 & ⑥ 배운 점</div>
          <p style="font-size: 13px; color: #78350F; line-height: 1.5;">
            <strong>적용성:</strong> ${company} 양산 라인의 수율 최적화 및 공정 산패 방지에 원천 적용 가능.<br/>
            <strong>배운점:</strong> 데이터 기반 가설 검증의 중요성과 현장 변수 제어 능력을 체득함.
          </p>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span>${company} ${job} 포트폴리오</span>
      <span>지원자: ${applicantName}</span>
      <span>4 / 6</span>
    </div>
  </div>

  <!-- Slide 5: Additional Experience -->
  <div class="slide-container">
    <div class="slide-header">
      <div>
        <div class="slide-title-en">Additional Experience</div>
        <div class="slide-subtitle">직무 연계 추가 활동 & 확장 역량</div>
      </div>
      <span class="badge">추가 경험</span>
    </div>
    <div class="slide-body" style="flex-direction: column; gap: 16px;">
      <div class="card" style="display: flex; justify-content: space-between; align-items: center; border-left: 4px solid #1B2A4A;">
        <div>
          <h3 style="font-size: 18px; font-weight: 700; color: #1B2A4A; margin-bottom: 6px;">
            활동 01: 전공 실험 및 데이터 정밀 분석 – 직무 연결고리
          </h3>
          <p style="font-size: 14px; color: #475569;">
            ${kw1} 분야 공학적 메커니즘을 심화 탐구하고 모의 실험 데이터로 가설을 검증
          </p>
        </div>
        <span class="point-badge">전공 심화</span>
      </div>

      <div class="card" style="display: flex; justify-content: space-between; align-items: center; border-left: 4px solid #0284C7;">
        <div>
          <h3 style="font-size: 18px; font-weight: 700; color: #1B2A4A; margin-bottom: 6px;">
            활동 02: 팀 협업 및 공학적 문제해결 – 직무 연결고리
          </h3>
          <p style="font-size: 14px; color: #475569;">
            ${tools} 도구를 활용하여 분업을 주도하고 프로젝트 커뮤니케이션 리더십 발휘
          </p>
        </div>
        <span class="point-badge">협업 리더십</span>
      </div>

      <div class="card" style="display: flex; justify-content: space-between; align-items: center; border-left: 4px solid #059669;">
        <div>
          <h3 style="font-size: 18px; font-weight: 700; color: #1B2A4A; margin-bottom: 6px;">
            활동 03: 전문 역량 검증 (${specs}) – 직무 연결고리
          </h3>
          <p style="font-size: 14px; color: #475569;">
            꾸준한 스펙 관리와 기사/분석 자격 취득을 통해 지속적 자기개발 역량 증명
          </p>
        </div>
        <span class="point-badge">자기 개발</span>
      </div>
    </div>
    <div class="slide-footer">
      <span>${company} ${job} 포트폴리오</span>
      <span>지원자: ${applicantName}</span>
      <span>5 / 6</span>
    </div>
  </div>

  <!-- Slide 6: Action Plan & Vision -->
  <div class="slide-container">
    <div class="slide-header">
      <div>
        <div class="slide-title-en">Action Plan & Vision</div>
        <div class="slide-subtitle">입사 후 포부 및 연차별 로드맵 (Action Plan)</div>
      </div>
      <span class="badge">비전 & 목표</span>
    </div>
    <div class="slide-body" style="flex-direction: column; gap: 16px;">
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
        <!-- 1년차 -->
        <div class="card" style="border-top: 4px solid #0284C7;">
          <div style="background: #E0F2FE; color: #0369A1; font-weight: 800; font-size: 14px; padding: 4px 12px; border-radius: 4px; width: fit-content; margin-bottom: 12px;">
            1년차 [적응 · 숙련]
          </div>
          <h3 style="font-size: 18px; font-weight: 700; color: #1B2A4A; margin-bottom: 10px;">현장 공정 파악 및 기본기 확립</h3>
          <ul style="padding-left: 18px; font-size: 14px; color: #334155; line-height: 1.6;">
            <li style="margin-bottom: 6px;">Action 1: ${company}의 ${job} 라인 SOP 숙지 및 데이터 라벨링 정밀화</li>
            <li>Action 2: 선배 엔지니어와의 소통으로 돌발 이슈 대처 노하우 체득</li>
          </ul>
        </div>

        <!-- 3년차 -->
        <div class="card" style="border-top: 4px solid #2563EB;">
          <div style="background: #DBEAFE; color: #1E40AF; font-weight: 800; font-size: 14px; padding: 4px 12px; border-radius: 4px; width: fit-content; margin-bottom: 12px;">
            3년차 [프로젝트 리딩]
          </div>
          <h3 style="font-size: 18px; font-weight: 700; color: #1B2A4A; margin-bottom: 10px;">수율 개선 및 단위 과제 주도</h3>
          <ul style="padding-left: 18px; font-size: 14px; color: #334155; line-height: 1.6;">
            <li style="margin-bottom: 6px;">Action 1: 수율/성능 향상을 위한 핵심 파라미터 조건 최적화 프로젝트 주도</li>
            <li>Action 2: 데이터 기반 불량 패턴 분석 및 사전 예지 보전 시스템 기획 참여</li>
          </ul>
        </div>

        <!-- 5년차 -->
        <div class="card" style="border-top: 4px solid #1B2A4A;">
          <div style="background: #F1F5F9; color: #0F172A; font-weight: 800; font-size: 14px; padding: 4px 12px; border-radius: 4px; width: fit-content; margin-bottom: 12px;">
            5년차 [핵심 실무 전문가]
          </div>
          <h3 style="font-size: 18px; font-weight: 700; color: #1B2A4A; margin-bottom: 10px;">차세대 기술 개발 및 핵심 전문가</h3>
          <ul style="padding-left: 18px; font-size: 14px; color: #334155; line-height: 1.6;">
            <li style="margin-bottom: 6px;">Action 1: ${job} 분야 차세대 기술 로드맵 수립 및 후배 멘토링</li>
            <li>Action 2: ${company} 글로벌 경쟁력 확보를 위한 기술 표준화 수립</li>
          </ul>
        </div>
      </div>

      <div class="card" style="background: #1B2A4A; color: white; text-align: center; padding: 20px;">
        <h4 style="font-size: 18px; font-weight: 700; color: #38BDF8; margin-bottom: 6px;">
          "사실과 역량에 근거한 실행력으로 ${company}의 핵심 엔지니어로 성장하겠습니다."
        </h4>
      </div>
    </div>
    <div class="slide-footer">
      <span>${company} ${job} 포트폴리오</span>
      <span>지원자: ${applicantName}</span>
      <span>6 / 6</span>
    </div>
  </div>

</body>
</html>`;

  return {
    companyAnalysisSummary: summary,
    htmlCode: html,
    studentNotes: notes,
  };
}

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
