import React, { useEffect, useState } from "react";
import { CheckCircle2, RotateCcw, Shield, Building2, Sparkles } from "lucide-react";
import { fetchDepartmentCountApi } from "../utils/api";

interface SuccessPageProps {
  department: string;
  name: string;
  missionTitle: string;
  onReset: () => void;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({
  department,
  name,
  missionTitle,
  onReset,
}) => {
  const [deptCount, setDeptCount] = useState<number | null>(null);
  const [isLoadingCount, setIsLoadingCount] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadCount() {
      if (!department) return;
      setIsLoadingCount(true);
      const count = await fetchDepartmentCountApi(department);
      if (isMounted) {
        setDeptCount(count);
        setIsLoadingCount(false);
      }
    }
    loadCount();
    return () => {
      isMounted = false;
    };
  }, [department]);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9E2EC] shadow-lg text-center space-y-6 animate-in zoom-in-95 duration-200 max-w-lg mx-auto">
      {/* Icon Graphic */}
      <div className="relative inline-flex items-center justify-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 ring-8 ring-emerald-50">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <div className="absolute -top-1 -right-1 bg-[#2563EB] text-white p-1.5 rounded-full shadow-md">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-2">
        <span className="inline-block px-3 py-1 bg-[#EAF2FF] text-[#2563EB] text-xs font-bold rounded-full">
          인증 등록 완료
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
          미션 완료!
        </h2>
        <p className="text-sm sm:text-base text-[#64748B] max-w-sm mx-auto leading-relaxed">
          정보보호를 위한 작은 실천에 참여해주셔서 감사합니다.
        </p>
      </div>

      {/* Submission Summary Card */}
      <div className="bg-slate-50 border border-[#D9E2EC] rounded-2xl p-4 text-left space-y-2.5">
        <div className="flex items-center justify-between text-xs text-[#64748B] font-medium">
          <span>참여자 정보</span>
          <span className="text-[#2563EB] font-bold">2026 정보보호 챌린지</span>
        </div>

        <div className="space-y-1.5 pt-1 border-t border-slate-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#64748B] font-medium">소속 부서</span>
            <span className="font-bold text-[#172033]">{department}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#64748B] font-medium">참여자 성명</span>
            <span className="font-bold text-[#172033]">{name}님</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#64748B] font-medium">수행 미션</span>
            <span className="font-bold text-[#1E3A5F] truncate max-w-[200px]">
              {missionTitle}
            </span>
          </div>
        </div>
      </div>

      {/* Department Count Stat */}
      <div className="bg-[#EAF2FF]/60 border border-[#2563EB]/20 rounded-2xl p-4 flex items-center justify-between gap-3 text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[#1E3A5F] font-bold">
              {department} 참여 현황
            </div>
            <div className="text-sm font-medium text-[#172033]">
              우리 부서 동료들과 함께 실천 중!
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          {isLoadingCount ? (
            <div className="text-xs text-blue-500 animate-pulse">조회 중...</div>
          ) : deptCount !== null ? (
            <div className="text-xl font-black text-[#1E3A5F] tabular-nums">
              {deptCount}
              <span className="text-xs font-semibold text-[#2563EB] ml-0.5">건</span>
            </div>
          ) : (
            <div className="text-xs text-[#2563EB] font-medium">참여 완료</div>
          )}
        </div>
      </div>

      {/* Reset Action Button */}
      <button
        type="button"
        onClick={onReset}
        className="w-full min-h-[48px] bg-[#1E3A5F] hover:bg-[#102A45] text-white font-bold text-base rounded-2xl flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all cursor-pointer"
      >
        <RotateCcw className="w-5 h-5" />
        <span>다른 미션 인증하기</span>
      </button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-[#64748B]">
        <Shield className="w-3.5 h-3.5 text-[#2563EB]" />
        <span>제출된 사진은 안전하게 보관 및 확인됩니다.</span>
      </div>
    </div>
  );
};
