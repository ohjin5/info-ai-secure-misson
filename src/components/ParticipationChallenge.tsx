import React, {
  useState
} from "react";

import {
  Check,
  Gift,
  Coffee,
  Trophy,
  LockKeyhole,
  Sparkles,
  UsersRound,
  Target,
  ChevronDown
} from "lucide-react";

import type {
  ParticipationChallenge as ParticipationChallengeData,
  ParticipationMilestone
} from "../utils/api";


interface ParticipationChallengeProps {
  challenge:
    | ParticipationChallengeData
    | null
    | undefined;
}


/**
 * 목표별 아이콘
 */
function getMilestoneIcon(
  target: number,
  achieved: boolean,
  isCurrent: boolean
) {

  if (achieved) {

    return (
      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
    );

  }


  if (isCurrent) {

    return (
      <Target className="w-4 h-4 sm:w-5 sm:h-5" />
    );

  }


  if (target >= 300) {

    return (
      <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
    );

  }


  if (target >= 200) {

    return (
      <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
    );

  }


  return (
    <Coffee className="w-4 h-4 sm:w-5 sm:h-5" />
  );

}


/**
 * 목표별 기본 문구
 */
function getRewardText(
  milestone: ParticipationMilestone
) {

  if (
    milestone.reward &&
    milestone.reward.trim()
  ) {

    return milestone.reward;

  }


  if (
    milestone.target === 100
  ) {

    return "커피쿠폰 추가 추첨";

  }


  if (
    milestone.target === 200
  ) {

    return "편의점 상품권 추가 추첨";

  }


  if (
    milestone.target === 300
  ) {

    return "특별 경품 추가 추첨";

  }


  return "추가 경품 추첨";

}


export const ParticipationChallenge:
  React.FC<ParticipationChallengeProps> = ({
    challenge
  }) => {

    /**
     * =====================================
     * 달성 혜택 접기 / 펼치기
     *
     * 기본값 false
     * → 처음에는 접힌 상태
     * =====================================
     */
    const [
      isBenefitsOpen,
      setIsBenefitsOpen
    ] =
      useState(
        false
      );


    /**
     * 데이터 로딩 중
     */
    if (!challenge) {

      return (
        <section
          className="
            w-full
            overflow-hidden
            rounded-2xl
            sm:rounded-3xl
            border
            border-[#D9E2EC]
            bg-white
            shadow-sm
          "
        >

          <div className="p-4 sm:p-5">

            <div className="flex items-center gap-2">

              <div
                className="
                  w-9
                  h-9
                  rounded-xl
                  bg-[#EAF2FF]
                  text-[#2563EB]
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >

                <UsersRound className="w-5 h-5" />

              </div>


              <div className="min-w-0">

                <div
                  className="
                    text-sm
                    sm:text-base
                    font-black
                    text-[#172033]
                  "
                >
                  함께 채우는 정보보호 챌린지
                </div>


                <div
                  className="
                    mt-0.5
                    text-[11px]
                    sm:text-xs
                    font-medium
                    text-[#64748B]
                  "
                >
                  참여 현황을 불러오고 있어요.
                </div>

              </div>

            </div>


            <div
              className="
                mt-4
                h-3
                sm:h-4
                rounded-full
                bg-slate-100
                overflow-hidden
              "
            >

              <div
                className="
                  h-full
                  w-1/3
                  rounded-full
                  bg-blue-200
                  animate-pulse
                "
              />

            </div>

          </div>

        </section>
      );

    }


    const {
      totalParticipation,
      nextGoal,
      nextReward,
      progressTarget,
      progressPercent,
      remaining,
      isComplete,
      milestones
    } = challenge;


    /**
     * 0 ~ 100 범위 보정
     */
    const safeProgress =
      Math.min(
        100,
        Math.max(
          0,
          Number(
            progressPercent
          ) || 0
        )
      );


    const currentGoal =
      nextGoal ??
      300;


    return (
      <section
        className="
          relative
          w-full
          overflow-hidden
          rounded-2xl
          sm:rounded-3xl
          border
          border-[#CFE0F5]
          bg-white
          shadow-sm
        "
      >

        {/* 배경 장식 */}
        <div
          className="
            pointer-events-none
            absolute
            -top-14
            -right-10
            w-36
            h-36
            rounded-full
            bg-blue-100/60
          "
        />


        <div
          className="
            pointer-events-none
            absolute
            -top-6
            right-24
            w-16
            h-16
            rounded-full
            bg-sky-100/50
          "
        />


        <div
          className="
            relative
            z-10
            p-4
            sm:p-5
          "
        >

          {/* =====================================
              제목
          ====================================== */}
          <div
            className="
              flex
              items-start
              justify-between
              gap-3
            "
          >

            <div
              className="
                flex
                items-start
                gap-3
                min-w-0
              "
            >

              <div
                className="
                  w-10
                  h-10
                  sm:w-11
                  sm:h-11
                  rounded-2xl
                  bg-[#2563EB]
                  text-white
                  flex
                  items-center
                  justify-center
                  shadow-sm
                  shrink-0
                "
              >

                <UsersRound className="w-5 h-5 sm:w-6 sm:h-6" />

              </div>


              <div className="min-w-0">

                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-[10px]
                    sm:text-[11px]
                    font-extrabold
                    text-[#2563EB]
                  "
                >

                  <Sparkles className="w-3.5 h-3.5" />

                  공동 참여 목표

                </div>


                <h2
                  className="
                    mt-0.5
                    text-[15px]
                    min-[380px]:text-base
                    sm:text-lg
                    font-black
                    text-[#172033]
                    leading-tight
                    break-keep
                  "
                >
                  함께 채우는 정보보호 챌린지
                </h2>


                <p
                  className="
                    mt-1
                    text-[10px]
                    sm:text-xs
                    text-[#64748B]
                    font-medium
                    leading-relaxed
                    break-keep
                  "
                >
                  미션에 참여할수록 모두의 목표가 함께 채워집니다.
                </p>

              </div>

            </div>


            {isComplete && (

              <div
                className="
                  shrink-0
                  inline-flex
                  items-center
                  gap-1
                  px-2
                  sm:px-2.5
                  py-1
                  rounded-full
                  bg-emerald-50
                  border
                  border-emerald-200
                  text-[9px]
                  sm:text-[10px]
                  font-extrabold
                  text-emerald-700
                "
              >

                <Trophy className="w-3.5 h-3.5" />

                전체 달성

              </div>

            )}

          </div>


          {/* =====================================
              현재 누적 참여
          ====================================== */}
          <div
            className="
              mt-4
              flex
              items-end
              justify-between
              gap-4
            "
          >

            <div>

              <div
                className="
                  text-[11px]
                  sm:text-xs
                  font-bold
                  text-[#64748B]
                "
              >
                현재 누적 참여
              </div>


              <div
                className="
                  mt-0.5
                  flex
                  items-baseline
                  gap-1
                "
              >

                <strong
                  className="
                    text-[28px]
                    sm:text-[34px]
                    leading-none
                    font-black
                    tracking-tight
                    text-[#172033]
                  "
                >
                  {totalParticipation.toLocaleString()}
                </strong>


                <span
                  className="
                    text-sm
                    sm:text-base
                    font-extrabold
                    text-[#475569]
                  "
                >
                  건
                </span>

              </div>

            </div>


            {!isComplete &&
              nextGoal !== null && (

                <div className="text-right">

                  <div
                    className="
                      text-[10px]
                      sm:text-xs
                      font-semibold
                      text-[#64748B]
                    "
                  >
                    다음 목표까지
                  </div>


                  <div
                    className="
                      mt-0.5
                      text-sm
                      sm:text-base
                      font-black
                      text-[#2563EB]
                    "
                  >
                    {remaining.toLocaleString()}건
                  </div>

                </div>

              )}

          </div>


          {/* =====================================
              진행 그래프
          ====================================== */}
          <div className="mt-4">

            <div
              className="
                flex
                items-center
                justify-between
                gap-3
                mb-2
              "
            >

              <div
                className="
                  text-[10px]
                  sm:text-xs
                  font-bold
                  text-[#475569]
                "
              >

                {isComplete
                  ? "최종 목표 달성"
                  : `${currentGoal.toLocaleString()}건을 향해 참여 중`}

              </div>


              <div
                className="
                  text-[10px]
                  sm:text-xs
                  font-extrabold
                  text-[#2563EB]
                  whitespace-nowrap
                "
              >

                {isComplete
                  ? `${totalParticipation.toLocaleString()}건`
                  : `${totalParticipation.toLocaleString()} / ${progressTarget.toLocaleString()}`}

              </div>

            </div>


            <div
              className="
                relative
                w-full
                h-3.5
                sm:h-4
                rounded-full
                bg-[#EAF0F7]
                overflow-hidden
                border
                border-[#DCE5EF]
              "
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(
                safeProgress
              )}
              aria-label="누적 참여 진행률"
            >

              <div
                className="
                  relative
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-[#60A5FA]
                  via-[#3B82F6]
                  to-[#2563EB]
                  transition-[width]
                  duration-700
                  ease-out
                  overflow-hidden
                "
                style={{
                  width:
                    `${safeProgress}%`
                }}
              >

                <div
                  className="
                    absolute
                    inset-y-0
                    right-0
                    w-8
                    bg-gradient-to-r
                    from-transparent
                    to-white/30
                  "
                />

              </div>

            </div>


            <div
              className="
                mt-1.5
                flex
                items-center
                justify-between
                text-[9px]
                sm:text-[10px]
                font-semibold
                text-[#94A3B8]
              "
            >

              <span>
                0
              </span>


              <span
                className="
                  font-extrabold
                  text-[#64748B]
                "
              >
                {Math.round(
                  safeProgress
                )}%
              </span>


              <span>
                {progressTarget.toLocaleString()}
              </span>

            </div>

          </div>


          {/* =====================================
              다음 목표
          ====================================== */}
          {!isComplete &&
            nextGoal !== null && (

              <div
                className="
                  mt-3
                  rounded-xl
                  border
                  border-blue-100
                  bg-[#F3F8FF]
                  px-3
                  py-2.5
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    w-8
                    h-8
                    rounded-lg
                    bg-white
                    border
                    border-blue-100
                    text-[#2563EB]
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >

                  <Gift className="w-4 h-4" />

                </div>


                <div className="min-w-0">

                  <div
                    className="
                      text-[9px]
                      sm:text-[10px]
                      font-extrabold
                      text-[#2563EB]
                    "
                  >
                    다음 목표 · {nextGoal.toLocaleString()}건
                  </div>


                  <div
                    className="
                      mt-0.5
                      text-[11px]
                      sm:text-xs
                      font-black
                      text-[#1E293B]
                      break-keep
                    "
                  >
                    {nextReward ||
                      "추가 경품 추첨"}
                  </div>

                </div>

              </div>

            )}


          {/* =====================================
              달성 혜택 접기 / 펼치기 버튼
          ====================================== */}
          <button
            type="button"

            onClick={() =>
              setIsBenefitsOpen(
                (
                  previous
                ) =>
                  !previous
              )
            }

            aria-expanded={
              isBenefitsOpen
            }

            className="
              mt-3
              w-full
              min-h-10
              px-3
              rounded-xl
              border
              border-[#D9E2EC]
              bg-white
              hover:bg-slate-50
              text-[#475569]
              flex
              items-center
              justify-center
              gap-2
              text-[11px]
              sm:text-xs
              font-extrabold
              transition-colors
              cursor-pointer
            "
          >

            <span>
              {isBenefitsOpen
                ? "달성 혜택 접기"
                : "100 · 200 · 300건 달성 혜택 보기"}
            </span>


            <ChevronDown
              className={`
                w-4
                h-4
                transition-transform
                duration-300
                ${
                  isBenefitsOpen
                    ? "rotate-180"
                    : ""
                }
              `}
            />

          </button>


          {/* =====================================
              접었을 때는 렌더링하지 않음
          ====================================== */}
          {isBenefitsOpen && (

            <div
              className="
                mt-3
                border-t
                border-slate-100
                pt-3
                animate-in
                fade-in
                slide-in-from-top-1
                duration-200
              "
            >

              <div
                className="
                  text-[10px]
                  sm:text-xs
                  font-extrabold
                  text-[#475569]
                  mb-3
                "
              >
                누적 참여 달성 혜택
              </div>


              <div className="space-y-2">

                {milestones.map(
                  (
                    milestone
                  ) => {

                    const isCurrent =
                      !milestone.achieved &&
                      milestone.target ===
                        nextGoal;


                    const isLocked =
                      !milestone.achieved &&
                      !isCurrent;


                    return (
                      <div
                        key={
                          milestone.target
                        }

                        className={`
                          flex
                          items-center
                          gap-2.5
                          rounded-xl
                          border
                          px-3
                          py-2.5
                          transition-all
                          ${
                            milestone.achieved
                              ? "bg-emerald-50/70 border-emerald-200"
                              : isCurrent
                                ? "bg-blue-50/80 border-blue-200"
                                : "bg-slate-50/80 border-slate-200"
                          }
                        `}
                      >

                        {/* 아이콘 */}
                        <div
                          className={`
                            w-8
                            h-8
                            sm:w-9
                            sm:h-9
                            rounded-full
                            flex
                            items-center
                            justify-center
                            shrink-0
                            border
                            ${
                              milestone.achieved
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : isCurrent
                                  ? "bg-[#2563EB] border-[#2563EB] text-white"
                                  : "bg-white border-slate-200 text-slate-400"
                            }
                          `}
                        >

                          {isLocked ? (

                            <LockKeyhole className="w-4 h-4" />

                          ) : (

                            getMilestoneIcon(
                              milestone.target,
                              milestone.achieved,
                              isCurrent
                            )

                          )}

                        </div>


                        {/* 내용 */}
                        <div className="min-w-0 flex-1">

                          <div
                            className="
                              flex
                              flex-wrap
                              items-center
                              gap-x-2
                              gap-y-0.5
                            "
                          >

                            <span
                              className={`
                                text-[11px]
                                sm:text-xs
                                font-black
                                ${
                                  milestone.achieved
                                    ? "text-emerald-800"
                                    : isCurrent
                                      ? "text-[#1D4ED8]"
                                      : "text-[#64748B]"
                                }
                              `}
                            >
                              {milestone.target.toLocaleString()}건
                            </span>


                            {milestone.achieved && (

                              <span
                                className="
                                  px-1.5
                                  py-0.5
                                  rounded-md
                                  bg-emerald-100
                                  text-[8px]
                                  sm:text-[9px]
                                  font-extrabold
                                  text-emerald-700
                                "
                              >
                                달성
                              </span>

                            )}


                            {isCurrent && (

                              <span
                                className="
                                  px-1.5
                                  py-0.5
                                  rounded-md
                                  bg-blue-100
                                  text-[8px]
                                  sm:text-[9px]
                                  font-extrabold
                                  text-blue-700
                                "
                              >
                                도전 중
                              </span>

                            )}

                          </div>


                          <div
                            className={`
                              mt-0.5
                              text-[10px]
                              sm:text-[11px]
                              font-semibold
                              leading-relaxed
                              break-keep
                              ${
                                milestone.achieved
                                  ? "text-emerald-700"
                                  : isCurrent
                                    ? "text-[#334155]"
                                    : "text-[#94A3B8]"
                              }
                            `}
                          >
                            {getRewardText(
                              milestone
                            )}
                          </div>

                        </div>


                        {/* 우측 상태 */}
                        <div className="shrink-0">

                          {milestone.achieved ? (

                            <Check className="w-4 h-4 text-emerald-600" />

                          ) : isCurrent ? (

                            <div
                              className="
                                w-2
                                h-2
                                rounded-full
                                bg-[#2563EB]
                                ring-4
                                ring-blue-100
                              "
                            />

                          ) : (

                            <LockKeyhole className="w-3.5 h-3.5 text-slate-300" />

                          )}

                        </div>

                      </div>
                    );

                  }
                )}

              </div>

            </div>

          )}


          {/* =====================================
              최종 목표 완료
          ====================================== */}
          {isComplete && (

            <div
              className="
                mt-3
                rounded-xl
                border
                border-emerald-200
                bg-gradient-to-r
                from-emerald-50
                to-green-50
                px-3
                py-3
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  w-9
                  h-9
                  rounded-full
                  bg-emerald-600
                  text-white
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >

                <Trophy className="w-5 h-5" />

              </div>


              <div className="min-w-0">

                <div
                  className="
                    text-xs
                    sm:text-sm
                    font-black
                    text-emerald-800
                  "
                >
                  300건 목표 달성!
                </div>


                <p
                  className="
                    mt-0.5
                    text-[9px]
                    sm:text-[10px]
                    font-semibold
                    text-emerald-700
                    leading-relaxed
                    break-keep
                  "
                >
                  모든 공동목표를 달성했습니다.
                </p>

              </div>

            </div>

          )}


          {/* 하단 안내 */}
          <p
            className="
              mt-3
              text-[8px]
              sm:text-[9px]
              text-[#94A3B8]
              font-medium
              leading-relaxed
              text-center
              break-keep
            "
          >
            누적 참여는 등록된 미션 인증 건수를 기준으로 집계됩니다.
          </p>

        </div>

      </section>
    );

  };