export function buildPortfolioPrompt(data: {
  company: string;
  job: string;
  keywords: string;
  experience: string;
  profile?: string;
}) {
  return `
당신은 대학일자리플러스센터 수석 취업 컨설턴트이자 2026 이공계열 채용 시장 전문가입니다.
다음 사용자 입력 데이터를 바탕으로 이공계 직무 핏 중심의 6장 포트폴리오 초안을 생성하세요.

[사용자 입력 정보]
- 지원 기업: ${data.company}
- 지원 직무: ${data.job}
- 핵심 직무 역량 키워드: ${data.keywords}
- 주요 프로젝트 경험 및 기술 스택: ${data.experience}
- 프로필 정보 및 링크: ${data.profile || "기본 프로필"}

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
}
