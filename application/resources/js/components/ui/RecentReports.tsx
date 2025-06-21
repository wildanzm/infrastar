import { AlertTriangle, Clock, MapPin } from 'lucide-react';
import React from 'react';

type RecentReportItem = {
    id: number;
    title: string;
    location: string;
    damageType: string;
    status: 'Tertunda' | 'Dalam Proses' | 'Selesai';
    created_at: string;
    user: {
        id: number;
        name: string;
    };
    priority?: 'Tinggi' | 'Sedang' | 'Rendah';
};

interface RecentReportsProps {
    reports: RecentReportItem[];
}

const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' tahun yang lalu';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' bulan yang lalu';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' sehari yang lalu';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' jam yang lalu';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' menit yang lalu';
    return Math.floor(seconds) + ' detik yang lalu';
};

const RecentReports: React.FC<RecentReportsProps> = ({ reports }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Selesai':
                return 'text-green-600 bg-green-50';
            case 'Dalam Proses':
                return 'text-blue-600 bg-blue-50';
            case 'Tertunda':
                return 'text-yellow-600 bg-yellow-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Laporan Terbaru</h3>
                <AlertTriangle className="h-5 w-5 text-gray-400" />
            </div>

            <div className="space-y-4">
                {reports.map((report) => (
                    <div key={report.id} className="rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50">
                        <div className="mb-2 flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-900">{report.user.name}</span>
                            </div>
                            <span className={`rounded-full px-2 py-1 text-xs ${getStatusColor(report.status)}`}>
                                {report.status.replace('-', ' ')}
                            </span>
                        </div>

                        <p className="mb-1 text-sm font-medium text-gray-900">{report.damageType}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{report.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{formatTimeAgo(report.created_at)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="mt-4 w-full text-sm font-medium text-blue-600 transition-colors hover:text-blue-700">Lihat Semua</button>
        </div>
    );
};

export default RecentReports;
