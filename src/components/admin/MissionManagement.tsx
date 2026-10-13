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
  AlertCircle
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
  onSettingsUpdated: () => Promise<void> | void;
}


export const MissionManagement:
  React.FC<MissionManagementProps> = ({
    adminPassword,
    initialSettings,
    onSettingsUpdated
  }) => {

    const [
      selectedWeek,
      setSelectedWeek
    ] = useState(
      String(
        initialSettings?.currentWeek ??
        "1"
      )
    );

    const [
      activeMissions,
      setActiveMissions
    ] = useState<string[]>(
      initialSettings
        ?.activeMissions
        ?.length
        ? initialSettings.activeMissions
        : MISSIONS.map(
            (mission) =>
              mission.id
          )
    );


    const [
      isSaving,
      setIsSaving
    ] = useState(false);

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
     * 서버에서 최신 설정을 다시 받으면
     * 관리자 화면 상태도 동기화
     */
    useEffect(() => {

      if (!initialSettings) {
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
        initialSettings
          .activeMissions.length >
          0
      ) {
        setActiveMissions(
          initialSettings.activeMissions
        );
      }

    }, [
      initialSettings
    ]);


    /**
     * 미션 선택/해제
     */
    const toggleMission = (
      missionId: string
    ) => {

      setErrorMsg(
        null
      );

      setToastMessage(
        null
      );


      setActiveMissions(
        (previous) => {

          if (
            previous.includes(
              missionId
            )
          ) {

            /**
             * 최소 1개는 반드시 유지
             */
            if (
              previous.length <=
              1
            ) {

              setErrorMsg(
                "최소 1개 이상의 미션을 선택해야 합니다."
              );

              return previous;
            }


            return previous.filter(
              (id) =>
                id !==
                missionId
            );
          }


          return [
            ...previous,
            missionId
          ];
        }
      );
    };


    /**
     * 운영 설정 저장
     */
    const handleSave =
      async () => {

        if (
          activeMissions.length ===
          0
        ) {
          setErrorMsg(
            "최소 1개 이상의 미션을 선택해주세요."
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
            String(week),
            activeMissions
          );


          setToastMessage(
            "미션 운영 설정이 저장되었습니다."
          );


          /**
           * 저장 후 관리자 전체 데이터 재조회
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

        } catch (error) {

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
            사용자 화면에 노출할 미션과 현재 운영 주차를 설정합니다.
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
              isSaving
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
        <div className="space-y-2">

          <div className="flex flex-wrap items-center justify-between gap-2">

            <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              활성화할 미션 선택
            </div>

            <div className="text-xs font-bold text-[#2563EB]">
              {activeMissions.length} /{" "}
              {MISSIONS.length}개 선택
            </div>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">

            {MISSIONS.map(
              (mission) => {

                const isChecked =
                  activeMissions.includes(
                    mission.id
                  );


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
                      toggleMission(
                        mission.id
                      )
                    }
                    className={`w-full p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all text-left disabled:opacity-60 ${
                      isChecked
                        ? "bg-[#EAF2FF] border-[#2563EB] text-[#172033]"
                        : "bg-white border-[#D9E2EC] text-slate-500 hover:border-slate-300"
                    }`}
                  >

                    {/* Checkbox */}
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-colors ${
                        isChecked
                          ? "bg-[#2563EB] border-[#2563EB] text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >

                      {isChecked && (

                        <Check className="w-3.5 h-3.5 stroke-[3]" />

                      )}

                    </div>


                    <div className="min-w-0">

                      <div
                        className={`text-xs font-bold ${
                          isChecked
                            ? "text-[#2563EB]"
                            : "text-[#64748B]"
                        }`}
                      >
                        {mission.id} 미션
                      </div>

                      <div className="text-sm font-extrabold text-[#172033] leading-snug">
                        {mission.title}
                      </div>

                    </div>

                  </button>
                );
              }
            )}

          </div>

        </div>


        {/* 안내 */}
        <div className="text-[11px] sm:text-xs text-[#64748B] leading-relaxed bg-slate-50 border border-slate-200 rounded-xl p-3">
          저장된 주차와 활성 미션은 사용자 화면에 즉시 반영됩니다.
          최소 1개 이상의 미션은 반드시 활성화되어 있어야 합니다.
        </div>

      </div>
    );
  };