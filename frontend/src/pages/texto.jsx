import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

function Legales() {
    const { t } = useTranslation();

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
                <div className='w-full max-w-3xl bg-base-100 border border-base-300 rounded-xl'>

                    {/* Índice simple */}
                    <div className='border-b border-base-300 p-4 text-sm flex justify-center gap-6'>
                        <a href='#aviso-legal' className='hover:underline'>{t('legalNotice')}</a>
                        <a href='#privacidad' className='hover:underline'>{t('privacy')}</a>
                        <a href='#terminos' className='hover:underline'>{t('terms')}</a>
                    </div>

                    <div className='p-6 md:p-10 space-y-14 text-sm md:text-base leading-relaxed text-base-content'>
                        {/* Aviso legal */}
                        <section id='aviso-legal'>
                            <h2 className='text-2xl font-semibold mb-4'>{t('legalNotice')}</h2>
                            <p>{t('legalNoticeText1')}</p>
                            <p className='mt-4'>{t('legalNoticeText2')}</p>
                            <ul className='mt-6 space-y-2 list-disc pl-6'>
                                <li><strong>{t('companyName')}:</strong> AKOTAN Workshop S.L.</li>
                                <li><strong>{t('cif')}:</strong> B-00000000</li>
                                <li><strong>{t('address')}:</strong> Calle de la Mecánica, 12, 28001 Madrid, España</li>
                                <li><strong>{t('email')}:</strong> contacto@akotan.com</li>
                                <li><strong>{t('phone')}:</strong> +34 600 000 000</li>
                            </ul>
                        </section>

                        {/* Privacidad */}
                        <section id='privacidad'>
                            <h2 className='text-2xl font-semibold mb-4'>{t('privacy')}</h2>
                            <p>{t('privacyText1')}</p>
                            <p className='mt-4'>{t('privacyText2')}</p>
                            <p className='mt-4'>{t('privacyText3')}</p>
                            <p className='mt-4'>{t('privacyText4')}</p>
                        </section>

                        {/* Términos */}
                        <section id='terminos'>
                            <h2 className='text-2xl font-semibold mb-4'>{t('terms')}</h2>

                            <h3 className='font-semibold mt-6'>{t('terms1Title')}</h3>
                            <p>{t('terms1Text')}</p>

                            <h3 className='font-semibold mt-6'>{t('terms2Title')}</h3>
                            <p>{t('terms2Text')}</p>

                            <h3 className='font-semibold mt-6'>{t('terms3Title')}</h3>
                            <p>{t('terms3Text')}</p>

                            <h3 className='font-semibold mt-6'>{t('terms4Title')}</h3>
                            <p>{t('terms4Text')}</p>
                        </section>

                    </div>

                    {/* Pie legal */}
                    <div className='border-t border-base-300 p-6 text-center text-sm text-base-content/70'>
                        <p>{t('lastUpdate', { date: 'junio de 2025' })}</p>
                        <p className='mt-1'>AKOTAN Workshop</p>
                    </div>
                </div>

                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className='mt-8 text-sm underline cursor-pointer text-base-content/70'
                >
                    {t('backToTop')}
                </button>
            </main>

            <Footer />
        </div>
    )
}

export default Legales;
