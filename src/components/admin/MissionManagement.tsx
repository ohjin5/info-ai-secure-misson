import React, {
  useState,
  useEffect
} from "react";

import {
  Settings,
  Save,
  Check,
  Loader2,
  Calendar,
  AlertCircle,
  Circle,
  CheckCircle2
} from "lucide-react";

import {
  MISSIONS
} from "../../constants";

import {
  MissionSettings,
  updateMissionSettingsApi
} from "../../utils/api";


interface MissionManagementProps {
  adminPassword: string;

  initialSettings?: MissionSettings;

  onSettingsUpdated:
    () => Promise<void> | void;
}


export const MissionManagement:
  React.FC<MissionManagementProps> = ({
    adminPassword,
    initialSettings,
    onSettingsUpdated
  }) => {

    /**
     * 현재 운영 주차
     */
    const [
      selectedWeek,
      setSelectedWeek
    ] =
      useState(
        String(
          initialSettings?.currentWeek ??
          "1"
        )
      );


    /**
     * 이번 주 활성 미션
     *
     * API 구조는 string[]을 유지하지만
     * 실제로는 1개만 저장
     */
    const [
      activeMissions,
      setActiveMissions
    ] =
      useState<string[]>(() => {

        if (
          initialSettings?.activeMissions &&
          initialSettings.activeMissions.length >
            0
        ) {
          return [
            initialSettings.activeMissions[0]
          ];
        }


        if (
          MISSIONS.length >
          0
        ) {
          return [
            MISSIONS[0].id
          ];
        }


        return [];
      });


    const [
      isSaving,
      setIsSaving
    ] =
      useState(
        false
      );


    const [
      toastMessage,
      setToastMessage
    ] =
      useState<string | null>(
        null
      );


    const [
      errorMsg,
      setErrorMsg
    ] =
      useState<string | null>(
        null
      );


    /**
     * 서버 설정이 갱신되면
     * 관리자 화면도 동기화
     */
    useEffect(
      () => {

        if (
          !initialSettings
        ) {
          return;
        }


        setSelectedWeek(
          String(
            initialSettings.currentWeek ??
            "1"
          )
        );


        if (
          Array.isArray(
            initialSettings.activeMissions
          ) &&
          initialSettings.activeMissions.length >
            0
        ) {

          /**
           * 과거 설정에 여러 개가 저장돼 있어도
           * 첫 번째 미션 1개만 사용
           */
          setActiveMissions([
            initialSettings.activeMissions[0]
          ]);

        } else if (
          MISSIONS.length >
          0
        ) {

          setActiveMissions([
            MISSIONS[0].id
          ]);

        }

      },
      [
        initialSettings
      ]
    );


    /**
     * 미션 선택
     *
     * 라디오 버튼처럼 동작:
     * 새 미션을 누르면 기존 선택은 자동 해제
     */
    const selectMission = (
      missionId: string
    ) => {

      setErrorMsg(
        null
      );


      setToastMessage(
        null
      );


      setActiveMissions([
        missionId
      ]);
    };


    /**
     * 설정 저장
     */
    const handleSave =
      async () => {

        if (
          activeMissions.length !==
          1
        ) {

          setErrorMsg(
            "이번 주 미션을 1개 선택해주세요."
          );


          return;
        }


        const week =
          Number(
            selectedWeek
          );


        if (
          !Number.isInteger(
            week
          ) ||
          week < 1 ||
          week > 10
        ) {

          setErrorMsg(
            "운영 주차는 1주차부터 10주차까지 선택할 수 있습니다."
          );


          return;
        }


        try {

          setIsSaving(
            true
          );


          setErrorMsg(
            null
          );


          setToastMessage(
            null
          );


          await updateMissionSettingsApi(
            adminPassword,
            String(
              week
            ),
            [
              activeMissions[0]
            ]
          );


          setToastMessage(
            `${week}주차 미션이 저장되었습니다.`
          );


          /**
           * 관리자 데이터 다시 조회
           */
          await onSettingsUpdated();


          window.setTimeout(
            () => {

              setToastMessage(
                null
              );

            },
            3000
          );


        } catch (
          error
        ) {

          console.error(
            "Failed to update mission settings:",
            error
          );


          setErrorMsg(
            error instanceof Error
              ? error.message
              : "설정 저장 중 오류가 발생했습니다."
          );


        } finally {

          setIsSaving(
            false
          );

        }

      };


    const selectedMissionId =
      activeMissions.length >
      0
        ? activeMissions[0]
        : null;


    const selectedMission =
      MISSIONS.find(
        (
          mission
        ) =>
          mission.id ===
          selectedMissionId
      );


    return (
      <div className="bg-white border border-[#D9E2EC] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">

          <div className="flex items-center gap-2">

            <Settings className="w-5 h-5 text-[#2563EB]" />


            <h3 className="text-base sm:text-lg font-extrabold text-[#172033]">
              미션 운영 관리
            </h3>

          </div>


          <span className="text-xs text-[#64748B] font-medium">
            주차별로 공개할 미션 1개를 설정합니다.
          </span>

        </div>


        {/* Week + Save */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">

          <div className="flex items-center gap-2 flex-wrap">

            <Calendar className="w-4 h-4 text-[#2563EB] shrink-0" />


            <label
              htmlFor="mission-week-select"
              className="text-sm font-bold text-[#172033]"
            >
              현재 운영 주차
            </label>


            <select
              id="mission-week-select"

              value={
                selectedWeek
              }

              disabled={
                isSaving
              }

              onChange={(
                event
              ) => {

                setSelectedWeek(
                  event.target.value
                );


                setErrorMsg(
                  null
                );


                setToastMessage(
                  null
                );

              }}

              className="h-9 px-3 bg-white border border-[#D9E2EC] rounded-lg text-sm font-bold text-[#1E3A5F] focus:outline-none focus:border-[#2563EB] disabled:opacity-60"
            >

              {Array.from(
                {
                  length: 10
                },
                (
                  _,
                  index
                ) => {

                  const week =
                    String(
                      index + 1
                    );


                  return (
                    <option
                      key={
                        week
                      }

                      value={
                        week
                      }
                    >
                      {week}주차
                    </option>
                  );

                }
              )}

            </select>

          </div>


          <button
            type="button"

            disabled={
              isSaving ||
              activeMissions.length !==
                1
            }

            onClick={
              handleSave
            }

            className="h-10 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 disabled:pointer-events-none text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
          >

            {isSaving ? (

              <Loader2 className="w-4 h-4 animate-spin" />

            ) : (

              <Save className="w-4 h-4" />

            )}


            <span>

              {isSaving
                ? "저장 중..."
                : "변경사항 저장"}

            </span>

          </button>

        </div>


        {/* 현재 선택 */}
        {selectedMission && (

          <div className="bg-[#EAF2FF] border border-blue-200 rounded-xl p-3.5 flex items-center justify-between gap-3">

            <div className="min-w-0">

              <div className="text-[10px] font-extrabold tracking-wide text-[#2563EB]">
                {selectedWeek}주차 OPEN 미션
              </div>


              <div className="text-base font-extrabold text-[#172033] mt-0.5">
                {selectedMission.title}
              </div>


              <div className="text-xs text-[#64748B] mt-1">
                {selectedMission.description}
              </div>

            </div>


            <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0">

              <CheckCircle2 className="w-5 h-5" />

            </div>

          </div>

        )}


        {/* Error */}
        {errorMsg && (

          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-xs font-semibold text-rose-800">

            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />


            <span>
              {errorMsg}
            </span>

          </div>

        )}


        {/* Success */}
        {toastMessage && (

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-800 animate-in fade-in">

            <Check className="w-4 h-4 text-emerald-600 shrink-0" />


            <span>
              {toastMessage}
            </span>

          </div>

        )}


        {/* Missions */}
        <div className="space-y-3">

          <div className="flex flex-wrap items-center justify-between gap-2">

            <div>

              <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                이번 주 OPEN 미션
              </div>


              <div className="text-[11px] text-[#94A3B8] mt-0.5">
                선택한 미션 1개만 사용자 화면에서 잠금 해제됩니다.
              </div>

            </div>


            <div className="text-xs font-extrabold px-2.5 py-1 rounded-full border bg-[#EAF2FF] border-blue-200 text-[#2563EB]">

              1개 선택

            </div>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">

            {MISSIONS.map(
              (
                mission
              ) => {

                const isChecked =
                  selectedMissionId ===
                  mission.id;


                return (
                  <button
                    key={
                      mission.id
                    }

                    type="button"

                    disabled={
                      isSaving
                    }

                    aria-pressed={
                      isChecked
                    }

                    onClick={() =>
                      selectMission(
                        mission.id
                      )
                    }

                    className={`w-full p-3.5 rounded-xl border flex items-start gap-3 transition-all text-left disabled:opacity-60 ${
                      isChecked
                        ? "bg-[#EAF2FF] border-[#2563EB] shadow-xs cursor-pointer"
                        : "bg-white border-[#D9E2EC] hover:border-blue-300 hover:bg-slate-50 cursor-pointer"
                    }`}
                  >

                    {/* Radio */}
                    <div className="w-6 h-6 shrink-0 flex items-center justify-center mt-0.5">

                      {isChecked ? (

                        <CheckCircle2 className="w-6 h-6 text-[#2563EB]" />

                      ) : (

                        <Circle className="w-6 h-6 text-slate-300" />

                      )}

                    </div>


                    {/* Mission */}
                    <div className="min-w-0 flex-1">

                      <div
                        className={`text-[10px] font-extrabold tracking-wide ${
                          isChecked
                            ? "text-[#2563EB]"
                            : "text-[#94A3B8]"
                        }`}
                      >
                        {mission.id}
                      </div>


                      <div className="text-sm sm:text-base font-extrabold text-[#172033] leading-snug mt-0.5">
                        {mission.title}
                      </div>


                      <div className="text-xs text-[#64748B] leading-relaxed mt-1 break-keep">
                        {mission.description}
                      </div>

                    </div>


                    {isChecked && (

                      <span className="text-[10px] font-bold text-[#2563EB] shrink-0">
                        OPEN
                      </span>

                    )}

                  </button>
                );

              }
            )}

          </div>

        </div>


        {/* 안내 */}
        <div className="text-[11px] sm:text-xs text-[#64748B] leading-relaxed bg-slate-50 border border-slate-200 rounded-xl p-3">

          주차별로 미션 1개만 공개할 수 있습니다.
          다른 미션을 선택하면 기존 미션은 자동으로 해제됩니다.
          저장 후 사용자 화면의 「정보보호 미션 마을」에서 선택한 미션만 OPEN 상태로 표시됩니다.

        </div>

      </div>
    );
  };