import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, X, Building2 } from "lucide-react";
import { DEPARTMENT_CATEGORIES } from "../constants";

interface DepartmentComboboxProps {
  value: string;
  onChange: (department: string) => void;
}

/**
 * Normalizes string for flexible matching ignoring whitespace and case
 * e.g., "102 Unit", "102u", "102 unit" -> "102unit"
 */
function normalizeString(str: string): string {
  return str.replace(/\s+/g, "").toLowerCase();
}

export const DepartmentCombobox: React.FC<DepartmentComboboxProps> = ({
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when opening dropdown
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Filtered categories and departments (whitespace and case insensitive)
  const filteredCategories = useMemo(() => {
    const query = normalizeString(searchQuery);
    if (!query) return DEPARTMENT_CATEGORIES;

    return DEPARTMENT_CATEGORIES.map((cat) => {
      const filteredItems = cat.items.filter((item) =>
        normalizeString(item).includes(query)
      );
      return {
        category: cat.category,
        items: filteredItems,
      };
    }).filter((cat) => cat.items.length > 0);
  }, [searchQuery]);

  const handleSelect = (dept: string) => {
    onChange(dept);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearchQuery("");
  };

  return (
    <div className="space-y-1.5" ref={containerRef}>
      <label className="block text-sm font-bold text-[#172033]">
        근무 부서를 선택해주세요. <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full min-h-[48px] px-3.5 rounded-xl border text-left flex items-center justify-between gap-2 bg-white transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] cursor-pointer ${
            value
              ? "border-[#2563EB] text-[#172033] font-medium bg-[#EAF2FF]/30"
              : "border-[#D9E2EC] text-[#64748B]"
          }`}
        >
          <div className="flex items-center gap-2.5 truncate">
            <Building2 className="w-5 h-5 text-[#2563EB] shrink-0" />
            <span className="text-base truncate">
              {value || "부서 이름을 검색하거나 선택하세요"}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {value && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    onChange("");
                  }
                }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 cursor-pointer"
                aria-label="선택 해제"
              >
                <X className="w-4 h-4" />
              </span>
            )}
            <ChevronDown
              className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                isOpen ? "rotate-180 text-[#2563EB]" : ""
              }`}
            />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-30 left-0 right-0 mt-1.5 bg-white border border-[#D9E2EC] rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Search Input Bar */}
            <div className="p-2.5 bg-slate-50 border-b border-[#D9E2EC] flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="부서명 검색 (예: 신경, 내과, 102U)"
                className="w-full bg-transparent border-none text-base text-[#172033] placeholder:text-slate-400 focus:outline-none focus:ring-0 py-1"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1 text-slate-400 hover:text-slate-600 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* List Items Scrollable Area */}
            <div className="max-h-64 sm:max-h-72 overflow-y-auto divide-y divide-slate-100 p-1">
              {filteredCategories.length === 0 ? (
                <div className="py-8 text-center text-sm text-[#64748B]">
                  검색 결과가 없습니다.
                </div>
              ) : (
                filteredCategories.map((cat) => (
                  <div key={cat.category} className="py-1">
                    <div className="px-3 py-1 text-[11px] font-bold text-[#1E3A5F] tracking-wider uppercase bg-slate-100/80 rounded-md my-0.5">
                      [{cat.category}]
                    </div>
                    <div className="space-y-0.5 mt-0.5">
                      {cat.items.map((item) => {
                        const isSelected = value === item;
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => handleSelect(item)}
                            className={`w-full min-h-[40px] px-3 py-2 text-left text-sm rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-[#2563EB] text-white font-bold"
                                : "text-[#172033] hover:bg-[#EAF2FF] hover:text-[#1E3A5F]"
                            }`}
                          >
                            <span>{item}</span>
                            {isSelected && (
                              <Check className="w-4 h-4 text-white shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
