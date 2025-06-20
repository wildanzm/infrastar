import { useForm } from '@inertiajs/react';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow });
L.Marker.prototype.options.icon = DefaultIcon;

type LatLngTuple = [number, number];

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
        latitude: number;
        longitude: number;
        damage_type: string;
        severity_score: number;
        urgency_score: number;
    }>({
        image: null,
        latitude: 0,
        longitude: 0,
        damage_type: '',
        severity_score: 0,
        urgency_score: 0,
    });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                setPosition([lat, lng]);
                setData('latitude', lat);
                setData('longitude', lng);
            },
            () => {
                const fallback: LatLngTuple = [-6.2, 106.8];
                setPosition(fallback);
                setData('latitude', fallback[0]);
                setData('longitude', fallback[1]);
            },
        );
    }, [setData]);

    const predictFromAI = async (file: File) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = (reader.result as string).split(',')[1];
            const { latitude, longitude } = data;

            try {
                const countRes = await fetch(`/report-count?latitude=${latitude}&longitude=${longitude}`);
                const { count } = await countRes.json();

                const res = await fetch('http://localhost:5000/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        image_base64: base64,
                        num_similar_reports: count,
                    }),
                });

                const result = await res.json();
                if (result.success) {
                    setData('damage_type', result.prediction_results.classification_result);
                    setData('severity_score', parseInt(result.prediction_results.Keparahan_Numerik));
                    setData('urgency_score', parseInt(result.prediction_results.urgency_prediction));
                } else {
                    alert('Gagal memproses prediksi AI');
                }
            } catch (err) {
                alert('Error saat memanggil model AI: ' + err);
            }
        };

        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Data dikirim:', data);
        post(route('reports.store'), {
            forceFormData: true, // PENTING UNTUK MENGIRIM FILE!
        });
    };

    return (
        <div className="mx-auto max-w-2xl space-y-4 p-6">
            <h2 className="text-3xl font-bold text-foreground">Buat Laporan Kerusakan</h2>

            <MapContainer center={position} zoom={15} style={{ height: '300px', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <RecenterMap position={position} />
                <Marker position={position}>
                    <Popup>Lokasi Anda Saat Ini</Popup>
                </Marker>
            </MapContainer>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-lg font-bold">Foto</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setData('image', file);
                                predictFromAI(file);
                            }
                        }}
                    />
                    {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                </div>

                <div className="space-y-1 text-sm text-gray-700">
                    <p>
                        <strong>Latitude:</strong> {data.latitude}
                    </p>
                    <p>
                        <strong>Longitude:</strong> {data.longitude}
                    </p>
                    <p>
                        <strong>Jenis Kerusakan:</strong> {data.damage_type}
                    </p>
                    <p>
                        <strong>Tingkat Keparahan:</strong> {data.severity_score}
                    </p>
                    <p>
                        <strong>Skor Urgensi:</strong> {data.urgency_score}
                    </p>
                </div>

                <button type="submit" disabled={processing} className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/80">
                    Kirim Laporan
                </button>
            </form>
        </div>
    );
};

export default ReportForm;
