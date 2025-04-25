// API service for fetching doctor data
const API_URL = "https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json";

export const fetchDoctors = async () => {
  try {
    // Use our local API route which now fetches from the real API endpoint
    const response = await fetch("/api/doctors");
    if (!response.ok) {
      throw new Error("Failed to fetch doctors");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
};

// Helper function to extract unique specialties from the doctor data
export const extractSpecialties = (doctors) => {
  const specialtiesSet = new Set();

  doctors.forEach((doctor) => {
    doctor.specialities.forEach((specialty) => {
      specialtiesSet.add(specialty.name);
    });
  });

  return Array.from(specialtiesSet).sort();
};

// Format fees to numeric value for sorting
export const extractNumericFees = (feeString) => {
  return parseInt(feeString.replace(/[^\d]/g, ""), 10) || 0;
};

// Extract numeric experience value for sorting
export const extractNumericExperience = (experienceString) => {
  const match = experienceString.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};
