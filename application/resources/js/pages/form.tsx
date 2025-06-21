import { Head, useForm } from '@inertiajs/react';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { FileImage, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow });
L.Marker.prototype.options.icon = DefaultIcon;

type LatLngTuple = [number, number];

const RecenterMap = ({ position }: { position: LatLngTuple }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(position, 15);
    }, [position, map]);
    return null;
};

const ReportForm = () => {
    const [position, setPosition] = useState<LatLngTuple>([-6.716, 108.566]); // Default ke Cirebon
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm<{
        image: File | null;
        latitude: number;
        longitude: number;
        description: string;
    }>({
        image: null,
        latitude: -6.716,
        longitude: 108.566,
        description: '',
    });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                setPosition([lat, lng]);
                // Menggunakan callback untuk update state agar lebih aman
                setData((currentData) => ({ ...currentData, latitude: lat, longitude: lng }));
            },
            () => {
                console.log('Izin lokasi ditolak, menggunakan lokasi default Cirebon.');
            },
        );
    }, []);

    // Handler saat ada file yang dipilih atau di-drop
    const handleFileChange = (file: File | null) => {
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setData('image', file);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Mengirim data form ke backend menggunakan Inertia
        post(route('reports.store'), {
            forceFormData: true, // Wajib untuk upload file
            onSuccess: () => {
                alert('Laporan berhasil dikirim! Terima kasih atas partisipasi Anda.');
                reset(); // Reset semua field form
                setImagePreview(null); // Hapus preview gambar
            },
            onError: () => {
                alert('Terjadi kesalahan. Mohon periksa kembali isian Anda.');
            },
        });
    };

    return (
        <>
            <Head title="Laporan" />
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-3xl space-y-8">
                    <header className="text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Lapor Kerusakan Jalan</h1>
                        <p className="mt-3 text-lg text-gray-600">
                            Bantu kami meningkatkan kualitas infrastruktur dengan melaporkan kerusakan yang Anda temukan.
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <section className="rounded-xl border bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-xl font-semibold text-gray-900">Langkah 1: Konfirmasi Lokasi Anda</h3>
                            <div className="z-0 h-[300px] w-full overflow-hidden rounded-md border">
                                <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <RecenterMap position={position} />
                                    <Marker
                                        position={position}
                                        draggable={true}
                                        eventHandlers={{
                                            dragend: (e) => {
                                                const { lat, lng } = e.target.getLatLng();
                                                setPosition([lat, lng]);
                                                setData((currentData) => ({ ...currentData, latitude: lat, longitude: lng }));
                                            },
                                        }}
                                    >
                                        <Popup>Geser pin ini jika lokasi kurang akurat.</Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                                Lokasi terdeteksi otomatis. Anda bisa menggeser pin di peta untuk menyesuaikan.
                            </p>
                        </section>

                        <section className="rounded-xl border bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-xl font-semibold text-gray-900">Langkah 2: Unggah Foto Kerusakan</h3>
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
                                        <img src={imagePreview} alt="Preview Laporan" className="mx-auto h-48 w-auto rounded-md object-cover" />
                                    ) : (
                                        <>
                                            <FileImage className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                                <span className="font-semibold text-blue-600">Klik untuk unggah</span>&nbsp;atau seret dan lepas
                                            </div>
                                            <p className="text-xs leading-5 text-gray-600">PNG, JPG, JPEG (Maks. 5MB)</p>
                                        </>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="sr-only"
                                    accept="image/png, image/jpeg, image/jpg"
                                    onChange={(e: any) => handleFileChange(e.target.files?.[0])}
                                />
                            </div>
                            {errors.image && <p className="mt-2 text-sm text-red-600">{errors.image}</p>}
                        </section>

                        <section className="rounded-xl border bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-xl font-semibold text-gray-900">Langkah 3: Berikan Detail Laporan</h3>
                            <label htmlFor="description" className="block text-lg leading-6 font-semibold text-gray-900">
                                Deskripsi Kerusakan
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    className="block w-full resize-none rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:ring-inset sm:leading-6"
                                    placeholder="Contoh: Terdapat lubang besar dengan diameter sekitar 50cm di lajur kiri, sangat berbahaya bagi pengendara motor."
                                    value={data.description}
                                    onChange={(e) => setData((currentData) => ({ ...currentData, description: e.target.value }))}
                                />
                            </div>
                            {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
                            <p className="mt-2 text-sm text-gray-500">Jelaskan sedetail mungkin tentang kerusakan yang Anda lihat.</p>
                        </section>

                        <div className="border-t pt-6">
                            <button
                                type="submit"
                                disabled={processing || !data.image || !data.description}
                                className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Mengirim Laporan...
                                    </>
                                ) : (
                                    'Kirim Laporan'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ReportForm;
