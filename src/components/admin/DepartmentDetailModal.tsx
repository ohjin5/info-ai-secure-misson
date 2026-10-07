import React from "react";
import { X, Building2, Users, FileText, ChevronRight, User } from "lucide-react";
import { SubmissionItem } from "../../utils/api";

interface DepartmentDetailModalProps {
  departmentName: string;
  submissions: SubmissionItem[];
  departmentData?: {
    totalCount: number;
    uniqueUsersCount: number;
    participants: Record<string, { count: number; submissions: SubmissionItem[] }>;
  };
  onClose: () => void;
  onViewAllSubmissions: (filtered: SubmissionItem[]) => void;
  onViewUserSubmissions: (filtered: SubmissionItem[], userName: string) => void;
}

export const DepartmentDetailModal: React.FC<DepartmentDetailModalProps> = ({
  departmentName,
  submissions,
  departmentData,
  onClose,
  onViewAllSubmissions,
  onViewUserSubmissions,
}) => {
  // Filter submissions for this department
  const deptSubmissions = submissions.filter(
    (s) => s.department === departmentName
  );

  // Group by participant name or use server departmentData if provided
  let userCounts: Record<string, number> = {};
  let totalCount = deptSubmissions.length;
  let uniqueUsers = 0;

  if (departmentData && departmentData.participants) {
    totalCount = departmentData.totalCount ?? deptSubmissions.length;
    uniqueUsers = departmentData.uniqueUsersCount ?? Object.keys(departmentData.participants).length;
    Object.entries(departmentData.participants).forEach(([pName, pData]) => {
      userCounts[pName] = pData.count;
    });
  } else {
    userCounts = deptSubmissions.reduce<Record<string, number>>((acc, cur) => {
      const name = cur.name || "익명";
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});
    uniqueUsers = Object.keys(userCounts).length;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-[#D9E2EC]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#1E3A5F] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{departmentName} 참여 현황</h3>
              <p className="text-xs text-blue-200/80">부서 세부 참여자 및 제출 내역</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Top KPI row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#EAF2FF]/60 p-3.5 rounded-2xl border border-[#2563EB]/20 text-center">
              <div className="text-xs font-bold text-[#1E3A5F] flex items-center justify-center gap-1">
                <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>총 제출 건수</span>
              </div>
              <div className="text-2xl font-black text-[#1E3A5F] mt-1 tabular-nums">
                {totalCount}
                <span className="text-xs font-semibold ml-0.5 text-[#2563EB]">건</span>
              </div>
            </div>

            <div className="bg-slate-100/80 p-3.5 rounded-2xl border border-slate-200 text-center">
              <div className="text-xs font-bold text-[#172033] flex items-center justify-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>참여 인원</span>
              </div>
              <div className="text-2xl font-black text-[#172033] mt-1 tabular-nums">
                {uniqueUsers}
                <span className="text-xs font-semibold ml-0.5 text-[#64748B]">명</span>
              </div>
            </div>
          </div>

          {/* Participant List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              참여자 목록 ({uniqueUsers}명)
            </h4>

            {Object.keys(userCounts).length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                제출 내역이 없습니다.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-[#D9E2EC] rounded-2xl overflow-hidden bg-slate-50/50">
                {Object.entries(userCounts).map(([userName, count]) => (
                  <div
                    key={userName}
                    onClick={() => {
                      const userSubmissions = deptSubmissions.filter(
                        (s) => s.name === userName
                      );
                      onViewUserSubmissions(
                        userSubmissions.length > 0 ? userSubmissions : deptSubmissions,
                        userName
                      );
                    }}
                    className="p-3 bg-white hover:bg-[#EAF2FF]/50 flex items-center justify-between gap-3 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#EAF2FF] group-hover:text-[#2563EB] text-slate-500 flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-[#172033] group-hover:text-[#1E3A5F]">
                        {userName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-[#2563EB] bg-[#EAF2FF] px-2.5 py-1 rounded-full border border-blue-200">
                        {count}건 인증
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2563EB]" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-[#D9E2EC] shrink-0">
          <button
            type="button"
            disabled={deptSubmissions.length === 0}
            onClick={() => onViewAllSubmissions(deptSubmissions)}
            className="w-full h-12 bg-[#1E3A5F] hover:bg-[#102A45] disabled:opacity-50 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <span>이 부서의 전체 인증사진 보기 ({totalCount}건)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
