import React, {
  useState,
  useEffect,
  useCallback
} from "react";

import {
  Header
} from "./components/Header";

import {
  MissionCard
} from "./components/MissionCard";

import {
  DepartmentCombobox
} from "./components/DepartmentCombobox";

import {
  UserInfoForm
} from "./components/UserInfoForm";

import {
  PhotoUploader
} from "./components/PhotoUploader";

import {
  SuccessPage
} from "./components/SuccessPage";

import {
  AdminLogin
} from "./components/admin/AdminLogin";

import {
  AdminDashboard
} from "./components/admin/AdminDashboard";

import {
  MISSIONS,
  Mission
} from "./constants";

import {
  submitMissionApi,
  fetchMissionSettingsApi,
  fetchDailySubmissionStatusApi,
  AdminDataResponse,
  DailySubmissionStatus
} from "./utils/api";

import {
  Loader2,
  AlertCircle,
  Send,
  Calendar,
  CheckCircle2,
  Clock3
} from "lucide-react";


/**
 * 동일 브라우저 식별값 생성
 *
 * 실제 기기 고유정보를 수집하는 것이 아니라
 * localStorage에 임의 UUID를 저장
 */
function getOrCreateDeviceId():
string {

  const storageKey =
    "securityMissionDeviceId";


  if (
    typeof window ===
    "undefined"
  ) {

    return "";
  }


  let deviceId =
    window.localStorage
      .getItem(
        storageKey
      );


  if (!deviceId) {

    if (
      typeof crypto !==
        "undefined" &&
      typeof crypto.randomUUID ===
        "function"
    ) {

      deviceId =
        crypto.randomUUID();

    } else {

      deviceId =
        `device-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`;

    }


    window.localStorage
      .setItem(
        storageKey,
        deviceId
      );
  }


  return deviceId;
}


export default function App() {

  /**
   * Navigation
   */
  const [
    view,
    setView
  ] =
    useState<
      | "form"
      | "success"
      | "admin-login"
      | "admin-dashboard"
    >(() => {

      if (
        typeof window !==
        "undefined"
      ) {

        const path =
          window.location.pathname;


        const hash =
          window.location.hash;


        if (
          path === "/admin" ||
          path.endsWith(
            "/admin"
          ) ||
          hash === "#admin"
        ) {

          return "admin-login";
        }
      }


      return "form";
    });


  /**
   * Device ID
   */
  const [
    deviceId
  ] =
    useState<string>(
      () =>
        getOrCreateDeviceId()
    );


  /**
   * 미션 운영 설정
   */
  const [
    currentWeek,
    setCurrentWeek
  ] =
    useState(
      "1"
    );


  const [
    activeMissions,
    setActiveMissions
  ] =
    useState<string[]>(
      MISSIONS.map(
        (mission) =>
          mission.id
      )
    );


  const [
    isLoadingSettings,
    setIsLoadingSettings
  ] =
    useState(
      true
    );


  /**
   * 하루 참여 상태
   *
   * 기기당 하루 1회
   */
  const [
    dailyStatus,
    setDailyStatus
  ] =
    useState<DailySubmissionStatus>({
      success: true,
      count: 0,
      limit: 1,
      remaining: 1,
      canSubmit: true
    });


  const [
    isLoadingDailyStatus,
    setIsLoadingDailyStatus
  ] =
    useState(
      true
    );


  /**
   * 사용자 Form
   */
  const [
    selectedMission,
    setSelectedMission
  ] =
    useState<Mission | null>(
      null
    );


  const [
    department,
    setDepartment
  ] =
    useState(
      ""
    );


  const [
    name,
    setName
  ] =
    useState(
      ""
    );


  const [
    description,
    setDescription
  ] =
    useState(
      ""
    );


  const [
    imageData,
    setImageData
  ] =
    useState<string | null>(
      null
    );


  /**
   * Submit
   */
  const [
    isSubmitting,
    setIsSubmitting
  ] =
    useState(
      false
    );


  const [
    submitError,
    setSubmitError
  ] =
    useState<string | null>(
      null
    );


  /**
   * Admin
   */
  const [
    adminPassword,
    setAdminPassword
  ] =
    useState(
      ""
    );


  const [
    adminData,
    setAdminData
  ] =
    useState<
      AdminDataResponse | null
    >(
      null
    );


  /**
   * 미션 운영 설정 조회
   */
  const loadMissionSettings =
    useCallback(
      async () => {

        try {

          setIsLoadingSettings(
            true
          );


          const settings =
            await fetchMissionSettingsApi();


          if (
            settings &&
            Array.isArray(
              settings.activeMissions
            )
          ) {

            const week =
              String(
                settings.currentWeek ||
                "1"
              );


            const active =
              settings.activeMissions;


            setCurrentWeek(
              week
            );


            setActiveMissions(
              active
            );


            /**
             * 기존 선택 미션이
             * 비활성화되었다면 선택 해제
             */
            setSelectedMission(
              (
                previous
              ) => {

                if (
                  previous &&
                  !active.includes(
                    previous.id
                  )
                ) {

                  return null;
                }


                return previous;
              }
            );
          }


        } catch (error) {

          console.error(
            "Mission settings error:",
            error
          );


        } finally {

          setIsLoadingSettings(
            false
          );

        }
      },
      []
    );


  /**
   * 오늘 참여 상태 조회
   */
  const loadDailyStatus =
    useCallback(
      async () => {

        if (!deviceId) {

          return;
        }


        try {

          setIsLoadingDailyStatus(
            true
          );


          const status =
            await fetchDailySubmissionStatusApi(
              deviceId
            );


          setDailyStatus(
            status
          );


        } catch (error) {

          console.error(
            "Daily submission status error:",
            error
          );


        } finally {

          setIsLoadingDailyStatus(
            false
          );

        }
      },
      [
        deviceId
      ]
    );


  /**
   * 사용자 화면 진입 시
   * 최신 설정 + 참여 상태 조회
   */
  useEffect(
    () => {

      if (
        view ===
        "form"
      ) {

        loadMissionSettings();

        loadDailyStatus();

      }

    },
    [
      view,
      loadMissionSettings,
      loadDailyStatus
    ]
  );


  /**
   * Browser 뒤로가기
   */
  useEffect(
    () => {

      const handlePopState =
        () => {

          const path =
            window.location.pathname;


          const hash =
            window.location.hash;


          if (
            path === "/admin" ||
            path.endsWith(
              "/admin"
            ) ||
            hash === "#admin"
          ) {

            if (!adminData) {

              setView(
                "admin-login"
              );

            }

          } else if (
            view ===
              "admin-login" ||
            view ===
              "admin-dashboard"
          ) {

            setView(
              "form"
            );

          }
        };


      window.addEventListener(
        "popstate",
        handlePopState
      );


      return () =>
        window.removeEventListener(
          "popstate",
          handlePopState
        );

    },
    [
      adminData,
      view
    ]
  );


  /**
   * 활성 미션만 사용자에게 표시
   */
  const visibleMissions =
    MISSIONS.filter(
      (
        mission
      ) =>
        activeMissions.includes(
          mission.id
        )
    );


  /**
   * M05 설명 필수
   */
  const isDescriptionValid =
    selectedMission?.id !==
      "M05" ||
    Boolean(
      description.trim()
    );


  /**
   * Form 유효성
   */
  const isFormValid =
    Boolean(
      selectedMission
    ) &&
    Boolean(
      department.trim()
    ) &&
    Boolean(
      name.trim()
    ) &&
    Boolean(
      imageData
    ) &&
    isDescriptionValid &&
    dailyStatus.canSubmit;


  /**
   * 미션 제출
   */
  const handleSubmit =
    async (
      event:
        React.FormEvent
    ) => {

      event.preventDefault();


      /**
       * 하루 1회 제한
       */
      if (
        !dailyStatus.canSubmit
      ) {

        setSubmitError(
          "오늘 참여를 이미 완료했습니다. 내일 다시 참여해주세요."
        );

        return;
      }


      if (
        !isFormValid ||
        !selectedMission ||
        !imageData ||
        isSubmitting
      ) {

        return;
      }


      try {

        setIsSubmitting(
          true
        );


        setSubmitError(
          null
        );


        /**
         * 제출 직전 서버에서
         * 하루 참여 여부 재확인
         */
        const latestStatus =
          await fetchDailySubmissionStatusApi(
            deviceId
          );


        if (
          !latestStatus.canSubmit
        ) {

          setDailyStatus(
            latestStatus
          );


          throw new Error(
            "오늘 참여를 이미 완료했습니다. 내일 다시 참여해주세요."
          );
        }


        const response =
          await submitMissionApi({
            missionId:
              selectedMission.id,

            missionName:
              selectedMission.title,

            department:
              department.trim(),

            name:
              name.trim(),

            description:
              description.trim(),

            imageData:
              imageData,

            imageMimeType:
              "image/jpeg",

            deviceId:
              deviceId
          });


        if (
          response &&
          response.success !==
            false
        ) {

          /**
           * 제출 성공 후 서버 상태 갱신
           */
          try {

            const newStatus =
              await fetchDailySubmissionStatusApi(
                deviceId
              );


            setDailyStatus(
              newStatus
            );


          } catch (
            statusError
          ) {

            console.error(
              "Failed to refresh daily status:",
              statusError
            );


            /**
             * 서버 제출 자체는 성공했으므로
             * 화면에서도 참여 완료 상태로 보정
             */
            setDailyStatus({
              success: true,
              count: 1,
              limit: 1,
              remaining: 0,
              canSubmit: false,
              message:
                "오늘 참여를 완료했습니다."
            });
          }


          setView(
            "success"
          );


        } else {

          throw new Error(
            response?.message ||
            "등록 중 오류가 발생했습니다."
          );

        }


      } catch (error) {

        console.error(
          "Mission submission failed:",
          error
        );


        if (
          error instanceof
          Error
        ) {

          setSubmitError(
            error.message
          );


          /**
           * 서버에서 하루 1회 제한 오류가 온 경우
           * 화면 상태도 즉시 막음
           */
          if (
            error.message.includes(
              "오늘 참여"
            )
          ) {

            setDailyStatus({
              success: true,
              count: 1,
              limit: 1,
              remaining: 0,
              canSubmit: false,
              message:
                "오늘 참여를 완료했습니다."
            });

          }


        } else {

          setSubmitError(
            "등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
          );

        }


      } finally {

        setIsSubmitting(
          false
        );

      }
    };


  /**
   * 성공 화면에서 사용자 화면으로 돌아가기
   *
   * 하루 1회 정책이므로
   * 다시 입력할 수 있는 상태가 아니라
   * 참여 완료 안내 화면으로 복귀
   */
  const handleReset =
    () => {

      setSelectedMission(
        null
      );

      setDepartment(
        ""
      );

      setName(
        ""
      );

      setDescription(
        ""
      );

      setImageData(
        null
      );

      setSubmitError(
        null
      );

      setView(
        "form"
      );

    };


  /**
   * 관리자 이동
   */
  const navigateToAdmin =
    () => {

      if (
        typeof window !==
          "undefined" &&
        window.history
      ) {

        window.history.pushState(
          {},
          "",
          "/admin"
        );

      }


      if (
        adminData &&
        adminPassword
      ) {

        setView(
          "admin-dashboard"
        );

      } else {

        setView(
          "admin-login"
        );

      }
    };


  /**
   * 사용자 화면 이동
   */
  const navigateToUser =
    () => {

      if (
        typeof window !==
          "undefined" &&
        window.history
      ) {

        window.history.pushState(
          {},
          "",
          "/"
        );

      }


      setView(
        "form"
      );

    };


  /**
   * 관리자 로그아웃
   */
  const handleAdminLogout =
    () => {

      setAdminPassword(
        ""
      );


      setAdminData(
        null
      );


      if (
        typeof window !==
          "undefined" &&
        window.history
      ) {

        window.history.pushState(
          {},
          "",
          "/admin"
        );

      }


      setView(
        "admin-login"
      );

    };


  /**
   * 관리자 Login
   */
  if (
    view ===
    "admin-login"
  ) {

    return (
      <div className="min-h-screen bg-[#F5F8FC] py-6 px-4 font-sans">

        <AdminLogin
          onSuccess={(
            password,
            data
          ) => {

            setAdminPassword(
              password
            );


            setAdminData(
              data
            );


            setView(
              "admin-dashboard"
            );

          }}

          onBackToUser={
            navigateToUser
          }
        />

      </div>
    );
  }


  /**
   * 관리자 Dashboard
   */
  if (
    view ===
      "admin-dashboard" &&
    adminData
  ) {

    return (
      <div className="min-h-screen bg-[#F5F8FC] py-6 px-4 font-sans">

        <AdminDashboard
          adminPassword={
            adminPassword
          }

          initialData={
            adminData
          }

          onBackToUser={
            navigateToUser
          }

          onLogout={
            handleAdminLogout
          }
        />

      </div>
    );
  }


  /**
   * 사용자 화면
   */
  return (
    <div className="min-h-screen bg-[#F5F8FC] text-[#172033] flex flex-col justify-between font-sans">

      <main className="w-full max-w-2xl mx-auto px-4 py-5 sm:py-8 space-y-5">

        {view ===
          "success" &&
        selectedMission ? (

          <SuccessPage
            department={
              department
            }

            name={
              name
            }

            missionTitle={
              selectedMission.title
            }

            onReset={
              handleReset
            }
          />

        ) : (

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-5 pb-24"
          >

            {/* Header */}
            <Header
              onNavigateToAdmin={
                navigateToAdmin
              }
            />


            {/* 오늘 참여 상태 */}
            {!isLoadingDailyStatus && (

              <div
                className={
                  dailyStatus.canSubmit
                    ? "bg-white border border-[#D9E2EC] rounded-2xl px-4 py-3 flex items-center justify-between gap-3"
                    : "bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 flex items-center gap-3"
                }
              >

                <div className="flex items-center gap-2">

                  {dailyStatus.canSubmit ? (

                    <Clock3 className="w-4 h-4 text-[#2563EB] shrink-0" />

                  ) : (

                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />

                  )}


                  <span className="text-xs sm:text-sm font-semibold text-[#475569]">

                    {dailyStatus.canSubmit
                      ? "오늘 1회 참여할 수 있어요."
                      : "오늘 참여를 완료했습니다."}

                  </span>

                </div>


                {dailyStatus.canSubmit && (

                  <span className="text-xs font-bold text-[#2563EB] whitespace-nowrap">

                    1회 가능

                  </span>

                )}

              </div>

            )}


            {/* 이미 참여 완료 */}
            {!isLoadingDailyStatus &&
              !dailyStatus.canSubmit && (

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-900">

                <div className="flex items-start gap-2">

                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />

                  <div className="space-y-1">

                    <div className="font-bold">
                      오늘 참여가 완료되었습니다.
                    </div>

                    <div className="text-xs sm:text-sm text-emerald-800">
                      정보보호 미션은 한 기기에서 하루 1회 참여할 수 있습니다.
                      내일 다시 참여해주세요.
                    </div>

                  </div>

                </div>

              </div>

            )}


            {/* Section 1 */}
            <section
              className={`bg-white border border-[#D9E2EC] rounded-3xl p-4 sm:p-6 shadow-xs space-y-4 ${
                !dailyStatus.canSubmit
                  ? "opacity-60 pointer-events-none"
                  : ""
              }`}
            >

              <div className="flex items-center justify-between border-b border-slate-100 pb-3">

                <div className="flex items-center gap-2">

                  <span className="w-6 h-6 rounded-full bg-[#2563EB] text-white font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </span>

                  <h2 className="text-base sm:text-lg font-extrabold text-[#172033]">

                    미션 선택{" "}

                    <span className="text-red-500">
                      *
                    </span>

                  </h2>

                </div>


                <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#EAF2FF] text-[#2563EB] text-xs font-bold rounded-full border border-blue-200">

                  <Calendar className="w-3.5 h-3.5" />

                  <span>
                    {currentWeek}주차 미션
                  </span>

                </div>

              </div>


              <div className="text-xs sm:text-sm text-[#64748B] font-medium">
                이번 주 정보보호 미션을 선택해주세요.
              </div>


              {isLoadingSettings ? (

                <div className="space-y-3 py-2">

                  <div className="h-24 bg-slate-100 animate-pulse rounded-2xl" />

                  <div className="h-24 bg-slate-100 animate-pulse rounded-2xl" />

                </div>

              ) : (

                <div className="space-y-3">

                  {visibleMissions.map(
                    (
                      mission
                    ) => (

                      <MissionCard
                        key={
                          mission.id
                        }

                        mission={
                          mission
                        }

                        isSelected={
                          selectedMission?.id ===
                          mission.id
                        }

                        onSelect={(
                          selected
                        ) =>
                          setSelectedMission(
                            selected
                          )
                        }
                      />

                    )
                  )}

                </div>

              )}

            </section>


            {/* Section 2 */}
            <section
              className={`bg-white border border-[#D9E2EC] rounded-3xl p-4 sm:p-6 shadow-xs space-y-4 ${
                !dailyStatus.canSubmit
                  ? "opacity-60 pointer-events-none"
                  : ""
              }`}
            >

              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">

                <span className="w-6 h-6 rounded-full bg-[#2563EB] text-white font-black text-xs flex items-center justify-center shrink-0">
                  2
                </span>

                <h2 className="text-base sm:text-lg font-extrabold text-[#172033]">
                  부서 선택
                </h2>

              </div>


              <DepartmentCombobox
                value={
                  department
                }

                onChange={(
                  selectedDepartment
                ) =>
                  setDepartment(
                    selectedDepartment
                  )
                }
              />

            </section>


            {/* Section 3 */}
            <section
              className={`bg-white border border-[#D9E2EC] rounded-3xl p-4 sm:p-6 shadow-xs space-y-4 ${
                !dailyStatus.canSubmit
                  ? "opacity-60 pointer-events-none"
                  : ""
              }`}
            >

              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">

                <span className="w-6 h-6 rounded-full bg-[#2563EB] text-white font-black text-xs flex items-center justify-center shrink-0">
                  3
                </span>

                <h2 className="text-base sm:text-lg font-extrabold text-[#172033]">
                  참여자 정보
                </h2>

              </div>


              <UserInfoForm
                name={
                  name
                }

                onChangeName={(
                  value
                ) =>
                  setName(
                    value
                  )
                }

                description={
                  description
                }

                onChangeDescription={(
                  value
                ) =>
                  setDescription(
                    value
                  )
                }

                isMission05={
                  selectedMission?.id ===
                  "M05"
                }
              />

            </section>


            {/* Section 4 */}
            <section
              className={`bg-white border border-[#D9E2EC] rounded-3xl p-4 sm:p-6 shadow-xs space-y-4 ${
                !dailyStatus.canSubmit
                  ? "opacity-60 pointer-events-none"
                  : ""
              }`}
            >

              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">

                <span className="w-6 h-6 rounded-full bg-[#2563EB] text-white font-black text-xs flex items-center justify-center shrink-0">
                  4
                </span>

                <h2 className="text-base sm:text-lg font-extrabold text-[#172033]">
                  인증사진 촬영 및 등록
                </h2>

              </div>


              <PhotoUploader
                imageData={
                  imageData
                }

                onImageSelected={(
                  image
                ) =>
                  setImageData(
                    image
                  )
                }
              />

            </section>


            {/* 제출 Error */}
            {submitError && (

              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-sm font-semibold text-rose-900">

                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />

                <span>
                  {submitError}
                </span>

              </div>

            )}


            {/* Sticky Submit */}
            <div className="fixed bottom-0 left-0 right-0 p-3.5 sm:p-4 bg-white/90 backdrop-blur-md border-t border-[#D9E2EC] z-40 shadow-lg">

              <div className="max-w-2xl mx-auto">

                <button
                  type="submit"

                  disabled={
                    !isFormValid ||
                    isSubmitting ||
                    !dailyStatus.canSubmit
                  }

                  className="w-full h-12 sm:h-14 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-md disabled:opacity-40 disabled:pointer-events-none active:scale-[0.99] transition-all cursor-pointer"
                >

                  {isSubmitting ? (

                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-blue-200" />

                      <span>
                        미션을 등록하고 있습니다...
                      </span>
                    </>

                  ) : !dailyStatus.canSubmit ? (

                    <>
                      <CheckCircle2 className="w-5 h-5" />

                      <span>
                        오늘 참여 완료
                      </span>
                    </>

                  ) : (

                    <>
                      <Send className="w-5 h-5" />

                      <span>
                        미션 인증하기
                      </span>
                    </>

                  )}

                </button>

              </div>

            </div>

          </form>

        )}

      </main>


      {/* Footer */}
      <footer className="w-full border-t border-[#D9E2EC] py-6 px-4 bg-white text-center text-xs text-[#64748B] space-y-1.5">

        <p className="font-semibold text-[#172033]">
          2026 정보보호 미션 챌린지
        </p>


        <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#64748B]">

          <span>
            개인정보 안내
          </span>


          <span
            aria-hidden="true"
          >
            ·
          </span>


          <button
            type="button"
            onClick={
              navigateToAdmin
            }
            className="text-[#64748B] hover:text-[#2563EB] underline underline-offset-2 transition-colors cursor-pointer"
          >
            관리자
          </button>

        </p>

      </footer>

    </div>
  );
}