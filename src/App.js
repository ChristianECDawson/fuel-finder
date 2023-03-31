import { useMemo } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

export default function Home() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>Loading... </div>;
  return <Map />;
}


function Map() {
  const center = useMemo(() => ({ lat: 44, lng: -80 }), []);

  return <GoogleMap
    zoom={10}
    center={center}
    mapContainerClassName="map-container"
  >
    <Marker position={center} />
  </GoogleMap>;
}

// import React, { useState, useEffect } from 'react';
// import { Box, Container, Grid } from '@mui/material';
// import NavigationPanel from './components/NavigationPanel';
// import MapContainer from './components/MapContainer';

// function App() {
//   const [userLocation, setUserLocation] = useState(null);

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setUserLocation({
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         });
//       },
//       (error) => {
//         console.error('Error getting user location:', error);
//       }
//     );
//   }, []);

//   return (
//     <Box sx={{ height: '100vh' }}>
//       <Container maxWidth="xl" disableGutters>
//         <Grid container>
//           <Grid item xs={12}>
//             <NavigationPanel />
//           </Grid>
//           <Grid item xs={12}>
//             {userLocation && (
//               <MapContainer userLocation={userLocation} />
//             )}
//           </Grid>
//         </Grid>
//       </Container>
//     </Box>
//   );
// }

// export default App;