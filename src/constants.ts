export const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxrsNwCQ4d-EczxzLRgmITkiyS_x1ff-D9_iyejomG68qs8ML_ymUbzJlWXjKLS1pHd/exec";


export interface Mission {
  id: string;

  /**
   * 카드에 크게 보이는 미션명
   */
  title: string;

  /**
   * 카드에 보이는 짧은 한 줄 설명
   */
  description: string;

  /**
   * 실제 수행 방법
   */
  guide: string;

  /**
   * 사진 인증 방법
   */
  verificationGuide: string;

  icon:
    | "lock"
    | "sparkles"
    | "printer"
    | "monitor-check"
    | "shield-check"
    | "trash"
    | "archive"
    | "eye"
    | "mail"
    | "file-check"
    | "door-closed"
    | "key-round";
}


export const MISSIONS: Mission[] = [
  {
    id: "M01",
    title: "잠그GO",
    description: "자리 비울 땐 PC 화면 잠금",
    guide:
      "자리를 비우기 전 Windows + L을 눌러 PC 화면을 잠가주세요.",
    verificationGuide:
      "잠금 처리된 PC 화면이 보이도록 촬영해주세요.",
    icon: "lock"
  },

  {
    id: "M02",
    title: "파쇄하GO",
    description: "불필요한 개인정보 문서는 바로 파쇄",
    guide:
      "업무가 끝난 개인정보 문서나 중요자료 중 더 이상 보관할 필요가 없는 문서는 일반 쓰레기통이 아닌 파쇄기를 이용해 폐기해주세요.",
    verificationGuide:
      "개인정보가 보이지 않도록 주의하면서 문서를 파쇄하는 모습이나 파쇄 완료 상태를 촬영해주세요.",
    icon: "trash"
  },

  {
    id: "M03",
    title: "회수하GO",
    description: "출력물은 프린터에 두지 않고 바로 회수",
    guide:
      "프린터·복합기 사용 후 출력물이 남아 있지 않은지 확인하고 본인이 출력한 자료는 즉시 회수해주세요.",
    verificationGuide:
      "출력물이 방치되어 있지 않은 프린터 또는 복합기 주변을 촬영해주세요.",
    icon: "printer"
  },

  {
    id: "M04",
    title: "치우GO",
    description: "책상 위 개인정보와 중요자료 정리",
    guide:
      "책상 위에 환자정보, 개인정보, 내부 업무자료 등이 방치되어 있지 않도록 정리하고 필요한 문서는 서랍이나 보관함에 보관해주세요.",
    verificationGuide:
      "개인정보가 노출되지 않도록 정리가 완료된 업무공간을 촬영해주세요.",
    icon: "sparkles"
  },

  {
    id: "M05",
    title: "보관하GO",
    description: "중요 문서는 잠금장이나 서랍에 보관",
    guide:
      "개인정보나 중요 업무자료는 사용 후 책상 위에 두지 말고 잠금장, 서랍 또는 지정된 보관함에 보관해주세요.",
    verificationGuide:
      "개인정보가 노출되지 않도록 주의하면서 문서가 보관된 잠금장이나 서랍의 상태를 촬영해주세요.",
    icon: "archive"
  },

  {
    id: "M06",
    title: "정리하GO",
    description: "PC에 남은 불필요한 업무파일 정리",
    guide:
      "다운로드 폴더, 바탕화면, 임시폴더 등에 불필요한 개인정보나 업무파일이 남아 있지 않은지 확인하고 정리해주세요.",
    verificationGuide:
      "환자정보나 개인정보가 노출되지 않는 범위에서 정리가 완료된 PC 화면을 촬영해주세요.",
    icon: "monitor-check"
  },

  {
    id: "M07",
    title: "확인하GO",
    description: "모니터에 개인정보가 노출되지 않는지 확인",
    guide:
      "자리에서 화면이 외부에 그대로 노출되어 있지 않은지 확인하고, 필요하지 않은 개인정보 화면은 닫거나 최소화해주세요.",
    verificationGuide:
      "개인정보가 노출되지 않은 안전한 업무 화면 또는 정리된 모니터 환경을 촬영해주세요.",
    icon: "eye"
  },

  {
    id: "M08",
    title: "지키GO",
    description: "비밀번호·계정정보 메모는 남기지 않기",
    guide:
      "모니터, 책상, 키보드 주변 등에 비밀번호나 계정정보를 적은 메모가 붙어 있지 않은지 확인하고 제거해주세요.",
    verificationGuide:
      "비밀번호 메모가 없는 정리된 업무공간을 촬영해주세요.",
    icon: "key-round"
  },

  {
    id: "M09",
    title: "가리GO",
    description: "개인정보 문서는 보이지 않게 뒤집거나 보관",
    guide:
      "잠시 자리를 비울 때 책상 위 문서에 개인정보가 노출되지 않도록 문서를 뒤집거나 서랍에 보관해주세요.",
    verificationGuide:
      "개인정보가 보이지 않도록 정리된 문서 상태를 촬영해주세요.",
    icon: "file-check"
  },

  {
    id: "M10",
    title: "확인하GO+",
    description: "메일 보내기 전 수신자·첨부파일 다시 확인",
    guide:
      "메일 발송 전 수신자, 참조자, 첨부파일을 다시 확인하고 개인정보나 내부자료가 잘못 포함되지 않았는지 점검해주세요.",
    verificationGuide:
      "실제 개인정보나 메일주소가 노출되지 않도록 주의하면서 발송 전 확인 화면 또는 점검 모습을 촬영해주세요.",
    icon: "mail"
  },

  {
    id: "M11",
    title: "분리하GO",
    description: "일반폐기와 파쇄 대상 문서를 구분",
    guide:
      "개인정보나 중요정보가 포함된 문서는 일반 쓰레기통에 버리지 않고 파쇄 대상 문서로 구분해주세요.",
    verificationGuide:
      "개인정보가 직접 보이지 않도록 하면서 파쇄 대상 문서함 또는 분리된 상태를 촬영해주세요.",
    icon: "trash"
  },

  {
    id: "M12",
    title: "닫GO",
    description: "보관함과 중요자료 공간은 사용 후 닫기",
    guide:
      "개인정보 또는 중요자료가 보관된 캐비닛, 서랍, 보관함 등은 사용 후 반드시 닫아주세요.",
    verificationGuide:
      "닫혀 있는 캐비닛, 서랍 또는 보관함 상태를 촬영해주세요.",
    icon: "door-closed"
  },

  {
    id: "M13",
    title: "점검하GO",
    description: "우리 부서의 정보보호 취약요소 하나 점검",
    guide:
      "우리 부서에서 개인정보 노출이나 정보보호 사고로 이어질 수 있는 요소를 하나 찾아 점검하고 개선해주세요.",
    verificationGuide:
      "개인정보가 노출되지 않는 범위에서 점검 또는 개선된 모습을 촬영해주세요.",
    icon: "shield-check"
  },

  {
    id: "M14",
    title: "자랑하GO",
    description: "우리 팀의 정보보호 실천을 공유",
    guide:
      "우리 팀에서 평소 실천하고 있는 정보보호 활동이나 좋은 관리방법을 하나 찾아주세요.",
    verificationGuide:
      "보안서류함, 문서 파쇄, 정리된 업무환경 등 정보보호 활동을 보여주는 사진을 촬영해주세요.",
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


export const DEPARTMENTS: string[] =
  Array.from(
    new Set(
      DEPARTMENT_CATEGORIES.flatMap(
        (
          category
        ) =>
          category.items
      )
    )
  );