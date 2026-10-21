import {
  APPS_SCRIPT_URL
} from "../constants";


/**
 * =========================================
 * 사용자 미션 제출 Payload
 * =========================================
 */
export interface SubmitPayload {
  action: "submit";

  missionId: string;
  missionName: string;

  department: string;

  name: string;

  /**
   * 사번
   *
   * 동명이인 구분 및
   * 경품 추첨 대상 식별용
   */
  employeeId: string;

  description: string;

  imageData: string;
  imageMimeType: string;

  /**
   * 동일 브라우저/기기 기준
   * 하루 1회 참여 제한
   */
  deviceId: string;
}


/**
 * =========================================
 * 누적 참여 공동목표 - 단계
 * =========================================
 */
export interface ParticipationMilestone {

  /**
   * 목표 인증 건수
   * 예: 100, 200, 300
   */
  target: number;


  /**
   * 목표 달성 보상
   */
  reward: string;


  /**
   * 현재 목표 달성 여부
   */
  achieved: boolean;
}


/**
 * =========================================
 * 누적 참여 공동목표
 *
 * totalParticipation =
 * 고유 인원수가 아닌
 * 전체 미션 인증 건수
 * =========================================
 */
export interface ParticipationChallenge {

  /**
   * 누적 인증 건수
   */
  totalParticipation: number;


  /**
   * 다음 목표
   *
   * 예:
   * 0~99   → 100
   * 100~199 → 200
   * 200~299 → 300
   * 300 이상 → null
   */
  nextGoal: number | null;


  /**
   * 다음 목표 보상
   */
  nextReward: string | null;


  /**
   * 현재 진행률 표시 기준
   *
   * 예:
   * 현재 163건이면 200
   */
  progressTarget: number;


  /**
   * 진행률 0 ~ 100
   */
  progressPercent: number;


  /**
   * 다음 목표까지 남은 건수
   */
  remaining: number;


  /**
   * 300건 최종 달성 여부
   */
  isComplete: boolean;


  /**
   * 100 / 200 / 300 목표
   */
  milestones: ParticipationMilestone[];
}


/**
 * =========================================
 * 관리자 화면 제출 데이터
 * =========================================
 */
export interface SubmissionItem {

  submissionId: string;

  timestamp: string;

  missionId: string;

  missionName: string;

  department: string;

  name: string;


  /**
   * 사번
   */
  employeeId: string;


  description: string;


  /**
   * Drive 내부 파일 ID
   */
  imageFileId?: string;


  /**
   * 기존 컴포넌트 호환
   */
  imageUrl?: string;


  /**
   * 현재 구조에서는
   * 제출 즉시 참여 인정
   */
  status: "승인" | string;


  reviewNote?: string;

  reviewedAt?: string;
}


/**
 * =========================================
 * 부서별 Ranking
 * =========================================
 */
export interface DepartmentRanking {

  rank: number;

  department: string;


  /**
   * 참여 인증 건수
   */
  total: number;


  /**
   * 참여 인원
   *
   * 관리자 통계 호환을 위해 유지
   */
  participants: number;


  /**
   * 미션별 인증 건수
   */
  missions: Record<
    string,
    number
  >;
}


/**
 * =========================================
 * 운영 미션 설정
 * =========================================
 */
export interface MissionSettings {

  currentWeek: string;


  /**
   * 현재 운영상
   * 미션은 정확히 1개 사용
   */
  activeMissions: string[];


  /**
   * 누적 참여 공동목표
   */
  participationChallenge?:
    ParticipationChallenge;
}


/**
 * =========================================
 * 오늘 참여 상태
 * =========================================
 */
export interface DailySubmissionStatus {

  success: boolean;


  /**
   * 오늘 해당 기기 제출 건수
   */
  count: number;


  /**
   * 현재 1
   */
  limit: number;


  /**
   * 0 또는 1
   */
  remaining: number;


  /**
   * 오늘 참여 가능 여부
   */
  canSubmit: boolean;


  message?: string;
}


/**
 * =========================================
 * 관리자 Summary
 * =========================================
 */
export interface AdminSummary {

  /**
   * 전체 인증 건수
   */
  total: number;

  approved: number;

  rejected: number;

  pending: number;

  departments: number;


  /**
   * 기존 고유 참여자 통계
   *
   * 공동목표 숫자는
   * participationChallenge
   * .totalParticipation 사용
   */
  participants: number;
}


/**
 * =========================================
 * 관리자 부서별 참여자
 * =========================================
 */
export interface DepartmentParticipant {

  name: string;


  /**
   * 동명이인 구분을 위해
   * 사번 포함
   */
  employeeId?: string;


  total: number;

  submissions: SubmissionItem[];
}


/**
 * =========================================
 * 관리자 부서 상세
 * =========================================
 */
export interface DepartmentDetail {

  department: string;

  total: number;


  /**
   * 현재 백엔드 구조상
   * Record key는 서버에서 결정
   */
  participants: Record<
    string,
    DepartmentParticipant
  >;


  submissions: SubmissionItem[];
}


/**
 * =========================================
 * 관리자 전체 데이터
 * =========================================
 */
export interface AdminDataResponse {

  success: boolean;

  message?: string;

  missionSettings?: MissionSettings;


  /**
   * 누적 참여 100 / 200 / 300
   */
  participationChallenge?:
    ParticipationChallenge;


  summary?: AdminSummary;

  rankings?: DepartmentRanking[];

  submissions?: SubmissionItem[];


  departments?: Record<
    string,
    DepartmentDetail
  >;


  missionStats?: Record<
    string,
    number
  >;
}


/**
 * =========================================
 * 관리자 이미지 조회
 * =========================================
 */
export interface SubmissionImageResponse {

  success: boolean;

  submissionId: string;

  mimeType: string;


  /**
   * data:image/jpeg;base64,...
   */
  imageData: string;


  message?: string;
}


/**
 * =========================================
 * 공통 API 응답
 * =========================================
 */
interface BasicApiResponse {

  success: boolean;

  message?: string;
}


/**
 * =========================================
 * 공동목표 응답 정규화
 * =========================================
 */
function normalizeParticipationChallenge(
  value: unknown
):
  | ParticipationChallenge
  | undefined {

  if (
    !value ||
    typeof value !== "object"
  ) {

    return undefined;

  }


  const raw =
    value as {

      totalParticipation?: unknown;

      nextGoal?: unknown;

      nextReward?: unknown;

      progressTarget?: unknown;

      progressPercent?: unknown;

      remaining?: unknown;

      isComplete?: unknown;

      milestones?: unknown;

    };


  const totalParticipation =
    Number(
      raw.totalParticipation
    );


  const progressTarget =
    Number(
      raw.progressTarget
    );


  const progressPercent =
    Number(
      raw.progressPercent
    );


  const remaining =
    Number(
      raw.remaining
    );


  if (
    !Number.isFinite(
      totalParticipation
    ) ||
    !Number.isFinite(
      progressTarget
    ) ||
    !Number.isFinite(
      progressPercent
    ) ||
    !Number.isFinite(
      remaining
    )
  ) {

    return undefined;

  }


  const milestones:
    ParticipationMilestone[] =
    Array.isArray(
      raw.milestones
    )

      ? raw.milestones
          .map(
            (
              item
            ) => {

              if (
                !item ||
                typeof item !== "object"
              ) {

                return null;

              }


              const milestone =
                item as {

                  target?: unknown;

                  reward?: unknown;

                  achieved?: unknown;

                };


              const target =
                Number(
                  milestone.target
                );


              if (
                !Number.isFinite(
                  target
                )
              ) {

                return null;

              }


              return {

                target,

                reward:
                  String(
                    milestone.reward ||
                    ""
                  ),

                achieved:
                  Boolean(
                    milestone.achieved
                  )

              };

            }
          )
          .filter(
            (
              item
            ): item is ParticipationMilestone =>
              item !== null
          )

      : [];


  const parsedNextGoal =
    raw.nextGoal === null ||
    raw.nextGoal === undefined

      ? null

      : Number(
          raw.nextGoal
        );


  const nextGoal =
    parsedNextGoal === null

      ? null

      : Number.isFinite(
          parsedNextGoal
        )

        ? parsedNextGoal

        : null;


  const nextReward =
    raw.nextReward === null ||
    raw.nextReward === undefined

      ? null

      : String(
          raw.nextReward
        );


  return {

    totalParticipation:
      Math.max(
        0,
        totalParticipation
      ),

    nextGoal,

    nextReward,

    progressTarget:
      Math.max(
        0,
        progressTarget
      ),

    progressPercent:
      Math.min(
        100,
        Math.max(
          0,
          progressPercent
        )
      ),

    remaining:
      Math.max(
        0,
        remaining
      ),

    isComplete:
      Boolean(
        raw.isComplete
      ),

    milestones

  };
}


/**
 * =========================================
 * Google Apps Script 공통 POST
 *
 * text/plain:
 * Apps Script CORS preflight 최소화
 * =========================================
 */
async function postToAppsScript<T>(
  data: unknown
): Promise<T> {

  let response:
    Response;


  try {

    response =
      await fetch(
        APPS_SCRIPT_URL,
        {

          method:
            "POST",

          headers: {

            "Content-Type":
              "text/plain;charset=utf-8"

          },

          body:
            JSON.stringify(
              data
            ),

          cache:
            "no-store"

        }
      );


  } catch (
    error
  ) {

    console.error(
      "Apps Script network error:",
      error
    );


    throw new Error(
      "서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요."
    );

  }


  /**
   * HTTP 오류
   */
  if (
    !response.ok
  ) {

    throw new Error(
      `서버 요청에 실패했습니다. (${response.status})`
    );

  }


  /**
   * JSON 파싱 전
   * raw text 확인
   */
  let responseText:
    string;


  try {

    responseText =
      await response.text();


  } catch (
    error
  ) {

    console.error(
      "Apps Script response read error:",
      error
    );


    throw new Error(
      "서버 응답을 읽을 수 없습니다."
    );

  }


  if (
    !responseText ||
    !responseText.trim()
  ) {

    throw new Error(
      "서버에서 빈 응답이 반환되었습니다."
    );

  }


  let result:
    any;


  try {

    result =
      JSON.parse(
        responseText
      );


  } catch (
    error
  ) {

    console.error(
      "Apps Script JSON parse error:",
      error
    );


    console.error(
      "Raw Apps Script response:",
      responseText
    );


    /**
     * Apps Script 배포 오류 등으로
     * HTML이 반환된 경우
     */
    if (
      responseText
        .trim()
        .startsWith(
          "<"
        )
    ) {

      throw new Error(
        "Apps Script 응답 형식이 올바르지 않습니다. 웹 앱 배포 설정과 배포 URL을 확인해주세요."
      );

    }


    throw new Error(
      "서버 응답을 처리할 수 없습니다."
    );

  }


  /**
   * Apps Script는
   * HTTP 200 + success:false 형태로
   * 오류를 내려줄 수 있음
   */
  if (
    result &&
    result.success === false
  ) {

    throw new Error(
      result.message ||
      "요청 처리 중 오류가 발생했습니다."
    );

  }


  return result as T;
}


/**
 * =========================================
 * 운영 미션 설정 조회
 *
 * - 현재 주차
 * - 활성 미션
 * - 공동목표
 * =========================================
 */
export async function
fetchMissionSettingsApi():
Promise<MissionSettings | null> {

  try {

    const response =
      await postToAppsScript<{

        success?: boolean;

        currentWeek?:
          string | number;

        activeMissions?:
          string[];

        participationChallenge?:
          ParticipationChallenge;


        /**
         * 이전 Wrapper 구조 호환
         */
        missionSettings?: {

          currentWeek:
            string | number;

          activeMissions:
            string[];

          participationChallenge?:
            ParticipationChallenge;

        };

      }>({

        action:
          "missionSettings"

      });


    console.log(
      "Mission settings raw response:",
      response
    );


    /**
     * Wrapper 구조
     */
    if (
      response.missionSettings &&
      Array.isArray(
        response
          .missionSettings
          .activeMissions
      )
    ) {

      const challenge =
        normalizeParticipationChallenge(

          response
            .missionSettings
            .participationChallenge ||

          response
            .participationChallenge

        );


      return {

        currentWeek:
          String(
            response
              .missionSettings
              .currentWeek ||
            "1"
          ),

        activeMissions:
          response
            .missionSettings
            .activeMissions,

        participationChallenge:
          challenge

      };

    }


    /**
     * 기본 구조
     */
    if (
      Array.isArray(
        response.activeMissions
      )
    ) {

      const challenge =
        normalizeParticipationChallenge(
          response
            .participationChallenge
        );


      return {

        currentWeek:
          String(
            response.currentWeek ||
            "1"
          ),

        activeMissions:
          response.activeMissions,

        participationChallenge:
          challenge

      };

    }


    return null;


  } catch (
    error
  ) {

    console.warn(
      "Failed to fetch mission settings:",
      error
    );


    /**
     * 사용자 화면 자체는
     * 막지 않음
     */
    return null;

  }

}


/**
 * =========================================
 * 사용자 미션 제출
 * =========================================
 */
export async function
submitMissionApi(
  payload: Omit<
    SubmitPayload,
    "action"
  >
): Promise<{
  success: boolean;
  message?: string;
  submissionId?: string;
}> {

  const body:
    SubmitPayload = {

    action:
      "submit",

    ...payload

  };


  return postToAppsScript<{
    success: boolean;

    message?: string;

    submissionId?: string;
  }>(
    body
  );

}


/**
 * =========================================
 * 오늘 동일 기기 참여 상태
 * =========================================
 */
export async function
fetchDailySubmissionStatusApi(
  deviceId: string
): Promise<DailySubmissionStatus> {

  if (
    !deviceId
  ) {

    throw new Error(
      "기기 식별 정보를 확인할 수 없습니다."
    );

  }


  return postToAppsScript<
    DailySubmissionStatus
  >({

    action:
      "dailySubmissionStatus",

    deviceId

  });

}


/**
 * =========================================
 * 관리자 전체 데이터 조회
 * =========================================
 */
export async function
fetchAdminDataApi(
  adminPassword: string
): Promise<AdminDataResponse> {

  if (
    !adminPassword
  ) {

    throw new Error(
      "관리자 비밀번호를 입력해주세요."
    );

  }


  /**
   * 서버에서는 currentWeek가
   * 숫자 또는 문자일 수 있음
   */
  const response =
    await postToAppsScript<

      Omit<
        AdminDataResponse,
        "missionSettings"
      > & {

        missionSettings?: {

          currentWeek:
            string | number;

          activeMissions:
            string[];

        };


        participationChallenge?:
          ParticipationChallenge;

      }

    >({

      action:
        "adminData",

      adminPassword

    });


  /**
   * 공동목표 정규화
   */
  const participationChallenge =
    normalizeParticipationChallenge(
      response
        .participationChallenge
    );


  const normalizedResponse:
    AdminDataResponse = {

    ...response,

    participationChallenge

  };


  /**
   * currentWeek은
   * frontend에서 항상 string
   */
  if (
    response.missionSettings
  ) {

    normalizedResponse
      .missionSettings = {

      currentWeek:
        String(
          response
            .missionSettings
            .currentWeek ||
          "1"
        ),

      activeMissions:
        Array.isArray(
          response
            .missionSettings
            .activeMissions
        )

          ? response
              .missionSettings
              .activeMissions

          : []

    };

  }


  return normalizedResponse;
}


/**
 * =========================================
 * 관리자 주차별 활성 미션 변경
 *
 * 한 주에 미션 1개만 OPEN
 * =========================================
 */
export async function
updateMissionSettingsApi(
  adminPassword: string,
  currentWeek: string,
  activeMissions: string[]
): Promise<{
  success: boolean;
  message?: string;
  currentWeek?: string;
  activeMissions?: string[];
}> {

  if (
    !adminPassword
  ) {

    throw new Error(
      "관리자 인증 정보가 없습니다."
    );

  }


  if (
    !Array.isArray(
      activeMissions
    ) ||
    activeMissions.length !== 1
  ) {

    throw new Error(
      "이번 주 미션은 1개만 선택해주세요."
    );

  }


  return postToAppsScript<{
    success: boolean;

    message?: string;

    currentWeek?: string;

    activeMissions?: string[];
  }>({

    action:
      "updateMissionSettings",

    adminPassword,

    currentWeek:
      String(
        currentWeek
      ),

    activeMissions

  });

}


/**
 * =========================================
 * 관리자 인증사진 조회
 *
 * Drive 파일을 공개하지 않고
 * Apps Script에서 Base64로 조회
 * =========================================
 */
export async function
fetchSubmissionImageApi(
  adminPassword: string,
  submissionId: string
): Promise<SubmissionImageResponse> {

  if (
    !adminPassword
  ) {

    throw new Error(
      "관리자 인증 정보가 없습니다."
    );

  }


  if (
    !submissionId
  ) {

    throw new Error(
      "제출 정보를 확인할 수 없습니다."
    );

  }


  const response =
    await postToAppsScript<
      SubmissionImageResponse
    >({

      action:
        "getImage",

      adminPassword,

      submissionId

    });


  /**
   * 이미지 형식 검증
   */
  if (
    !response.imageData ||
    !response.imageData.startsWith(
      "data:image/"
    )
  ) {

    throw new Error(
      "인증사진 데이터를 확인할 수 없습니다."
    );

  }


  return response;
}


/**
 * =========================================
 * 관리자 제출 건 삭제
 *
 * 서버에서:
 * 1. Drive 파일 휴지통 이동
 * 2. Sheet 행 삭제
 * =========================================
 */
export async function
deleteSubmissionApi(
  adminPassword: string,
  submissionId: string
): Promise<BasicApiResponse> {

  if (
    !adminPassword
  ) {

    throw new Error(
      "관리자 인증 정보가 없습니다."
    );

  }


  if (
    !submissionId
  ) {

    throw new Error(
      "삭제할 제출 정보를 확인할 수 없습니다."
    );

  }


  return postToAppsScript<
    BasicApiResponse
  >({

    action:
      "deleteSubmission",

    adminPassword,

    submissionId

  });

}