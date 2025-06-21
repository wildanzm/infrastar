import { Activity, Calendar } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Chart from './ui/Chart';
import RecentReports from './ui/RecentReports';

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
    name: string;
    total: number;
};

type RecentReportItem = {
    id: number;
    title: string;
    location: string;
    status: 'Tertunda' | 'Dalam Proses' | 'Selesai';
    created_at: string;
    user: {
        id: number;
        name: string;
    };
};

type DashboardData = {
    stats: DashboardStats;
    topLocations: TopLocation[];
    chartData: ChartDataItem[];
    recentReports: RecentReportItem[];
};

const Dashboard: React.FC = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
    }, []);

    if (isLoading) {
        return <div className="p-6 text-center">Memuat data dashboard...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-500">Terjadi kesalahan: {error}</div>;
    }

    if (!data) {
        return <div className="p-6 text-center">Data tidak tersedia.</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Chart data={data.chartData} />
                </div>
                <div>
                    <RecentReports reports={data.recentReports} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Waktu Respon</h3>
                        <Activity className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Rata-rata</span>
                            <span className="font-semibold">{data.stats.avgResponseTime} jam</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-200">
                            <div className="h-2 w-3/4 rounded-full bg-green-500"></div>
                        </div>
                        <p className="text-sm text-gray-500">Akumulasi dari laporan yang selesai</p>
                    </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Minggu Ini</h3>
                        <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Laporan Baru</span>
                            <span className="font-semibold text-blue-600">{data.stats.newThisWeek}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Selesai</span>
                            <span className="font-semibold text-green-600">{data.stats.resolvedThisWeek}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Dalam Proses</span>
                            <span className="font-semibold text-orange-600">{data.stats.inProgress}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
