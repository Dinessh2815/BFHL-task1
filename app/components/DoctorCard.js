"use client";

import Image from "next/image";

export default function DoctorCard({ doctor }) {
  // Create a simple color background with initials as fallback
  const generateFallbackImage = (initials) => {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="%234A90E2"/><text x="50%" y="50%" font-family="Arial" font-size="40" fill="white" text-anchor="middle" dy=".3em">${initials}</text></svg>`;
  };

  // Function to handle default image if doctor's photo is null or "null"
  const getImageSrc = () => {
    if (!doctor.photo || doctor.photo === "null") {
      return generateFallbackImage(doctor.name_initials || "DR");
    }
    return doctor.photo;
  };

  return (
    <div
      data-testid="doctor-card"
      className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-4"
    >
      <div className="md:w-1/4 flex justify-center">
        <div className="relative h-32 w-32 rounded-full overflow-hidden">
          <Image
            src={getImageSrc()}
            alt={doctor.name}
            fill
            sizes="128px"
            className="object-cover"
            onError={(e) => {
              e.target.src = generateFallbackImage(
                doctor.name_initials || "DR"
              );
            }}
          />
        </div>
      </div>

      <div className="md:w-3/4">
        <h3 data-testid="doctor-name" className="text-xl font-semibold">
          {doctor.name}
        </h3>

        <div className="flex flex-wrap gap-2 mt-2">
          {doctor.specialities.map((specialty, index) => (
            <span
              key={index}
              data-testid="doctor-specialty"
              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
            >
              {specialty.name}
            </span>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap gap-4">
          <span data-testid="doctor-experience" className="text-gray-600">
            <i className="fas fa-briefcase mr-1"></i>
            {doctor.experience}
          </span>

          <span data-testid="doctor-fee" className="text-gray-600">
            <i className="fas fa-money-bill-wave mr-1"></i>
            {doctor.fees}
          </span>
        </div>

        <div className="mt-2">
          <p className="text-gray-700 line-clamp-2">
            {doctor.doctor_introduction ||
              `${doctor.name} is a healthcare professional based in ${
                doctor.clinic?.address?.city || "your area"
              }.`}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {doctor.video_consult && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              Video Consult Available
            </span>
          )}

          {doctor.in_clinic && (
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
              In-Clinic Consultation
            </span>
          )}

          {doctor.clinic?.address?.locality && doctor.clinic?.address?.city && (
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
              {doctor.clinic.address.locality}, {doctor.clinic.address.city}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
