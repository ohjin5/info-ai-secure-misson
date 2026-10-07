import React from "react";
import { ShieldCheck, AlertTriangle, Lock } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="w-full space-y-3.5">
      {/* Hospital Campaign Top Banner - Navy & Primary Blue Accent */}
      <div className="bg-[#1E3A5F] text-white rounded-2xl p-5 sm:p-7 shadow-sm relative overflow-hidden border border-[#102A45]">
        {/* Subtle decorative glow */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-8 top-3 opacity-10 pointer-events-none hidden sm:block">
          <ShieldCheck className="w-32 h-32 text-blue-200" />
        </div>

        <div className="relative z-10 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-100 tracking-tight">
            <Lock className="w-3.5 h-3.5 text-blue-300" />
            <span>병원 교직원 정보보호 캠페인</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            2026 정보보호 미션 챌린지
          </h1>

          <p className="text-sm sm:text-base font-medium text-slate-200/90 max-w-xl">
            “오늘의 작은 실천이 우리의 정보를 지킵니다.”
          </p>
        </div>
      </div>

      {/* Patient Privacy Warning Banner - Clean Amber/Notice Callout */}
      <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3.5 sm:p-4 flex items-start gap-3 shadow-xs">
        <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <h2 className="text-xs font-bold text-amber-900 tracking-tight">
            [필수 확인] 개인정보 및 환자정보 보호 안내
          </h2>
          <p className="text-xs sm:text-sm text-amber-800 leading-snug font-medium">
            인증사진에는 환자정보, 의무기록, 비밀번호 및 개인정보가 노출되지 않도록 반드시 확인해주세요.
          </p>
        </div>
      </div>
    </header>
  );
};
