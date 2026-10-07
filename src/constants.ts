export const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxrsNwCQ4d-EczxzLRgmITkiyS_x1ff-D9_iyejomG68qs8ML_ymUbzJlWXjKLS1pHd/exec";

export interface Mission {
  id: string;
  title: string;
  description: string;
  guide: string;
  icon: "lock" | "sparkles" | "printer" | "monitor-check" | "shield-check";
}

export const MISSIONS: Mission[] = [
  {
    id: "M01",
    title: "잠깐 자리 비울 때도 LOCK!",
    description: "자리를 비우기 전 PC 화면을 잠가주세요.",
    guide: "Windows + L을 눌러 화면을 잠근 후 인증해주세요.",
    icon: "lock"
  },
  {
    id: "M02",
    title: "클린데스크 만들기",
    description: "업무공간에 개인정보나 중요자료가 방치되어 있지 않도록 정리해주세요.",
    guide: "정리가 완료된 업무공간을 촬영해주세요.",
    icon: "sparkles"
  },
  {
    id: "M03",
    title: "프린터 주변 점검",
    description: "프린터·복합기에 출력물이 방치되어 있지 않은지 확인해주세요.",
    guide: "출력물이 남아 있지 않은 상태를 인증해주세요.",
    icon: "printer"
  },
  {
    id: "M04",
    title: "내 PC 정보보호 점검",
    description: "내 PC에 불필요한 파일이나 개인정보 흔적이 남아 있지 않은지 점검해주세요.",
    guide: "점검 또는 정리를 완료한 화면을 인증해주세요.",
    icon: "monitor-check"
  },
  {
    id: "M05",
    title: "우리 팀의 정보보호 활동 자랑하기",
    description: "우리 팀에서 정보보호를 위해 실천하고 있는 모습을 자유롭게 찾아주세요.",
    guide: "정보보호를 위해 실제로 하고 있는 활동이나 환경을 촬영해주세요.",
    icon: "shield-check"
  }
];

export interface DepartmentCategory {
  category: string;
  items: string[];
}

export const DEPARTMENT_CATEGORIES: DepartmentCategory[] = [
  {
    category: "임상과",
    items: [
      "내과",
      "소화기내과",
      "순환기내과",
      "호흡기내과",
      "신장내과",
      "내분비내과",
      "혈액내과",
      "종양내과",
      "류마티스내과",
      "완화의학과",
      "신경과",
      "정신건강의학과",
      "외과",
      "정형외과",
      "신경외과",
      "심장혈관흉부외과",
      "성형외과",
      "마취통증의학과",
      "산부인과",
      "소아청소년과",
      "안과",
      "이비인후과",
      "피부과",
      "비뇨의학과",
      "영상의학과",
      "방사선종양학과",
      "핵의학과",
      "진단검사의학과",
      "병리과",
      "재활의학과",
      "가정의학과",
      "치과",
      "응급의학과"
    ]
  },
  {
    category: "전문센터 및 병원",
    items: [
      "통합내과 외래",
      "유방센터",
      "응급의료센터",
      "통원수술센터",
      "소화기센터",
      "뇌신경센터",
      "호흡기센터",
      "당뇨병갑상선센터",
      "척추 관절 통증 류마티스센터",
      "인공관절센터",
      "수부상지센터",
      "로봇수술센터",
      "건강증진센터",
      "안센터",
      "미세침습수술센터",
      "다발골수종센터",
      "뇌졸중센터",
      "안성형재건센터",
      "감염병검사센터",
      "암센터",
      "수술 전 협진",
      "니프로임신센터",
      "심장혈관병원",
      "장기이식병원"
    ]
  },
  {
    category: "진료지원",
    items: [
      "기능검사팀",
      "의무기록팀",
      "약제부",
      "영양팀",
      "진료협력센터"
    ]
  },
  {
    category: "행정부",
    items: [
      "기획팀",
      "홍보마케팅팀",
      "총무팀",
      "인사팀",
      "재무팀",
      "원무팀",
      "시설관리팀",
      "적정진료관리팀",
      "구매관리팀",
      "의공학팀",
      "정보보호팀",
      "PI팀",
      "고객행복팀"
    ]
  },
  {
    category: "연구지원",
    items: [
      "연구지원팀",
      "연구윤리사무국"
    ]
  },
  {
    category: "간호부",
    items: [
      "간호행정교육팀",
      "외래간호팀",
      "수술간호팀",
      "병동간호2팀"
    ]
  },
  {
    category: "외래/특수 Unit",
    items: [
      "인공신장실Unit",
      "외래간호A Unit",
      "외래간호B Unit",
      "분만실Unit",
      "신생아실Unit",
      "응급간호Unit",
      "신생아중환자실Unit",
      "내과중환자실Unit",
      "외과중환자실Unit",
      "심장계중환자실Unit",
      "신경계중환자실Unit",
      "고위험임산부 집중치료실Unit",
      "뇌졸중집중치료실Unit"
    ]
  },
  {
    category: "병동 Unit",
    items: [
      "62 Unit",
      "71 Unit",
      "72 Unit",
      "81 Unit",
      "82 Unit",
      "83 Unit",
      "91 Unit",
      "92 Unit",
      "102 Unit",
      "111 Unit",
      "112 Unit",
      "121 Unit",
      "122 Unit",
      "131 Unit",
      "132 Unit",
      "142 Unit",
      "152 Unit",
      "161 Unit",
      "162 Unit"
    ]
  }
];

export const DEPARTMENTS: string[] = Array.from(
  new Set(DEPARTMENT_CATEGORIES.flatMap((c) => c.items))
);
