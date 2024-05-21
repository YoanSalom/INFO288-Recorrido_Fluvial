import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Corrige el problema con los íconos predeterminados de Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

function App() {
    const [location, setLocation] = useState(null);
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                setLocation([latitude, longitude]);

                // Enviar la ubicación al backend
                fetch('http://127.0.0.1:5000/location', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ latitude, longitude })
                })
                .then(response => response.json())
                .then(data => setStatus(data.status))
                .catch(error => console.error('Error:', error));
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                {location ? (
                    <MapContainer center={location} zoom={13} style={{ height: "100vh", width: "100%" }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={location}>
                            <Popup>
                                You are here.
                            </Popup>
                        </Marker>
                    </MapContainer>
                ) : (
                    <p>Getting location...</p>
                )}
                {status && <p>Status: {status}</p>}
            </header>
        </div>
    );
}

export default App;