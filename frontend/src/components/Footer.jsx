import { Facebook, Instagram, MapPin, Phone, Mail } from 'lucide-react';
import logo from "../assets/img/logo_background.png";

function Footer() {
    return (
        <footer className="bg-base-100 dark:bg-base-200 text-base-content pt-12 pb-8 mt-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">

            {/* Logo y descripción */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <img src={logo} alt="Logo Akotan" className="w-20 h-20 object-contain" />
                    <div>
                        <h2 className="text-2xl font-bold">AKOTAN</h2>
                        <p className="text-sm text-base-content/70 font-medium">TALLER MECÁNICO</p>
                    </div>
                </div>
                <p className="text-base-content/70 text-sm leading-relaxed">
                    Especialistas en personalización y reparación de vehículos. Combinamos tecnología de vanguardia con artesanía tradicional.
                </p>

                <div className="flex items-center space-x-4 pt-2">
                    {[Facebook, Instagram, Phone].map((Icon, i) => (
                        <a key={i} href="#" className="w-10 h-10 rounded-full bg-base-300 dark:bg-base-400 flex items-center justify-center hover:bg-primary transition-colors duration-300">
                            <Icon size={18} className="text-base-content" />
                        </a>
                    ))}
                </div>
            </div>

            {/* Contacto */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <div className="w-2 h-6 bg-primary rounded-full"></div>
                    Contacto
                </h3>
                <div className="space-y-4 text-base-content/70">
                    <div className="flex items-start gap-3">
                        <MapPin size={20} className="text-primary mt-1 shrink-0" />
                        <span>Calle Taller, 123, 35600 Puerto del Rosario, España.</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Phone size={20} className="text-primary shrink-0" />
                        <a href="tel:+34912345678" className="hover:text-primary transition-colors">+34 912 345 678</a>
                    </div>
                    <div className="flex items-center gap-3">
                        <Mail size={20} className="text-primary shrink-0" />
                        <a href="mailto:info@akotan.com" className="hover:text-primary transition-colors">info@akotan.com</a>
                    </div>
                </div>
            </div>

            {/* Enlaces rápidos */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <div className="w-2 h-6 bg-primary rounded-full"></div>
                    Enlaces Rápidos
                </h3>
                <ul className="space-y-3">
                    {[
                        { label: 'Inicio', href: '/' },
                        { label: 'Reservas Online', href: '/reservas' },
                        { label: 'Tienda', href: '/productos' },
                        { label: 'Sobre Nosotros', href: '/sobre-nosotros' },
                    ].map(link => (
                        <li key={link.href}>
                            <a href={link.href} className="hover:text-primary transition-colors flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-base-content/50 rounded-full group-hover:bg-primary transition-colors"></div>
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Horario */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <div className="w-2 h-6 bg-primary rounded-full"></div>
                    Horario
                </h3>
                <div className="space-y-3 text-base-content/70">
                    {[
                        { days: 'Lunes - Viernes', hours: '9:00 - 19:00' },
                        { days: 'Sábados', hours: '10:00 - 14:00' },
                        { days: 'Domingos', hours: 'Cerrado' },
                    ].map((schedule, i) => (
                        <div key={i} className="flex justify-between py-2 border-b border-base-300">
                            <span>{schedule.days}</span>
                            <span className="text-primary font-medium">{schedule.hours}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Footer bottom */}
        <div className="border-t border-base-300 pt-8 text-base-content/70 text-sm">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-center md:text-left">Copyright © {new Date().getFullYear()} Akotan Taller Mecánico. Todos los derechos reservados.</p>
                <p>Desarrollado por <span className="text-primary font-medium">Yeray Carrión</span> y <span className="text-primary font-medium">Óscar Gordillo</span></p>
                <div className="flex items-center gap-6">
                    <a href="/Aviso-legal" className="hover:text-primary transition-colors">Política de Privacidad</a>
                    <a href="/Aviso-legal" className="hover:text-primary transition-colors">Términos y Condiciones</a>
                    <a href="/Aviso-legal" className="hover:text-primary transition-colors">Aviso Legal</a>
                </div>
            </div>
        </div>
    </div>
</footer>

    );
}

export default Footer;