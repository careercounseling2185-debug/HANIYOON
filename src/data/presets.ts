import { PresetSample } from "../types";

export const PRESET_SAMPLES: PresetSample[] = [
  {
    id: "semiconductor",
    title: "⚡ 삼성전자 DS 메모리 공정기술",
    company: "삼성전자 DS부문",
    job: "메모리 공정기술 엔지니어",
    keywords: "SiWafer 식각 공정 수율 최적화, 데이터 기반 산화막 불량 규명, Plackett-Burman DOE, Python & Minitab 공정 분석",
    experience: "[프로젝트명: SiWafer 식각 공정 패턴 미세화 및 산화막 불량 저감 과제]\n- 역할: 공정 파라미터 데이터 분석 및 DOE 실험 설계 담당\n- 해결과정: 1) 공정 센서 로그 및 가스 유량 데이터 파싱 2) Plackett-Burman 변수 선별 기법으로 불량 주요 요인 3가지(가스 압력, RF Power, 플라즈마 온도) 도출 3) 반응표면분석법(RSM)으로 최적 공정 윈도우 수립\n- 성과: 불량 발생률 감소 [✍️ 확인 필요: 예) 불량률 14.2% 개선], Cpk 공정능력지수 향상 [✍️ 확인 필요: 예) 1.12 -> 1.48 달성]\n- 사용 툴: Python (Pandas/SciPy), Minitab, OriginLab",
    profile: "한국대학교 전자공학과 4학년 / 정보처리기사, ADsP, OIC / OPIC AL / GitHub: github.com/semi-hong / 지원자: 홍길동",
  },
  {
    id: "battery",
    title: "🔋 LG에너지솔루션 배터리 셀 개발",
    company: "LG에너지솔루션",
    job: "차세대 배터리 셀 R&D 엔지니어",
    keywords: "양극재 코팅 균일성 개선, 열화 모니터링, 데이터 기반 잔존 수명(SOH) 예측, EIS 임피던스 분석",
    experience: "[프로젝트명: 하이엔드 양극재 믹싱 공정 코팅 두께 편차 개선 및 열화 특성 분석]\n- 역할: 슬러리 점도 및 코팅 스피드 연계 데이터 수집과 임피던스(EIS) 스펙트럼 분석\n- 해결과정: 1) 점도 변동성에 따른 미세 기포 발생 원인 탐색 2) 점도지수 제어 가이드라인 수립 및 인라인 모니터링 시스템 제안 3) 충방전 사이클 데이터 기반 잔존 수명 모델 구현\n- 성과: 셀 내부 저항 산차 감소 [✍️ 확인 필요: 예) 저항 산포 22% 감소], 사이클 수명 증가 [✍️ 확인 필요: 예) 1,000 사이클 보유 수율 88%]\n- 사용 툴: MATLAB, Python, Biologic EC-Lab, COMSOL MultiPhysics",
    profile: "서울공과대학교 화학공학과 4학년 / 화공기사, 화학분석기사 / 토익스피킹 IH (160) / 지원자: 이진우",
  },
  {
    id: "auto-sw",
    title: "🚗 현대자동차 차량 제어 SW",
    company: "현대자동차",
    job: "차량 제어 소프트웨어 개발 엔지니어",
    keywords: "AUTOSAR 클래식 제어 모듈, CAN/CAN-FD 통신, 제어 알고리즘 검증, HILs 시뮬레이션, C/C++",
    experience: "[프로젝트명: 차량 차선 유지 보조(LKA) 제어 로직 모듈 HILs 검증 및 제어 오차 개선]\n- 역할: C++ 기반 제어 알고리즘 리팩토링 및 HILs(Hardware-in-the-Loop) 테스터 검증 시나리오 구축\n- 해결과정: 1) CAN 통신 지연으로 인한 조향 응답 제어 지연 오차 식별 2) 칼만 필터 기반 위치 추정 보정 알고리즘 적용 3) ISO 26262 기능안전 기준 테스트 케이스 자동화 스크립트 작성\n- 성과: 제어 응답 시간 단축 [✍️ 확인 필요: 예) 응답 속도 35ms 단축], HILs 부하율 감소 [✍️ 확인 필요: 예) CPU 사용률 18% 절감]\n- 사용 툴: C/C++, Vector CANoe, MATLAB/Simulink, dSPACE HILs",
    profile: "대한대학교 컴퓨터공학과 4학년 / 정보처리기사 / 토익 890 / GitHub: github.com/auto-dev-park / 지원자: 박성준",
  },
  {
    id: "bio-qa",
    title: "🧪 삼성바이오로직스 품질보증 (QA)",
    company: "삼성바이오로직스",
    job: "바이오 의약품 품질보증(QA) 엔지니어",
    keywords: "cGMP 규정 준수, 배양 공정 데이터 타당성 검증(Validation), LIMS 시스템, 편차(Deviation) 관리",
    experience: "[프로젝트명: 동물세포 배양 공정 불순물 모니터링 데이터 밸리데이션 및 cGMP 가이드라인 입증]\n- 역할: 배양 배치(Batch) 모니터링 데이터 분석 및 Deviation 조사 보고서 작성\n- 해결과정: 1) 배양액 pH 및 용존산소량(DO) 불균일 지점 탐색 2) LIMS 연동 정밀 데이터 로깅 수립 3) Deviation 발생 시 Root Cause Analysis (5-Why, Fishbone Diagram) 수행\n- 성과: 보고서 승인 소요 기간 단축 [✍️ 확인 필요: 예) 결함 조사 기간 3일 -> 1일로 단축], 품질 표준 적합률 달성 [✍️ 확인 필요: 예) 적합률 99.8% 기록]\n- 사용 툴: LIMS, Empower 3, Minitab, MS Excel Advanced",
    profile: "중앙대학교 생명공학과 4학년 / 바이오분석기사 / 토익 920 / 지원자: 김민지",
  },
];
