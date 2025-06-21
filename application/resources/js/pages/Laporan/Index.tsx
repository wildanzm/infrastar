import Navbar from '@/components/ui/Navbar';
import { Head, Link, usePage } from '@inertiajs/react';
import { Clock, MapPin, PlusCircle } from 'lucide-react';

type Report = {
    id: number;
    title: string;
    location: string;
    status: 'Menunggu' | 'Dalam Proses' | 'Selesai';
    created_at: string;
};

type Paginator<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
};

type LaporanPageProps = {
    reports: Paginator<Report>;
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

const getStatusPill = (status: Report['status']) => {
    const baseClasses = 'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium';
    const colorClasses = {
        Selesai: 'bg-green-100 text-green-800',
        'Dalam Proses': 'bg-blue-100 text-blue-800',
        Menunggu: 'bg-yellow-100 text-yellow-800',
    };
    return <span className={`${baseClasses} ${colorClasses[status]}`}>{status}</span>;
};

const LaporanPage = ({ reports }: LaporanPageProps) => {
    const { auth } = usePage<ShareData>().props;
    return (
        <>
            <Head title="Daftar Laporan" />
            <Navbar auth={auth} />
            <div className="mt-14 bg-gray-50 py-12 sm:py-16">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <header className="text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Daftar Laporan Saya</h1>
                        <p className="mt-4 text-lg leading-8 text-gray-600">
                            Berikut adalah riwayat semua laporan kerusakan yang telah Anda kirimkan.
                        </p>
                    </header>

                    <div className="mt-12">
                        {reports.data.length === 0 ? (
                            <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                                <PlusCircle className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-lg font-medium text-gray-900">Anda Belum Punya Laporan</h3>
                                <p className="mt-1 text-sm text-gray-500">Mulai berkontribusi dengan membuat laporan pertama Anda.</p>
                                <div className="mt-6">
                                    <Link
                                        href={route('reports.create')}
                                        className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                    >
                                        Buat Laporan Baru
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {reports.data.map((report: Report) => (
                                    <div
                                        key={report.id}
                                        className="rounded-xl border bg-white p-6 shadow-sm transition-all duration-300 ease-in-out hover:border-blue-300 hover:shadow-lg"
                                    >
                                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                                            <div className="flex-1">
                                                <p className="cursor-pointer text-lg font-semibold text-gray-800 hover:text-blue-600">
                                                    {report.title || 'Laporan Kerusakan'}
                                                </p>
                                                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <MapPin className="mr-1.5 h-4 w-4 text-gray-400" />
                                                        <span>{report.location}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
                                                        <span>{formatDate(report.created_at)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0">{getStatusPill(report.status)}</div>
                                        </div>
                                    </div>
                                ))}

                                <nav className="mt-10 flex items-center justify-between border-t border-gray-200 px-4 pt-6 sm:px-0">
                                    <div className="hidden sm:block">
                                        <p className="text-sm text-gray-700">
                                            Menampilkan <span className="font-medium">{reports.from}</span> sampai{' '}
                                            <span className="font-medium">{reports.to}</span> dari{' '}
                                            <span className="font-medium">{reports.total}</span> hasil
                                        </p>
                                    </div>
                                    <div className="flex flex-1 justify-between space-x-1 sm:justify-end">
                                        {reports.links.map((link: any, index: any) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold ${
                                                    link.active
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50'
                                                } ${!link.url ? 'cursor-not-allowed text-gray-400 ring-gray-300' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default LaporanPage;
