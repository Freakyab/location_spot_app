import React, { useEffect, useState } from "react";
import { Briefcase, Contact, Home, MapPin } from "lucide-react";
import { useLocation } from "./context.tsx";
import { saveLocation } from "../action.tsx";
import { useAuth } from "./context.tsx";

function Hero({
  setIsFocusSearch,
  isEnable,
  setIsEnable,
}: {
  setIsFocusSearch: (value: boolean) => void;
  isEnable: boolean;
  setIsEnable: (value: boolean) => void;
}) {
  const { userDetails } = useAuth();
  const [formData, setFormData] = useState({
    addressFetched: "",
    houseAddress: "",
    aparmentAddress: "",
  });

  const { location } = useLocation();
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        if (location.lat === 0 && location.long === 0) return;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.long}&format=jsonv2`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        if (data.display_name) {
          setFormData({
            ...formData,
            addressFetched: data.display_name,
          });
        }
      } catch (e) {
        console.error("Error fetching location:", e);
      }
    };
    fetchLocation();
  }, [location]);

  const handleSubmit = async (type: string) => {
    if (userDetails.token) {
      if (formData.houseAddress === "" || formData.aparmentAddress === "") {
        alert("Please fill all the fields");
        return;
      }
      saveLocation(formData, userDetails.token, type).then((success) => {
        if (success) {
          setIsEnable(false);
        }
      });
    } else {
      alert("Please login to save location");
    }
  };

  return (
    <div className="w-full max-w-lg h-fit p-6 bg-white shadow-md rounded-lg z-[500] absolute sm:top-20 sm:left-10 bottom-0 left-0">
      {location.lat === 0 && location.long === 0 ? (
        <p className="text-xl font-semibold text-center mb-4">
          Fetching Your Location Details
        </p>
      ) : (
        <React.Fragment>
          {!isEnable ? (
            <div>
              <p className="text-xl font-semibold text-center mb-4">
                Select Your Location Details
              </p>
              <div className="flex items-center gap-3 mb-6">
                <span>
                  <MapPin className="text-red-400 w-6 h-6" />
                </span>
                <div>
                  <p className="font-bold text-lg">
                    {formData.addressFetched.split(",")[0]}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formData.addressFetched}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  className="flex-1 border border-red-400 text-red-400 rounded-md px-4 py-2 hover:bg-red-50"
                  onClick={() => setIsEnable(true)}>
                  Enable
                </button>
                <button
                  className="flex-1 bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600"
                  onClick={() => {
                    setIsFocusSearch(true);
                  }}>
                  Change
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span>
                  <MapPin className="text-red-400 w-6 h-6" />
                </span>
                <div>
                  <p className="font-bold text-lg">
                    {formData.addressFetched.split(",")[0]}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formData.addressFetched}
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  House / Flat No. / Block No.
                </label>
                <input
                  type="text"
                  value={formData.houseAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, houseAddress: e.target.value })
                  }
                  placeholder="Enter House / Flat No. / Block No."
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apartment / Road / Area
                </label>
                <input
                  type="text"
                  value={formData.aparmentAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      aparmentAddress: e.target.value,
                    })
                  }
                  placeholder="Enter Apartment / Road / Area"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
                />
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-sm font-medium text-gray-700">Save As:</p>
                <div className="flex gap-4">
                  <button
                    className="flex flex-col items-center p-3 border-2 border-gray-300 rounded-md hover:border-gray-500"
                    onClick={() => handleSubmit("home")}>
                    <Home className="text-gray-600 w-6 h-6" />
                    <span className="text-xs text-gray-600 mt-1">Home</span>
                  </button>
                  <button
                    className="flex flex-col items-center p-3 border-2 border-gray-300 rounded-md hover:border-gray-500"
                    onClick={() => handleSubmit("work")}>
                    <Briefcase className="text-gray-600 w-6 h-6" />
                    <span className="text-xs text-gray-600 mt-1">Work</span>
                  </button>
                  <button
                    className="flex flex-col items-center p-3 border-2 border-gray-300 rounded-md hover:border-gray-500"
                    onClick={() => handleSubmit("friend")}>
                    <Contact className="text-gray-600 w-6 h-6" />
                    <span className="text-xs text-gray-600 mt-1">Friend</span>
                  </button>
                  <button
                    className="flex flex-col items-center p-3 border-2 border-gray-300 rounded-md hover:border-gray-500"
                    onClick={() => handleSubmit("other")}>
                    <MapPin className="text-gray-600 w-6 h-6" />
                    <span className="text-xs text-gray-600 mt-1">Other</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
}

export default Hero;
