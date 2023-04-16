// App.js
import React, { useState, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import MapContainer from './components/MapContainer';
import NavigationPanel from './components/NavigationPanel';
import { fetchNearbyFuelStations, geocodeAddress } from './api';
import LandingPage from './components/LandingPage';

export default function Home() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const defaultCenter = {
    lat: 51.504171,
    lng: -2.549914,
  }; // You can change the coordinates to the desired default location

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

  const handleLocationConfirm = (location) => {
    setUserLocation(location);
    setLocationConfirmed(true);
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

          const directionsService = new window.google.maps.DirectionsService();

          const fetchDrivingDistance = (origin, destination) => {
            return new Promise((resolve, reject) => {
              directionsService.route(
                {
                  origin: origin,
                  destination: destination,
                  travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                  if (status === window.google.maps.DirectionsStatus.OK) {
                    const distanceInMeters =
                      result.routes[0].legs[0].distance.value;
                    resolve(distanceInMeters);
                  } else {
                    reject(`Directions request failed due to ${status}`);
                  }
                }
              );
            });
          };

          const fetchAllDrivingDistances = async () => {
            const transformedStations = [];

            for (const station of results.results) {
              try {
                const drivingDistanceInMeters = await fetchDrivingDistance(
                  userLocation,
                  station.geometry.location
                );
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
                  distance: drivingDistanceInKm, // Distance in kilometers
                });
              } catch (error) {
                console.error(
                  `Error fetching driving distance for station ${station.name}:`,
                  error
                );
              }
            }

            setStations(transformedStations);
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
        setStations={setStations}
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
          setStations={setStations}
          destination={destination}
          onDirectionsClick={onDirectionsClick}
          isBlurred={!locationConfirmed}
          compareStations={compareStations}
          setCompareStations={setCompareStations}
          zoomResetKey={zoomResetKey}
        />
        {!locationConfirmed && (
          <LandingPage onLocationConfirm={handleLocationConfirm} />
        )}
      </div>
    </>
  );
}
