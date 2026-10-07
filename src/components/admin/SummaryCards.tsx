import React from "react";
import { Layers, CheckCircle2, Clock, XCircle, Building2, Users } from "lucide-react";

interface SummaryCardsProps {
  stats?: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    departmentCount: number;
    userCount: number;
  };
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: "전체 인증",
      value: stats?.total ?? 0,
      icon: <Layers className="w-5 h-5 text-[#2563EB]" />,
      bg: "bg-[#EAF2FF]/60 border-[#2563EB]/30",
      textColor: "text-[#1E3A5F]",
    },
    {
      title: "승인",
      value: stats?.approved ?? 0,
      icon: <CheckCircle2 className="w-5 h-5 text-[#0F766E]" />,
      bg: "bg-teal-50/70 border-teal-200",
      textColor: "text-[#0F766E]",
    },
    {
      title: "승인대기",
      value: stats?.pending ?? 0,
      icon: <Clock className="w-5 h-5 text-[#D97706]" />,
      bg: "bg-amber-50/70 border-amber-200",
      textColor: "text-[#D97706]",
    },
    {
      title: "반려",
      value: stats?.rejected ?? 0,
      icon: <XCircle className="w-5 h-5 text-[#DC2626]" />,
      bg: "bg-rose-50/70 border-rose-200",
      textColor: "text-[#DC2626]",
    },
    {
      title: "참여 부서",
      value: stats?.departmentCount ?? 0,
      icon: <Building2 className="w-5 h-5 text-[#1E3A5F]" />,
      bg: "bg-slate-100 border-slate-200",
      textColor: "text-[#1E3A5F]",
    },
    {
      title: "참여 인원",
      value: stats?.userCount ?? 0,
      icon: <Users className="w-5 h-5 text-[#2563EB]" />,
      bg: "bg-blue-50/80 border-blue-200",
      textColor: "text-[#172033]",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`p-4 rounded-2xl border ${card.bg} flex flex-col justify-between transition-all hover:shadow-xs bg-white`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-[#64748B]">
            <span>{card.title}</span>
            {card.icon}
          </div>
          <div className={`text-2xl sm:text-3xl font-black ${card.textColor} tracking-tight mt-2 tabular-nums`}>
            {(card.value ?? 0).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};
