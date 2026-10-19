import React from "react";
import {
  Lock,
  Sparkles,
  Printer,
  MonitorCheck,
  ShieldCheck,
  Shuffle,
  Gift,
  CheckCircle2
} from "lucide-react";
import { Mission } from "../constants";

interface MissionDrawCardProps {
  missions: Mission[];
  selectedMission: Mission | null;
  onSelectMission: (mission: Mission) => void;
}

export const MissionDrawCard: React.FC<MissionDrawCardProps> = ({
  missions,
  selectedMission,
  onSelectMission
}) => {
  const getIcon = (iconType: Mission["icon"]) => {
    switch (iconType) {
      case "lock":
        return <Lock className="w-7 h-7" />;
      case "sparkles":
        return <Sparkles className="w-7 h-7" />;
      case "printer":
        return <Printer className="w-7 h-7" />;
      case "monitor-check":
        return <MonitorCheck className="w-7 h-7" />;
      case "shield-check":
        return <ShieldCheck className="w-7 h-7" />;
      default:
        return <ShieldCheck className="w-7 h-7" />;
    }
  };

  const drawMission = () => {
    if (!missions || missions.length === 0) return;

    if (missions.length === 1) {
      onSelectMission(missions[0]);
      return;
    }

    let pool = missions;

    if (selectedMission) {
      const filtered = missions.filter((m) => m.id !== selectedMission.id);
      if (filtered.length > 0) {
        pool = filtered;
      }
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    onSelectMission(pool[randomIndex]);
  };

  if (!missions || missions.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
        현재 공개할 미션이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!selectedMission ? (
        <div className="relative">
          {/* 뒤 카드들 */}
          <div className="absolute left-1/2 top-2 -translate-x-1/2 rotate-[-8deg] w-[88%] h-[220px] rounded-3xl bg-blue-100 border border-blue-200 opacity-70" />
          <div className="absolute left-1/2 top-1 -translate-x-1/2 rotate-[8deg] w-[88%] h-[220px] rounded-3xl bg-slate-100 border border-slate-200 opacity-80" />

          {/* 메인 카드 뒷면 */}
          <button
            type="button"
            onClick={drawMission}
            className="relative w-full rounded-3xl border border-[#2563EB]/30 bg-gradient-to-br from-[#1E3A5F] to-[#2563EB] text-white p-6 min-h-[220px] shadow-lg overflow-hidden cursor-pointer active:scale-[0.99] transition-all"
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-4 left-4 text-xs">MISSION</div>
              <div className="absolute top-10 right-6 text-xs">MISSION</div>
              <div className="absolute bottom-8 left-8 text-xs">MISSION</div>
              <div className="absolute bottom-4 right-4 text-xs">MISSION</div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/15 border border-white/20 flex items-center justify-center">
                <Gift className="w-8 h-8 text-white" />
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold tracking-[0.2em] text-blue-100">
                  2026 INFORMATION SECURITY
                </div>
                <h3 className="text-2xl font-extrabold">오늘의 미션 카드</h3>
                <p className="text-sm text-blue-100">
                  카드를 눌러 이번 주 미션을 공개하세요
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#1E3A5F] font-bold text-sm">
                <Shuffle className="w-4 h-4" />
                <span>카드 열기</span>
              </div>
            </div>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* 공개된 카드 */}
          <div className="relative rounded-3xl border border-[#2563EB]/20 bg-white shadow-md overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#1E3A5F] to-[#2563EB]" />

            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-[#EAF2FF] text-[#2563EB] flex items-center justify-center shrink-0">
                    {getIcon(selectedMission.icon)}
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#2563EB]">
                      공개된 미션 {selectedMission.id}
                    </div>
                    <h3 className="text-xl font-extrabold text-[#172033] leading-snug">
                      {selectedMission.title}
                    </h3>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  선택됨
                </span>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <div className="text-sm font-semibold text-[#172033]">
                  {selectedMission.description}
                </div>
              </div>

              <div className="rounded-2xl bg-[#EAF2FF]/50 border border-blue-100 p-4">
                <div className="text-xs font-bold text-[#1E3A5F] mb-1">
                  수행 방법
                </div>
                <div className="text-sm text-[#172033] leading-relaxed">
                  {selectedMission.guide}
                </div>
              </div>
            </div>
          </div>

          {missions.length > 1 && (
            <button
              type="button"
              onClick={drawMission}
              className="w-full h-11 rounded-2xl border border-[#2563EB] bg-white text-[#2563EB] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#EAF2FF] transition-colors cursor-pointer"
            >
              <Shuffle className="w-4 h-4" />
              <span>다른 카드 뽑기</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};