export interface PortfolioInput {
  company: string;
  job: string;
  keywords: string;
  experience: string;
  profile: string;
}

export interface PortfolioResponse {
  isComplete: boolean;
  missingFields?: string[];
  message?: string;
  companyAnalysisSummary?: string;
  htmlCode?: string;
  studentNotes?: string;
}

export interface PresetSample {
  id: string;
  title: string;
  company: string;
  job: string;
  keywords: string;
  experience: string;
  profile: string;
}

export interface MetricMarker {
  id: string;
  originalText: string;
  label: string;
  userValue: string;
}
