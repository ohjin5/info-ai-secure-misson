import React from "react";

import {
  Award,
  Trophy,
  ChevronRight,
  Building2
} from "lucide-react";

import {
  DepartmentRanking
} from "../../utils/api";


interface RankingTableProps {
  rankings: DepartmentRanking[];

  onSelectDepartment: (
    deptName: string
  ) => void;
}


export const RankingTable:
  React.FC<RankingTableProps> = ({
    rankings,
    onSelectDepartment
  }) => {

    const getRankBadge = (
      rank: number
    ) => {

      if (rank === 1) {

        return (
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-black text-xs ring-2 ring-amber-300">

            <Trophy className="w-3.5 h-3.5 mr-0.5 text-amber-600" />

            1

          </span>
        );
      }


      if (rank === 2) {

        return (
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-black text-xs ring-2 ring-slate-300">

            2

          </span>
        );
      }


      if (rank === 3) {

        return (
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700/10 text-amber-900 font-black text-xs ring-2 ring-amber-700/20">

            3

          </span>
        );
      }


      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-500 font-bold text-xs">

          {rank}

        </span>
      );
    };


    return (
      <div className="bg-white border border-[#D9E2EC] rounded-2xl overflow-hidden shadow-xs space-y-3 p-4 sm:p-5">

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-3">

          <div className="flex items-center gap-2">

            <Award className="w-5 h-5 text-[#2563EB]" />

            <h3 className="text-base sm:text-lg font-extrabold text-[#172033]">

              부서별 참여 순위

            </h3>

          </div>


          <span className="text-xs text-[#64748B] font-medium text-right">

            부서를 선택하면 세부 참여 현황을 확인할 수 있습니다.

          </span>

        </div>


        {/* Empty */}
        {rankings.length === 0 ? (

          <div className="py-8 text-center text-sm text-[#64748B]">

            아직 참여 내역이 없습니다.

          </div>

        ) : (

          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">

            {rankings.map(
              (
                item
              ) => (

                <button
                  key={
                    item.department
                  }
                  type="button"
                  onClick={() =>
                    onSelectDepartment(
                      item.department
                    )
                  }
                  className="w-full py-3 px-2 flex items-center justify-between gap-3 hover:bg-[#EAF2FF]/50 rounded-xl transition-colors cursor-pointer group text-left"
                >

                  {/* Left */}
                  <div className="flex items-center gap-3 min-w-0">

                    <div className="shrink-0">

                      {getRankBadge(
                        item.rank
                      )}

                    </div>


                    <div className="min-w-0">

                      <div className="text-sm font-bold text-[#172033] group-hover:text-[#2563EB] truncate">

                        {item.department}

                      </div>


                      <div className="text-xs text-[#64748B] flex items-center gap-1">

                        <Building2 className="w-3 h-3 text-slate-400" />

                        <span>

                          참여 인원:{" "}

                          {item.participants ??
                            0}

                          명

                        </span>

                      </div>

                    </div>

                  </div>


                  {/* Right */}
                  <div className="flex items-center gap-2 shrink-0">

                    <div className="text-right">

                      <div className="text-base font-black text-[#1E3A5F] tabular-nums">

                        {item.total ?? 0}

                        <span className="text-xs font-normal text-[#64748B] ml-0.5">

                          건

                        </span>

                      </div>

                    </div>


                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-transform" />

                  </div>

                </button>

              )
            )}

          </div>

        )}

      </div>
    );
  };