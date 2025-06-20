import { useForm } from '@inertiajs/react';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

// Set default marker icon
const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

type LatLngTuple = [number, number];

// Komponen untuk memindahkan peta ke posisi baru
const RecenterMap = ({ position }: { position: LatLngTuple }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(position);
    }, [position, map]);
    return null;
};

const ReportForm = () => {
    const [position, setPosition] = useState<LatLngTuple>([0, 0]);

    const { data, setData, post, processing, errors } = useForm<{
        image: File | null;
        latitude: string;
        longitude: string;
        damage_type: string;
        severity_score: string;
        urgency_score: string;
    }>({
        image: null,
        latitude: '',
        longitude: '',
        damage_type: '',
        severity_score: '',
        urgency_score: '',
    });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                const coords: LatLngTuple = [lat, lng];
                setPosition(coords);
                setData('latitude', lat.toString());
                setData('longitude', lng.toString());
            },
            () => {
                const fallback: LatLngTuple = [-6.2, 106.8]; // fallback Jakarta
                setPosition(fallback);
                setData('latitude', '-6.2');
                setData('longitude', '106.8');
            },
        );
    }, [setData]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('reports.store'));
    };

    return (
        <div className="mx-auto max-w-2xl space-y-4 p-6">
            <h2 className="text-2xl font-bold text-gray-800">Buat Laporan Kerusakan</h2>

            <MapContainer center={position} zoom={15} style={{ height: '300px', width: '100%' }}>
                <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <RecenterMap position={position} />
                <Marker position={position}>
                    <Popup>Lokasi Anda Saat Ini</Popup>
                </Marker>
            </MapContainer>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Foto</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setData('image', e.target.files[0]);
                            }
                        }}
                    />
                    {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                </div>

                <div>
                    <label className="block font-medium">Jenis Kerusakan</label>
                    <input
                        type="text"
                        className="w-full border p-2"
                        value={data.damage_type}
                        onChange={(e) => setData('damage_type', e.target.value)}
                    />
                    {errors.damage_type && <p className="text-sm text-red-500">{errors.damage_type}</p>}
                </div>

                <div>
                    <label className="block font-medium">Skor Keparahan (1–10)</label>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        className="w-full border p-2"
                        value={data.severity_score}
                        onChange={(e) => setData('severity_score', e.target.value)}
                    />
                    {errors.severity_score && <p className="text-sm text-red-500">{errors.severity_score}</p>}
                </div>

                <div>
                    <label className="block font-medium">Skor Urgensi (1–10)</label>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        className="w-full border p-2"
                        value={data.urgency_score}
                        onChange={(e) => setData('urgency_score', e.target.value)}
                    />
                    {errors.urgency_score && <p className="text-sm text-red-500">{errors.urgency_score}</p>}
                </div>

                <input type="hidden" value={data.latitude} name="latitude" />
                <input type="hidden" value={data.longitude} name="longitude" />

                <button type="submit" disabled={processing} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                    Kirim Laporan
                </button>
            </form>
        </div>
    );
};

export default ReportForm;
