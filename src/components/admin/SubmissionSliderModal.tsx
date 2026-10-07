import React, { useState, useEffect, useRef } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Building2,
  Calendar,
  FileText,
  Loader2,
  MessageSquare
} from "lucide-react";
import { SubmissionItem, reviewSubmissionApi } from "../../utils/api";

interface SubmissionSliderModalProps {
  submissions: SubmissionItem[];
  initialIndex?: number;
  adminPassword: string;
  onClose: () => void;
  onRefreshData: () => void;
}

export const SubmissionSliderModal: React.FC<SubmissionSliderModalProps> = ({
  submissions,
  initialIndex = 0,
  adminPassword,
  onClose,
  onRefreshData,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isReviewing, setIsReviewing] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Touch swipe states
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const currentItem = submissions[currentIndex];

  useEffect(() => {
    if (initialIndex >= 0 && initialIndex < submissions.length) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, submissions.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showRejectDialog) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, submissions.length, showRejectDialog]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < submissions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < submissions.length - 1) {
      handleNext();
    }
    if (isRightSwipe && currentIndex > 0) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Approval review
  const handleApprove = async () => {
    if (!currentItem) return;
    try {
      setIsReviewing(true);
      await reviewSubmissionApi(
        adminPassword,
        currentItem.submissionId,
        "승인",
        ""
      );
      onRefreshData();
    } catch (e) {
      console.error("Failed to approve submission", e);
      alert("승인 처리 중 오류가 발생했습니다.");
    } finally {
      setIsReviewing(false);
    }
  };

  // Rejection review
  const handleRejectConfirm = async () => {
    if (!currentItem) return;
    try {
      setIsReviewing(true);
      await reviewSubmissionApi(
        adminPassword,
        currentItem.submissionId,
        "반려",
        rejectReason
      );
      setShowRejectDialog(false);
      setRejectReason("");
      onRefreshData();
    } catch (e) {
      console.error("Failed to reject submission", e);
      alert("반려 처리 중 오류가 발생했습니다.");
    } finally {
      setIsReviewing(false);
    }
  };

  if (!currentItem) return null;

  const getStatusBadge = (status: string) => {
    if (status === "승인") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>승인 완료</span>
        </span>
      );
    }
    if (status === "반려") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-300">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>반려됨</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        <span>승인 대기</span>
      </span>
    );
  };

  const imageSrc = currentItem.imageUrl || currentItem.imageData;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 text-white rounded-3xl max-w-2xl w-full max-h-[96vh] flex flex-col shadow-2xl overflow-hidden border border-slate-800">
        {/* Modal Top Header */}
        <div className="p-3 sm:p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-300 bg-blue-950 px-2.5 py-1 rounded-lg border border-blue-800/50">
              인증 상세 {currentIndex + 1} / {submissions.length}
            </span>
            {getStatusBadge(currentItem.status)}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Main Content: Image & Metadata */}
        <div
          className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Photo Showcase Container */}
          <div className="relative bg-black rounded-2xl overflow-hidden flex items-center justify-center min-h-[220px] max-h-[420px] shadow-inner group">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={currentItem.missionName}
                className="max-h-[420px] w-auto object-contain"
              />
            ) : (
              <div className="p-8 text-center text-slate-500 text-sm">
                사진 이미지를 불러올 수 없습니다.
              </div>
            )}

            {/* Prev / Next overlay arrows */}
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900/80 hover:bg-[#2563EB] disabled:opacity-20 text-white rounded-full flex items-center justify-center transition-all cursor-pointer"
              aria-label="이전 인증"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              type="button"
              disabled={currentIndex === submissions.length - 1}
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900/80 hover:bg-[#2563EB] disabled:opacity-20 text-white rounded-full flex items-center justify-center transition-all cursor-pointer"
              aria-label="다음 인증"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Metadata Card */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-base font-bold text-white">
                  {currentItem.name}
                </span>
                <span className="text-xs text-slate-400">|</span>
                <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-sm font-semibold text-blue-200">
                  {currentItem.department}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{currentItem.timestamp || "일자 정보 없음"}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                <FileText className="w-4 h-4" />
                <span>미션: {currentItem.missionName}</span>
              </div>

              {currentItem.description ? (
                <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-700/40 text-xs sm:text-sm text-slate-200 leading-relaxed">
                  <span className="text-blue-400 font-semibold block mb-0.5">활동 설명</span>
                  {currentItem.description}
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic">
                  작성된 활동 설명이 없습니다.
                </div>
              )}

              {currentItem.reviewNote && (
                <div className="mt-2 bg-rose-950/40 border border-rose-800/50 p-2.5 rounded-xl text-xs text-rose-300 flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">반려 사유: </span>
                    {currentItem.reviewNote}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Bottom Controls & Review Actions */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 space-y-3 shrink-0">
          {/* Slider Pagination Controls */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={handlePrev}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>이전</span>
            </button>

            <span className="text-sm font-bold text-white tracking-widest tabular-nums">
              {currentIndex + 1} / {submissions.length}
            </span>

            <button
              type="button"
              disabled={currentIndex === submissions.length - 1}
              onClick={handleNext}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition-colors cursor-pointer"
            >
              <span>다음</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Admin Action Buttons (Approve / Reject) */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              disabled={isReviewing}
              onClick={handleApprove}
              className="h-11 bg-[#0F766E] hover:bg-teal-600 disabled:opacity-50 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
            >
              {isReviewing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>승인</span>
            </button>

            <button
              type="button"
              disabled={isReviewing}
              onClick={() => setShowRejectDialog(true)}
              className="h-11 bg-[#DC2626] hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
            >
              <XCircle className="w-4 h-4" />
              <span>반려</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reject Reason Dialog Modal */}
      {showRejectDialog && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white text-[#172033] rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="space-y-1">
              <h4 className="text-base font-bold text-[#172033]">
                인증 반려 사유 입력
              </h4>
              <p className="text-xs text-[#64748B]">
                반려 처리 사유(예: 환자정보 노출, 불명확한 사진 등)를 간단히 적어주세요.
              </p>
            </div>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="예) 환자명 노출로 인한 반려"
              rows={3}
              className="w-full p-2.5 border border-[#D9E2EC] rounded-xl text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectDialog(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#64748B] cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                disabled={isReviewing}
                onClick={handleRejectConfirm}
                className="px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {isReviewing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>반려 등록</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
