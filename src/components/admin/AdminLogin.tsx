import React, {
  useState
} from "react";

import {
  Lock,
  KeyRound,
  Loader2,
  AlertCircle,
  ArrowLeft
} from "lucide-react";

import {
  fetchAdminDataApi,
  AdminDataResponse
} from "../../utils/api";


interface AdminLoginProps {
  onSuccess: (
    password: string,
    data: AdminDataResponse
  ) => void;

  onBackToUser: () => void;
}


export const AdminLogin:
  React.FC<AdminLoginProps> = ({
    onSuccess,
    onBackToUser
  }) => {

    const [
      password,
      setPassword
    ] = useState("");

    const [
      isLoading,
      setIsLoading
    ] = useState(false);

    const [
      errorMsg,
      setErrorMsg
    ] =
      useState<string | null>(
        null
      );


    /**
     * 관리자 로그인
     */
    const handleSubmit =
      async (
        event: React.FormEvent
      ) => {

        event.preventDefault();


        if (!password) {
          setErrorMsg(
            "비밀번호를 입력해주세요."
          );

          return;
        }


        try {

          setIsLoading(
            true
          );

          setErrorMsg(
            null
          );


          const response =
            await fetchAdminDataApi(
              password
            );


          /**
           * api.ts에서 success:false는
           * 이미 Error로 처리되므로
           * 정상 응답이면 바로 로그인 성공 처리
           */
          onSuccess(
            password,
            response
          );

        } catch (error) {

          console.error(
            "Admin login failed:",
            error
          );


          setErrorMsg(
            error instanceof Error
              ? error.message
              : "관리자 인증 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
          );

        } finally {

          setIsLoading(
            false
          );
        }
      };


    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">

        <div className="w-full max-w-md bg-white border border-[#D9E2EC] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">

          {/* 사용자 화면 */}
          <button
            type="button"
            onClick={
              onBackToUser
            }
            disabled={
              isLoading
            }
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#172033] transition-colors cursor-pointer disabled:opacity-50"
          >

            <ArrowLeft className="w-4 h-4" />

            <span>
              사용자 화면으로 돌아가기
            </span>

          </button>


          {/* Header */}
          <div className="text-center space-y-2">

            <div className="w-14 h-14 bg-[#EAF2FF] text-[#2563EB] rounded-2xl flex items-center justify-center mx-auto">

              <Lock className="w-7 h-7" />

            </div>


            <h2 className="text-xl sm:text-2xl font-extrabold text-[#172033]">
              관리자 로그인
            </h2>


            <p className="text-xs sm:text-sm text-[#64748B]">
              캠페인 관리를 위한 관리자 비밀번호를 입력해주세요.
            </p>

          </div>


          {/* Form */}
          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-4"
          >

            <div className="space-y-1.5">

              <label
                htmlFor="admin-password"
                className="block text-xs font-bold text-[#172033]"
              >
                관리자 비밀번호
              </label>


              <div className="relative">

                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">

                  <KeyRound className="w-5 h-5 text-[#2563EB]" />

                </div>


                <input
                  id="admin-password"
                  type="password"
                  value={
                    password
                  }
                  disabled={
                    isLoading
                  }
                  onChange={(
                    event
                  ) => {

                    setPassword(
                      event.target.value
                    );

                    if (
                      errorMsg
                    ) {
                      setErrorMsg(
                        null
                      );
                    }
                  }}
                  placeholder="비밀번호 입력"
                  autoComplete="current-password"
                  autoFocus
                  className="w-full h-12 pl-10 pr-3.5 bg-slate-50 border border-[#D9E2EC] rounded-xl text-base text-[#172033] placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 transition-all disabled:opacity-60"
                />

              </div>

            </div>


            {/* Error */}
            {errorMsg && (

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-xs font-medium text-rose-800">

                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />

                <span>
                  {errorMsg}
                </span>

              </div>

            )}


            {/* Login */}
            <button
              type="submit"
              disabled={
                isLoading ||
                !password
              }
              className="w-full h-12 bg-[#1E3A5F] hover:bg-[#102A45] text-white font-bold text-sm sm:text-base rounded-xl flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer active:scale-[0.99]"
            >

              {isLoading ? (

                <>
                  <Loader2 className="w-5 h-5 animate-spin" />

                  <span>
                    로그인 중...
                  </span>
                </>

              ) : (

                <span>
                  관리자 로그인
                </span>

              )}

            </button>

          </form>

        </div>

      </div>
    );
  };