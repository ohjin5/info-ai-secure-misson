import React, {
  useState,
  useEffect,
  useRef,
  useCallback
} from "react";

import {
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Building2,
  Calendar,
  FileText,
  Loader2,
  AlertCircle,
  Trash2,
  ImageOff,
  CheckCircle2
} from "lucide-react";

import {
  SubmissionItem,
  fetchSubmissionImageApi,
  deleteSubmissionApi
} from "../../utils/api";


interface SubmissionSliderModalProps {
  submissions: SubmissionItem[];

  initialIndex?: number;

  adminPassword: string;

  onClose: () => void;

  onRefreshData:
    () => Promise<void> | void;
}


export const SubmissionSliderModal:
  React.FC<SubmissionSliderModalProps> = ({
    submissions,
    initialIndex = 0,
    adminPassword,
    onClose,
    onRefreshData
  }) => {

    const [
      currentIndex,
      setCurrentIndex
    ] = useState(
      initialIndex
    );


    /**
     * 사진
     */
    const [
      imageData,
      setImageData
    ] =
      useState<string | null>(
        null
      );


    const [
      isLoadingImage,
      setIsLoadingImage
    ] =
      useState(false);


    const [
      imageError,
      setImageError
    ] =
      useState<string | null>(
        null
      );


    /**
     * 삭제
     */
    const [
      showDeleteDialog,
      setShowDeleteDialog
    ] =
      useState(false);


    const [
      isDeleting,
      setIsDeleting
    ] =
      useState(false);


    const [
      deleteError,
      setDeleteError
    ] =
      useState<string | null>(
        null
      );


    /**
     * Touch swipe
     */
    const touchStartX =
      useRef<number | null>(
        null
      );


    const touchEndX =
      useRef<number | null>(
        null
      );


    const currentItem =
      submissions[
        currentIndex
      ];


    /**
     * initialIndex 변경 시 동기화
     */
    useEffect(() => {

      if (
        initialIndex >= 0 &&
        initialIndex <
          submissions.length
      ) {

        setCurrentIndex(
          initialIndex
        );
      }

    }, [
      initialIndex,
      submissions.length
    ]);


    /**
     * 사진 불러오기
     *
     * Drive URL 직접 사용하지 않고
     * Apps Script getImage API 호출
     */
    useEffect(() => {

      let cancelled =
        false;


      const loadImage =
        async () => {

          if (
            !currentItem ||
            !currentItem.submissionId
          ) {

            setImageData(
              null
            );

            setImageError(
              "제출 정보를 확인할 수 없습니다."
            );

            return;
          }


          try {

            setIsLoadingImage(
              true
            );

            setImageData(
              null
            );

            setImageError(
              null
            );


            const response =
              await fetchSubmissionImageApi(
                adminPassword,
                currentItem.submissionId
              );


            if (
              cancelled
            ) {
              return;
            }


            setImageData(
              response.imageData
            );


          } catch (error) {

            if (
              cancelled
            ) {
              return;
            }


            console.error(
              "Failed to load submission image:",
              error
            );


            setImageError(
              error instanceof Error
                ? error.message
                : "인증사진을 불러올 수 없습니다."
            );


          } finally {

            if (
              !cancelled
            ) {

              setIsLoadingImage(
                false
              );
            }
          }
        };


      loadImage();


      return () => {

        cancelled =
          true;

      };

    }, [
      currentItem?.submissionId,
      adminPassword
    ]);


    /**
     * 이전
     */
    const handlePrev =
      useCallback(() => {

        setImageError(
          null
        );

        setDeleteError(
          null
        );

        setShowDeleteDialog(
          false
        );


        setCurrentIndex(
          (previous) =>
            previous > 0
              ? previous - 1
              : previous
        );

      }, []);


    /**
     * 다음
     */
    const handleNext =
      useCallback(() => {

        setImageError(
          null
        );

        setDeleteError(
          null
        );

        setShowDeleteDialog(
          false
        );


        setCurrentIndex(
          (previous) =>
            previous <
              submissions.length - 1
              ? previous + 1
              : previous
        );

      }, [
        submissions.length
      ]);


    /**
     * Keyboard
     */
    useEffect(() => {

      const handleKeyDown = (
        event: KeyboardEvent
      ) => {

        if (
          showDeleteDialog
        ) {

          if (
            event.key ===
            "Escape"
          ) {

            setShowDeleteDialog(
              false
            );

            setDeleteError(
              null
            );
          }


          return;
        }


        if (
          event.key ===
          "Escape"
        ) {

          onClose();
        }


        if (
          event.key ===
          "ArrowLeft"
        ) {

          handlePrev();
        }


        if (
          event.key ===
          "ArrowRight"
        ) {

          handleNext();
        }
      };


      window.addEventListener(
        "keydown",
        handleKeyDown
      );


      return () =>
        window.removeEventListener(
          "keydown",
          handleKeyDown
        );

    }, [
      handlePrev,
      handleNext,
      onClose,
      showDeleteDialog
    ]);


    /**
     * Touch 시작
     */
    const handleTouchStart = (
      event: React.TouchEvent
    ) => {

      touchStartX.current =
        event.targetTouches[0]
          ?.clientX ??
        null;


      touchEndX.current =
        null;
    };


    /**
     * Touch 이동
     */
    const handleTouchMove = (
      event: React.TouchEvent
    ) => {

      touchEndX.current =
        event.targetTouches[0]
          ?.clientX ??
        null;
    };


    /**
     * Touch 종료
     */
    const handleTouchEnd =
      () => {

        if (
          touchStartX.current ===
            null ||
          touchEndX.current ===
            null
        ) {

          return;
        }


        const distance =
          touchStartX.current -
          touchEndX.current;


        const swipeThreshold =
          50;


        if (
          distance >
          swipeThreshold
        ) {

          handleNext();
        }


        if (
          distance <
          -swipeThreshold
        ) {

          handlePrev();
        }


        touchStartX.current =
          null;


        touchEndX.current =
          null;
      };


    /**
     * 제출 삭제
     */
    const handleDelete =
      async () => {

        if (
          !currentItem ||
          !currentItem.submissionId ||
          isDeleting
        ) {

          return;
        }


        try {

          setIsDeleting(
            true
          );

          setDeleteError(
            null
          );


          await deleteSubmissionApi(
            adminPassword,
            currentItem.submissionId
          );


          /**
           * 관리자 데이터 다시 조회
           */
          await onRefreshData();


          setShowDeleteDialog(
            false
          );


          /**
           * 현재 리스트에 1개만 있었다면
           * 모달 종료
           */
          if (
            submissions.length <=
            1
          ) {

            onClose();

            return;
          }


          /**
           * 마지막 항목을 삭제한 경우
           * 한 칸 앞으로 이동
           */
          if (
            currentIndex >=
            submissions.length - 1
          ) {

            setCurrentIndex(
              Math.max(
                0,
                currentIndex - 1
              )
            );

          }


        } catch (error) {

          console.error(
            "Failed to delete submission:",
            error
          );


          setDeleteError(
            error instanceof Error
              ? error.message
              : "인증 내역 삭제 중 오류가 발생했습니다."
          );


        } finally {

          setIsDeleting(
            false
          );
        }
      };


    if (
      !currentItem
    ) {

      return null;
    }


    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">

        <div className="bg-slate-900 text-white rounded-3xl max-w-2xl w-full max-h-[96vh] flex flex-col shadow-2xl overflow-hidden border border-slate-800">

          {/* Header */}
          <div className="p-3 sm:p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0 gap-3">

            <div className="flex items-center gap-2 flex-wrap">

              <span className="text-xs font-bold text-blue-300 bg-blue-950 px-2.5 py-1 rounded-lg border border-blue-800/50">

                인증 상세{" "}

                {currentIndex + 1} /{" "}

                {submissions.length}

              </span>


              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-xs font-bold">

                <CheckCircle2 className="w-3.5 h-3.5" />

                참여 완료

              </span>

            </div>


            <button
              type="button"
              onClick={
                onClose
              }
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer shrink-0"
              aria-label="닫기"
            >

              <X className="w-6 h-6" />

            </button>

          </div>


          {/* Main */}
          <div
            className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 select-none"
            onTouchStart={
              handleTouchStart
            }
            onTouchMove={
              handleTouchMove
            }
            onTouchEnd={
              handleTouchEnd
            }
          >

            {/* Photo */}
            <div className="relative bg-black rounded-2xl overflow-hidden flex items-center justify-center min-h-[220px] max-h-[440px] shadow-inner">

              {isLoadingImage ? (

                <div className="flex flex-col items-center justify-center gap-3 text-slate-400">

                  <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />

                  <span className="text-sm font-medium">
                    인증사진을 불러오는 중...
                  </span>

                </div>

              ) : imageData ? (

                <img
                  src={
                    imageData
                  }
                  alt={
                    currentItem.missionName ||
                    "인증사진"
                  }
                  className="max-h-[440px] max-w-full w-auto object-contain"
                  draggable={
                    false
                  }
                />

              ) : (

                <div className="p-8 text-center space-y-3 text-slate-500">

                  <ImageOff className="w-10 h-10 mx-auto text-slate-600" />

                  <div className="text-sm">
                    인증사진을 불러올 수 없습니다.
                  </div>

                  {imageError && (

                    <div className="text-xs text-rose-400 max-w-sm mx-auto leading-relaxed">
                      {imageError}
                    </div>

                  )}

                </div>

              )}


              {/* Left */}
              <button
                type="button"
                disabled={
                  currentIndex ===
                  0
                }
                onClick={
                  handlePrev
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900/80 hover:bg-[#2563EB] disabled:opacity-20 disabled:pointer-events-none text-white rounded-full flex items-center justify-center transition-all cursor-pointer"
                aria-label="이전 인증"
              >

                <ChevronLeft className="w-6 h-6" />

              </button>


              {/* Right */}
              <button
                type="button"
                disabled={
                  currentIndex ===
                  submissions.length -
                    1
                }
                onClick={
                  handleNext
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900/80 hover:bg-[#2563EB] disabled:opacity-20 disabled:pointer-events-none text-white rounded-full flex items-center justify-center transition-all cursor-pointer"
                aria-label="다음 인증"
              >

                <ChevronRight className="w-6 h-6" />

              </button>

            </div>


            {/* Metadata */}
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 space-y-3">

              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/60 pb-3">

                <div className="flex items-center gap-2 flex-wrap">

                  <User className="w-4 h-4 text-blue-400 shrink-0" />

                  <span className="text-base font-bold text-white">

                    {currentItem.name ||
                      "이름 없음"}

                  </span>


                  <span className="text-xs text-slate-500">
                    |
                  </span>


                  <Building2 className="w-4 h-4 text-blue-400 shrink-0" />

                  <span className="text-sm font-semibold text-blue-200">

                    {currentItem.department ||
                      "부서 없음"}

                  </span>

                </div>


                <div className="flex items-center gap-1.5 text-xs text-slate-400">

                  <Calendar className="w-3.5 h-3.5" />

                  <span>

                    {currentItem.timestamp ||
                      "일자 정보 없음"}

                  </span>

                </div>

              </div>


              <div className="space-y-2">

                <div className="flex items-start gap-2 text-sm font-bold text-blue-300">

                  <FileText className="w-4 h-4 shrink-0 mt-0.5" />

                  <span className="leading-snug">

                    {currentItem.missionName ||
                      currentItem.missionId ||
                      "미션 정보 없음"}

                  </span>

                </div>


                {currentItem.description ? (

                  <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-700/40 text-xs sm:text-sm text-slate-200 leading-relaxed">

                    <span className="text-blue-400 font-semibold block mb-1">
                      활동 설명
                    </span>

                    {currentItem.description}

                  </div>

                ) : (

                  <div className="text-xs text-slate-500 italic">
                    작성된 활동 설명이 없습니다.
                  </div>

                )}

              </div>

            </div>


            {/* Image Error */}
            {imageError &&
              !isLoadingImage &&
              !imageData && (

                <div className="bg-rose-950/50 border border-rose-800 rounded-xl p-3 flex items-start gap-2 text-xs text-rose-200">

                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />

                  <span>
                    {imageError}
                  </span>

                </div>

              )}

          </div>


          {/* Bottom */}
          <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 space-y-3 shrink-0">

            {/* Pagination */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">

              <button
                type="button"
                disabled={
                  currentIndex ===
                  0
                }
                onClick={
                  handlePrev
                }
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-white transition-colors cursor-pointer"
              >

                <ChevronLeft className="w-4 h-4" />

                <span>
                  이전
                </span>

              </button>


              <span className="text-sm font-bold text-white tracking-widest tabular-nums">

                {currentIndex + 1} /{" "}

                {submissions.length}

              </span>


              <button
                type="button"
                disabled={
                  currentIndex ===
                  submissions.length -
                    1
                }
                onClick={
                  handleNext
                }
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-white transition-colors cursor-pointer"
              >

                <span>
                  다음
                </span>

                <ChevronRight className="w-4 h-4" />

              </button>

            </div>


            {/* Delete */}
            <button
              type="button"
              disabled={
                isDeleting
              }
              onClick={() => {

                setDeleteError(
                  null
                );

                setShowDeleteDialog(
                  true
                );

              }}
              className="w-full h-11 bg-rose-950/70 hover:bg-rose-900 border border-rose-800/70 disabled:opacity-50 disabled:pointer-events-none text-rose-300 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
            >

              <Trash2 className="w-4 h-4" />

              <span>
                인증 내역 삭제
              </span>

            </button>

          </div>

        </div>


        {/* Delete Dialog */}
        {showDeleteDialog && (

          <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-150">

            <div className="bg-white text-[#172033] rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl">

              <div className="space-y-1.5">

                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">

                  <Trash2 className="w-5 h-5" />

                </div>


                <h4 className="text-base font-extrabold text-[#172033]">
                  인증 내역을 삭제할까요?
                </h4>


                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  삭제하면 해당 제출 내역과 인증사진이 함께 삭제됩니다.
                  삭제한 내용은 관리자 화면에서 복구할 수 없습니다.
                </p>

              </div>


              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1 text-xs">

                <div className="font-bold text-[#172033]">
                  {currentItem.name} · {currentItem.department}
                </div>

                <div className="text-[#64748B]">
                  {currentItem.missionName}
                </div>

              </div>


              {deleteError && (

                <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 flex items-start gap-2 text-xs text-rose-800">

                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />

                  <span>
                    {deleteError}
                  </span>

                </div>

              )}


              <div className="grid grid-cols-2 gap-2 pt-1">

                <button
                  type="button"
                  disabled={
                    isDeleting
                  }
                  onClick={() => {

                    setShowDeleteDialog(
                      false
                    );

                    setDeleteError(
                      null
                    );

                  }}
                  className="h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-bold text-[#64748B] cursor-pointer disabled:opacity-50"
                >
                  취소
                </button>


                <button
                  type="button"
                  disabled={
                    isDeleting
                  }
                  onClick={
                    handleDelete
                  }
                  className="h-10 rounded-xl bg-[#DC2626] hover:bg-rose-700 disabled:opacity-50 disabled:pointer-events-none text-white text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >

                  {isDeleting ? (

                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />

                      <span>
                        삭제 중...
                      </span>
                    </>

                  ) : (

                    <>
                      <Trash2 className="w-4 h-4" />

                      <span>
                        삭제
                      </span>
                    </>

                  )}

                </button>

              </div>

            </div>

          </div>

        )}

      </div>
    );
  };