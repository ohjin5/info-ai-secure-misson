import React from "react";
import { BarChart3 } from "lucide-react";
import { MISSIONS } from "../../constants";

interface MissionStatsProps {
  missionStats?: Record<string, number>;
}

export const MissionStats: React.FC<MissionStatsProps> = ({ missionStats }) => {
  const labelMap: Record<string, string> = {
    M01: "M01 화면잠금",
    M02: "M02 클린데스크",
    M03: "M03 프린터 점검",
    M04: "M04 PC 정보보호 점검",
    M05: "M05 우리 팀 정보보호 활동",
  };

  const statsList = MISSIONS.map((m) => {
    const count = missionStats?.[m.id] ?? 0;
    return {
      id: m.id,
      label: labelMap[m.id] || m.title,
      count,
    };
  });

  const maxCount = Math.max(...statsList.map((s) => s.count), 1);

  return (
    <div className="bg-white border border-[#D9E2EC] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <BarChart3 className="w-5 h-5 text-[#2563EB]" />
        <h3 className="text-base sm:text-lg font-extrabold text-[#172033]">
          미션별 인증 현황
        </h3>
      </div>

      <div className="space-y-3">
        {statsList.map((item) => {
          const percent = Math.round((item.count / maxCount) * 100);
          return (
            <div key={item.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-[#172033]">
                <span>{item.label}</span>
                <span className="text-[#2563EB] tabular-nums">{item.count}건</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-[#2563EB] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(percent, 2)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
