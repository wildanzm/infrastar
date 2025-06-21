import { useForm } from '@inertiajs/react';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { AlarmClock, BrainCircuit, Compass, FileImage, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

// Setup Leaflet Icon
const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow });
L.Marker.prototype.options.icon = DefaultIcon;

type LatLngTuple = [number, number];

// Komponen helper untuk recenter peta, tidak ada perubahan
const RecenterMap = ({ position }: { position: LatLngTuple }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(position, 15);
    }, [position, map]);
    return null;
};

// Komponen Utama ReportForm yang sudah di-styling
const ReportForm = () => {
    const [position, setPosition] = useState<LatLngTuple>([-6.2, 106.8]); // Default ke Jakarta
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isPredicting, setIsPredicting] = useState(false); // State baru untuk loading prediksi AI
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm<{
        image: File | null;
        latitude: number;
        longitude: number;
        damage_type: string;
        severity_score: number;
        urgency_score: number;
    }>({
        image: null,
        latitude: -6.2,
        longitude: 106.8,
        damage_type: '',
        severity_score: 0,
        urgency_score: 0,
    });

    // Ambil lokasi user saat komponen dimuat
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                setPosition([lat, lng]);
                setData({ ...data, latitude: lat, longitude: lng });
            },
            () => {
                console.log('Izin lokasi ditolak, menggunakan lokasi default.');
            },
        );
    }, []); // Dependensi kosong agar hanya berjalan sekali

    // Fungsi untuk prediksi AI
    const predictFromAI = async (file: File) => {
        setIsPredicting(true); // Mulai loading
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = (reader.result as string).split(',')[1];
            const { latitude, longitude } = data;

            try {
                // Fetch report count dan prediksi AI
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
                    setData({
                        ...data,
                        image: file,
                        damage_type: result.prediction_results.classification_result,
                        severity_score: parseInt(result.prediction_results.Keparahan_Numerik),
                        urgency_score: parseInt(result.prediction_results.urgency_prediction),
                    });
                } else {
                    alert('Gagal memproses prediksi AI: ' + (result.error || 'Unknown error'));
                }
            } catch (err) {
                alert('Error saat memanggil model AI: ' + err);
            } finally {
                setIsPredicting(false); // Selesai loading
            }
        };
        reader.readAsDataURL(file);
    };

    // Handler untuk file input
    const handleFileChange = (file: File | null) => {
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            predictFromAI(file);
        }
    };

    // Handler untuk submit form
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('reports.store'), {
            forceFormData: true,
            onSuccess: () => {
                alert('Laporan berhasil dikirim!');
                reset();
                setImagePreview(null);
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-3xl space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Lapor Kerusakan Jalan</h1>
                    <p className="mt-3 text-lg text-gray-600">Ambil foto kerusakan, dan biarkan AI kami menganalisisnya untuk Anda.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Card untuk Peta Lokasi */}
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Langkah 1: Konfirmasi Lokasi Anda</h3>
                        <div className="z-0 h-[300px] w-full overflow-hidden rounded-md">
                            <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <RecenterMap position={position} />
                                <Marker position={position}>
                                    <Popup>Perkiraan Lokasi Anda</Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                    </div>

                    {/* Card untuk Upload Gambar */}
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Langkah 2: Unggah Foto Kerusakan</h3>
                        <div
                            className="mt-2 flex cursor-pointer justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-10 transition-colors hover:border-blue-500"
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                handleFileChange(e.dataTransfer.files?.[0]);
                            }}
                        >
                            <div className="text-center">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="mx-auto h-48 w-auto rounded-md" />
                                ) : (
                                    <>
                                        <FileImage className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                            <span className="font-semibold text-blue-600">Klik untuk unggah</span>&nbsp;atau seret dan lepas
                                        </div>
                                        <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF hingga 10MB</p>
                                    </>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={(e: any) => handleFileChange(e.target.files?.[0])}
                            />
                        </div>
                        {errors.image && <p className="mt-2 text-sm text-red-600">{errors.image}</p>}
                    </div>

                    {/* Card untuk Hasil Analisis AI */}
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Langkah 3: Hasil Analisis AI</h3>
                        {isPredicting ? (
                            <div className="flex h-24 items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                <p className="ml-4 text-gray-600">Menganalisis gambar...</p>
                            </div>
                        ) : data.damage_type ? (
                            <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                                <div className="flex items-center space-x-3">
                                    <Compass className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="text-gray-500">Lokasi</p>
                                        <p className="font-medium text-gray-900">
                                            {data.latitude.toFixed(5)}, {data.longitude.toFixed(5)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <BrainCircuit className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="text-gray-500">Jenis Kerusakan</p>
                                        <p className="font-medium text-gray-900 capitalize">{data.damage_type.replace('_', ' ')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-blue-600"
                                    >
                                        <path d="M21.5 13.67V12a10.15 10.15 0 0 0-1.2-4.83" />
                                        <path d="M18.83 18.83a10.15 10.15 0 0 1-4.83 1.2V21.5" />
                                        <path d="M12 10.15V2.5" />
                                        <path d="M4.83 8.77a10.15 10.15 0 0 0-1.2 4.83V13" />
                                        <path d="M8.77 18.83a10.15 10.15 0 0 0 4.83 1.2V21.5" />
                                        <path d="M13 2.5V10.15" />
                                        <path d="M2.5 13H10.15" />
                                        <path d="M13.85 13H21.5" />
                                        <path d="M18.83 4.83l-3.36 3.36" />
                                        <path d="M8.77 8.77l-3.36-3.36" />
                                        <path d="M15.23 15.23l3.36 3.36" />
                                        <path d="M5.17 18.83l3.36-3.36" />
                                    </svg>
                                    <div>
                                        <p className="text-gray-500">Tingkat Keparahan</p>
                                        <p className="font-medium text-gray-900">{data.severity_score} / 10</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <AlarmClock className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="text-gray-500">Skor Urgensi</p>
                                        <p className="font-medium text-gray-900">{data.urgency_score} / 10</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="flex h-24 items-center justify-center text-center text-gray-500">
                                Hasil analisis akan muncul di sini setelah gambar diunggah.
                            </p>
                        )}
                    </div>

                    {/* Tombol Submit */}
                    <div className="border-t pt-4">
                        <button
                            type="submit"
                            disabled={processing || isPredicting || !data.image}
                            className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Mengirim...
                                </>
                            ) : (
                                'Kirim Laporan'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportForm;
