import React from "react";
import {
  ShieldCheck,
  AlertTriangle,
  Shield
} from "lucide-react";

interface HeaderProps {
  onNavigateToAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigateToAdmin
}) => {
  return (
    <header className="w-full space-y-3.5">

      {/* Main Header */}
      <div className="bg-[#1E3A5F] text-white rounded-2xl p-5 sm:p-7 shadow-sm relative overflow-hidden border border-[#102A45]">

        {/* Decorative background */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="absolute right-8 top-3 opacity-10 pointer-events-none hidden sm:block">
          <ShieldCheck className="w-32 h-32 text-blue-200" />
        </div>


        <div className="relative z-10 space-y-3">

          {/* Admin button only */}
          {onNavigateToAdmin && (
            <div className="flex justify-end">

              <button
                type="button"
                onClick={onNavigateToAdmin}
                className="
                  min-h-[40px]
                  px-3.5
                  bg-white
                  hover:bg-[#EAF2FF]
                  text-[#1E3A5F]
                  border
                  border-[#CBD5E1]
                  rounded-xl
                  text-xs
                  sm:text-sm
                  font-bold
                  flex
                  items-center
                  gap-1.5
                  shadow-xs
                  transition-colors
                  cursor-pointer
                  shrink-0
                  active:scale-[0.98]
                "
              >
                <Shield className="w-4 h-4 text-[#2563EB]" />

                <span>
                  관리자
                </span>
              </button>

            </div>
          )}


          {/* Main Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            2026 정보보호 미션 챌린지
          </h1>


          {/* Subtitle */}
          <p className="text-sm sm:text-base font-medium text-slate-200/90 max-w-xl">
            “오늘의 작은 실천이 우리의 정보를 지킵니다.”
          </p>

        </div>
      </div>


      {/* Privacy Warning */}
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