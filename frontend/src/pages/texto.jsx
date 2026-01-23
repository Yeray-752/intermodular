import React from 'react';
import Header from '../components/Principal/Header';
import Footer from '../components/Principal/Footer';
import { useTranslation } from 'react-i18next';

function Legales() {
    // Especificamos el namespace 'legales'
    const { t, i18n } = useTranslation('legales');
    const lang = i18n.language?.split('-')[0] || 'es';

    return (
        <div className='bg-base-200 min-h-screen flex flex-col font-sans text-base-content'>
            <Header />

            <main className='grow flex flex-col items-center p-6 md:p-12'>
                {/* Título */}
                <div className='w-full max-w-3xl text-center mb-10'>
                    <h1 className='text-3xl md:text-4xl font-semibold mb-4'>{t('legalInfoTitle')}</h1>
                    <p className='text-base-content/70 leading-relaxed'>
                        {t('legalInfoDescription')}
                    </p>
                </div>

                {/* Contenedor principal */}
                <div className='w-full max-w-3xl bg-base-100 border border-base-300 rounded-xl shadow-sm'>

                    {/* Índice simple */}
                    <div className='border-b border-base-300 p-4 text-sm flex justify-center gap-6'>
                        <a href='#aviso-legal' className='hover:underline font-medium'>{t('legalNotice')}</a>
                        <a href='#privacidad' className='hover:underline font-medium'>{t('privacy')}</a>
                        <a href='#terminos' className='hover:underline font-medium'>{t('terms')}</a>
                    </div>

                    <div className='p-6 md:p-10 space-y-14 text-sm md:text-base leading-relaxed text-base-content'>
                        
                        {/* Aviso legal */}
                        <section id='aviso-legal'>
                            <h2 className='text-2xl font-semibold mb-4 text-primary'>{t('legalNotice')}</h2>
                            <p>{t('legalNoticeText1')}</p>
                            <p className='mt-4'>{t('legalNoticeText2')}</p>
                            <ul className='mt-6 space-y-2 list-disc pl-6 border-l-2 border-primary/20 bg-base-200/30 p-4 rounded-r-lg'>
                                <li><strong>{t('companyName')}:</strong> AKOTAN Workshop S.L.</li>
                                <li><strong>{t('cif')}:</strong> B-00000000</li>
                                <li><strong>{t('address')}:</strong> Calle de la Mecánica, 12, 28001 Madrid, España</li>
                                <li><strong>{t('email')}:</strong> contacto@akotan.com</li>
                                <li><strong>{t('phone')}:</strong> +34 600 000 000</li>
                            </ul>
                        </section>

                        {/* Privacidad */}
                        <section id='privacidad'>
                            <h2 className='text-2xl font-semibold mb-4 text-primary'>{t('privacy')}</h2>
                            <div className="space-y-4">
                                <p>{t('privacyText1')}</p>
                                <p>{t('privacyText2')}</p>
                                <p>{t('privacyText3')}</p>
                                <p>{t('privacyText4')}</p>
                            </div>
                        </section>

                        {/* Términos */}
                        <section id='terminos'>
                            <h2 className='text-2xl font-semibold mb-6 text-primary'>{t('terms')}</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className='font-bold text-lg mb-2'>{t('terms1Title')}</h3>
                                    <p>{t('terms1Text')}</p>
                                </div>

                                <div>
                                    <h3 className='font-bold text-lg mb-2'>{t('terms2Title')}</h3>
                                    <p>{t('terms2Text')}</p>
                                </div>

                                <div>
                                    <h3 className='font-bold text-lg mb-2'>{t('terms3Title')}</h3>
                                    <p>{t('terms3Text')}</p>
                                </div>

                                <div>
                                    <h3 className='font-bold text-lg mb-2'>{t('terms4Title')}</h3>
                                    <p>{t('terms4Text')}</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Pie legal */}
                    <div className='border-t border-base-300 p-6 text-center text-xs md:text-sm text-base-content/60 bg-base-200/50 rounded-b-xl'>
                        <p>{t('lastUpdate', { date: lang === 'es' ? 'junio de 2025' : 'June 2025' })}</p>
                        <p className='mt-1 font-semibold'>AKOTAN Workshop © 2025</p>
                    </div>
                </div>

                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className='mt-8 btn btn-ghost btn-sm normal-case opacity-70'
                >
                    ↑ {t('backToTop')}
                </button>
            </main>

            <Footer />
        </div>
    )
}

export default Legales;