import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { MissionCard } from "./components/MissionCard";
import { DepartmentCombobox } from "./components/DepartmentCombobox";
import { UserInfoForm } from "./components/UserInfoForm";
import { PhotoUploader } from "./components/PhotoUploader";
import { SuccessPage } from "./components/SuccessPage";
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { MISSIONS, Mission } from "./constants";
import {
  submitMissionApi,
  fetchMissionSettingsApi,
  AdminDataResponse,
} from "./utils/api";
import { Loader2, AlertCircle, Send, Calendar } from "lucide-react";

export default function App() {
  // Navigation View State: 'form' | 'success' | 'admin-login' | 'admin-dashboard'
  const [view, setView] = useState<"form" | "success" | "admin-login" | "admin-dashboard">("form");

  // Mission Settings State (Weekly active missions)
  const [currentWeek, setCurrentWeek] = useState("1");
  const [activeMissions, setActiveMissions] = useState<string[]>(
    MISSIONS.map((m) => m.id)
  );
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  // Form Fields
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [department, setDepartment] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);

  // Submission Progress & Error state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Admin Session State
  const [adminPassword, setAdminPassword] = useState("");
  const [adminData, setAdminData] = useState<AdminDataResponse | null>(null);

  // Load Mission Settings on Mount
  useEffect(() => {
    async function loadSettings() {
      try {
        setIsLoadingSettings(true);
        const settings = await fetchMissionSettingsApi();
        if (settings && settings.activeMissions && settings.activeMissions.length > 0) {
          if (settings.currentWeek) setCurrentWeek(String(settings.currentWeek));
          setActiveMissions(settings.activeMissions);
        }
      } catch (err) {
        console.warn("Failed to fetch mission settings on mount, using defaults", err);
      } finally {
        setIsLoadingSettings(false);
      }
    }
    loadSettings();
  }, []);

  // Filter visible missions based on activeMissions
  const visibleMissions = MISSIONS.filter((m) =>
    activeMissions.includes(m.id)
  );

  // Validation Check
  const isFormValid =
    Boolean(selectedMission) &&
    Boolean(department.trim()) &&
    Boolean(name.trim()) &&
    Boolean(imageData);

  // Handle Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !selectedMission || !imageData || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const res = await submitMissionApi({
        missionId: selectedMission.id,
        missionName: selectedMission.title,
        department: department.trim(),
        name: name.trim(),
        description: description.trim(),
        imageData: imageData,
        imageMimeType: "image/jpeg"
      });

      if (res && res.success !== false) {
        setView("success");
      } else {
        setSubmitError("등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setSubmitError("등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form after completion
  const handleReset = () => {
    setSelectedMission(null);
    setDepartment("");
    setName("");
    setDescription("");
    setImageData(null);
    setSubmitError(null);
    setView("form");
  };

  // Render Admin Flow
  if (view === "admin-login") {
    return (
      <div className="min-h-screen bg-[#F5F8FC] py-6 px-4 font-sans">
        <AdminLogin
          onSuccess={(pw, data) => {
            setAdminPassword(pw);
            setAdminData(data);
            setView("admin-dashboard");
          }}
          onBackToUser={() => setView("form")}
        />
      </div>
    );
  }

  if (view === "admin-dashboard" && adminData) {
    return (
      <div className="min-h-screen bg-[#F5F8FC] py-6 px-4 font-sans">
        <AdminDashboard
          adminPassword={adminPassword}
          initialData={adminData}
          onBackToUser={() => setView("form")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F8FC] text-[#172033] flex flex-col justify-between font-sans">
      {/* Main Container */}
      <main className="w-full max-w-2xl mx-auto px-4 py-5 sm:py-8 space-y-5">
        {view === "success" && selectedMission ? (
          <SuccessPage
            department={department}
            name={name}
            missionTitle={selectedMission.title}
            onReset={handleReset}
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 pb-24">
            {/* Header & Campaign Banner */}
            <Header />

            {/* Section 1: Select Mission */}
            <section className="bg-white border border-[#D9E2EC] rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#2563EB] text-white font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#172033]">
                    미션 선택 <span className="text-red-500">*</span>
                  </h2>
                </div>

                {/* Week Badge */}
                <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#EAF2FF] text-[#2563EB] text-xs font-bold rounded-full border border-blue-200">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{currentWeek}주차 미션</span>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-[#64748B] font-medium">
                이번 주 정보보호 미션을 선택해주세요.
              </div>

              {/* Skeleton or Mission Cards */}
              {isLoadingSettings ? (
                <div className="space-y-3 py-2">
                  <div className="h-24 bg-slate-100 animate-pulse rounded-2xl" />
                  <div className="h-24 bg-slate-100 animate-pulse rounded-2xl" />
                </div>
              ) : (
                <div className="space-y-3">
                  {(visibleMissions.length > 0 ? visibleMissions : MISSIONS).map((m) => (
                    <MissionCard
                      key={m.id}
                      mission={m}
                      isSelected={selectedMission?.id === m.id}
                      onSelect={(m) => setSelectedMission(m)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Section 2: Department Selection */}
            <section className="bg-white border border-[#D9E2EC] rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="w-6 h-6 rounded-full bg-[#2563EB] text-white font-black text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <h2 className="text-base sm:text-lg font-extrabold text-[#172033]">
                  부서 선택
                </h2>
              </div>

              <DepartmentCombobox
                value={department}
                onChange={(dept) => setDepartment(dept)}
              />
            </section>

            {/* Section 3: Participant Name & Activity Description */}
            <section className="bg-white border border-[#D9E2EC] rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="w-6 h-6 rounded-full bg-[#2563EB] text-white font-black text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <h2 className="text-base sm:text-lg font-extrabold text-[#172033]">
                  참여자 정보
                </h2>
              </div>

              <UserInfoForm
                name={name}
                onChangeName={(n) => setName(n)}
                description={description}
                onChangeDescription={(d) => setDescription(d)}
                isMission05={selectedMission?.id === "M05"}
              />
            </section>

            {/* Section 4: Photo Capture / Upload */}
            <section className="bg-white border border-[#D9E2EC] rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="w-6 h-6 rounded-full bg-[#2563EB] text-white font-black text-xs flex items-center justify-center shrink-0">
                  4
                </span>
                <h2 className="text-base sm:text-lg font-extrabold text-[#172033]">
                  인증사진 촬영 및 등록
                </h2>
              </div>

              <PhotoUploader
                imageData={imageData}
                onImageSelected={(img) => setImageData(img)}
              />
            </section>

            {/* Error Message if submit failed */}
            {submitError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-sm font-semibold text-rose-900 animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Sticky Bottom CTA for Mobile & Desktop Ergonomics */}
            <div className="fixed bottom-0 left-0 right-0 p-3.5 sm:p-4 bg-white/90 backdrop-blur-md border-t border-[#D9E2EC] z-40 shadow-lg">
              <div className="max-w-2xl mx-auto">
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="w-full h-12 sm:h-14 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-md disabled:opacity-40 disabled:pointer-events-none active:scale-[0.99] transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-blue-200" />
                      <span>미션을 등록하고 있습니다...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>미션 인증하기</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </main>

      {/* Subtle Admin Link Footer */}
      <footer className="w-full border-t border-[#D9E2EC] py-6 px-4 bg-white text-center text-xs text-[#64748B] space-y-2">
        <p>© 2026 병원 정보보호팀 · 정보보호 미션 챌린지</p>
        <div>
          <button
            type="button"
            onClick={() => setView("admin-login")}
            className="text-[#64748B] hover:text-[#2563EB] underline underline-offset-2 transition-colors cursor-pointer text-[11px]"
          >
            관리자
          </button>
        </div>
      </footer>
    </div>
  );
}
