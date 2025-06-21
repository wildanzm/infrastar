import axios from 'axios';

import 'leaflet/dist/leaflet.css';
import { Filter } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

const Reports: React.FC = () => {
    const [searchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [reports, setReports] = useState<any[]>([]);

    const fetchReports = async () => {
        try {
            const response = await axios.get('/api/reports');

            const reportsWithComments = response.data.reports.map((report: any) => ({
                ...report,
                comments: response.data.comments.filter((c: any) => c.report_id === report.id),
            }));

            setReports(reportsWithComments);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    const updateReportStatus = async (id: number, status: string) => {
        try {
            const allowedStatuses = ['Menunggu', 'Dalam Proses', 'Selesai'];
            if (!allowedStatuses.includes(status)) {
                console.warn(`Status "${status}" tidak valid.`);
                return;
            }

            const response = await axios.put(`/api/reports/${id}/status`, { status });

            console.log(`Status updated for report ID ${id}:`, response.data);
            await fetchReports(); // Refresh data
            alert('Status berhasil diperbarui.');
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                console.error('Error updating status:', {
                    message: error.message,
                    code: error.code,
                    response: error.response?.data || 'No response body',
                });
            } else {
                console.error('Unknown error occurred:', error);
            }
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Menunggu':
                return 'text-green-700 bg-green-100';
            case 'Dalam Proses':
                return 'text-blue-700 bg-blue-100';
            case 'Selesai':
                return 'text-yellow-700 bg-yellow-100';
            default:
                return 'text-gray-700 bg-gray-100';
        }
    };
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Tinggi':
                return 'text-red-700 bg-red-100';
            case 'Sedang':
                return 'text-orange-700 bg-orange-100';
            case 'Rendah':
                return 'text-green-700 bg-green-100';
            default:
                return 'text-gray-700 bg-gray-100';
        }
    };
    const getPriorityFromUrgency = (urgency: number) => {
        if (urgency >= 33 && urgency < 66) return 'Sedang';
        if (urgency >= 66 && urgency <= 100) return 'Tinggi';
        if (urgency < 33) return 'Rendah';
        return 'unknown';
    };

    const filteredReports = reports.filter((report) => {
        const matchesSearch =
            (report?.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (report?.location?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (report?.reporter?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lon: number; title: string } | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Manajemen Laporan</h1>
                <p className="mt-2 text-gray-600">Tinjau dan kelola laporan kerusakan Infrastruktur</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                        <div className="relative">
                            <Filter className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                            <select
                                className="appearance-none rounded-lg border border-gray-300 bg-white py-2 pr-8 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">Semua Status</option>
                                <option value="Menunggu">Menunggu</option>
                                <option value="Dalam Proses">Dalam Proses</option>
                                <option value="Selesai">Selesai</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">No</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Nama Pelapor</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Lokasi</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Gambar</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Jenis Infrastruktur</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Deskripsi</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Prioritas</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredReports.map((report: any, index: number) => (
                                <tr key={report.id} className="transition-colors hover:bg-gray-50">
                                    <td className="px-6 py-4 text-center text-sm text-gray-900">{index + 1}</td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-900">{report.user?.name || '-'}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            className="text-sm text-blue-600 underline hover:text-blue-800"
                                            onClick={() =>
                                                setSelectedLocation({
                                                    lat: report.latitude,
                                                    lon: report.longitude,
                                                    title: report.title || 'Lokasi',
                                                })
                                            }
                                        >
                                            Lihat Lokasi
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {report.image ? (
                                            <button
                                                onClick={() => setSelectedImage(`/storage/${report.image}`)}
                                                className="text-sm text-blue-600 underline hover:text-blue-800"
                                            >
                                                Lihat Gambar
                                            </button>
                                        ) : (
                                            <span className="text-gray-400 italic">No image</span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-center">{report.damage_type || '-'}</td>
                                    <td className="px-6 py-4 text-center">
                                        {report.comments && report.comments.length > 0 ? (
                                            report.comments.map((comment: any, idx: number) => (
                                                <p key={idx} className="text-sm text-gray-700">
                                                    {comment.comment_text}
                                                </p>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 italic">Belum ada komentar</span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(report.status)}`}>
                                            {report.status.replace('-', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {(() => {
                                            const priority = getPriorityFromUrgency(report.urgency_score);
                                            return (
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(priority)}`}
                                                >
                                                    {priority}
                                                </span>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {report.status === 'Menunggu' && (
                                            <>
                                                <button
                                                    className="mr-2 rounded-md bg-blue-600 px-2 py-1 text-sm text-white hover:bg-blue-700"
                                                    onClick={() => updateReportStatus(report.id, 'Dalam Proses')}
                                                >
                                                    Proses
                                                </button>
                                                <button
                                                    className="rounded-md bg-green-600 px-2 py-1 text-sm text-white hover:bg-green-700"
                                                    onClick={() => updateReportStatus(report.id, 'Selesai')}
                                                >
                                                    Selesai
                                                </button>
                                            </>
                                        )}

                                        {report.status === 'Dalam Proses' && (
                                            <button
                                                className="rounded-md bg-green-600 px-2 py-1 text-sm text-white hover:underline"
                                                onClick={() => updateReportStatus(report.id, 'Selesai')}
                                            >
                                                Selesai
                                            </button>
                                        )}

                                        {report.status === 'Selesai' && <span className="text-xs text-gray-500 italic">Selesai</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredReports.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-gray-500">No reports found matching your criteria.</p>
                    </div>
                )}
            </div>
            {selectedLocation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
                    <div className="relative w-full max-w-2xl rounded-lg bg-white p-4 shadow-lg">
                        <h2 className="mb-2 text-lg font-semibold text-gray-800">{selectedLocation.title}</h2>
                        <div className="h-64 w-full">
                            <MapContainer center={[selectedLocation.lat, selectedLocation.lon]} zoom={16} style={{ height: '100%', width: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                                <Marker position={[selectedLocation.lat, selectedLocation.lon]}>
                                    <Popup>{selectedLocation.title}</Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                        <div className="mt-4 text-right">
                            <button
                                onClick={() => setSelectedLocation(null)}
                                className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
                    <div className="relative w-full max-w-xl rounded-lg bg-white p-4 shadow-lg">
                        <h2 className="mb-2 text-lg font-semibold text-gray-800">Preview Gambar</h2>
                        <div className="max-h-[400px] overflow-auto">
                            <img src={selectedImage} alt="Preview" className="mx-auto max-h-[400px] w-auto rounded object-contain" />
                        </div>
                        <div className="mt-4 text-right">
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
