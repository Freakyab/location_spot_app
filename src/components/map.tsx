import React, { useEffect } from "react";
import { TileLayer, MapContainer, Marker, useMap, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { userIcon } from "./icons.tsx";
import { useLocation } from "./context.tsx";

function Map({
  mapRef,
  setMapRef,
  setIsEnable,
  markerRef,
}: {
  mapRef: any;
  setMapRef: any;
  setIsEnable: (value: boolean) => void;
  markerRef: any;
}) {
  const { location, setLocation } = useLocation();

  const LocationMarker = () => {
    const map = useMap();

    useEffect(() => {
      setMapRef(map);
      if (location.lat !== 0 && location.long !== 0) {
        map.flyTo([location.lat, location.long], 12);
        if (markerRef.current !== null) {
          markerRef.current.openPopup();
        }
      }
    }, [map]);

    return null;
  };

  return (
    <MapContainer
      center={[15, 7]}
      zoom={10}
      ref={mapRef}
      className="w-screen h-[calc(100vh-4rem)]"
      zoomControl={false}
      scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
      {/* Add a marker for the user's location */}
      <Marker
        position={[location.lat, location.long]}
        icon={userIcon}
        ref={markerRef}
        draggable
        // after the user drags the marker, update the location
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target;
            const position = marker.getLatLng();
            setLocation({ lat: position.lat, long: position.lng });
            setIsEnable(false);
          },
        }}>
        <Popup>
          Your order will be delivered here Move pin to your exact location
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default Map;
