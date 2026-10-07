import React, { useState, useEffect } from "react";
import { Settings, Save, Check, Loader2, Calendar, AlertCircle } from "lucide-react";
import { MISSIONS } from "../../constants";
import { MissionSettings, updateMissionSettingsApi } from "../../utils/api";

interface MissionManagementProps {
  adminPassword: string;
  initialSettings?: MissionSettings;
  onSettingsUpdated: () => void;
}

export const MissionManagement: React.FC<MissionManagementProps> = ({
  adminPassword,
  initialSettings,
  onSettingsUpdated,
}) => {
  const [selectedWeek, setSelectedWeek] = useState(
    initialSettings?.currentWeek || "1"
  );
  const [activeMissions, setActiveMissions] = useState<string[]>(
    initialSettings?.activeMissions || MISSIONS.map((m) => m.id)
  );

  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialSettings) {
      if (initialSettings.currentWeek) {
        setSelectedWeek(initialSettings.currentWeek);
      }
      if (initialSettings.activeMissions && initialSettings.activeMissions.length > 0) {
        setActiveMissions(initialSettings.activeMissions);
      }
    }
  }, [initialSettings]);

  const toggleMission = (id: string) => {
    setErrorMsg(null);
    if (activeMissions.includes(id)) {
      if (activeMissions.length <= 1) {
        setErrorMsg("최소 1개 이상의 미션을 선택해야 합니다.");
        return;
      }
      setActiveMissions(activeMissions.filter((mId) => mId !== id));
    } else {
      setActiveMissions([...activeMissions, id]);
    }
  };

  const handleSave = async () => {
    if (activeMissions.length === 0) {
      setErrorMsg("최소 1개 이상의 미션을 선택해주세요.");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg(null);
      setToastMessage(null);

      const res = await updateMissionSettingsApi(
        adminPassword,
        selectedWeek,
        activeMissions
      );

      if (res && res.success !== false) {
        setToastMessage("미션 운영 설정이 저장되었습니다.");
        onSettingsUpdated();
        setTimeout(() => {
          setToastMessage(null);
        }, 3000);
      } else {
        setErrorMsg(res.message || "설정 저장에 실패했습니다.");
      }
    } catch (err) {
      console.error("Failed to update mission settings", err);
      setErrorMsg("설정 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-[#D9E2EC] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#2563EB]" />
          <h3 className="text-base sm:text-lg font-extrabold text-[#172033]">
            미션 운영 관리 (주차별 미션 노출)
          </h3>
        </div>
        <span className="text-xs text-[#64748B] font-medium">
          사용자 앱에 활성화할 미션과 현재 운영 주차를 설정합니다
        </span>
      </div>

      {/* Week Selection & Save button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#2563EB] shrink-0" />
          <label className="text-sm font-bold text-[#172033]">운영 주차 선택:</label>
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="h-9 px-3 bg-white border border-[#D9E2EC] rounded-lg text-sm font-bold text-[#1E3A5F] focus:outline-none focus:border-[#2563EB]"
          >
            <option value="1">1주차</option>
            <option value="2">2주차</option>
            <option value="3">3주차</option>
            <option value="4">4주차</option>
          </select>
        </div>

        <button
          type="button"
          disabled={isSaving}
          onClick={handleSave}
          className="h-9 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>변경사항 저장</span>
        </button>
      </div>

      {/* Error & Success Feedback */}
      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-800 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mission Checkboxes */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
          활성화할 미션 선택 ({activeMissions.length} / {MISSIONS.length}개 선택됨)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {MISSIONS.map((m) => {
            const isChecked = activeMissions.includes(m.id);
            return (
              <label
                key={m.id}
                onClick={() => toggleMission(m.id)}
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  isChecked
                    ? "bg-[#EAF2FF] border-[#2563EB] text-[#172033]"
                    : "bg-white border-[#D9E2EC] text-slate-500 hover:border-slate-300"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-colors ${
                    isChecked
                      ? "bg-[#2563EB] border-[#2563EB] text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#1E3A5F]">
                    {m.id} 미션
                  </div>
                  <div className="text-sm font-extrabold truncate">
                    {m.title}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
