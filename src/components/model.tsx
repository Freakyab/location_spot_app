import React, { useEffect } from "react";
import { useLocation } from "./context.tsx";
import { Search } from "lucide-react";

const LocationModal = ({
  setIsFocusSearch,
  isModalOpen,
  setIsModalOpen,
}: {
  setIsFocusSearch: (value: boolean) => void;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}) => {
  const { setLocation } = useLocation();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, long: longitude });
          setIsModalOpen(false);
        },
        (error) => {
          setIsModalOpen(true);
        }
      );
    } else {
      setIsModalOpen(true);
    }
  }, []);

  const handleEnableLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          alert(`Latitude: ${latitude}, Longitude: ${longitude}`);
          setIsModalOpen(false);
        },
        (error) => {
          alert(`Error obtaining location: ${error.code}, ${error.message}`);
          console.error("Error obtaining location", error);
        },
        { enableHighAccuracy: true, maximumAge: 10000 }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleModalManulSearch = () => {
    setIsFocusSearch(true);
    setIsModalOpen(false);
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 flex sm:items-center items-end justify-center bg-gray-800 bg-opacity-75 z-[401]">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Location Permission</h2>
            <p className="mb-4">
              Please enable location services to update your delivery address.
            </p>
            <div className="flex justify-end gap-4 flex-col sm:flex-row">
              <button
                onClick={handleEnableLocation}
                className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 rounded-md">
                Enable Location
              </button>
              <button
                onClick={handleModalManulSearch}
                className="bg-red-700 text-white px-4 py-2 flex items-center justify-center gap-3 rounded-md font-semibold
                hover:bg-red-800">
                <Search size={20} />
                Search manully location
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LocationModal;
