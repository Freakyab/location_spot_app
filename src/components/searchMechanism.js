import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import L from "leaflet";
import { useLocation } from "./context.tsx";

function LoactionSearch({ search, markerRef, mapRef }) {
  const { setLocation } = useLocation();
  useEffect(() => {
    const geocoder = L.Control.Geocoder.nominatim();
    if (search) {
      geocoder.geocode(search, (results) => {
        var r = results[0];
        if (r) {
          const { lat, lng } = r?.center;
          setLocation({ lat, long : lng });
          mapRef.current.setView([lat, lng], mapRef.current.getZoom());
          mapRef.current.flyTo([lat, lng], mapRef.current.getZoom());
          markerRef.current.setLatLng([lat, lng]);
        }
      });
    }
  }, [search,mapRef,markerRef,setLocation]);

  return null;
}

export default LoactionSearch;
