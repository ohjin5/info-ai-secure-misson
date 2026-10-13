import React, {
  useState,
  useMemo
} from "react";

import {
  Search,
  Filter,
  Eye,
  Building2,
  User,
  CheckCircle2
} from "lucide-react";

import {
  SubmissionItem
} from "../../utils/api";

import {
  MISSIONS
} from "../../constants";


interface SubmissionTableProps {
  submissions: SubmissionItem[];

  onOpenSlider: (
    filteredList: SubmissionItem[],
    index: number
  ) => void;
}


export const SubmissionTable:
  React.FC<SubmissionTableProps> = ({
    submissions,
    onOpenSlider
  }) => {

    const [
      search,
      setSearch
    ] = useState("");


    const [
      selectedDept,
      setSelectedDept
    ] = useState("ALL");


    const [
      selectedMission,
      setSelectedMission
    ] = useState("ALL");


    /**
     * 실제 제출 내역에 존재하는 부서 목록
     */
    const deptList =
      useMemo(() => {

        const departmentSet =
          new Set<string>();


        submissions.forEach(
          (submission) => {

            if (
              submission.department
            ) {

              departmentSet.add(
                submission.department
              );

            }

          }
        );


        return Array
          .from(
            departmentSet
          )
          .sort();

      }, [
        submissions
      ]);


    /**
     * 검색 + 부서 + 미션 필터
     */
    const filteredSubmissions =
      useMemo(() => {

        return submissions.filter(
          (submission) => {

            const query =
              search
                .trim()
                .toLowerCase();


            /**
             * 검색
             */
            if (query) {

              const nameMatch =
                submission.name
                  ?.toLowerCase()
                  .includes(
                    query
                  );


              const departmentMatch =
                submission.department
                  ?.toLowerCase()
                  .includes(
                    query
                  );


              const missionMatch =
                submission.missionName
                  ?.toLowerCase()
                  .includes(
                    query
                  );


              if (
                !nameMatch &&
                !departmentMatch &&
                !missionMatch
              ) {

                return false;

              }

            }


            /**
             * 부서
             */
            if (
              selectedDept !==
                "ALL" &&
              submission.department !==
                selectedDept
            ) {

              return false;

            }


            /**
             * 미션
             */
            if (
              selectedMission !==
                "ALL" &&
              submission.missionId !==
                selectedMission
            ) {

              return false;

            }


            return true;

          }
        );

      }, [
        submissions,
        search,
        selectedDept,
        selectedMission
      ]);


    return (
      <div className="bg-white border border-[#D9E2EC] rounded-2xl overflow-hidden shadow-xs space-y-4 p-4 sm:p-5">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">

          <div className="flex items-center gap-2">

            <Filter className="w-5 h-5 text-[#2563EB]" />

            <h3 className="text-base sm:text-lg font-extrabold text-[#172033]">
              인증 내역 ({filteredSubmissions.length}건)
            </h3>

          </div>


          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1.5">

            <CheckCircle2 className="w-3.5 h-3.5" />

            제출 즉시 참여 완료

          </div>

        </div>


        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">

          {/* Search */}
          <div className="relative">

            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

            <input
              type="text"
              value={
                search
              }
              onChange={(
                event
              ) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="이름, 부서 또는 미션 검색"
              className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-[#D9E2EC] rounded-xl text-sm focus:outline-none focus:border-[#2563EB] focus:bg-white text-[#172033]"
            />

          </div>


          {/* Department */}
          <select
            value={
              selectedDept
            }
            onChange={(
              event
            ) =>
              setSelectedDept(
                event.target.value
              )
            }
            className="h-10 px-3 bg-slate-50 border border-[#D9E2EC] rounded-xl text-sm text-[#172033] focus:outline-none focus:border-[#2563EB]"
          >

            <option value="ALL">
              전체 부서 보기
            </option>


            {deptList.map(
              (
                department
              ) => (

                <option
                  key={
                    department
                  }
                  value={
                    department
                  }
                >
                  {department}
                </option>

              )
            )}

          </select>


          {/* Mission */}
          <select
            value={
              selectedMission
            }
            onChange={(
              event
            ) =>
              setSelectedMission(
                event.target.value
              )
            }
            className="h-10 px-3 bg-slate-50 border border-[#D9E2EC] rounded-xl text-sm text-[#172033] focus:outline-none focus:border-[#2563EB]"
          >

            <option value="ALL">
              전체 미션 보기
            </option>


            {MISSIONS.map(
              (
                mission
              ) => (

                <option
                  key={
                    mission.id
                  }
                  value={
                    mission.id
                  }
                >
                  [{mission.id}]{" "}
                  {mission.title}
                </option>

              )
            )}

          </select>

        </div>


        {/* Empty */}
        {filteredSubmissions.length ===
        0 ? (

          <div className="py-12 text-center text-sm text-[#64748B]">
            조건에 해당하는 인증 내역이 없습니다.
          </div>

        ) : (

          <>

            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">

              <table className="w-full text-left text-sm">

                <thead className="bg-slate-50 text-[#64748B] text-xs font-bold uppercase border-y border-[#D9E2EC]">

                  <tr>

                    <th className="py-3 px-3">
                      등록일시
                    </th>

                    <th className="py-3 px-3">
                      부서
                    </th>

                    <th className="py-3 px-3">
                      이름
                    </th>

                    <th className="py-3 px-3">
                      미션
                    </th>

                    <th className="py-3 px-3 text-right">
                      상세보기
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-100">

                  {filteredSubmissions.map(
                    (
                      item,
                      index
                    ) => (

                      <tr
                        key={
                          item.submissionId ||
                          index
                        }
                        onClick={() =>
                          onOpenSlider(
                            filteredSubmissions,
                            index
                          )
                        }
                        className="hover:bg-[#EAF2FF]/50 cursor-pointer transition-colors"
                      >

                        <td className="py-3 px-3 text-xs text-[#64748B] whitespace-nowrap">

                          {item.timestamp ||
                            "-"}

                        </td>


                        <td className="py-3 px-3 font-semibold text-[#172033]">

                          {item.department ||
                            "-"}

                        </td>


                        <td className="py-3 px-3 text-[#172033] font-medium">

                          {item.name ||
                            "-"}

                        </td>


                        <td className="py-3 px-3 text-[#1E3A5F] font-bold max-w-xs truncate">

                          {item.missionName ||
                            item.missionId ||
                            "-"}

                        </td>


                        <td className="py-3 px-3 text-right">

                          <button
                            type="button"
                            onClick={(
                              event
                            ) => {

                              event.stopPropagation();


                              onOpenSlider(
                                filteredSubmissions,
                                index
                              );

                            }}
                            className="p-1.5 text-[#2563EB] hover:bg-[#EAF2FF] rounded-lg inline-flex items-center gap-1 text-xs font-bold cursor-pointer"
                          >

                            <Eye className="w-4 h-4" />

                            <span>
                              사진확인
                            </span>

                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>


            {/* Mobile */}
            <div className="md:hidden space-y-2.5">

              {filteredSubmissions.map(
                (
                  item,
                  index
                ) => (

                  <button
                    key={
                      item.submissionId ||
                      index
                    }
                    type="button"
                    onClick={() =>
                      onOpenSlider(
                        filteredSubmissions,
                        index
                      )
                    }
                    className="w-full p-3.5 bg-slate-50/80 border border-[#D9E2EC] rounded-2xl flex items-center justify-between gap-3 active:bg-[#EAF2FF] transition-colors cursor-pointer text-left"
                  >

                    <div className="space-y-1.5 min-w-0">

                      <div className="flex items-center gap-2">

                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">

                          <CheckCircle2 className="w-3 h-3" />

                          참여 완료

                        </span>


                        <span className="text-xs text-[#64748B]">

                          {item.timestamp
                            ?.split(" ")
                            ?.[0] ||
                            ""}

                        </span>

                      </div>


                      <div className="flex items-center gap-2 text-sm font-bold text-[#172033] min-w-0">

                        <User className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />

                        <span className="truncate">

                          {item.name ||
                            "-"}

                        </span>


                        <span className="text-slate-300 shrink-0">
                          ·
                        </span>


                        <Building2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />

                        <span className="truncate">

                          {item.department ||
                            "-"}

                        </span>

                      </div>


                      <div className="text-xs font-semibold text-[#1E3A5F] truncate">

                        {item.missionName ||
                          item.missionId ||
                          "-"}

                      </div>

                    </div>


                    <div className="p-2 bg-[#EAF2FF] text-[#2563EB] rounded-xl shrink-0">

                      <Eye className="w-5 h-5" />

                    </div>

                  </button>

                )
              )}

            </div>

          </>

        )}

      </div>
    );
  };