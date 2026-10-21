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
  ParticipationChallenge
} from "./components/ParticipationChallenge";

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
  DailySubmissionStatus,
  ParticipationChallenge as ParticipationChallengeData
} from "./utils/api";

import {
  Loader2,
  AlertCircle,
  Send,
  Calendar,
  CheckCircle2,
  Clock3,
  Info,
  Camera,
  AlertTriangle
} from "lucide-react";


/**
 * =====================================
 * Device ID
 * =====================================
 */
function getOrCreateDeviceId(): string {

  const storageKey =
    "securityMissionDeviceId";


  if (
    typeof window ===
    "undefined"
  ) {

    return "";

  }


  let deviceId =
    window.localStorage.getItem(
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


    window.localStorage.setItem(
      storageKey,
      deviceId
    );

  }


  return deviceId;
}


/**
 * =====================================
 * App
 * =====================================
 */
export default function App() {

  /**
   * =====================================
   * Navigation
   * =====================================
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
   * =====================================
   * Device
   * =====================================
   */

  const [
    deviceId
  ] =
    useState<string>(
      () =>
        getOrCreateDeviceId()
    );


  /**
   * =====================================
   * Mission settings
   * =====================================
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
      []
    );


  const [
    isLoadingSettings,
    setIsLoadingSettings
  ] =
    useState(
      true
    );


  /**
   * =====================================
   * 누적 참여 공동목표
   * =====================================
   */

  const [
    participationChallenge,
    setParticipationChallenge
  ] =
    useState<
      ParticipationChallengeData | null
    >(
      null
    );


  /**
   * =====================================
   * 봉투 공개 여부
   * =====================================
   */

  const [
    isMissionRevealed,
    setIsMissionRevealed
  ] =
    useState(
      false
    );


  /**
   * =====================================
   * Daily status
   * =====================================
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
   * =====================================
   * Form
   * =====================================
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


  /**
   * 사번
   */
  const [
    employeeId,
    setEmployeeId
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
   * =====================================
   * Submit
   * =====================================
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
   * =====================================
   * Admin
   * =====================================
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
   * =====================================
   * Mission settings 조회
   * =====================================
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


          if (!settings) {

            setParticipationChallenge(
              null
            );


            return;

          }


          /**
           * 누적 참여 공동목표
           */
          setParticipationChallenge(
            settings
              .participationChallenge ??
            null
          );


          /**
           * 현재 운영 주차
           */
          const week =
            String(
              settings.currentWeek ||
              "1"
            );


          setCurrentWeek(
            week
          );


          /**
           * 주차별 미션은 하나만 사용
           */
          const active =
            Array.isArray(
              settings.activeMissions
            ) &&
            settings.activeMissions.length >
              0
              ? [
                  settings.activeMissions[0]
                ]
              : [];


          setActiveMissions(
            active
          );


          /**
           * 관리자가 미션을 변경한 경우
           * 기존 선택상태 초기화
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

                setIsMissionRevealed(
                  false
                );


                setDescription(
                  ""
                );


                return null;

              }


              return previous;

            }
          );


        } catch (
          error
        ) {

          console.error(
            "Mission settings error:",
            error
          );


          setParticipationChallenge(
            null
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
   * =====================================
   * Daily status 조회
   * =====================================
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


        } catch (
          error
        ) {

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
   * =====================================
   * 사용자 화면 진입
   * =====================================
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
   * =====================================
   * Browser history
   * =====================================
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

            } else {

              setView(
                "admin-dashboard"
              );

            }


          } else {

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
      adminData
    ]
  );


  /**
   * =====================================
   * 이번 주 OPEN 미션
   * =====================================
   */

  const activeMissionId =
    activeMissions.length >
      0
      ? activeMissions[0]
      : null;


  const activeMission =
    activeMissionId
      ? MISSIONS.find(
          (
            mission
          ) =>
            mission.id ===
            activeMissionId
        ) ?? null
      : null;


  /**
   * =====================================
   * M14 자랑하GO 설명 필수
   * =====================================
   */

  const isDescriptionValid =
    selectedMission?.id !==
      "M14" ||
    Boolean(
      description.trim()
    );


  /**
   * =====================================
   * Form valid
   *
   * 이름 + 사번 모두 필수
   * =====================================
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
      employeeId.trim()
    ) &&
    Boolean(
      imageData
    ) &&
    isDescriptionValid &&
    dailyStatus.canSubmit;


  /**
   * =====================================
   * 봉투 열기
   * =====================================
   */

  const handleRevealMission =
    () => {

      if (
        !activeMission ||
        !dailyStatus.canSubmit
      ) {

        return;

      }


      setIsMissionRevealed(
        true
      );

    };


  /**
   * =====================================
   * 미션 참여 선택
   * =====================================
   */

  const handleMissionSelect =
    (
      mission: Mission
    ) => {

      if (
        mission.id !==
        activeMissionId
      ) {

        return;

      }


      setSelectedMission(
        mission
      );


      setDescription(
        ""
      );


      setSubmitError(
        null
      );

    };


  /**
   * =====================================
   * Submit
   * =====================================
   */

  const handleSubmit =
    async (
      event:
        React.FormEvent
    ) => {

      event.preventDefault();


      /**
       * 오늘 참여 완료
       */
      if (
        !dailyStatus.canSubmit
      ) {

        setSubmitError(
          "오늘 참여를 이미 완료했습니다. 내일 다시 참여해주세요."
        );


        return;

      }


      /**
       * 사번 필수
       */
      if (
        !employeeId.trim()
      ) {

        setSubmitError(
          "사번을 입력해주세요."
        );


        return;

      }


      /**
       * M14 설명 필수
       */
      if (
        selectedMission?.id ===
          "M14" &&
        !description.trim()
      ) {

        setSubmitError(
          "우리 팀의 정보보호 활동 내용을 간단히 입력해주세요."
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


      /**
       * 현재 OPEN 미션 재확인
       */
      if (
        selectedMission.id !==
        activeMissionId
      ) {

        setSubmitError(
          "현재 참여할 수 없는 미션입니다. 화면을 새로고침해주세요."
        );


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
         * 제출 직전
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


        /**
         * 실제 제출
         */
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

            employeeId:
              employeeId.trim(),

            description:
              description.trim(),

            imageData,

            imageMimeType:
              "image/jpeg",

            deviceId

          });


        if (
          response &&
          response.success !==
            false
        ) {

          /**
           * 오늘 참여상태 갱신
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


          /**
           * 누적참여 숫자 갱신
           */
          try {

            const latestSettings =
              await fetchMissionSettingsApi();


            if (
              latestSettings
                ?.participationChallenge
            ) {

              setParticipationChallenge(
                latestSettings
                  .participationChallenge
              );

            }


          } catch (
            challengeError
          ) {

            console.warn(
              "Failed to refresh participation challenge:",
              challengeError
            );

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


      } catch (
        error
      ) {

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
   * =====================================
   * 성공 → 처음으로
   * =====================================
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


      /**
       * 사번 초기화
       */
      setEmployeeId(
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


      setIsMissionRevealed(
        false
      );


      setView(
        "form"
      );

    };


  /**
   * =====================================
   * Admin
   * =====================================
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
   * =====================================
   * Admin Login
   * =====================================
   */

  if (
    view ===
    "admin-login"
  ) {

    return (
      <div
        className="
          min-h-screen
          bg-[#F5F8FC]
          px-3
          py-5
          sm:px-4
          sm:py-6
          font-sans
        "
      >

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
   * =====================================
   * Admin Dashboard
   * =====================================
   */

  if (
    view ===
      "admin-dashboard" &&
    adminData
  ) {

    return (
      <div
        className="
          min-h-screen
          bg-[#F5F8FC]
          px-3
          py-5
          sm:px-4
          sm:py-6
          font-sans
        "
      >

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
   * =====================================
   * User
   * =====================================
   */

  return (
    <div
      className="
        min-h-screen
        bg-[#F5F8FC]
        text-[#172033]
        flex
        flex-col
        font-sans
      "
    >

      <main
        className="
          w-full
          max-w-2xl
          mx-auto
          px-3
          sm:px-4
          lg:px-5
          py-4
          sm:py-8
          flex-1
        "
      >

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

            className="
              space-y-4
              sm:space-y-5
              pb-24
              sm:pb-28
            "
          >

            {/* =====================================
                Header
            ====================================== */}
            <Header
              onNavigateToAdmin={
                navigateToAdmin
              }
            />


            {/* =====================================
                오늘 참여 상태
            ====================================== */}
            {!isLoadingDailyStatus && (

              <div
                className={
                  dailyStatus.canSubmit

                    ? `
                      bg-white
                      border
                      border-[#D9E2EC]
                      rounded-2xl
                      px-3.5
                      sm:px-4
                      py-3
                      flex
                      items-center
                      justify-between
                      gap-3
                    `

                    : `
                      bg-emerald-50
                      border
                      border-emerald-200
                      rounded-2xl
                      px-3.5
                      sm:px-4
                      py-3
                      flex
                      items-center
                      gap-3
                    `
                }
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    min-w-0
                  "
                >

                  {dailyStatus.canSubmit ? (

                    <Clock3
                      className="
                        w-4
                        h-4
                        text-[#2563EB]
                        shrink-0
                      "
                    />

                  ) : (

                    <CheckCircle2
                      className="
                        w-4
                        h-4
                        text-emerald-600
                        shrink-0
                      "
                    />

                  )}


                  <span
                    className="
                      text-xs
                      sm:text-sm
                      font-semibold
                      text-[#475569]
                      truncate
                    "
                  >

                    {dailyStatus.canSubmit
                      ? "오늘 1회 참여할 수 있어요."
                      : "오늘 참여를 완료했습니다."}

                  </span>

                </div>


                {dailyStatus.canSubmit && (

                  <span
                    className="
                      text-[11px]
                      sm:text-xs
                      font-bold
                      text-[#2563EB]
                      whitespace-nowrap
                    "
                  >
                    1회 가능
                  </span>

                )}

              </div>

            )}


            {/* =====================================
                공동 참여 목표
            ====================================== */}
            <ParticipationChallenge
              challenge={
                participationChallenge
              }
            />


            {/* =====================================
                이번 주 미션
            ====================================== */}
            <section
              className={`
                bg-white
                border
                border-[#D9E2EC]
                rounded-2xl
                sm:rounded-3xl
                p-3
                sm:p-6
                shadow-xs
                space-y-4
                sm:space-y-5
                ${
                  !dailyStatus.canSubmit
                    ? "opacity-60 pointer-events-none"
                    : ""
                }
              `}
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-2
                  sm:gap-3
                  border-b
                  border-slate-100
                  pb-3
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    min-w-0
                  "
                >

                  <span
                    className="
                      w-6
                      h-6
                      rounded-full
                      bg-[#2563EB]
                      text-white
                      font-black
                      text-xs
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                  >
                    1
                  </span>


                  <h2
                    className="
                      text-sm
                      min-[380px]:text-base
                      sm:text-lg
                      font-extrabold
                      text-[#172033]
                      leading-tight
                      break-keep
                    "
                  >
                    이번 주 정보보호 미션
                  </h2>

                </div>


                <div
                  className="
                    inline-flex
                    items-center
                    gap-1
                    px-2
                    sm:px-2.5
                    py-1
                    bg-[#EAF2FF]
                    text-[#2563EB]
                    text-[10px]
                    sm:text-xs
                    font-bold
                    rounded-full
                    border
                    border-blue-200
                    whitespace-nowrap
                    shrink-0
                  "
                >

                  <Calendar
                    className="
                      w-3
                      sm:w-3.5
                      h-3
                      sm:h-3.5
                    "
                  />


                  <span>
                    {currentWeek}주차
                  </span>

                </div>

              </div>


              {/* 미션 카드 */}
              <div
                className="
                  w-full
                  flex
                  justify-center
                "
              >

                <div
                  className="
                    w-full
                    max-w-[430px]
                    mx-auto
                  "
                >

                  {isLoadingSettings ? (

                    <div
                      className="
                        w-full
                        min-h-[260px]
                        sm:min-h-[285px]
                        bg-slate-100
                        animate-pulse
                        rounded-[24px]
                        sm:rounded-[28px]
                      "
                    />

                  ) : !activeMission ? (

                    <div
                      className="
                        w-full
                        py-10
                        sm:py-12
                        px-4
                        text-center
                        bg-slate-50
                        border
                        border-dashed
                        border-slate-300
                        rounded-2xl
                      "
                    >

                      <AlertCircle
                        className="
                          w-6
                          h-6
                          text-slate-400
                          mx-auto
                          mb-2
                        "
                      />


                      <div
                        className="
                          text-sm
                          font-bold
                          text-slate-500
                        "
                      >
                        현재 공개된 미션이 없습니다.
                      </div>

                    </div>

                  ) : (

                    <MissionCard
                      mission={
                        activeMission
                      }

                      isRevealed={
                        isMissionRevealed
                      }

                      isSelected={
                        selectedMission?.id ===
                        activeMission.id
                      }

                      onReveal={
                        handleRevealMission
                      }

                      onSelect={
                        handleMissionSelect
                      }
                    />

                  )}

                </div>

              </div>


              {/* =====================================
                  미션 상세
              ====================================== */}
              {selectedMission && (

                <div
                  className="
                    w-full
                    max-w-[520px]
                    mx-auto
                    space-y-3
                    pt-1
                    animate-in
                    fade-in
                    slide-in-from-top-1
                    duration-300
                  "
                >

                  {/* 수행 방법 */}
                  <div
                    className="
                      bg-[#EAF2FF]/60
                      border
                      border-blue-100
                      rounded-xl
                      sm:rounded-2xl
                      p-3
                      sm:p-3.5
                      flex
                      items-start
                      gap-3
                    "
                  >

                    <div
                      className="
                        w-8
                        h-8
                        rounded-xl
                        bg-white
                        text-[#2563EB]
                        flex
                        items-center
                        justify-center
                        shrink-0
                        border
                        border-blue-100
                      "
                    >

                      <Info className="w-4 h-4" />

                    </div>


                    <div className="min-w-0">

                      <div
                        className="
                          text-xs
                          font-extrabold
                          text-[#1E3A5F]
                        "
                      >
                        수행 방법
                      </div>


                      <p
                        className="
                          mt-1
                          text-xs
                          sm:text-sm
                          text-[#334155]
                          leading-relaxed
                          font-medium
                          break-keep
                        "
                      >
                        {selectedMission.guide}
                      </p>

                    </div>

                  </div>


                  {/* 인증 방법 */}
                  <div
                    className="
                      bg-white
                      border
                      border-[#D9E2EC]
                      rounded-xl
                      sm:rounded-2xl
                      p-3
                      sm:p-3.5
                      flex
                      items-start
                      gap-3
                    "
                  >

                    <div
                      className="
                        w-8
                        h-8
                        rounded-xl
                        bg-[#EAF2FF]
                        text-[#2563EB]
                        flex
                        items-center
                        justify-center
                        shrink-0
                      "
                    >

                      <Camera className="w-4 h-4" />

                    </div>


                    <div className="min-w-0">

                      <div
                        className="
                          text-xs
                          font-extrabold
                          text-[#1E3A5F]
                        "
                      >
                        인증 방법
                      </div>


                      <p
                        className="
                          mt-1
                          text-xs
                          sm:text-sm
                          text-[#334155]
                          leading-relaxed
                          font-medium
                          break-keep
                        "
                      >
                        {selectedMission.verificationGuide}
                      </p>

                    </div>

                  </div>


                  {/* 개인정보 주의 */}
                  <div
                    className="
                      bg-amber-50
                      border
                      border-amber-200
                      rounded-xl
                      p-3
                      flex
                      items-start
                      gap-2
                    "
                  >

                    <AlertTriangle
                      className="
                        w-4
                        h-4
                        text-amber-600
                        shrink-0
                        mt-0.5
                      "
                    />


                    <p
                      className="
                        text-[11px]
                        sm:text-xs
                        text-amber-900
                        leading-relaxed
                        font-medium
                        break-keep
                      "
                    >
                      인증사진에 환자 이름, 등록번호,
                      의무기록, 비밀번호 등 개인정보가
                      보이지 않는지 반드시 확인해주세요.
                    </p>

                  </div>

                </div>

              )}

            </section>


            {/* =====================================
                부서
            ====================================== */}
            <section
              className={`
                bg-white
                border
                border-[#D9E2EC]
                rounded-2xl
                sm:rounded-3xl
                p-4
                sm:p-6
                space-y-4
                ${
                  !dailyStatus.canSubmit
                    ? "opacity-60 pointer-events-none"
                    : ""
                }
              `}
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  border-b
                  border-slate-100
                  pb-3
                "
              >

                <span
                  className="
                    w-6
                    h-6
                    rounded-full
                    bg-[#2563EB]
                    text-white
                    font-black
                    text-xs
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >
                  2
                </span>


                <h2
                  className="
                    text-sm
                    sm:text-base
                    font-extrabold
                    text-[#172033]
                  "
                >

                  부서 선택{" "}

                  <span className="text-red-500">
                    *
                  </span>

                </h2>

              </div>


              <DepartmentCombobox
                value={
                  department
                }

                onChange={
                  setDepartment
                }
              />

            </section>


            {/* =====================================
                참여자 정보
            ====================================== */}
            <section
              className={`
                bg-white
                border
                border-[#D9E2EC]
                rounded-2xl
                sm:rounded-3xl
                p-4
                sm:p-6
                space-y-4
                ${
                  !dailyStatus.canSubmit
                    ? "opacity-60 pointer-events-none"
                    : ""
                }
              `}
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  border-b
                  border-slate-100
                  pb-3
                "
              >

                <span
                  className="
                    w-6
                    h-6
                    rounded-full
                    bg-[#2563EB]
                    text-white
                    font-black
                    text-xs
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >
                  3
                </span>


                <h2
                  className="
                    text-sm
                    sm:text-base
                    font-extrabold
                    text-[#172033]
                  "
                >
                  참여자 정보
                </h2>

              </div>


              <UserInfoForm
                name={
                  name
                }

                onChangeName={
                  setName
                }

                employeeId={
                  employeeId
                }

                onChangeEmployeeId={
                  setEmployeeId
                }

                description={
                  description
                }

                onChangeDescription={
                  setDescription
                }

                requiresDescription={
                  selectedMission?.id ===
                  "M14"
                }
              />

            </section>


            {/* =====================================
                사진
            ====================================== */}
            <section
              className={`
                bg-white
                border
                border-[#D9E2EC]
                rounded-2xl
                sm:rounded-3xl
                p-4
                sm:p-6
                space-y-4
                ${
                  !dailyStatus.canSubmit
                    ? "opacity-60 pointer-events-none"
                    : ""
                }
              `}
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  border-b
                  border-slate-100
                  pb-3
                "
              >

                <span
                  className="
                    w-6
                    h-6
                    rounded-full
                    bg-[#2563EB]
                    text-white
                    font-black
                    text-xs
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >
                  4
                </span>


                <h2
                  className="
                    text-sm
                    sm:text-base
                    font-extrabold
                    text-[#172033]
                  "
                >

                  인증사진 촬영 및 등록{" "}

                  <span className="text-red-500">
                    *
                  </span>

                </h2>

              </div>


              <PhotoUploader
                imageData={
                  imageData
                }

                onImageSelected={
                  setImageData
                }
              />

            </section>


            {/* =====================================
                Error
            ====================================== */}
            {submitError && (

              <div
                className="
                  p-3.5
                  sm:p-4
                  bg-rose-50
                  border
                  border-rose-200
                  rounded-2xl
                  flex
                  items-start
                  gap-2
                  text-xs
                  sm:text-sm
                  font-semibold
                  text-rose-900
                "
              >

                <AlertCircle
                  className="
                    w-5
                    h-5
                    text-rose-600
                    shrink-0
                  "
                />


                <span className="leading-relaxed">
                  {submitError}
                </span>

              </div>

            )}


            {/* =====================================
                Sticky Submit
            ====================================== */}
            <div
              className="
                fixed
                bottom-0
                left-0
                right-0
                z-40
                bg-white/95
                backdrop-blur-md
                border-t
                border-[#D9E2EC]
                px-3
                sm:px-4
                pt-3
                pb-[calc(0.75rem+env(safe-area-inset-bottom))]
                shadow-[0_-4px_18px_rgba(15,23,42,0.08)]
              "
            >

              <div
                className="
                  w-full
                  max-w-2xl
                  mx-auto
                "
              >

                <button
                  type="submit"

                  disabled={
                    !isFormValid ||
                    isSubmitting ||
                    !dailyStatus.canSubmit
                  }

                  className="
                    w-full
                    min-h-12
                    sm:min-h-14
                    px-4
                    bg-[#2563EB]
                    hover:bg-[#1D4ED8]
                    text-white
                    rounded-xl
                    sm:rounded-2xl
                    font-bold
                    text-sm
                    sm:text-base
                    flex
                    items-center
                    justify-center
                    gap-2
                    shadow-md
                    disabled:opacity-40
                    disabled:pointer-events-none
                    active:scale-[0.99]
                    transition-all
                    cursor-pointer
                  "
                >

                  {isSubmitting ? (

                    <>
                      <Loader2
                        className="
                          w-5
                          h-5
                          animate-spin
                        "
                      />

                      <span>
                        등록 중...
                      </span>
                    </>

                  ) : !dailyStatus.canSubmit ? (

                    <>
                      <CheckCircle2 className="w-5 h-5" />

                      <span>
                        오늘 참여 완료
                      </span>
                    </>

                  ) : !isMissionRevealed ? (

                    <>
                      <Send className="w-5 h-5" />

                      <span>
                        먼저 미션 봉투를 열어주세요
                      </span>
                    </>

                  ) : !selectedMission ? (

                    <>
                      <Send className="w-5 h-5" />

                      <span>
                        미션 참여하기를 눌러주세요
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


      {/* =====================================
          Footer
      ====================================== */}
      <footer
        className="
          w-full
          border-t
          border-[#D9E2EC]
          py-5
          sm:py-6
          px-4
          bg-white
          text-center
          text-xs
          text-[#64748B]
        "
      >

        <div
          className="
            font-semibold
            text-[#172033]
          "
        >
          2026 정보보호 미션 챌린지
        </div>


        <button
          type="button"

          onClick={
            navigateToAdmin
          }

          className="
            mt-1
            text-[11px]
            underline
            underline-offset-2
            hover:text-[#2563EB]
            cursor-pointer
          "
        >
          관리자
        </button>

      </footer>

    </div>
  );
}