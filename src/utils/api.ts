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

  description: string;

  /**
   * Drive 내부 파일 ID
   */
  imageFileId?: string;

  /**
   * 현재 구조에서는 직접 Drive URL을 사용하지 않지만
   * 기존 컴포넌트 호환을 위해 필드는 유지
   */
  imageUrl?: string;

  /**
   * 현재 운영 방식에서는
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
   * 랭킹 인정 건수
   */
  total: number;

  /**
   * 참여 인원
   */
  participants: number;

  /**
   * 미션별 인정 건수
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

  activeMissions: string[];
}


/**
 * =========================================
 * 오늘 참여 상태
 * =========================================
 */
export interface DailySubmissionStatus {
  success: boolean;

  /**
   * 오늘 해당 기기에서 제출한 건수
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
 *
 * approved / rejected / pending은
 * 기존 관리자 컴포넌트 호환을 위해 유지
 *
 * 현재 구조에서는:
 * approved = total
 * rejected = 0
 * pending = 0
 * =========================================
 */
export interface AdminSummary {
  total: number;

  approved: number;

  rejected: number;

  pending: number;

  departments: number;

  participants: number;
}


/**
 * =========================================
 * 관리자 부서별 참여자
 * =========================================
 */
export interface DepartmentParticipant {
  name: string;

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
 * 관리자 이미지 조회 응답
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
 * Google Apps Script 공통 POST
 *
 * text/plain 사용:
 * Apps Script 호출 시 불필요한
 * CORS preflight 최소화
 * =========================================
 */
async function postToAppsScript<T>(
  data: unknown
): Promise<T> {

  let response: Response;


  try {

    response =
      await fetch(
        APPS_SCRIPT_URL,
        {
          method: "POST",

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

  } catch (error) {

    console.error(
      "Apps Script network error:",
      error
    );


    throw new Error(
      "서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요."
    );
  }


  /**
   * HTTP 자체 오류
   */
  if (!response.ok) {

    throw new Error(
      `서버 요청에 실패했습니다. (${response.status})`
    );
  }


  /**
   * 먼저 text로 받고 JSON 파싱
   *
   * Apps Script 배포 문제로 HTML이 반환되는 경우
   * 원인을 쉽게 확인하기 위함
   */
  let responseText:
    string;


  try {

    responseText =
      await response.text();

  } catch (error) {

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

  } catch (error) {

    console.error(
      "Apps Script JSON parse error:",
      error
    );


    console.error(
      "Raw Apps Script response:",
      responseText
    );


    if (
      responseText
        .trim()
        .startsWith("<")
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
   * Apps Script는 오류여도
   * HTTP 200 + success:false 가능
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

        /**
         * 이전 응답 구조 호환
         */
        missionSettings?: {
          currentWeek:
            string | number;

          activeMissions:
            string[];
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
     * Wrapper 형태
     */
    if (
      response.missionSettings &&
      Array.isArray(
        response
          .missionSettings
          .activeMissions
      )
    ) {

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
            .activeMissions
      };
    }


    /**
     * 현재 Apps Script 기본 형태
     */
    if (
      Array.isArray(
        response.activeMissions
      )
    ) {

      return {
        currentWeek:
          String(
            response.currentWeek ||
            "1"
          ),

        activeMissions:
          response.activeMissions
      };
    }


    return null;


  } catch (error) {

    console.warn(
      "Failed to fetch mission settings:",
      error
    );


    /**
     * 사용자 화면 전체를 막지 않고
     * App에서 기본값 사용
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
 *
 * 관리자 비밀번호 검증도
 * 이 요청을 통해 수행
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


  const response =
    await postToAppsScript<
      AdminDataResponse & {
        missionSettings?: {
          currentWeek:
            string | number;

          activeMissions:
            string[];
        };
      }
    >({
      action:
        "adminData",

      adminPassword
    });


  /**
   * currentWeek은 frontend에서
   * 항상 string으로 사용
   */
  if (
    response.missionSettings
  ) {

    response.missionSettings = {

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


  return response;
}


/**
 * =========================================
 * 관리자 주차별 활성 미션 변경
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
    activeMissions.length ===
      0
  ) {

    throw new Error(
      "최소 1개 이상의 미션을 선택해주세요."
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
 * Drive 파일을 공개 URL로 열지 않고
 * Apps Script에서 관리자 인증 후
 * Base64 Data URL을 받아옴
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
   * 비정상 응답 방지
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
 * Apps Script에서:
 * 1. Drive 사진 휴지통 이동
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