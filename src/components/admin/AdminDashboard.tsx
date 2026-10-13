import React, {
  useState
} from "react";

import {
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  LogOut
} from "lucide-react";

import {
  SummaryCards
} from "./SummaryCards";

import {
  RankingTable
} from "./RankingTable";

import {
  DepartmentDetailModal
} from "./DepartmentDetailModal";

import {
  SubmissionSliderModal
} from "./SubmissionSliderModal";

import {
  SubmissionTable
} from "./SubmissionTable";

import {
  MissionStats
} from "./MissionStats";

import {
  MissionManagement
} from "./MissionManagement";

import {
  AdminDataResponse,
  fetchAdminDataApi,
  SubmissionItem
} from "../../utils/api";


interface AdminDashboardProps {
  adminPassword: string;

  initialData: AdminDataResponse;

  onBackToUser: () => void;

  onLogout: () => void;
}


export const AdminDashboard:
  React.FC<AdminDashboardProps> = ({
    adminPassword,
    initialData,
    onBackToUser,
    onLogout
  }) => {

    /**
     * 관리자 데이터
     */
    const [
      adminData,
      setAdminData
    ] =
      useState<AdminDataResponse>(
        initialData
      );


    const [
      isRefreshing,
      setIsRefreshing
    ] =
      useState(false);


    const [
      fetchError,
      setFetchError
    ] =
      useState<string | null>(
        null
      );


    /**
     * 부서 상세 Modal
     */
    const [
      selectedDepartmentForModal,
      setSelectedDepartmentForModal
    ] =
      useState<string | null>(
        null
      );


    /**
     * 사진 Slider Modal
     */
    const [
      sliderModalSubmissions,
      setSliderModalSubmissions
    ] =
      useState<
        SubmissionItem[] | null
      >(
        null
      );


    const [
      sliderModalIndex,
      setSliderModalIndex
    ] =
      useState(
        0
      );


    /**
     * 관리자 데이터 새로고침
     */
    const handleRefresh =
      async () => {

        try {

          setIsRefreshing(
            true
          );


          setFetchError(
            null
          );


          const response =
            await fetchAdminDataApi(
              adminPassword
            );


          setAdminData(
            response
          );


        } catch (error) {

          console.error(
            "Admin refresh failed:",
            error
          );


          setFetchError(
            error instanceof Error
              ? error.message
              : "관리자 데이터를 불러오지 못했습니다."
          );


        } finally {

          setIsRefreshing(
            false
          );

        }
      };


    /**
     * 사진 Slider 열기
     */
    const handleOpenSlider = (
      list: SubmissionItem[],
      index: number
    ) => {

      if (
        !list ||
        list.length === 0
      ) {

        return;
      }


      setSliderModalSubmissions(
        list
      );


      setSliderModalIndex(
        Math.max(
          0,
          Math.min(
            index,
            list.length - 1
          )
        )
      );

    };


    /**
     * Slider에서 삭제 후 호출
     *
     * 삭제 전 배열을 Slider가 계속 들고 있지 않도록
     * 닫은 뒤 최신 관리자 데이터를 다시 조회
     */
    const handleSliderRefresh =
      async () => {

        await handleRefresh();


        setSliderModalSubmissions(
          null
        );


        setSliderModalIndex(
          0
        );

      };


    return (
      <div className="space-y-6 pb-12 max-w-7xl mx-auto">

        {/* 상단 관리자 Navigation */}
        <div className="bg-[#1E3A5F] text-white p-4 sm:p-5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md border border-[#102A45]">

          <div className="flex items-center gap-3">

            <div className="p-2.5 bg-[#2563EB] rounded-xl text-white">

              <ShieldCheck className="w-6 h-6" />

            </div>


            <div>

              <h2 className="text-lg sm:text-xl font-bold">
                정보보호 미션 챌린지 관리자 대시보드
              </h2>


              <p className="text-xs text-blue-200 hidden sm:block">
                캠페인 참여 현황, 주차별 미션 운영 및 인증 내역 관리
              </p>

            </div>

          </div>


          <div className="flex items-center gap-2">

            {/* 새로고침 */}
            <button
              type="button"
              onClick={
                handleRefresh
              }
              disabled={
                isRefreshing
              }
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer disabled:opacity-60"
              title="새로고침"
            >

              <RefreshCw
                className={`w-4 h-4 ${
                  isRefreshing
                    ? "animate-spin"
                    : ""
                }`}
              />

              <span className="hidden sm:inline">
                새로고침
              </span>

            </button>


            {/* 사용자 화면 */}
            <button
              type="button"
              onClick={
                onBackToUser
              }
              className="p-2.5 bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="사용자 화면"
            >

              <ArrowLeft className="w-4 h-4" />

              <span className="hidden sm:inline">
                사용자 화면
              </span>

            </button>


            {/* 로그아웃 */}
            <button
              type="button"
              onClick={
                onLogout
              }
              className="p-2.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="로그아웃"
            >

              <LogOut className="w-4 h-4" />

              <span>
                로그아웃
              </span>

            </button>

          </div>

        </div>


        {/* 오류 메시지 */}
        {fetchError && (

          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-rose-900">

            <div className="flex items-start gap-2">

              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />

              <span>
                {fetchError}
              </span>

            </div>


            <button
              type="button"
              onClick={
                handleRefresh
              }
              className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg cursor-pointer shrink-0"
            >
              다시 시도
            </button>

          </div>

        )}


        {/* KPI */}
        <SummaryCards
          stats={
            adminData.summary
          }
        />


        {/* 주차별 미션 운영 관리 */}
        <MissionManagement
          adminPassword={
            adminPassword
          }

          initialSettings={
            adminData
              .missionSettings
          }

          onSettingsUpdated={
            handleRefresh
          }
        />


        {/* 순위 + 미션 통계 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2">

            <RankingTable
              rankings={
                adminData.rankings ||
                []
              }

              onSelectDepartment={(
                departmentName
              ) =>
                setSelectedDepartmentForModal(
                  departmentName
                )
              }
            />

          </div>


          <div>

            <MissionStats
              missionStats={
                adminData
                  .missionStats
              }
            />

          </div>

        </div>


        {/* 인증 목록 */}
        <SubmissionTable
          submissions={
            adminData.submissions ||
            []
          }

          onOpenSlider={
            handleOpenSlider
          }
        />


        {/* 부서 상세 Modal */}
        {selectedDepartmentForModal && (

          <DepartmentDetailModal
            departmentName={
              selectedDepartmentForModal
            }

            submissions={
              adminData
                .submissions ||
              []
            }

            departmentData={
              adminData
                .departments?.[
                  selectedDepartmentForModal
                ]
            }

            onClose={() =>
              setSelectedDepartmentForModal(
                null
              )
            }

            onViewAllSubmissions={(
              filtered
            ) => {

              setSelectedDepartmentForModal(
                null
              );


              handleOpenSlider(
                filtered,
                0
              );

            }}

            onViewUserSubmissions={(
              filtered
            ) => {

              setSelectedDepartmentForModal(
                null
              );


              handleOpenSlider(
                filtered,
                0
              );

            }}
          />

        )}


        {/* 사진 Slider */}
        {sliderModalSubmissions &&
          sliderModalSubmissions.length >
            0 && (

          <SubmissionSliderModal
            submissions={
              sliderModalSubmissions
            }

            initialIndex={
              sliderModalIndex
            }

            adminPassword={
              adminPassword
            }

            onClose={() => {

              setSliderModalSubmissions(
                null
              );


              setSliderModalIndex(
                0
              );

            }}

            onRefreshData={
              handleSliderRefresh
            }
          />

        )}

      </div>
    );
  };