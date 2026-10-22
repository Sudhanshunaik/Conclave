import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { GOA_CENTER, PANAJI_TO_GMC_ROUTE, GOA_LANDMARKS } from '../../utils/goaLocations';
import { Navigation, Clock, ShieldCheck, MapPin } from 'lucide-react';

function createHtmlIcon(emoji, label, color = '#6366f1') {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background: ${color};
        color: white;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        border: 3px solid white;
        box-shadow: 0 4px 14px rgba(0,0,0,0.4);
      ">${emoji}</div>
      <div style="
        background: rgba(15, 23, 42, 0.9);
        color: white;
        padding: 2px 8px;
        border-radius: 8px;
        font-size: 11px;
        font-weight: 700;
        white-space: nowrap;
        margin-top: 4px;
        border: 1px solid rgba(255,255,255,0.2);
        box-shadow: 0 2px 6px rgba(0,0,0,0.5);
      ">${label}</div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19]
  });
}

function MapUpdater({ helperCoords, pickupCoords }) {
  const map = useMap();
  useEffect(() => {
    if (helperCoords) {
      map.panTo([helperCoords.lat, helperCoords.lng], { animate: true, duration: 1 });
    } else if (pickupCoords) {
      map.panTo([pickupCoords.lat, pickupCoords.lng], { animate: true });
    }
  }, [helperCoords, pickupCoords, map]);
  return null;
}

export default function GoaLiveMap({
  task,
  helper,
  simulationStep,
  pickupCoords = { lat: 15.4989, lng: 73.8278 },
  destCoords = { lat: 15.4616, lng: 73.8567 },
  currentHelperCoords
}) {
  const defaultPickup = [pickupCoords.lat, pickupCoords.lng];
  const defaultDest = [destCoords.lat, destCoords.lng];
  const activeHelperPos = currentHelperCoords
    ? [currentHelperCoords.lat, currentHelperCoords.lng]
    : helper?.current_coords
      ? [helper.current_coords.lat, helper.current_coords.lng]
      : defaultPickup;

  const userIcon = createHtmlIcon('👤', 'Asha (Citizen)', '#10b981');
  const helperIcon = createHtmlIcon('🚶‍♂️', `${helper?.name || 'Rahul (Helper)'}`, '#6366f1');
  const destIcon = createHtmlIcon('🏥', 'GMC Bambolim', '#f43f5e');
  const landmarkIcon = createHtmlIcon('📍', 'Goa POI', '#f59e0b');

  const etaMinutes = Math.max(1, 5 - (simulationStep || 0));

  return (
    <div className="card" style={{ padding: '16px' }}>
      <div className="card-header" style={{ marginBottom: '12px' }}>
        <div className="card-title">
          <Navigation size={18} color="var(--primary-indigo)" />
          Interactive Live Goa Map & Escort Tracker • थेट स्थान ट्रॅकिंग
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="badge-verified">
            <ShieldCheck size={12} />
            Goa Geo-Fence Active
          </span>
          <span className="pill-btn" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
            <Clock size={12} color="var(--accent-amber)" />
            ETA: {task?.status === 'completed' ? 'Arrived at GMC' : `${etaMinutes} mins`}
          </span>
        </div>
      </div>

      <div className="map-card-wrapper">
        <MapContainer
          center={GOA_CENTER}
          zoom={13}
          scrollWheelZoom={false}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapUpdater helperCoords={currentHelperCoords} pickupCoords={pickupCoords} />

          {/* NH66 Route Polyline */}
          <Polyline
            positions={PANAJI_TO_GMC_ROUTE}
            pathOptions={{ color: '#6366f1', weight: 5, opacity: 0.85, dashArray: '8, 8' }}
          />

          {/* Pickup Marker */}
          <Marker position={defaultPickup} icon={userIcon}>
            <Popup>
              <strong>Pickup Point</strong><br />
              {task?.pickup_location || "Panaji KTC Bus Stand"}<br />
              Citizen: Asha Naik
            </Popup>
          </Marker>

          {/* Destination Marker */}
          <Marker position={defaultDest} icon={destIcon}>
            <Popup>
              <strong>Destination</strong><br />
              {task?.destination || "Goa Medical College (GMC) Bambolim"}
            </Popup>
          </Marker>

          {/* Matched Helper Pin */}
          {task?.status && task.status !== 'requested' && (
            <Marker position={activeHelperPos} icon={helperIcon}>
              <Popup>
                <strong>{helper?.name || 'Rahul Naik (Verified)'}</strong><br />
                Status: {task?.status === 'completed' ? 'Arrived at destination' : 'Escorting Citizen'}<br />
                Rating: ⭐ {helper?.rating || '4.95'}
              </Popup>
            </Marker>
          )}

          {/* Landmark POIs in Goa */}
          <Marker position={GOA_LANDMARKS.MAPUSA_MARKET.coords} icon={landmarkIcon}>
            <Popup>
              <strong>{GOA_LANDMARKS.MAPUSA_MARKET.name}</strong><br />
              {GOA_LANDMARKS.MAPUSA_MARKET.description}
            </Popup>
          </Marker>
          <Marker position={GOA_LANDMARKS.MARGAO_STATION.coords} icon={landmarkIcon}>
            <Popup>
              <strong>{GOA_LANDMARKS.MARGAO_STATION.name}</strong><br />
              {GOA_LANDMARKS.MARGAO_STATION.description}
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <div style={{
        marginTop: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.82rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={14} color="var(--accent-emerald)" />
          Corridor: Panaji KTC ➔ Ourem Creek ➔ Merces ➔ GMC Bambolim
        </div>
        <div>
          Status: <strong style={{ color: 'var(--text-main)' }}>{task?.status?.toUpperCase() || 'IDLE'}</strong>
        </div>
      </div>
    </div>
  );
}
