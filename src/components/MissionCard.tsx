import React from "react";

import {
  Lock,
  Sparkles,
  Printer,
  MonitorCheck,
  ShieldCheck,
  Trash2,
  Archive,
  Eye,
  Mail,
  FileCheck2,
  DoorClosed,
  KeyRound,
  MailOpen,
  CheckCircle2,
  ArrowRight,
  Shield
} from "lucide-react";

import {
  Mission
} from "../constants";


interface MissionCardProps {
  mission: Mission;

  isRevealed: boolean;

  isSelected: boolean;

  onReveal: () => void;

  onSelect: (
    mission: Mission
  ) => void;
}


export const MissionCard:
  React.FC<MissionCardProps> = ({
    mission,
    isRevealed,
    isSelected,
    onReveal,
    onSelect
  }) => {

    /**
     * 미션별 아이콘
     */
    const getIcon = (
      iconType:
        Mission["icon"]
    ) => {

      switch (
        iconType
      ) {

        case "lock":
          return (
            <Lock className="w-8 h-8 sm:w-10 sm:h-10" />
          );


        case "sparkles":
          return (
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10" />
          );


        case "printer":
          return (
            <Printer className="w-8 h-8 sm:w-10 sm:h-10" />
          );


        case "monitor-check":
          return (
            <MonitorCheck className="w-8 h-8 sm:w-10 sm:h-10" />
          );


        case "shield-check":
          return (
            <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10" />
          );


        case "trash":
          return (
            <Trash2 className="w-8 h-8 sm:w-10 sm:h-10" />
          );


        case "archive":
          return (
            <Archive className="w-8 h-8 sm:w-10 sm:h-10" />
          );


        case "eye":
          return (
            <Eye className="w-8 h-8 sm:w-10 sm:h-10" />
          );


        case "mail":
          return (
            <Mail className="w-8 h-8 sm:w-10 sm:h-10" />
          );


        case "file-check":
          return (
            <FileCheck2 className="w-8 h-8 sm:w-10 sm:h-10" />
          );


        case "door-closed":
          return (
            <DoorClosed className="w-8 h-8 sm:w-10 sm:h-10" />
          );


        case "key-round":
          return (
            <KeyRound className="w-8 h-8 sm:w-10 sm:h-10" />
          );


        default:
          return (
            <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10" />
          );

      }

    };


    /**
     * =========================================
     * 봉투 열기 전
     * =========================================
     */
    if (
      !isRevealed
    ) {

      return (
        <button
          type="button"

          onClick={
            onReveal
          }

          aria-label="이번 주 정보보호 미션 봉투 열기"

          className="
            group
            relative
            block
            w-full
            max-w-[430px]
            mx-auto
            min-h-[255px]
            sm:min-h-[285px]
            rounded-[24px]
            sm:rounded-[28px]
            overflow-hidden
            border
            border-[#BED7F5]
            bg-gradient-to-b
            from-[#F5FAFF]
            to-[#EAF4FF]
            shadow-md
            hover:shadow-xl
            sm:hover:-translate-y-1
            active:scale-[0.99]
            transition-all
            duration-300
            cursor-pointer
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#2563EB]
            focus-visible:ring-offset-2
          "
        >

          {/* =====================================
              배경 하늘
          ====================================== */}
          <div
            className="
              absolute
              inset-x-0
              top-0
              h-[90px]
              sm:h-[105px]
              bg-[#DFF2FF]
            "
          />


          {/* 왼쪽 구름 */}
          <div
            className="
              absolute
              top-4
              sm:top-5
              left-6
              sm:left-8
              w-12
              sm:w-16
              h-5
              sm:h-6
              bg-white/85
              rounded-full
            "
          />


          <div
            className="
              absolute
              top-7
              sm:top-8
              left-14
              sm:left-[72px]
              w-8
              sm:w-11
              h-3
              sm:h-4
              bg-white/65
              rounded-full
            "
          />


          {/* 오른쪽 구름 */}
          <div
            className="
              absolute
              top-5
              sm:top-6
              right-6
              sm:right-8
              w-16
              sm:w-20
              h-6
              sm:h-7
              bg-white/75
              rounded-full
            "
          />


          {/* =====================================
              잔디
          ====================================== */}
          <div
            className="
              absolute
              inset-x-0
              bottom-0
              h-[64px]
              sm:h-[72px]
              bg-[#E1F2D8]
            "
          />


          {/* =====================================
              OPEN 배지
          ====================================== */}
          <div
            className="
              absolute
              top-3
              sm:top-4
              left-1/2
              -translate-x-1/2
              inline-flex
              items-center
              gap-1.5
              px-2.5
              sm:px-3
              py-1
              sm:py-1.5
              rounded-full
              bg-[#2563EB]
              text-white
              text-[9px]
              sm:text-[10px]
              font-extrabold
              shadow-sm
              z-30
              whitespace-nowrap
            "
          >

            <MailOpen className="w-3 sm:w-3.5 h-3 sm:h-3.5" />

            <span>
              이번 주 미션 도착
            </span>

          </div>


          {/* =====================================
              봉투 영역
          ====================================== */}
          <div
            className="
              absolute
              left-1/2
              top-[52px]
              sm:top-[62px]
              -translate-x-1/2
              w-[210px]
              min-[380px]:w-[230px]
              sm:w-[245px]
              h-[125px]
              min-[380px]:h-[136px]
              sm:h-[145px]
              rounded-xl
              sm:rounded-2xl
              bg-[#FFF9EA]
              border-2
              border-[#E7D2A3]
              shadow-lg
              overflow-hidden
              transition-transform
              duration-300
              sm:group-hover:-translate-y-1
              z-20
            "
          >

            {/* 봉투 상단 */}
            <div
              className="
                absolute
                inset-x-0
                top-0
                h-[68px]
                sm:h-[78px]
                bg-[#F5E9CA]
                [clip-path:polygon(0_0,100%_0,50%_100%)]
              "
            />


            {/* 왼쪽 접힘 */}
            <div
              className="
                absolute
                inset-0
                bg-[#FFF3D1]
                [clip-path:polygon(0_0,50%_58%,0_100%)]
              "
            />


            {/* 오른쪽 접힘 */}
            <div
              className="
                absolute
                inset-0
                bg-[#F9EAC2]
                [clip-path:polygon(100%_0,50%_58%,100%_100%)]
              "
            />


            {/* 아래 접힘 */}
            <div
              className="
                absolute
                inset-0
                bg-[#FFF8E7]
                [clip-path:polygon(0_100%,50%_48%,100%_100%)]
              "
            />


            {/* 봉인 */}
            <div
              className="
                absolute
                left-1/2
                top-1/2
                -translate-x-1/2
                -translate-y-1/2
                w-12
                h-12
                sm:w-14
                sm:h-14
                rounded-full
                bg-[#2563EB]
                text-white
                border-[3px]
                sm:border-4
                border-white/80
                shadow-md
                flex
                items-center
                justify-center
                z-20
              "
            >

              <Shield className="w-5 h-5 sm:w-6 sm:h-6" />

            </div>

          </div>


          {/* =====================================
              하단 안내 문구
          ====================================== */}
          <div
            className="
              absolute
              left-3
              right-3
              bottom-3
              sm:bottom-4
              z-30
              flex
              flex-col
              items-center
              justify-center
              text-center
              gap-0.5
              sm:gap-1
            "
          >

            <div
              className="
                text-sm
                min-[380px]:text-[15px]
                sm:text-base
                font-black
                text-[#172033]
                break-keep
              "
            >
              봉투를 열어 미션을 확인하세요
            </div>


            <div
              className="
                text-[10px]
                sm:text-xs
                font-semibold
                text-[#64748B]
              "
            >
              봉투를 눌러주세요
            </div>

          </div>

        </button>
      );

    }


    /**
     * =========================================
     * 미션 공개 후
     * =========================================
     */
    return (
      <div
        className="
          relative
          block
          w-full
          max-w-[430px]
          mx-auto
          rounded-[24px]
          sm:rounded-[30px]
          overflow-hidden
          border
          border-[#B9D4F8]
          bg-white
          shadow-lg
          animate-in
          fade-in
          zoom-in-95
          duration-300
        "
      >

        {/* =====================================
            상단 미션 영역
        ====================================== */}
        <div
          className="
            relative
            bg-gradient-to-br
            from-[#1D4ED8]
            via-[#2563EB]
            to-[#3B82F6]
            px-5
            sm:px-6
            pt-5
            sm:pt-6
            pb-6
            sm:pb-7
            text-white
            overflow-hidden
          "
        >

          {/* 배경 원 */}
          <div
            className="
              absolute
              -top-10
              -right-8
              w-28
              sm:w-32
              h-28
              sm:h-32
              bg-white/10
              rounded-full
            "
          />


          <div
            className="
              absolute
              -bottom-10
              -left-7
              w-24
              sm:w-28
              h-24
              sm:h-28
              bg-white/10
              rounded-full
            "
          />


          <div className="relative z-10">

            {/* 상단 badge */}
            <div
              className="
                flex
                items-center
                justify-between
                gap-2
                sm:gap-3
              "
            >

              <div
                className="
                  inline-flex
                  items-center
                  px-2
                  sm:px-2.5
                  py-1
                  rounded-full
                  bg-white/15
                  border
                  border-white/20
                  text-[8px]
                  min-[380px]:text-[9px]
                  sm:text-[10px]
                  font-extrabold
                  whitespace-nowrap
                "
              >
                THIS WEEK MISSION
              </div>


              {isSelected && (

                <div
                  className="
                    inline-flex
                    items-center
                    gap-1
                    px-2
                    sm:px-2.5
                    py-1
                    rounded-full
                    bg-white
                    text-[#2563EB]
                    text-[9px]
                    sm:text-[10px]
                    font-extrabold
                    whitespace-nowrap
                  "
                >

                  <CheckCircle2 className="w-3 sm:w-3.5 h-3 sm:h-3.5" />

                  <span>
                    참여 선택
                  </span>

                </div>

              )}

            </div>


            {/* 아이콘 */}
            <div
              className="
                mt-4
                sm:mt-5
                w-16
                h-16
                sm:w-20
                sm:h-20
                rounded-[20px]
                sm:rounded-[24px]
                bg-white
                text-[#2563EB]
                shadow-md
                flex
                items-center
                justify-center
              "
            >

              {getIcon(
                mission.icon
              )}

            </div>


            {/* 미션 텍스트 */}
            <div className="mt-4 sm:mt-5">

              <div
                className="
                  text-[10px]
                  sm:text-xs
                  font-bold
                  text-blue-100
                  tracking-wider
                "
              >
                MISSION {mission.id}
              </div>


              <h3
                className="
                  mt-1
                  text-[28px]
                  min-[380px]:text-3xl
                  sm:text-4xl
                  font-black
                  tracking-tight
                  leading-tight
                  break-keep
                "
              >
                {mission.title}
              </h3>


              <p
                className="
                  mt-2
                  text-xs
                  min-[380px]:text-sm
                  sm:text-base
                  font-semibold
                  text-blue-50
                  leading-relaxed
                  break-keep
                "
              >
                {mission.description}
              </p>

            </div>

          </div>

        </div>


        {/* =====================================
            카드 하단
        ====================================== */}
        <div
          className="
            p-4
            min-[380px]:p-5
            sm:p-6
          "
        >

          <p
            className="
              text-[11px]
              sm:text-xs
              font-semibold
              text-[#64748B]
              leading-relaxed
              break-keep
            "
          >
            이번 주에 공개된 정보보호 미션입니다.
            미션 내용을 확인한 뒤 참여를 시작해주세요.
          </p>


          <button
            type="button"

            onClick={() =>
              onSelect(
                mission
              )
            }

            disabled={
              isSelected
            }

            className={`
              mt-4
              sm:mt-5
              w-full
              min-h-11
              sm:min-h-12
              px-4
              rounded-xl
              sm:rounded-2xl
              flex
              items-center
              justify-center
              gap-2
              font-extrabold
              text-xs
              sm:text-sm
              transition-all
              ${
                isSelected
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-700 cursor-default"
                  : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md active:scale-[0.99] cursor-pointer"
              }
            `}
          >

            {isSelected ? (

              <>
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />

                <span>
                  미션 참여 준비 완료
                </span>
              </>

            ) : (

              <>
                <span>
                  이 미션 참여하기
                </span>

                <ArrowRight className="w-4 h-4" />
              </>

            )}

          </button>

        </div>

      </div>
    );

  };