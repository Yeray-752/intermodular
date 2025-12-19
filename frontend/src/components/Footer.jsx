import { Facebook, Instagram, MapPin, Phone, Mail } from 'lucide-react';
import logo from "../assets/img/logo_background.png";

function Footer() {
    return (
        <footer className="bg-linear-to-r from-gray-900 to-gray-800 text-white pt-12 pb-8 mt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
                    
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img 
                                    src={logo} 
                                    alt="Logo Akotan" 
                                    className="w-20 h-20 object-contain"
                                />
                                <div className="absolute inset-0  rounded-full blur-sm"></div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">AKOTAN</h2>
                                <p className="text-sm text-gray-300 font-medium">TALLER MECÁNICO</p>
                            </div>
                        </div>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            Especialistas en personalización y reparación de vehículos. 
                            Combinamos tecnología de vanguardia con artesanía tradicional 
                            para resultados excepcionales.
                        </p>
                        
                        <div className="flex items-center space-x-4 pt-2">
                            <a 
                                href="#" 
                                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-600 transition-colors duration-300 group"
                                aria-label="Facebook"
                            >
                                <Facebook size={18} className="group-hover:text-white" />
                            </a>
                            <a 
                                href="#" 
                                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-600 transition-colors duration-300 group"
                                aria-label="Instagram"
                            >
                                <Instagram size={18} className="group-hover:text-white" />
                            </a>
                            <a 
                                href="#" 
                                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-600 transition-colors duration-300 group"
                                aria-label="WhatsApp"
                            >
                                <Phone size={18} className="group-hover:text-white" />
                            </a>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <div className="w-2 h-6 bg-orange-600 rounded-full"></div>
                            Contacto
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin size={20} className="text-orange-500 mt-1 shrink-0" />
                                <span className="text-gray-400">
                                    Calle Taller, 123, 35600 <br /> 
                                    Puerto del Rosario, España.
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={20} className="text-orange-500 shrink-0" />
                                <a href="tel:+34912345678" className="text-gray-400 hover:text-orange-500 transition-colors">
                                    +34 912 345 678
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={20} className="text-orange-500 shrink-0" />
                                <a href="mailto:info@akotan.com" className="text-gray-400 hover:text-orange-500 transition-colors">
                                    info@akotan.com
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <div className="w-2 h-6 bg-orange-600 rounded-full"></div>
                            Enlaces Rápidos
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { label: 'Inicio', href: '/' },
                                { label: 'Reservas Online', href: '/reservas' },
                                { label: 'Tienda', href: '/productos' },
                                { label: 'Sobre Nosotros', href: '/sobre-nosotros' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <a 
                                        href={link.href} 
                                        className="text-gray-400 hover:text-orange-500 transition-colors duration-300 flex items-center gap-2 group"
                                    >
                                        <div className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-orange-500 transition-colors"></div>
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <div className="w-2 h-6 bg-orange-600 rounded-full"></div>
                            Horario
                        </h3>
                        <div className="space-y-3">
                            {[
                                { days: 'Lunes - Viernes', hours: '9:00 - 19:00' },
                                { days: 'Sábados', hours: '10:00 - 14:00' },
                                { days: 'Domingos', hours: 'Cerrado' },
                            ].map((schedule, index) => (
                                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-800/50">
                                    <span className="text-gray-400">{schedule.days}</span>
                                    <span className="text-orange-500 font-medium">{schedule.hours}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm text-center md:text-left">
                            Copyright © {new Date().getFullYear()} Akotan Taller Mecánico. 
                            Todos los derechos reservados.
                        </p>
                        <p className="text-gray-500 text-sm">
                            Desarrollado por <span className="text-orange-500 font-medium">Yeray Carrión</span> y <span className="text-orange-500 font-medium">Óscar Gordillo</span>
                        </p>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                            <a href="/Aviso-legal" className="hover:text-orange-500 transition-colors">Política de Privacidad</a>
                            <a href="/Aviso-legal" className="hover:text-orange-500 transition-colors">Términos y Condiciones</a>
                            <a href="/Aviso-legal" className="hover:text-orange-500 transition-colors">Aviso Legal</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;