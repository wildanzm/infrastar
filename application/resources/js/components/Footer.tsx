import { Facebook, Instagram, Linkedin, Mail, MapIcon, Phone, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-primary text-white">
            <div className="container mx-auto px-4 py-16">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Company Info */}
                    <div className="lg:col-span-2">
                        <div className="mb-6 flex items-center space-x-2">
                            <img src="logo.png" alt="" width={50} />
                            <span className="text-2xl font-bold">Infrastar</span>
                        </div>
                        <p className="mb-6 max-w-md text-slate-300">
                            Solusi digital untuk pelaporan dan pemantauan infrastruktur. Bersama masyarakat, membangun negeri yang lebih baik.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-blue-600"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-blue-600"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-blue-600"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-blue-600"
                            >
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick as */}
                    <div>
                        <h3 className="mb-6 text-lg font-semibold">Menu Utama</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#home" className="text-slate-300 transition-colors hover:text-white">
                                    Beranda
                                </a>
                            </li>
                            <li>
                                <a href="#about" className="text-slate-300 transition-colors hover:text-white">
                                    Tentang Kami
                                </a>
                            </li>
                            <li>
                                <a href="#feature" className="text-slate-300 transition-colors hover:text-white">
                                    Fitur
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-slate-300 transition-colors hover:text-white">
                                    Cara Kerja
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-slate-300 transition-colors hover:text-white">
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="mb-6 text-lg font-semibold">Kontak</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-blue-400" />
                                <span className="text-slate-300">info@infrastar.id</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-blue-400" />
                                <span className="text-slate-300">+62 21 1234 5678</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <MapIcon className="mt-1 h-5 w-5 text-blue-400" />
                                <span className="text-slate-300">
                                    Jl. Teknologi No. 123
                                    <br />
                                    Jakarta Selatan, 12345
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-slate-800 pt-8">
                    <div className="flex flex-col items-center justify-between md:flex-row">
                        <p className="text-sm text-slate-400">© {new Date().getFullYear()} Infrastar. Semua hak cipta dilindungi.</p>
                        <div className="mt-4 flex space-x-6 md:mt-0">
                            <a href="#" className="text-sm text-slate-400 transition-colors hover:text-white">
                                Kebijakan Privasi
                            </a>
                            <a href="#" className="text-sm text-slate-400 transition-colors hover:text-white">
                                Syarat & Ketentuan
                            </a>
                            <a href="#" className="text-sm text-slate-400 transition-colors hover:text-white">
                                Bantuan
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
