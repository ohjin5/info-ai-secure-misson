import React from "react";

import {
  BarChart3
} from "lucide-react";

import {
  MISSIONS
} from "../../constants";


interface MissionStatsProps {
  missionStats?: Record<
    string,
    number
  >;
}


export const MissionStats:
  React.FC<MissionStatsProps> = ({
    missionStats
  }) => {

    const statsList =
      MISSIONS.map(
        (mission) => ({
          id: mission.id,

          label:
            `${mission.id} ${mission.title}`,

          count:
            missionStats?.[
              mission.id
            ] ?? 0
        })
      );


    const totalCount =
      statsList.reduce(
        (
          sum,
          item
        ) =>
          sum + item.count,
        0
      );


    const maxCount =
      Math.max(
        ...statsList.map(
          (item) =>
            item.count
        ),
        1
      );


    return (
      <div className="bg-white border border-[#D9E2EC] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">

        {/* Header */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">

          <div className="flex items-center gap-2">

            <BarChart3 className="w-5 h-5 text-[#2563EB]" />

            <h3 className="text-base sm:text-lg font-extrabold text-[#172033]">
              미션별 참여 현황
            </h3>

          </div>


          <span className="text-xs font-bold text-[#64748B] whitespace-nowrap">
            총 {totalCount.toLocaleString()}건
          </span>

        </div>


        {/* Stats */}
        <div className="space-y-3">

          {statsList.map(
            (item) => {

              const percent =
                item.count > 0
                  ? Math.round(
                      (
                        item.count /
                        maxCount
                      ) * 100
                    )
                  : 0;


              return (
                <div
                  key={
                    item.id
                  }
                  className="space-y-1.5"
                >

                  <div className="flex items-start justify-between gap-3 text-xs">

                    <span className="font-bold text-[#172033] leading-snug">
                      {item.label}
                    </span>

                    <span className="text-[#2563EB] font-extrabold tabular-nums whitespace-nowrap">
                      {item.count.toLocaleString()}건
                    </span>

                  </div>


                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">

                    <div
                      className="bg-[#2563EB] h-full rounded-full transition-all duration-500"
                      style={{
                        width:
                          item.count === 0
                            ? "0%"
                            : `${percent}%`
                      }}
                    />

                  </div>

                </div>
              );
            }
          )}

        </div>

      </div>
    );
  };