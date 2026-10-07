import React, { useRef, useState } from "react";
import { Camera, Image as ImageIcon, Trash2, RefreshCw, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { compressImage } from "../utils/imageCompression";

interface PhotoUploaderProps {
  imageData: string | null;
  onImageSelected: (base64Data: string | null) => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  imageData,
  onImageSelected,
}) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      setCompressionInfo("사진을 최적화하고 있습니다...");

      // Compress image to max 1600px long edge, JPEG quality 0.8
      const compressedDataUrl = await compressImage(file, 1600, 0.8);
      onImageSelected(compressedDataUrl);

      const originalMB = (file.size / (1024 * 1024)).toFixed(1);
      const approxBase64Bytes = compressedDataUrl.length * (3 / 4);
      const compressedMB = (approxBase64Bytes / (1024 * 1024)).toFixed(1);
      setCompressionInfo(`사진 용량이 최적화되었습니다 (${originalMB}MB → ${compressedMB}MB)`);
    } catch (err) {
      console.error("Image compression error:", err);
      alert("이미지 처리 중 오류가 발생했습니다. 다른 사진을 선택해주세요.");
      onImageSelected(null);
      setCompressionInfo(null);
    } finally {
      setIsCompressing(false);
      if (cameraInputRef.current) cameraInputRef.current.value = "";
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    onImageSelected(null);
    setCompressionInfo(null);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-[#172033]">
        미션 수행 사진을 등록해주세요. <span className="text-red-500">*</span>
      </label>

      {/* Hidden File Inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {!imageData ? (
        <div className="space-y-2.5">
          {/* Main Action: Camera Capture Button */}
          <button
            type="button"
            disabled={isCompressing}
            onClick={() => cameraInputRef.current?.click()}
            className="w-full min-h-[52px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60"
          >
            {isCompressing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Camera className="w-5 h-5" />
            )}
            <span>사진 촬영하기</span>
          </button>

          {/* Secondary Action: Choose from Album */}
          <button
            type="button"
            disabled={isCompressing}
            onClick={() => galleryInputRef.current?.click()}
            className="w-full min-h-[48px] bg-white border border-[#D9E2EC] hover:bg-slate-50 text-[#172033] rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ImageIcon className="w-4 h-4 text-[#64748B]" />
            <span>앨범에서 선택하기</span>
          </button>
        </div>
      ) : (
        /* Image Preview Area */
        <div className="bg-slate-900 rounded-2xl p-2.5 sm:p-3 space-y-2.5 relative overflow-hidden shadow-inner">
          <div className="relative rounded-xl overflow-hidden bg-black flex items-center justify-center max-h-80 sm:max-h-96">
            <img
              src={imageData}
              alt="미션 인증 미리보기"
              className="max-h-80 sm:max-h-96 w-auto object-contain rounded-lg"
            />
            {isCompressing && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm font-medium">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                처리 중...
              </div>
            )}
          </div>

          {/* Action buttons under preview */}
          <div className="flex items-center justify-between gap-2 px-1 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-blue-200 font-medium truncate">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">{compressionInfo || "사진 등록 완료"}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>다시 선택</span>
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>삭제</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safety & Patient Data Privacy Warning below photo area */}
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
        <p className="text-xs text-rose-900 leading-snug font-medium">
          사진에 환자 이름, 등록번호, 의무기록, 비밀번호 등 개인정보가 보이지 않는지 다시 한번 확인해주세요.
        </p>
      </div>
    </div>
  );
};
