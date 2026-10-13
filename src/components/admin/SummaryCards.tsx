import React from "react";

import {
  Layers,
  Building2,
  Users
} from "lucide-react";


interface SummaryCardsProps {
  stats?: {
    total: number;

    /**
     * 기존 API 호환용
     * 현재 화면에서는 사용하지 않음
     */
    approved?: number;
    pending?: number;
    rejected?: number;

    departments: number;
    participants: number;
  };
}


export const SummaryCards:
  React.FC<SummaryCardsProps> = ({
    stats
  }) => {

    const cards = [
      {
        title: "전체 인증",
        value:
          stats?.total ?? 0,

        icon: (
          <Layers className="w-5 h-5 text-[#2563EB]" />
        ),

        bg:
          "bg-[#EAF2FF]/60 border-[#2563EB]/30",

        textColor:
          "text-[#1E3A5F]",

        unit:
          "건"
      },

      {
        title: "참여 부서",
        value:
          stats?.departments ?? 0,

        icon: (
          <Building2 className="w-5 h-5 text-[#1E3A5F]" />
        ),

        bg:
          "bg-slate-100 border-slate-200",

        textColor:
          "text-[#1E3A5F]",

        unit:
          "개"
      },

      {
        title: "참여 인원",
        value:
          stats?.participants ?? 0,

        icon: (
          <Users className="w-5 h-5 text-[#2563EB]" />
        ),

        bg:
          "bg-blue-50/80 border-blue-200",

        textColor:
          "text-[#172033]",

        unit:
          "명"
      }
    ];


    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">

        {cards.map(
          (card) => (

            <div
              key={
                card.title
              }
              className={`p-4 sm:p-5 rounded-2xl border ${card.bg} flex flex-col justify-between transition-all hover:shadow-sm`}
            >

              <div className="flex items-center justify-between text-xs font-bold text-[#64748B]">

                <span>
                  {card.title}
                </span>

                {card.icon}

              </div>


              <div className="flex items-end gap-1 mt-3">

                <div
                  className={`text-2xl sm:text-3xl font-black ${card.textColor} tracking-tight tabular-nums`}
                >
                  {Number(
                    card.value ??
                    0
                  ).toLocaleString()}
                </div>


                <span className="text-xs sm:text-sm font-bold text-[#64748B] mb-1">
                  {card.unit}
                </span>

              </div>

            </div>

          )
        )}

      </div>
    );
  };