"use client";

import { useState, useEffect, useRef } from "react";

export default function SearchBar({ searchTerm, setSearchTerm, doctors }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchTerm && doctors.length > 0) {
      const matches = doctors
        .filter((doctor) =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 3); // Show top 3 matches
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, doctors]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSuggestionClick = (name) => {
    setSearchTerm(name);
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (suggestions.length > 0) {
        setSearchTerm(suggestions[0].name);
      }
      setSuggestions([]);
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          data-testid="autocomplete-input"
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search doctors by name..."
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
        {searchTerm && (
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setSearchTerm("")}
          >
            ✕
          </button>
        )}
      </div>

      {isFocused && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
          <ul>
            {suggestions.map((doctor) => (
              <li
                key={doctor.id}
                data-testid="suggestion-item"
                className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-0"
                onClick={() => handleSuggestionClick(doctor.name)}
              >
                {doctor.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
