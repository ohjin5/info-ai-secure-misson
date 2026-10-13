import { APPS_SCRIPT_URL } from "../constants";

export interface SubmitPayload {
  action: "submit";
  missionId: string;
  missionName: string;
  department: string;
  name: string;
  description: string;
  imageData: string;
  imageMimeType: string;
}

export interface SubmissionItem {
  submissionId: string;
  timestamp: string;
  missionId: string;
  missionName: string;
  department: string;
  name: string;
  description: string;
  imageUrl?: string;
  imageData?: string;
  status: "승인대기" | "승인" | "반려" | string;
  reviewNote?: string;
  reviewedAt?: string;
}

export interface DepartmentRanking {
  rank: number;
  department: string;
  count: number;
  uniqueUsersCount?: number;
  userCount?: number;
}

export interface MissionSettings {
  currentWeek: string;
  activeMissions: string[];
}

export interface AdminDataResponse {
  success: boolean;
  message?: string;
  stats?: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    departmentCount: number;
    userCount: number;
  };
  rankings?: DepartmentRanking[];
  submissions?: SubmissionItem[];
  departments?: Record<
    string,
    {
      totalCount: number;
      uniqueUsersCount: number;
      participants: Record<string, { count: number; submissions: SubmissionItem[] }>;
    }
  >;
  missionStats?: Record<string, number>;
  missionSettings?: MissionSettings;
}

/**
 * Generic POST fetch wrapper for Google Apps Script Web App
 * Uses text/plain to avoid CORS preflight issues
 */
async function postToAppsScript<T>(data: unknown): Promise<T> {
  const response = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return result as T;
}

export async function fetchMissionSettingsApi(): Promise<MissionSettings | null> {
  try {
    const res = await postToAppsScript<{
      success?: boolean;
      currentWeek?: string | number;
      activeMissions?: string[];
      missionSettings?: MissionSettings;
    }>({ action: "missionSettings" });

    console.log("Mission settings raw response:", res);

    if (res.missionSettings && Array.isArray(res.missionSettings.activeMissions)) {
      return {
        currentWeek: String(res.missionSettings.currentWeek || "1"),
        activeMissions: res.missionSettings.activeMissions
      };
    }

    if (res.activeMissions && Array.isArray(res.activeMissions)) {
      return {
        currentWeek: String(res.currentWeek || "1"),
        activeMissions: res.activeMissions
      };
    }

    return null;
  } catch (err) {
    console.warn("Failed to fetch mission settings, using defaults", err);
    return null;
  }
}

export async function submitMissionApi(payload: Omit<SubmitPayload, "action">) {
  const body: SubmitPayload = {
    action: "submit",
    ...payload
  };
  return postToAppsScript<{ success: boolean; message?: string; submissionId?: string }>(body);
}

export async function fetchAdminDataApi(adminPassword: string) {
  const body = {
    action: "adminData",
    adminPassword
  };
  return postToAppsScript<AdminDataResponse>(body);
}

export async function updateMissionSettingsApi(
  adminPassword: string,
  currentWeek: string,
  activeMissions: string[]
) {
  const body = {
    action: "updateMissionSettings",
    adminPassword,
    currentWeek: String(currentWeek),
    activeMissions
  };
  return postToAppsScript<{ success: boolean; message?: string; currentWeek?: string; activeMissions?: string[] }>(body);
}

export async function reviewSubmissionApi(
  adminPassword: string,
  submissionId: string,
  status: "승인" | "반려",
  note: string = ""
) {
  const body = {
    action: "review",
    adminPassword,
    submissionId,
    status,
    note
  };
  return postToAppsScript<{ success: boolean; message?: string }>(body);
}

export async function fetchDepartmentCountApi(department: string) {
  try {
    const body = {
      action: "getDepartmentStats",
      department
    };
    const res = await postToAppsScript<{ success: boolean; count?: number }>(body);
    return res.count ?? null;
  } catch (e) {
    console.warn("Failed to fetch department count", e);
    return null;
  }
}
