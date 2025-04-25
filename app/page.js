"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBar from "@/app/components/SearchBar";
import FilterPanel from "@/app/components/FilterPanel";
import DoctorCard from "@/app/components/DoctorCard";
import {
  fetchDoctors,
  extractNumericFees,
  extractNumericExperience,
} from "@/app/services/doctorService";

// Client Component that uses searchParams
function HomeContent() {
  const searchParams = useSearchParams();

  // Store all doctor data fetched from API
  const [allDoctors, setAllDoctors] = useState([]);
  // Store filtered doctor data after applying filters
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    consultationMode: "",
    specialties: [],
    sort: "",
  });

  // Fetch all doctors data once on component mount
  useEffect(() => {
    const getDoctors = async () => {
      setLoading(true);
      const data = await fetchDoctors();
      setAllDoctors(data);
      setFilteredDoctors(data);
      setLoading(false);
    };

    getDoctors();
  }, []);

  // Initialize filters from URL params when component mounts or when URL changes
  useEffect(() => {
    if (allDoctors.length > 0) {
      const querySearchTerm = searchParams.get("search") || "";
      const queryConsultMode = searchParams.get("mode") || "";
      const querySpecialties = searchParams.get("specialties")
        ? searchParams.get("specialties").split(",")
        : [];
      const querySort = searchParams.get("sort") || "";

      setSearchTerm(querySearchTerm);
      setFilters({
        consultationMode: queryConsultMode,
        specialties: querySpecialties,
        sort: querySort,
      });
    }
  }, [searchParams, allDoctors]);

  // Apply all filters on the client side
  const applyClientSideFilters = useCallback(() => {
    // Start with all doctors
    let filtered = [...allDoctors];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply consultation mode filter
    if (filters.consultationMode) {
      filtered = filtered.filter((doctor) =>
        filters.consultationMode === "video_consult"
          ? doctor.video_consult
          : doctor.in_clinic
      );
    }

    // Apply specialty filters
    if (filters.specialties.length > 0) {
      filtered = filtered.filter((doctor) =>
        doctor.specialities.some((spec) =>
          filters.specialties.includes(spec.name)
        )
      );
    }

    // Apply sort
    if (filters.sort) {
      if (filters.sort === "fees") {
        filtered.sort((a, b) => {
          return extractNumericFees(a.fees) - extractNumericFees(b.fees);
        });
      } else if (filters.sort === "experience") {
        filtered.sort((a, b) => {
          return (
            extractNumericExperience(b.experience) -
            extractNumericExperience(a.experience)
          );
        });
      }
    }

    setFilteredDoctors(filtered);
    updateUrlParams();
  }, [allDoctors, searchTerm, filters]);

  // Apply all filters client-side whenever filters change
  useEffect(() => {
    if (allDoctors.length > 0) {
      applyClientSideFilters();
    }
  }, [filters, searchTerm, allDoctors, applyClientSideFilters]);

  // Update URL query parameters
  const updateUrlParams = () => {
    const params = new URLSearchParams();

    if (searchTerm) params.set("search", searchTerm);
    if (filters.consultationMode) params.set("mode", filters.consultationMode);
    if (filters.specialties.length > 0)
      params.set("specialties", filters.specialties.join(","));
    if (filters.sort) params.set("sort", filters.sort);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev };

      if (filterType === "consultationMode") {
        newFilters.consultationMode = value;
      } else if (filterType === "specialties") {
        if (newFilters.specialties.includes(value)) {
          newFilters.specialties = newFilters.specialties.filter(
            (spec) => spec !== value
          );
        } else {
          newFilters.specialties = [...newFilters.specialties, value];
        }
      } else if (filterType === "sort") {
        newFilters.sort = value;
      }

      return newFilters;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="container mx-auto">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            doctors={allDoctors}
          />
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="md:w-1/4 order-2 md:order-1">
            <FilterPanel
              filters={filters}
              doctors={allDoctors}
              handleFilterChange={handleFilterChange}
            />
          </aside>

          <section className="md:w-3/4 order-1 md:order-2">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {loading
                  ? "Loading doctors..."
                  : `${filteredDoctors.length} Doctors found`}
              </h2>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                  ))
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <h3 className="text-lg font-semibold text-gray-700">
                      No doctors found
                    </h3>
                    <p className="mt-2 text-gray-500">
                      Try adjusting your filters or search term
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

// Main export wrapped with Suspense
export default function Home() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
