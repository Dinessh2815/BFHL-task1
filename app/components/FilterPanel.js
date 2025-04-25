"use client";

import { useState, useEffect } from "react";

export default function FilterPanel({ filters, doctors, handleFilterChange }) {
  const [specialties, setSpecialties] = useState([]);

  const specialtyTestIds = {
    "General Physician": "filter-specialty-General-Physician",
    Dentist: "filter-specialty-Dentist",
    Dermatologist: "filter-specialty-Dermatologist",
    Paediatrician: "filter-specialty-Paediatrician",
    "Gynaecologist and Obstetrician": "filter-specialty-Gynaecologist",
    ENT: "filter-specialty-ENT",
    Diabetologist: "filter-specialty-Diabetologist",
    Cardiologist: "filter-specialty-Cardiologist",
    Physiotherapist: "filter-specialty-Physiotherapist",
    Endocrinologist: "filter-specialty-Endocrinologist",
    Orthopaedic: "filter-specialty-Orthopaedic",
    Ophthalmologist: "filter-specialty-Ophthalmologist",
    Gastroenterologist: "filter-specialty-Gastroenterologist",
    Pulmonologist: "filter-specialty-Pulmonologist",
    Psychiatrist: "filter-specialty-Psychiatrist",
    Urologist: "filter-specialty-Urologist",
    "Dietitian/Nutritionist": "filter-specialty-Dietitian-Nutritionist",
    Psychologist: "filter-specialty-Psychologist",
    Sexologist: "filter-specialty-Sexologist",
    Nephrologist: "filter-specialty-Nephrologist",
    Neurologist: "filter-specialty-Neurologist",
    Oncologist: "filter-specialty-Oncologist",
    Ayurveda: "filter-specialty-Ayurveda",
    Homeopath: "filter-specialty-Homeopath",
  };

  useEffect(() => {
    if (doctors.length > 0) {
      // Extract unique specialties from doctors
      const allSpecialties = new Set();
      doctors.forEach((doctor) => {
        doctor.specialities.forEach((specialty) => {
          allSpecialties.add(specialty.name);
        });
      });

      setSpecialties(Array.from(allSpecialties).sort());
    }
  }, [doctors]);

  // Get the data-testid for a specialty name
  const getTestId = (specialty) => {
    // Try exact match first
    if (specialtyTestIds[specialty]) {
      return specialtyTestIds[specialty];
    }

    // For specialties like "Gynaecologist and Obstetrician", fall back to the standardized version
    for (const [key, id] of Object.entries(specialtyTestIds)) {
      if (specialty.includes(key)) {
        return id;
      }
    }

    // If no match is found, create a standardized data-testid
    return `filter-specialty-${specialty.replace(/[\/\s]/g, "-")}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>

      {/* Consultation Mode Filter */}
      <div className="mb-6">
        <h3
          data-testid="filter-header-moc"
          className="font-semibold mb-3 pb-2 border-b"
        >
          Consultation Mode
        </h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              data-testid="filter-video-consult"
              name="consultationMode"
              checked={filters.consultationMode === "video_consult"}
              onChange={() =>
                handleFilterChange("consultationMode", "video_consult")
              }
              className="form-radio text-blue-600"
            />
            <span>Video Consult</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              data-testid="filter-in-clinic"
              name="consultationMode"
              checked={filters.consultationMode === "in_clinic"}
              onChange={() =>
                handleFilterChange("consultationMode", "in_clinic")
              }
              className="form-radio text-blue-600"
            />
            <span>In Clinic</span>
          </label>

          {filters.consultationMode && (
            <button
              onClick={() => handleFilterChange("consultationMode", "")}
              className="text-blue-600 text-sm hover:underline ml-5 mt-2"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Specialties Filter */}
      <div className="mb-6">
        <h3
          data-testid="filter-header-speciality"
          className="font-semibold mb-3 pb-2 border-b"
        >
          Speciality
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {specialties.map((specialty) => (
            <label
              key={specialty}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                data-testid={getTestId(specialty)}
                checked={filters.specialties.includes(specialty)}
                onChange={() => handleFilterChange("specialties", specialty)}
                className="form-checkbox text-blue-600"
              />
              <span>{specialty}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sorting Options */}
      <div>
        <h3
          data-testid="filter-header-sort"
          className="font-semibold mb-3 pb-2 border-b"
        >
          Sort By
        </h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              data-testid="sort-fees"
              name="sort"
              checked={filters.sort === "fees"}
              onChange={() => handleFilterChange("sort", "fees")}
              className="form-radio text-blue-600"
            />
            <span>Fees (Low to High)</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              data-testid="sort-experience"
              name="sort"
              checked={filters.sort === "experience"}
              onChange={() => handleFilterChange("sort", "experience")}
              className="form-radio text-blue-600"
            />
            <span>Experience (High to Low)</span>
          </label>

          {filters.sort && (
            <button
              onClick={() => handleFilterChange("sort", "")}
              className="text-blue-600 text-sm hover:underline ml-5 mt-2"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
