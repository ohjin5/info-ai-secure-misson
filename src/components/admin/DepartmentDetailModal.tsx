import React from "react";

import {
  X,
  Building2,
  Users,
  FileText,
  ChevronRight,
  User
} from "lucide-react";

import {
  SubmissionItem,
  DepartmentDetail
} from "../../utils/api";


interface DepartmentDetailModalProps {
  departmentName: string;

  submissions: SubmissionItem[];

  departmentData?: DepartmentDetail;

  onClose: () => void;

  onViewAllSubmissions: (
    filtered: SubmissionItem[]
  ) => void;

  onViewUserSubmissions: (
    filtered: SubmissionItem[],
    userName: string
  ) => void;
}


export const DepartmentDetailModal:
  React.FC<DepartmentDetailModalProps> = ({
    departmentName,
    submissions,
    departmentData,
    onClose,
    onViewAllSubmissions,
    onViewUserSubmissions
  }) => {

    /**
     * 해당 부서 전체 제출
     */
    const deptSubmissions =
      submissions.filter(
        (submission) =>
          submission.department ===
          departmentName
      );


    /**
     * 참여자별 집계
     */
    let userCounts:
      Record<string, number> = {};


    let totalCount =
      deptSubmissions.length;


    let uniqueUsers =
      0;


    /**
     * 서버의 부서 상세 데이터 우선 사용
     */
    if (
      departmentData &&
      departmentData.participants
    ) {

      totalCount =
        departmentData.total ??
        deptSubmissions.length;


      uniqueUsers =
        Object.keys(
          departmentData.participants
        ).length;


      Object.entries(
        departmentData.participants
      ).forEach(
        ([
          participantName,
          participantData
        ]) => {

          userCounts[
            participantName
          ] =
            participantData.total ??
            participantData
              .submissions?.length ??
            0;

        }
      );


    } else {

      /**
       * 서버 상세 데이터가 없으면
       * 현재 submissions 배열에서 계산
       */
      userCounts =
        deptSubmissions.reduce<
          Record<string, number>
        >(
          (
            accumulator,
            current
          ) => {

            const participantName =
              current.name?.trim() ||
              "이름 없음";


            accumulator[
              participantName
            ] =
              (
                accumulator[
                  participantName
                ] || 0
              ) + 1;


            return accumulator;

          },
          {}
        );


      uniqueUsers =
        Object.keys(
          userCounts
        ).length;

    }


    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">

        <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-[#D9E2EC]">

          {/* Header */}
          <div className="p-4 sm:p-5 bg-[#1E3A5F] text-white flex items-center justify-between shrink-0">

            <div className="flex items-center gap-2.5">

              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">

                <Building2 className="w-5 h-5 text-blue-200" />

              </div>


              <div>

                <h3 className="text-lg font-bold">
                  {departmentName} 참여 현황
                </h3>


                <p className="text-xs text-blue-200/80">
                  부서별 참여자 및 참여 내역
                </p>

              </div>

            </div>


            <button
              type="button"
              onClick={
                onClose
              }
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              aria-label="닫기"
            >

              <X className="w-6 h-6" />

            </button>

          </div>


          {/* Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5">

            {/* KPI */}
            <div className="grid grid-cols-2 gap-3">

              <div className="bg-[#EAF2FF]/60 p-3.5 rounded-2xl border border-[#2563EB]/20 text-center">

                <div className="text-xs font-bold text-[#1E3A5F] flex items-center justify-center gap-1">

                  <FileText className="w-3.5 h-3.5 text-[#2563EB]" />

                  <span>
                    총 참여 건수
                  </span>

                </div>


                <div className="text-2xl font-black text-[#1E3A5F] mt-1 tabular-nums">

                  {totalCount}

                  <span className="text-xs font-semibold ml-0.5 text-[#2563EB]">
                    건
                  </span>

                </div>

              </div>


              <div className="bg-slate-100/80 p-3.5 rounded-2xl border border-slate-200 text-center">

                <div className="text-xs font-bold text-[#172033] flex items-center justify-center gap-1">

                  <Users className="w-3.5 h-3.5 text-[#2563EB]" />

                  <span>
                    참여 인원
                  </span>

                </div>


                <div className="text-2xl font-black text-[#172033] mt-1 tabular-nums">

                  {uniqueUsers}

                  <span className="text-xs font-semibold ml-0.5 text-[#64748B]">
                    명
                  </span>

                </div>

              </div>

            </div>


            {/* Participant List */}
            <div className="space-y-2">

              <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                참여자 목록 ({uniqueUsers}명)
              </h4>


              {Object.keys(
                userCounts
              ).length === 0 ? (

                <div className="text-center py-6 text-xs text-slate-400">
                  참여 내역이 없습니다.
                </div>

              ) : (

                <div className="divide-y divide-slate-100 border border-[#D9E2EC] rounded-2xl overflow-hidden bg-slate-50/50">

                  {Object.entries(
                    userCounts
                  ).map(
                    ([
                      userName,
                      count
                    ]) => (

                      <button
                        key={
                          userName
                        }
                        type="button"
                        onClick={() => {

                          let userSubmissions:
                            SubmissionItem[] =
                            [];


                          /**
                           * 서버에 참여자 상세 데이터가 있으면 우선 사용
                           */
                          const serverParticipant =
                            departmentData
                              ?.participants?.[
                                userName
                              ];


                          if (
                            serverParticipant &&
                            Array.isArray(
                              serverParticipant.submissions
                            )
                          ) {

                            userSubmissions =
                              serverParticipant.submissions;


                          } else {

                            userSubmissions =
                              deptSubmissions.filter(
                                (
                                  submission
                                ) =>
                                  submission.name ===
                                  userName
                              );

                          }


                          onViewUserSubmissions(
                            userSubmissions,
                            userName
                          );

                        }}
                        className="w-full p-3 bg-white hover:bg-[#EAF2FF]/50 flex items-center justify-between gap-3 cursor-pointer transition-colors group text-left"
                      >

                        <div className="flex items-center gap-2.5 min-w-0">

                          <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#EAF2FF] group-hover:text-[#2563EB] text-slate-500 flex items-center justify-center shrink-0">

                            <User className="w-4 h-4" />

                          </div>


                          <span className="text-sm font-bold text-[#172033] group-hover:text-[#1E3A5F] truncate">
                            {userName}
                          </span>

                        </div>


                        <div className="flex items-center gap-2 shrink-0">

                          <span className="text-xs font-extrabold text-[#2563EB] bg-[#EAF2FF] px-2.5 py-1 rounded-full border border-blue-200">
                            {count}건 참여
                          </span>

                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2563EB]" />

                        </div>

                      </button>

                    )
                  )}

                </div>

              )}

            </div>

          </div>


          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-[#D9E2EC] shrink-0">

            <button
              type="button"
              disabled={
                deptSubmissions.length ===
                0
              }
              onClick={() => {

                const allSubmissions =
                  departmentData
                    ?.submissions &&
                  departmentData
                    .submissions.length >
                    0
                    ? departmentData.submissions
                    : deptSubmissions;


                onViewAllSubmissions(
                  allSubmissions
                );

              }}
              className="w-full h-12 bg-[#1E3A5F] hover:bg-[#102A45] disabled:opacity-50 disabled:pointer-events-none text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >

              <span>
                이 부서의 전체 참여사진 보기 ({totalCount}건)
              </span>

            </button>

          </div>

        </div>

      </div>
    );
  };