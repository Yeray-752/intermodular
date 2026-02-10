import { Facebook, Instagram, MapPin, Phone, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import logo from "/img/web/logo_background.png";

function Footer() {
    // Cargamos los 3 namespaces necesarios
    const { t } = useTranslation(['footer', 'header', 'legales']);
    const navigate = useNavigate();

    // Datos del horario usando el namespace 'footer'
    const schedule = [
        { days: t('footer:days.week'), hours: '9:00 - 19:00' },
        { days: t('footer:days.sat'), hours: '10:00 - 14:00' },
        { days: t('footer:days.sun'), hours: t('footer:days.closed') },
    ];

    // Enlaces rápidos reutilizando las traducciones del 'header'
    const quickLinks = [
        { label: t('header:nav.home'), href: '/' },
        { label: t('header:nav.bookings'), href: '/reservas' },
        { label: t('header:nav.products'), href: '/productos' },
        { label: t('header:nav.about'), href: '/sobre-nosotros' },
    ];

    return (
        <footer className="bg-base-200 text-base-100 pt-5 pb-8 mt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Columna 1: Logo y descripción */}
                    <div className="space-y-6 content-center">
                        <div className="flex items-center justify-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
                            
                            <div>
                                <h2 className="text-3xl font-bold">AKOTAN</h2>
                                <p className="text-lg text-base-100 font-medium">
                                    {t('header:subtitle')}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-center space-x-4">
                            {[Facebook, Instagram, Phone].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-base-300 dark:bg-base-400 flex items-center justify-center hover:bg-primary-content transition-colors duration-300">
                                    <Icon size={18} className="text-base-content" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Columna 2: Contacto */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <div className="w-2 h-6 bg-primary-content rounded-full"></div>
                            {t('footer:contactTitle')}
                        </h3>
                        <div className="space-y-4 text-base-100">
                            <div className="flex items-start gap-3">
                                <MapPin size={20} className="text-primary-content mt-1 shrink-0" />
                                <span className=" truncate hover:text-primary-content transition-colors cursor-pointer">{t('footer:address')}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={20} className="text-primary-content shrink-0" />
                                <a href="tel:+34912345678" className="hover:text-primary-content transition-colors">+34 912 345 678</a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={20} className="text-primary-content shrink-0" />
                                <a href="mailto:info@akotan.com" className="hover:text-primary-content transition-colors">info@akotan.com</a>
                            </div>
                        </div>
                    </div>

                    {/* Columna 3: Enlaces rápidos */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <div className="w-2 h-6 bg-primary-content rounded-full"></div>
                            {t('footer:linksTitle')}
                        </h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <button 
                                        onClick={() => navigate(link.href)} 
                                        className="hover:text-primary-content transition-colors flex items-center gap-2 text-left"
                                    >
                                        <div className="w-1.5 h-1.5 bg-base-content/50 rounded-full"></div>
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Columna 4: Horario */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <div className="w-2 h-6 bg-primary-content rounded-full"></div>
                            {t('footer:scheduleTitle')}
                        </h3>
                        <div className="space-y-3 text-base-100">
                            {schedule.map((item, i) => (
                                <div key={i} className="flex justify-between py-2 border-b border-primary-content">
                                    <span>{item.days}</span>
                                    <span className="text-primary-content font-medium">{item.hours}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Bottom: Copyright y Legales */}
                <div className="border-t border-base-300 pt-8 mt-5 text-base-100 text-sm">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-center md:text-left">
                            Copyright © {new Date().getFullYear()} Akotan. {t('footer:rights')}
                        </p>
                        <p>
                            {t('footer:developedBy')} 
                            <span className="text-primary-content font-medium ml-1">Yeray Carrión</span> & 
                            <span className="text-primary-content font-medium ml-1">Óscar Gordillo</span>
                        </p>
                        <div className="flex items-center gap-6">
                            {/* Enlaces al namespace 'legales' */}
                            <button onClick={() => navigate('/Aviso-legal')} className="hover:text-primary-content transition-colors">
                                {t('legales:privacy')}
                            </button>
                            <button onClick={() => navigate('/Aviso-legal')} className="hover:text-primary-content transition-colors">
                                {t('legales:terms')}
                            </button>
                            <button onClick={() => navigate('/Aviso-legal')} className="hover:text-primary-content transition-colors">
                                {t('legales:legalNotice')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;