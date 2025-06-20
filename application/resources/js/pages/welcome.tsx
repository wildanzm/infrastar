import FeatureContainer, { FeatureContainerReverse } from '@/components/FeatureContainer';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/ui/Navbar';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { FaRoad, FaUsers } from 'react-icons/fa';
import { TbMessageReportFilled } from 'react-icons/tb';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title='Home' />
            <Navbar />
            {/* hero */}
            <div className="flex flex-col justify-center px-[7%] py-36">
                <div className="flex items-center justify-between gap-10 space-x-5">
                    <img src="hero.png" alt="" width={580} />
                    <div>
                        <h1 className="text-primary text-lg font-bold uppercase tracking-[0.25rem]">Selamat Datang</h1>
                        <h1 className="text-foreground text-6xl font-bold">Infrastar: Bersama Kita Perbaiki Negeri</h1>
                        <p className="text-foreground mb-7 mt-3 text-xl">
                            Laporkan jalan rusak di sekitarmu dengan cepat dan mudah. Setiap laporanmu adalah langkah menuju infrastruktur yang lebih
                            baik.
                        </p>
                        <Button className="px-10 py-6 text-xl">Laporkan Sekarang</Button>
                    </div>
                </div>
                <div className="mt-20 flex items-center justify-center space-x-20">
                    <div className="flex items-center gap-5">
                        <TbMessageReportFilled className="text-primary size-18" />
                        <h1 className="text-foreground text-3xl font-bold">
                            1.243<span className="block text-2xl">Laporan Masuk</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-5">
                        <FaRoad className="text-primary size-18" />
                        <h1 className="text-foreground text-3xl font-bold">
                            784<span className="block text-2xl">Perbaikan Dilakukan</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-5">
                        <FaUsers className="text-primary size-18" />
                        <h1 className="text-foreground text-3xl font-bold">
                            1.005<span className="block text-2xl">Pelapor Aktif</span>
                        </h1>
                    </div>
                </div>
            </div>
            {/* about */}
            <div className="from-primary py-22 bg-gradient-to-br to-[#0869CA] px-[7%] text-center text-white">
                <h1 className="text-lg font-bold uppercase tracking-[0.25rem]">About</h1>
                <h1 className="text-5xl font-bold">Tentang Infrastar</h1>
                <p className="mt-5 text-justify text-xl tracking-wide">
                    Infrastar adalah platform digital yang memudahkan masyarakat dalam melaporkan kerusakan infrastruktur, khususnya jalan. Dengan
                    teknologi yang sederhana namun efektif, kami menghubungkan suara warga dengan pihak berwenang agar penanganan dapat dilakukan
                    lebih cepat dan tepat sasaran.
                </p>
                <div className="mt-5 flex gap-20 text-left">
                    <img src="about.png" alt="" width={550} />
                    <div className="space-y-5">
                        <div>
                            <h1 className="text-3xl font-bold">Visi</h1>
                            <p className="mt-3 text-xl">
                                Mewujudkan infrastruktur yang aman dan layak bagi semua, dimulai dari partisipasi aktif masyarakat.
                            </p>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Misi</h1>
                            <div className="mt-3 flex items-center gap-5 text-xl">
                                <p className="text-primary flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white font-bold">
                                    1
                                </p>
                                <p>Mendorong kesadaran dan kepedulian publik terhadap kondisi infrastruktur.</p>
                            </div>
                            <div className="mt-3 flex items-center gap-5 text-xl">
                                <p className="text-primary flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white font-bold">
                                    2
                                </p>
                                <p>Menyediakan sistem pelaporan yang mudah diakses oleh siapa saja.</p>
                            </div>
                            <div className="mt-3 flex items-center gap-5 text-xl">
                                <p className="text-primary flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white font-bold">
                                    3
                                </p>
                                <p>Menjadi jembatan antara warga dan pemerintah dalam penyelesaian masalah jalan rusak.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* feature */}
            <div className="px-[7%] py-20 text-center">
                <h1 className="text-primary text-lg font-bold uppercase tracking-[0.25rem]">Feature</h1>
                <h1 className="text-foreground text-5xl font-bold">Fitur Unggulan Infrastar</h1>
                <p className="mt-3 text-center text-xl">
                    Dirancang untuk mempermudah masyarakat melaporkan dan memantau kondisi infrastruktur, berikut
                    <br />
                    fitur-fitur utama yang tersedia di Infrastar:
                </p>
                <div className="px-[5%]">
                    <FeatureContainer
                        img="report.png"
                        header="Laporkan Jalan Rusak Secara Instan"
                        desc="Laporkan kondisi jalan rusak hanya dalam beberapa klik. Sertakan lokasi, deskripsi, dan foto untuk memudahkan penanganan."
                    />
                    <FeatureContainerReverse
                        img="map.png"
                        header="Peta Interaktif"
                        desc="Lihat laporan dari seluruh wilayah dalam tampilan peta real-time. Setiap titik mewakili laporan masyarakat yang valid."
                    />
                    <FeatureContainer
                        img="status.png"
                        header="Pantau Status Laporan"
                        desc="Ketahui perkembangan laporanmu—mulai dari diterima, diproses, hingga diselesaikan—semuanya bisa dipantau langsung."
                    />
                    <FeatureContainerReverse
                        img="riwayat.png"
                        header="Riwayat Laporan Pribadi"
                        desc="Akses semua laporan yang pernah kamu kirim melalui dashboard pribadi, lengkap dengan status dan waktu penanganan."
                    />
                    <FeatureContainer
                        img="pemerintah.png"
                        header="Terintegrasi dengan Pemerintah Daerah"
                        desc="Laporan yang masuk akan langsung diteruskan ke instansi terkait agar tindak lanjut dapat dilakukan secara efisien."
                    />
                </div>
            </div>
            <Footer />
        </>
    );
}
