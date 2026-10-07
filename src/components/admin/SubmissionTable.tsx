import React, { useState, useMemo } from "react";
import { Search, Filter, Eye, CheckCircle2, Clock, XCircle, Building2, User } from "lucide-react";
import { SubmissionItem } from "../../utils/api";
import { MISSIONS } from "../../constants";

interface SubmissionTableProps {
  submissions: SubmissionItem[];
  onOpenSlider: (filteredList: SubmissionItem[], index: number) => void;
}

export const SubmissionTable: React.FC<SubmissionTableProps> = ({
  submissions,
  onOpenSlider,
}) => {
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedMission, setSelectedMission] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "승인대기" | "승인" | "반려">("ALL");

  // Get unique departments from submissions
  const deptList = useMemo(() => {
    const set = new Set<string>();
    submissions.forEach((s) => {
      if (s.department) set.add(s.department);
    });
    return Array.from(set).sort();
  }, [submissions]);

  // Filtered list
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((s) => {
      // Search check
      const query = search.trim().toLowerCase();
      if (query) {
        const nameMatch = s.name?.toLowerCase().includes(query);
        const deptMatch = s.department?.toLowerCase().includes(query);
        if (!nameMatch && !deptMatch) return false;
      }

      // Dept check
      if (selectedDept !== "ALL" && s.department !== selectedDept) return false;

      // Mission check
      if (selectedMission !== "ALL" && s.missionId !== selectedMission) return false;

      // Status check
      if (statusFilter !== "ALL") {
        if (statusFilter === "승인대기" && s.status !== "승인대기" && s.status !== "") return false;
        if (statusFilter === "승인" && s.status !== "승인") return false;
        if (statusFilter === "반려" && s.status !== "반려") return false;
      }

      return true;
    });
  }, [submissions, search, selectedDept, selectedMission, statusFilter]);

  const getStatusBadge = (status: string) => {
    if (status === "승인") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-100 text-[#0F766E] text-xs font-bold">
          <CheckCircle2 className="w-3 h-3 text-[#0F766E]" /> 승인
        </span>
      );
    }
    if (status === "반려") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-[#DC2626] text-xs font-bold">
          <XCircle className="w-3 h-3 text-[#DC2626]" /> 반려
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-[#D97706] text-xs font-bold">
        <Clock className="w-3 h-3 text-[#D97706]" /> 대기
      </span>
    );
  };

  return (
    <div className="bg-white border border-[#D9E2EC] rounded-2xl overflow-hidden shadow-xs space-y-4 p-4 sm:p-5">
      {/* Title & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#2563EB]" />
          <h3 className="text-base sm:text-lg font-extrabold text-[#172033]">
            최근 인증 내역 ({filteredSubmissions.length}건)
          </h3>
        </div>

        {/* Status Filter Segmented Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 overflow-x-auto">
          {(
            [
              { id: "ALL", label: "전체" },
              { id: "승인대기", label: "대기" },
              { id: "승인", label: "승인" },
              { id: "반려", label: "반려" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setStatusFilter(item.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === item.id
                  ? "bg-white text-[#1E3A5F] shadow-xs"
                  : "text-[#64748B] hover:text-[#172033]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Options Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름 또는 부서 검색"
            className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-[#D9E2EC] rounded-xl text-sm focus:outline-none focus:border-[#2563EB] focus:bg-white text-[#172033]"
          />
        </div>

        {/* Dept Filter */}
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="h-10 px-3 bg-slate-50 border border-[#D9E2EC] rounded-xl text-sm text-[#172033] focus:outline-none focus:border-[#2563EB]"
        >
          <option value="ALL">전체 부서 보기</option>
          {deptList.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {/* Mission Filter */}
        <select
          value={selectedMission}
          onChange={(e) => setSelectedMission(e.target.value)}
          className="h-10 px-3 bg-slate-50 border border-[#D9E2EC] rounded-xl text-sm text-[#172033] focus:outline-none focus:border-[#2563EB]"
        >
          <option value="ALL">전체 미션 보기</option>
          {MISSIONS.map((m) => (
            <option key={m.id} value={m.id}>
              [{m.id}] {m.title}
            </option>
          ))}
        </select>
      </div>

      {/* Table Content */}
      {filteredSubmissions.length === 0 ? (
        <div className="py-12 text-center text-sm text-[#64748B]">
          조건에 해당하는 인증 내역이 없습니다.
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[#64748B] text-xs font-bold uppercase border-y border-[#D9E2EC]">
                <tr>
                  <th className="py-3 px-3">등록일시</th>
                  <th className="py-3 px-3">부서</th>
                  <th className="py-3 px-3">이름</th>
                  <th className="py-3 px-3">미션</th>
                  <th className="py-3 px-3">상태</th>
                  <th className="py-3 px-3 text-right">상세보기</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubmissions.map((item, idx) => (
                  <tr
                    key={item.submissionId || idx}
                    onClick={() => onOpenSlider(filteredSubmissions, idx)}
                    className="hover:bg-[#EAF2FF]/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 text-xs text-[#64748B] whitespace-nowrap">
                      {item.timestamp || "-"}
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#172033]">
                      {item.department}
                    </td>
                    <td className="py-3 px-3 text-[#172033] font-medium">
                      {item.name}
                    </td>
                    <td className="py-3 px-3 text-[#1E3A5F] font-bold max-w-xs truncate">
                      {item.missionName}
                    </td>
                    <td className="py-3 px-3">{getStatusBadge(item.status)}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        className="p-1.5 text-[#2563EB] hover:bg-[#EAF2FF] rounded-lg inline-flex items-center gap-1 text-xs font-bold cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        <span>사진확인</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-2.5">
            {filteredSubmissions.map((item, idx) => (
              <div
                key={item.submissionId || idx}
                onClick={() => onOpenSlider(filteredSubmissions, idx)}
                className="p-3.5 bg-slate-50/80 border border-[#D9E2EC] rounded-2xl flex items-center justify-between gap-3 active:bg-[#EAF2FF] transition-colors cursor-pointer"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(item.status)}
                    <span className="text-xs text-[#64748B]">
                      {item.timestamp?.split(" ")?.[0] || ""}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-bold text-[#172033]">
                    <User className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                    <span>{item.name}</span>
                    <span className="text-slate-300">·</span>
                    <Building2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                    <span className="truncate">{item.department}</span>
                  </div>

                  <div className="text-xs font-semibold text-[#1E3A5F] truncate">
                    {item.missionName}
                  </div>
                </div>

                <div className="p-2 bg-[#EAF2FF] text-[#2563EB] rounded-xl shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
