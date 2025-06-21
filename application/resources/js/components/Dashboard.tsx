// src/components/Dashboard.tsx

import { Activity, Calendar, MapPin } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Chart from './ui/Chart';
import RecentReports from './ui/RecentReports';

// 1. Definisikan tipe data yang akan kita terima dari API
type DashboardStats = {
    newThisWeek: number;
    resolvedThisWeek: number;
    inProgress: number;
    avgResponseTime: number;
};

type TopLocation = {
    location: string;
    total: number;
};

type ChartDataItem = {
    name: string; // Misal: 'Jan', 'Feb'
    total: number;
};

type RecentReportItem = {
    id: number;
    title: string;
    location: string;
    status: 'pending' | 'in-progress' | 'resolved';
    created_at: string;
    user: {
        id: number;
        name: string;
    };
    priority?: 'high' | 'medium' | 'low'; // Jadikan opsional karena tidak ada di API
};

type DashboardData = {
    stats: DashboardStats;
    topLocations: TopLocation[];
    chartData: ChartDataItem[];
    recentReports: RecentReportItem[];
};

const Dashboard: React.FC = () => {
    // 2. Siapkan state untuk data, loading, dan error
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 3. Gunakan useEffect untuk fetch data saat komponen dimuat
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/dashboard-stats', {
                    headers: { Accept: 'application/json' },
                });

                if (!response.ok) {
                    throw new Error(`Gagal mengambil data: ${response.statusText}`);
                }

                const result: DashboardData = await response.json();
                setData(result);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []); // Array dependensi kosong agar hanya berjalan sekali

    // 4. Tampilkan status loading atau error
    if (isLoading) {
        return <div className="p-6 text-center">Memuat data dashboard...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-500">Terjadi kesalahan: {error}</div>;
    }

    if (!data) {
        return <div className="p-6 text-center">Data tidak tersedia.</div>;
    }

    // 5. Render UI dengan data yang sudah di-fetch
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="mt-2 text-gray-600">Monitor road damage reports and system performance</p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    {/* Kirim data chartData ke komponen anak */}
                    <Chart data={data.chartData} />
                </div>
                <div>
                    {/* Kirim data recentReports ke komponen anak */}
                    <RecentReports reports={data.recentReports} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Response Time</h3>
                        <Activity className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Average</span>
                            {/* Gunakan data dinamis */}
                            <span className="font-semibold">{data.stats.avgResponseTime} hours</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-200">
                            <div className="h-2 w-3/4 rounded-full bg-green-500"></div>
                        </div>
                        <p className="text-sm text-gray-500">Calculated from resolved reports</p>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Top Locations</h3>
                        <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    {/* Gunakan .map untuk render data dinamis */}
                    <div className="space-y-3">
                        {data.topLocations.map((loc) => (
                            <div key={loc.location} className="flex items-center justify-between">
                                <span className="text-gray-600 capitalize">{loc.location}</span>
                                <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">{loc.total} reports</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">This Week</h3>
                        <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">New Reports</span>
                            <span className="font-semibold text-blue-600">{data.stats.newThisWeek}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Resolved</span>
                            <span className="font-semibold text-green-600">{data.stats.resolvedThisWeek}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">In Progress</span>
                            <span className="font-semibold text-orange-600">{data.stats.inProgress}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
