import React, {
  useRef,
  useState
} from "react";

import {
  Camera,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react";

import {
  compressImage
} from "../utils/imageCompression";


interface PhotoUploaderProps {
  imageData: string | null;
  onImageSelected: (
    base64Data: string | null
  ) => void;
}


/**
 * 파일 크기 표시
 *
 * 1MB 미만은 KB
 * 1MB 이상은 MB
 */
function formatFileSize(
  bytes: number
): string {
  if (!bytes || bytes <= 0) {
    return "0KB";
  }

  if (
    bytes <
    1024 * 1024
  ) {
    return `${Math.max(
      1,
      Math.round(bytes / 1024)
    )}KB`;
  }

  return `${(
    bytes /
    1024 /
    1024
  ).toFixed(1)}MB`;
}


/**
 * Data URL의 대략적인 실제 byte 계산
 */
function estimateDataUrlBytes(
  dataUrl: string
): number {
  if (!dataUrl) {
    return 0;
  }

  const base64 =
    dataUrl.includes(",")
      ? dataUrl.split(",")[1]
      : dataUrl;

  if (!base64) {
    return 0;
  }

  /**
   * Base64는 원본 대비 약 4/3 크기이므로
   * 대략 3/4로 환산
   */
  const padding =
    base64.endsWith("==")
      ? 2
      : base64.endsWith("=")
        ? 1
        : 0;

  return Math.max(
    0,
    Math.floor(
      (base64.length * 3) /
        4 -
        padding
    )
  );
}


export const PhotoUploader:
  React.FC<PhotoUploaderProps> = ({
    imageData,
    onImageSelected
  }) => {

    const cameraInputRef =
      useRef<HTMLInputElement>(
        null
      );

    const galleryInputRef =
      useRef<HTMLInputElement>(
        null
      );

    const [
      isCompressing,
      setIsCompressing
    ] = useState(false);

    const [
      compressionInfo,
      setCompressionInfo
    ] =
      useState<string | null>(
        null
      );

    const [
      imageError,
      setImageError
    ] =
      useState<string | null>(
        null
      );


    /**
     * 사진 처리
     */
    const handleFileChange =
      async (
        event:
          React.ChangeEvent<HTMLInputElement>
      ) => {

        const file =
          event.target.files?.[0];

        if (!file) {
          return;
        }


        /**
         * 이미지 형식 확인
         */
        if (
          !file.type.startsWith(
            "image/"
          )
        ) {
          setImageError(
            "이미지 파일만 등록할 수 있습니다."
          );

          return;
        }


        /**
         * 지나치게 큰 원본 방지
         * 브라우저 메모리 문제 예방
         */
        const MAX_ORIGINAL_SIZE =
          25 * 1024 * 1024;

        if (
          file.size >
          MAX_ORIGINAL_SIZE
        ) {
          setImageError(
            "사진 용량이 너무 큽니다. 25MB 이하의 사진을 선택해주세요."
          );

          return;
        }


        try {

          setIsCompressing(
            true
          );

          setImageError(
            null
          );

          setCompressionInfo(
            "사진을 최적화하고 있습니다..."
          );


          /**
           * 긴 변 1600px
           * JPEG quality 0.8
           */
          const compressedDataUrl =
            await compressImage(
              file,
              1600,
              0.8
            );


          if (
            !compressedDataUrl ||
            !compressedDataUrl.startsWith(
              "data:image/"
            )
          ) {
            throw new Error(
              "압축된 이미지 데이터가 올바르지 않습니다."
            );
          }


          onImageSelected(
            compressedDataUrl
          );


          const originalSize =
            formatFileSize(
              file.size
            );


          const compressedBytes =
            estimateDataUrlBytes(
              compressedDataUrl
            );


          const compressedSize =
            formatFileSize(
              compressedBytes
            );


          setCompressionInfo(
            `사진 용량이 최적화되었습니다 (${originalSize} → ${compressedSize})`
          );

        } catch (error) {

          console.error(
            "Image compression error:",
            error
          );


          onImageSelected(
            null
          );


          setCompressionInfo(
            null
          );


          setImageError(
            error instanceof Error
              ? error.message
              : "이미지 처리 중 오류가 발생했습니다. 다른 사진을 선택해주세요."
          );

        } finally {

          setIsCompressing(
            false
          );


          /**
           * 같은 사진도 다시 선택할 수 있도록
           * input value 초기화
           */
          if (
            cameraInputRef.current
          ) {
            cameraInputRef.current.value =
              "";
          }

          if (
            galleryInputRef.current
          ) {
            galleryInputRef.current.value =
              "";
          }
        }
      };


    /**
     * 사진 삭제
     */
    const handleRemove =
      () => {

        onImageSelected(
          null
        );

        setCompressionInfo(
          null
        );

        setImageError(
          null
        );
      };


    return (
      <div className="space-y-3">

        <label className="block text-sm font-bold text-[#172033]">
          미션 수행 사진을 등록해주세요.{" "}
          <span className="text-red-500">
            *
          </span>
        </label>


        {/* Hidden Camera Input */}
        <input
          ref={
            cameraInputRef
          }
          type="file"
          accept="image/*"
          capture="environment"
          onChange={
            handleFileChange
          }
          className="hidden"
        />


        {/* Hidden Gallery Input */}
        <input
          ref={
            galleryInputRef
          }
          type="file"
          accept="image/*"
          onChange={
            handleFileChange
          }
          className="hidden"
        />


        {!imageData ? (

          <div className="space-y-2.5">

            {/* Camera */}
            <button
              type="button"
              disabled={
                isCompressing
              }
              onClick={() =>
                cameraInputRef
                  .current
                  ?.click()
              }
              className="w-full min-h-[52px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:pointer-events-none"
            >

              {isCompressing ? (

                <Loader2 className="w-5 h-5 animate-spin" />

              ) : (

                <Camera className="w-5 h-5" />

              )}

              <span>
                {isCompressing
                  ? "사진 처리 중..."
                  : "사진 촬영하기"}
              </span>

            </button>


            {/* Gallery */}
            <button
              type="button"
              disabled={
                isCompressing
              }
              onClick={() =>
                galleryInputRef
                  .current
                  ?.click()
              }
              className="w-full min-h-[48px] bg-white border border-[#D9E2EC] hover:bg-slate-50 text-[#172033] rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60 disabled:pointer-events-none"
            >

              <ImageIcon className="w-4 h-4 text-[#64748B]" />

              <span>
                앨범에서 선택하기
              </span>

            </button>

          </div>

        ) : (

          <div className="bg-slate-900 rounded-2xl p-2.5 sm:p-3 space-y-2.5 relative overflow-hidden shadow-inner">

            {/* Preview */}
            <div className="relative rounded-xl overflow-hidden bg-black flex items-center justify-center max-h-80 sm:max-h-96">

              <img
                src={
                  imageData
                }
                alt="미션 인증 미리보기"
                className="max-h-80 sm:max-h-96 max-w-full w-auto object-contain rounded-lg"
              />


              {isCompressing && (

                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm font-medium">

                  <Loader2 className="w-6 h-6 animate-spin mr-2" />

                  처리 중...

                </div>

              )}

            </div>


            {/* Preview Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-1 pt-1">

              <div className="flex items-start gap-1.5 text-xs text-blue-200 font-medium min-w-0">

                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />

                <span className="break-words">
                  {compressionInfo ||
                    "사진 등록 완료"}
                </span>

              </div>


              <div className="flex items-center gap-2 shrink-0">

                <button
                  type="button"
                  disabled={
                    isCompressing
                  }
                  onClick={() =>
                    cameraInputRef
                      .current
                      ?.click()
                  }
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >

                  <RefreshCw className="w-3.5 h-3.5" />

                  <span>
                    다시 촬영
                  </span>

                </button>


                <button
                  type="button"
                  disabled={
                    isCompressing
                  }
                  onClick={
                    handleRemove
                  }
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >

                  <Trash2 className="w-3.5 h-3.5" />

                  <span>
                    삭제
                  </span>

                </button>

              </div>

            </div>

          </div>

        )}


        {/* Image Error */}
        {imageError && (

          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2.5">

            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />

            <p className="text-xs text-rose-900 leading-snug font-medium">
              {imageError}
            </p>

          </div>

        )}


        {/* Privacy Warning */}
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2.5">

          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />

          <p className="text-xs text-rose-900 leading-snug font-medium">
            사진에 환자 이름, 등록번호, 의무기록, 비밀번호 등 개인정보가 보이지 않는지 다시 한번 확인해주세요.
          </p>

        </div>

      </div>
    );
  };