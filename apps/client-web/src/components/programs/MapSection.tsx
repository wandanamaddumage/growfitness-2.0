import { LocationRow } from './common/LocationRow'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Location data with coordinates
const locations = [
  { 
    id: 'independence-square',
    label: "Independence Square", 
    lat: 6.9022, 
    lng: 79.8650, 
    type: "personal" as const,
    sub: "Any day · Colombo 7",
    sessionType: 'personal' as const,
    address: "Independence Square, Colombo 7, Sri Lanka",
    link: "https://maps.app.goo.gl/N1AEGWvuFFuSd8SN9"
  },
  { 
    id: 'colpetty',
    label: "Colpetty", 
    lat: 6.8970, 
    lng: 79.8545, 
    type: "both" as const,
    sub: "Saturdays · Colombo 3",
    sessionType: 'group' as const,
    address: "Colpetty, Colombo 3, Sri Lanka",
    link:"https://maps.app.goo.gl/SbXErtbH9NyJKvSXA"
  },
  { 
    id: 'nawala',
    label: "Nawala", 
    lat: 6.9010, 
    lng: 79.8820, 
    type: "group" as const,
    sub: "Saturdays · Nawala",
    sessionType: 'group' as const,
    address: "Nawala, Sri Lanka",
    link:"https://maps.app.goo.gl/iqLoxAAJKfr8oSdw6"
  },
  { 
    id: 'kirulapone',
    label: "Kirulapone", 
    lat: 6.8910, 
    lng: 79.8700, 
    type: "group" as const,
    sub: "Saturdays · Colombo 6",
    sessionType: 'group' as const,
    address: "Kirulapone, Colombo 6, Sri Lanka",
    link:"https://maps.app.goo.gl/TzTPoeSDMn6jcvhf7"
  },
  { 
    id: 'dehiwala',
    label: "Dehiwala", 
    lat: 6.8560, 
    lng: 79.8650, 
    type: "group" as const,
    sub: "Saturdays · Dehiwala",
    sessionType: 'group' as const,
    address: "Dehiwala, Sri Lanka",
    link: "https://maps.app.goo.gl/8hH24NvxBnsZJChF9"
  },
  { 
    id: 'our-office',
    label: "Our office", 
    lat: 6.8930, 
    lng: 79.8580, 
    type: "personal" as const,
    sub: "Any day · Colombo",
    sessionType: 'personal' as const,
    address: "Colombo, Sri Lanka",
    link: "https://maps.app.goo.gl/JKWRH5M8Auyza5Tk7"
  },
]

// Custom marker icons
const createMarkerIcon = (type: string) => {
  const color = type === "personal" ? "var(--gf-leaf)" : "var(--gf-sun)"
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 16px;
      height: 16px;
      background-color: ${color};
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 0 4px rgba(0,0,0,0.2);
      cursor: pointer;
      transition: transform 0.2s;
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}

export function MapSection() {
  useEffect(() => {
    // Fix for Leaflet's default icon issue
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    })
  }, [])

  return (
    <section className="relative px-6 py-20" style={{ backgroundColor: "var(--gf-green-deep)" }}>
      <img
        src="/images/Grow VI Elements/Icons/Yellow abs.png"
        alt="flower"
        className="absolute w-[360px] pointer-events-none opacity-10 animate-spin-slow"
        style={{ right: -80, top: -80 }}
      />
      <div className="mx-auto max-w-6xl">
        <h1
          className="text-5xl font-extrabold uppercase leading-tight text-white md:text-7xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Where we
          <br />
          <span style={{ color: "var(--gf-sun)" }}>host sessions.</span>
        </h1>

        <div className="mt-10 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div
            className="relative h-64 sm:h-80 md:h-96 overflow-hidden rounded-3xl"
            style={{ backgroundColor: "#16281f", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <MapContainer
              center={[6.89, 79.87]}
              zoom={13}
              style={{ height: '100%', width: '100%', zIndex: 0 }}
              zoomControl={false}
              attributionControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {locations.map((location) => (
                <Marker
                  key={location.id}
                  position={[location.lat, location.lng]}
                  icon={createMarkerIcon(location.type)}
                  eventHandlers={{
                    click: () => {
                      // Smooth scroll to the location in the list
                      const element = document.getElementById(location.id)
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                      }
                    }
                  }}
                >
                  <Popup 
                    className="custom-popup"
                    closeButton={false}
                  >
                    <div className="p-2">
                      <h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-display)" }}>
                        {location.label}
                      </h3>
                      <p className="text-xs text-gray-600">{location.sub}</p>
                      <a 
                        href={location.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs block mt-1 font-semibold hover:underline"
                        style={{ color: "var(--gf-leaf)" }}
                      >
                        Get Directions →
                      </a>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            <div className="absolute bottom-4 left-4 flex items-center gap-4 text-[11px] text-white/70 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--gf-sun)" }} /> Group Sessions
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--gf-leaf)" }} /> Personal Training
              </span>
            </div>
            <p className="absolute left-3 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] tracking-[0.3em] text-white/25">
              INDIAN OCEAN
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            {/* Group Training Section */}
            <p className="text-lg font-extrabold mb-1 uppercase" style={{ color: "var(--gf-sun)" }}>Group Training</p>
            {locations
              .filter((location) => location.sessionType === "group")
              .map((location) => (
                <a key={location.id} href={location.link} target="_blank" rel="noopener noreferrer">
                  <div id={location.id}>
                    <LocationRow 
                      name={location.label} 
                      sub={location.sub} 
                      sessionType={location.sessionType}
                    />
                    <div className="text-right"></div>
                  </div>
                </a>
              ))}

            {/* Personal Training Section */}
             <p className="text-lg font-extrabold my-1 uppercase mt-2"  style={{
              color: "var(--gf-leaf)",
            }}>Personal Training</p>
            {locations
              .filter((location) => location.sessionType === "personal")
              .map((location) => (
                <a key={location.id} href={location.link} target="_blank" rel="noopener noreferrer">
                  <div id={location.id}>
                    <LocationRow 
                      name={location.label} 
                      sub={location.sub} 
                      sessionType={location.sessionType}
                    />
                    <div className="text-right"></div>
                  </div>
                </a>
              ))}
          </div>
        </div>
      </div>

      <style>{`
        .custom-popup .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          color: #1a1a1a;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.1);
        }
        .custom-popup .leaflet-popup-tip {
          background: rgba(255, 255, 255, 0.95);
        }
        .custom-marker div:hover {
          transform: scale(1.3);
        }
      `}</style>
    </section>
  );
}