import React from "react";
import { Lock, Sparkles, Printer, MonitorCheck, ShieldCheck, CheckCircle2, Info } from "lucide-react";
import { Mission } from "../constants";

interface MissionCardProps {
  mission: Mission;
  isSelected: boolean;
  onSelect: (mission: Mission) => void;
}

export const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  isSelected,
  onSelect,
}) => {
  const getIcon = (iconType: Mission["icon"]) => {
    switch (iconType) {
      case "lock":
        return <Lock className="w-5 h-5" />;
      case "sparkles":
        return <Sparkles className="w-5 h-5" />;
      case "printer":
        return <Printer className="w-5 h-5" />;
      case "monitor-check":
        return <MonitorCheck className="w-5 h-5" />;
      case "shield-check":
        return <ShieldCheck className="w-5 h-5" />;
      default:
        return <ShieldCheck className="w-5 h-5" />;
    }
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(mission)}
      className={`w-full text-left transition-all duration-200 rounded-2xl p-4 sm:p-5 relative cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
        isSelected
          ? "bg-[#EAF2FF] border-2 border-[#2563EB] shadow-xs"
          : "bg-white border border-[#D9E2EC] hover:border-blue-300 hover:bg-slate-50/80 shadow-xs"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              isSelected
                ? "bg-[#2563EB] text-white shadow-xs"
                : "bg-blue-100/70 text-[#1E3A5F]"
            }`}
          >
            {getIcon(mission.icon)}
          </div>
          <div>
            <span
              className={`text-[11px] font-bold tracking-wider uppercase ${
                isSelected ? "text-[#2563EB]" : "text-[#1E3A5F]"
              }`}
            >
              미션 {mission.id}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#172033] leading-snug">
              {mission.title}
            </h3>
          </div>
        </div>

        {/* Radio/Check button indicator */}
        <div className="shrink-0 mt-0.5">
          {isSelected ? (
            <CheckCircle2 className="w-6 h-6 text-[#2563EB] fill-blue-100" />
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
          )}
        </div>
      </div>

      <p className="text-xs sm:text-sm text-[#64748B] mt-2.5 leading-relaxed font-normal">
        {mission.description}
      </p>

      {/* Expanded Guide when selected */}
      {isSelected && (
        <div className="mt-3.5 pt-3 border-t border-blue-200/80 bg-white/80 p-3 rounded-xl flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-[#172033] font-medium">
            <span className="font-bold text-[#1E3A5F]">수행 방법: </span>
            {mission.guide}
          </div>
        </div>
      )}
    </button>
  );
};
