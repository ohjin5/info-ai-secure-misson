import React, { useState } from "react";
import { RefreshCw, ArrowLeft, ShieldCheck, AlertCircle } from "lucide-react";
import { SummaryCards } from "./SummaryCards";
import { RankingTable } from "./RankingTable";
import { DepartmentDetailModal } from "./DepartmentDetailModal";
import { SubmissionSliderModal } from "./SubmissionSliderModal";
import { SubmissionTable } from "./SubmissionTable";
import { MissionStats } from "./MissionStats";
import { MissionManagement } from "./MissionManagement";
import { AdminDataResponse, fetchAdminDataApi, SubmissionItem } from "../../utils/api";

interface AdminDashboardProps {
  adminPassword: string;
  initialData: AdminDataResponse;
  onBackToUser: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminPassword,
  initialData,
  onBackToUser,
}) => {
  const [adminData, setAdminData] = useState<AdminDataResponse>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Modals state
  const [selectedDepartmentForModal, setSelectedDepartmentForModal] = useState<string | null>(null);

  const [sliderModalSubmissions, setSliderModalSubmissions] = useState<SubmissionItem[] | null>(null);
  const [sliderModalIndex, setSliderModalIndex] = useState(0);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      setFetchError(null);
      const res = await fetchAdminDataApi(adminPassword);
      if (res && res.success !== false) {
        setAdminData(res);
      } else {
        setFetchError("관리자 데이터를 불러오지 못했습니다.");
      }
    } catch (err) {
      console.error("Refresh failed", err);
      setFetchError("관리자 데이터를 불러오지 못했습니다.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleOpenSlider = (list: SubmissionItem[], index: number) => {
    setSliderModalSubmissions(list);
    setSliderModalIndex(index);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Top Admin Navigation Bar */}
      <div className="bg-[#1E3A5F] text-white p-4 sm:p-5 rounded-2xl flex items-center justify-between shadow-md border border-[#102A45]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#2563EB] rounded-xl text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold">
              정보보호 미션 챌린지 관리자 대시보드
            </h2>
            <p className="text-xs text-blue-200 hidden sm:block">
              2026 병원 교직원 캠페인 현황, 미션 주차 관리 및 승인 검토
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">새로고침</span>
          </button>

          <button
            type="button"
            onClick={onBackToUser}
            className="p-2.5 bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">사용자 화면</span>
          </button>
        </div>
      </div>

      {/* Error state alert */}
      {fetchError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-sm text-rose-900">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{fetchError}</span>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg cursor-pointer"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <SummaryCards stats={adminData.stats} />

      {/* Mission Management Panel (Weekly active missions) */}
      <MissionManagement
        adminPassword={adminPassword}
        initialSettings={adminData.missionSettings}
        onSettingsUpdated={handleRefresh}
      />

      {/* Main Grid: Rankings & Mission Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RankingTable
            rankings={adminData.rankings || []}
            onSelectDepartment={(deptName) => setSelectedDepartmentForModal(deptName)}
          />
        </div>

        <div>
          <MissionStats missionStats={adminData.missionStats} />
        </div>
      </div>

      {/* Recent Submissions Table / Cards */}
      <SubmissionTable
        submissions={adminData.submissions || []}
        onOpenSlider={handleOpenSlider}
      />

      {/* Department Detail Modal */}
      {selectedDepartmentForModal && (
        <DepartmentDetailModal
          departmentName={selectedDepartmentForModal}
          submissions={adminData.submissions || []}
          departmentData={adminData.departments?.[selectedDepartmentForModal]}
          onClose={() => setSelectedDepartmentForModal(null)}
          onViewAllSubmissions={(filtered) => {
            setSelectedDepartmentForModal(null);
            handleOpenSlider(filtered, 0);
          }}
          onViewUserSubmissions={(filtered) => {
            setSelectedDepartmentForModal(null);
            handleOpenSlider(filtered, 0);
          }}
        />
      )}

      {/* Submission Photo Slider Modal */}
      {sliderModalSubmissions && sliderModalSubmissions.length > 0 && (
        <SubmissionSliderModal
          submissions={sliderModalSubmissions}
          initialIndex={sliderModalIndex}
          adminPassword={adminPassword}
          onClose={() => setSliderModalSubmissions(null)}
          onRefreshData={async () => {
            await handleRefresh();
          }}
        />
      )}
    </div>
  );
};
