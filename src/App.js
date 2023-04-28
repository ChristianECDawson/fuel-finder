import React, { useState, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import MapContainer from './components/MapContainer';
import NavigationPanel from './components/NavigationPanel';
import { fetchNearbyFuelStations } from './api';
import LandingPage from './components/LandingPage';

const googleMapsLibraries = ['places'];

export default function Home() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: googleMapsLibraries,
  });

  const defaultCenter = {
    lat: 51.504171,
    lng: -2.549914,
  };

  const [userLocation, setUserLocation] = useState(defaultCenter);
  const [radius, setRadius] = useState(5000);
  const [stations, setStations] = useState([]);
  const [destination, setDestination] = useState(null);
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [compareStations, setCompareStations] = useState([]);
  const [showingDirections, setShowingDirections] = useState(false);
  const [zoomResetKey, setZoomResetKey] = useState(0);

  const mapAndLandingPageContainerStyle = {
    position: 'relative',
  };

  const onDirectionsClick = (location) => {
    setDestination(location);
    setShowingDirections(true);
  };

  const onClearDirectionsClick = () => {
    setDestination(null);
    setShowingDirections(null);
  }

  const handleSearchUpdate = (locationCoords, radius) => {
    setUserLocation(locationCoords);
    setRadius(radius);
    setDestination(null);
    setCompareStations([]);
    setLocationConfirmed(true);
    setShowingDirections(null);
    setZoomResetKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    if (userLocation && radius) {
      fetchNearbyFuelStations(userLocation.lat, userLocation.lng, radius)
        .then((results) => {
          console.log("API response:", results);

          const distanceMatrixService = new window.google.maps.DistanceMatrixService();

          const fetchAllDrivingDistances = async () => {
            const transformedStations = [];

            const destinations = results.results.map(station => station.geometry.location);

            distanceMatrixService.getDistanceMatrix({
              origins: [userLocation],
              destinations: destinations,
              travelMode: window.google.maps.TravelMode.DRIVING,
            }, (response, status) => {
              if (status === window.google.maps.DistanceMatrixStatus.OK) {
                const distances = response.rows[0].elements;

                for (let i = 0; i < distances.length; i++) {
                  const station = results.results[i];
                  const drivingDistanceInMeters = distances[i].distance.value;
                  const drivingDistanceInKm = parseFloat(
                    (drivingDistanceInMeters / 1000).toFixed(2)
                  );

                  transformedStations.push({
                    ...station,
                    gasPrice: parseFloat(
                      (Math.random() * (1.52 - 1.42) + 1.42).toFixed(2)
                    ),
                    dieselPrice: parseFloat(
                      (Math.random() * (1.73 - 1.63) + 1.63).toFixed(2)
                    ),
                    distance: drivingDistanceInKm,
                  });
                }

                setStations(transformedStations);
              } else {
                console.error(`Distance Matrix request failed due to ${status}`);
              }
            });
          };

          fetchAllDrivingDistances();
        })
        .catch((error) => {
          console.error("Error fetching fuel stations:", error);
        });
    }
  }, [userLocation, radius]);


  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      <NavigationPanel
        userLocation={userLocation}
        defaultCenter={defaultCenter}
        onSearchUpdate={handleSearchUpdate}
        stations={stations}
        destination={destination}
        onDirectionsClick={onDirectionsClick}
        onClearDirectionsClick={onClearDirectionsClick}
        isBlurred={!locationConfirmed}
        compareStations={compareStations}
        setCompareStations={setCompareStations}
        showingDirections={showingDirections}
      />
      <div style={mapAndLandingPageContainerStyle}>
        <MapContainer
          userLocation={userLocation}
          radius={radius}
          stations={stations}
          destination={destination}
          onDirectionsClick={onDirectionsClick}
          isBlurred={!locationConfirmed}
          compareStations={compareStations}
          setCompareStations={setCompareStations}
          zoomResetKey={zoomResetKey}
        />
        {!locationConfirmed && (
          <LandingPage />
        )}
      </div>
    </>
  );
}
