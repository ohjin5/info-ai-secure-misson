import React from "react";

import {
  User,
  Badge,
  MessageSquare,
  Info,
  ShieldCheck
} from "lucide-react";


interface UserInfoFormProps {
  name: string;

  onChangeName: (
    name: string
  ) => void;

  employeeId: string;

  onChangeEmployeeId: (
    employeeId: string
  ) => void;

  description: string;

  onChangeDescription: (
    desc: string
  ) => void;

  requiresDescription: boolean;
}


export const UserInfoForm:
  React.FC<UserInfoFormProps> = ({
    name,
    onChangeName,
    employeeId,
    onChangeEmployeeId,
    description,
    onChangeDescription,
    requiresDescription
  }) => {

    return (
      <div className="space-y-4">

        {/* =====================================
            이름
        ====================================== */}
        <div className="space-y-1.5">

          <label
            className="
              block
              text-sm
              font-bold
              text-[#172033]
            "
          >
            이름을 입력해주세요.{" "}

            <span className="text-red-500">
              *
            </span>
          </label>


          <div className="relative">

            <div
              className="
                absolute
                inset-y-0
                left-0
                pl-3.5
                flex
                items-center
                pointer-events-none
              "
            >

              <User className="w-5 h-5 text-[#2563EB]" />

            </div>


            <input
              type="text"

              value={
                name
              }

              onChange={(
                event
              ) =>
                onChangeName(
                  event.target.value
                )
              }

              placeholder="이름을 입력해주세요."

              autoComplete="name"

              maxLength={30}

              className="
                w-full
                min-h-[48px]
                pl-10
                pr-3.5
                bg-white
                border
                border-[#D9E2EC]
                rounded-xl
                text-base
                text-[#172033]
                placeholder:text-slate-400
                focus:outline-none
                focus:border-[#2563EB]
                focus:ring-2
                focus:ring-[#2563EB]/20
                transition-all
              "
            />

          </div>

        </div>


        {/* =====================================
            사번
        ====================================== */}
        <div className="space-y-1.5">

          <label
            className="
              block
              text-sm
              font-bold
              text-[#172033]
            "
          >
            사번을 입력해주세요.{" "}

            <span className="text-red-500">
              *
            </span>
          </label>


          <div className="relative">

            <div
              className="
                absolute
                inset-y-0
                left-0
                pl-3.5
                flex
                items-center
                pointer-events-none
              "
            >

              <Badge className="w-5 h-5 text-[#2563EB]" />

            </div>


            <input
              type="text"

              value={
                employeeId
              }

              onChange={(
                event
              ) => {

                /**
                 * 앞뒤 공백 방지
                 * 너무 긴 값 방지
                 */
                const value =
                  event.target.value
                    .replace(
                      /\s/g,
                      ""
                    )
                    .slice(
                      0,
                      30
                    );


                onChangeEmployeeId(
                  value
                );

              }}

              placeholder="사번을 입력해주세요."

              autoComplete="off"

              inputMode="text"

              maxLength={30}

              className="
                w-full
                min-h-[48px]
                pl-10
                pr-3.5
                bg-white
                border
                border-[#D9E2EC]
                rounded-xl
                text-base
                text-[#172033]
                placeholder:text-slate-400
                focus:outline-none
                focus:border-[#2563EB]
                focus:ring-2
                focus:ring-[#2563EB]/20
                transition-all
              "
            />

          </div>


          <div
            className="
              flex
              items-start
              gap-1.5
              text-[11px]
              sm:text-xs
              text-[#64748B]
              font-medium
              leading-relaxed
            "
          >

            <ShieldCheck
              className="
                w-3.5
                h-3.5
                shrink-0
                mt-0.5
                text-[#2563EB]
              "
            />


            <span>
              사번은 동명이인 구분 및 경품 추첨 대상 확인을 위해 사용됩니다.
            </span>

          </div>

        </div>


        {/* =====================================
            활동 설명
        ====================================== */}
        <div className="space-y-1.5">

          <div
            className="
              flex
              items-center
              justify-between
              gap-2
            "
          >

            <label
              className="
                block
                text-sm
                font-bold
                text-[#172033]
              "
            >

              {requiresDescription ? (

                <span
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-[#1E3A5F]
                    font-extrabold
                  "
                >
                  어떤 정보보호 활동인가요?

                  <span className="text-red-500">
                    *
                  </span>
                </span>

              ) : (

                "활동 설명 (선택사항)"

              )}

            </label>


            <span
              className="
                text-xs
                text-[#64748B]
                tabular-nums
                whitespace-nowrap
              "
            >
              {description.length} / 300자
            </span>

          </div>


          <div className="relative">

            <textarea
              value={
                description
              }

              onChange={(
                event
              ) =>
                onChangeDescription(
                  event.target.value.slice(
                    0,
                    300
                  )
                )
              }

              placeholder={
                requiresDescription
                  ? "예) 개인정보 문서는 업무 종료 후 잠금장에 보관하고 있습니다."
                  : "추가로 설명이 필요한 경우 간단히 적어주세요. (선택)"
              }

              rows={3}

              maxLength={300}

              className={`
                w-full
                p-3
                bg-white
                border
                rounded-xl
                text-base
                text-[#172033]
                placeholder:text-slate-400
                focus:outline-none
                focus:border-[#2563EB]
                focus:ring-2
                focus:ring-[#2563EB]/20
                transition-all
                resize-none
                ${
                  requiresDescription
                    ? "border-[#2563EB] bg-[#EAF2FF]/20 ring-1 ring-[#2563EB]/20"
                    : "border-[#D9E2EC]"
                }
              `}
            />


            {requiresDescription ? (

              <div
                className="
                  mt-1.5
                  flex
                  items-start
                  gap-1.5
                  text-xs
                  text-[#1E3A5F]
                  font-medium
                  leading-relaxed
                "
              >

                <MessageSquare
                  className="
                    w-3.5
                    h-3.5
                    text-[#2563EB]
                    shrink-0
                    mt-0.5
                  "
                />


                <span>
                  사진만으로 활동 내용을 알기 어려울 수 있으니,
                  우리 팀에서 어떤 정보보호 활동을 하고 있는지 간단히 적어주세요.
                </span>

              </div>

            ) : (

              <div
                className="
                  mt-1.5
                  flex
                  items-start
                  gap-1.5
                  text-xs
                  text-[#64748B]
                  font-medium
                  leading-relaxed
                "
              >

                <Info
                  className="
                    w-3.5
                    h-3.5
                    shrink-0
                    mt-0.5
                  "
                />


                <span>
                  사진만으로 설명이 어려운 경우에만 작성해주세요.
                </span>

              </div>

            )}

          </div>

        </div>

      </div>
    );

  };