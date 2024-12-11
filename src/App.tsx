import React, { useRef, useState } from "react";
import Map from "./components/map.tsx";
import Model from "./components/model.tsx";
import Hero from "./components/hero.tsx";
import Navbar from "./components/navbar.tsx";
import LoactionSearch from "./components/searchMechanism.js";
import L from "leaflet";

function App() {
  const [mapRef, setMapRef] = useState(null);
  const [isEnable, setIsEnable] = useState(false);
  const [isFocusSearch, setIsFocusSearch] = useState(false);
  const [search, setSearch] = useState("");
  const markerRef = useRef<L.Marker>(null);
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div className="overflow-hidden">
      <Model
      setIsFocusSearch={setIsFocusSearch}
      isModalOpen={isModalOpen} 
      setIsModalOpen={setIsModalOpen} 
      />
      <Navbar
        // search={search}
        isEnable={isEnable}
        setIsEnable={setIsEnable}
        setSearch={setSearch}
        isFocusSearch={isFocusSearch}
        setIsFocusSearch={setIsFocusSearch}
      />
      <LoactionSearch search={search} mapRef={mapRef} markerRef={markerRef} />
      <Map
        markerRef={markerRef}
        mapRef={mapRef}
        setMapRef={setMapRef}
        setIsEnable={setIsEnable}
      />
      {!isModalOpen && (
        <Hero
          isEnable={isEnable}
          setIsFocusSearch={setIsFocusSearch}
          setIsEnable={setIsEnable}
        />
      )}
    </div>
  );
}

export default App;
