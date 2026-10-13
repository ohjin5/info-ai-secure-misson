import React from "react";

import {
  CheckCircle2,
  Home,
  Shield,
  Sparkles
} from "lucide-react";


interface SuccessPageProps {
  department: string;
  name: string;
  missionTitle: string;
  onReset: () => void;
}


export const SuccessPage:
  React.FC<SuccessPageProps> = ({
    department,
    name,
    missionTitle,
    onReset
  }) => {

    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9E2EC] shadow-lg text-center space-y-6 animate-in zoom-in-95 duration-200 max-w-lg mx-auto">

        {/* 완료 아이콘 */}
        <div className="relative inline-flex items-center justify-center">

          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 ring-8 ring-emerald-50">

            <CheckCircle2 className="w-12 h-12" />

          </div>


          <div className="absolute -top-1 -right-1 bg-[#2563EB] text-white p-1.5 rounded-full shadow-md">

            <Sparkles className="w-4 h-4" />

          </div>

        </div>


        {/* 안내 문구 */}
        <div className="space-y-2">

          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
            오늘 참여 완료
          </span>


          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
            미션 인증이 완료되었습니다!
          </h2>


          <p className="text-sm sm:text-base text-[#64748B] max-w-sm mx-auto leading-relaxed">
            정보보호를 위한 작은 실천에 참여해주셔서 감사합니다.
          </p>

        </div>


        {/* 제출 정보 */}
        <div className="bg-slate-50 border border-[#D9E2EC] rounded-2xl p-4 text-left space-y-2.5">

          <div className="flex items-center justify-between text-xs text-[#64748B] font-medium">

            <span>
              참여 정보
            </span>

            <span className="text-[#2563EB] font-bold">
              2026 정보보호 미션 챌린지
            </span>

          </div>


          <div className="space-y-2 pt-2 border-t border-slate-200">

            <div className="flex items-start justify-between gap-4 text-sm">

              <span className="text-[#64748B] font-medium shrink-0">
                소속 부서
              </span>

              <span className="font-bold text-[#172033] text-right break-keep">
                {department}
              </span>

            </div>


            <div className="flex items-start justify-between gap-4 text-sm">

              <span className="text-[#64748B] font-medium shrink-0">
                참여자 성명
              </span>

              <span className="font-bold text-[#172033] text-right">
                {name}님
              </span>

            </div>


            <div className="flex items-start justify-between gap-4 text-sm">

              <span className="text-[#64748B] font-medium shrink-0">
                수행 미션
              </span>

              <span className="font-bold text-[#1E3A5F] text-right leading-snug">
                {missionTitle}
              </span>

            </div>

          </div>

        </div>


        {/* 등록 상태 안내 */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-left">

          <div className="flex items-start gap-3">

            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">

              <CheckCircle2 className="w-5 h-5" />

            </div>


            <div className="space-y-1">

              <div className="text-sm font-bold text-emerald-900">
                인증이 정상적으로 등록되었습니다.
              </div>

              <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                별도의 승인 절차 없이 참여가 완료되었습니다.
              </p>

              <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                정보보호 미션은 한 기기에서 하루 1회 참여할 수 있습니다.
              </p>

            </div>

          </div>

        </div>


        {/* 처음 화면으로 */}
        <button
          type="button"
          onClick={
            onReset
          }
          className="w-full min-h-[48px] bg-[#1E3A5F] hover:bg-[#102A45] text-white font-bold text-base rounded-2xl flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all cursor-pointer"
        >

          <Home className="w-5 h-5" />

          <span>
            처음 화면으로 돌아가기
          </span>

        </button>


        {/* 하단 안내 */}
        <div className="flex items-start justify-center gap-1.5 text-xs text-[#64748B]">

          <Shield className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />

          <span>
            제출된 사진은 캠페인 참여 확인 및 운영을 위해 사용됩니다.
          </span>

        </div>

      </div>
    );
  };