import React, { useState } from "react";
import { Lock, KeyRound, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { fetchAdminDataApi, AdminDataResponse } from "../../utils/api";

interface AdminLoginProps {
  onSuccess: (password: string, data: AdminDataResponse) => void;
  onBackToUser: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onSuccess,
  onBackToUser,
}) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMsg("비밀번호를 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg(null);
      const response = await fetchAdminDataApi(password);

      if (response && response.success !== false) {
        onSuccess(password, response);
      } else {
        setErrorMsg(response.message || "관리자 비밀번호가 올바르지 않습니다.");
      }
    } catch (err) {
      console.error("Admin login failed:", err);
      setErrorMsg("관리자 인증 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#D9E2EC] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <button
          type="button"
          onClick={onBackToUser}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#172033] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>사용자 화면으로 돌아가기</span>
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-[#EAF2FF] text-[#2563EB] rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#172033]">
            관리자 인증
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B]">
            캠페인 관리를 위한 관리자 비밀번호를 입력해주세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#172033]">
              관리자 비밀번호
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-5 h-5 text-[#2563EB]" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                className="w-full h-12 pl-10 pr-3.5 bg-slate-50 border border-[#D9E2EC] rounded-xl text-base text-[#172033] placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                autoFocus
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs font-medium text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-[#1E3A5F] hover:bg-[#102A45] text-white font-bold text-sm sm:text-base rounded-xl flex items-center justify-center gap-2 shadow-md disabled:opacity-60 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>확인 중...</span>
              </>
            ) : (
              <span>로그인</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
