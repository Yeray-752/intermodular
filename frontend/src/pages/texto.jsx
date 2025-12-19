import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

function Legales() {
    return (
        <div className='bg-neutral-50 min-h-screen flex flex-col font-sans text-neutral-800'>
            <Header />

            <main className='grow flex flex-col items-center p-6 md:p-12'>
                {/* Título */}
                <div className='w-full max-w-3xl text-center mb-10'>
                    <h1 className='text-3xl md:text-4xl font-semibold mb-4'>Información Legal</h1>
                    <p className='text-neutral-600 leading-relaxed'>
                        En esta sección se recoge toda la información legal relacionada con el uso del sitio web de AKOTAN Workshop,
                        incluyendo el aviso legal, la política de privacidad y los términos y condiciones aplicables a nuestros servicios.
                    </p>
                </div>

                {/* Contenedor principal */}
                <div className='w-full max-w-3xl bg-white border border-neutral-200 rounded-xl'>

                    {/* Índice simple */}
                    <div className='border-b border-neutral-200 p-4 text-sm flex justify-center gap-6'>
                        <a href='#aviso-legal' className='hover:underline'>Aviso legal</a>
                        <a href='#privacidad' className='hover:underline'>Privacidad</a>
                        <a href='#terminos' className='hover:underline'>Términos</a>
                    </div>

                    <div className='p-6 md:p-10 space-y-14 text-sm md:text-base leading-relaxed'>

                        {/* Aviso legal */}
                        <section id='aviso-legal'>
                            <h2 className='text-2xl font-semibold mb-4'>Aviso Legal</h2>
                            <p>
                                De conformidad con lo establecido en la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la
                                Información y del Comercio Electrónico (LSSI-CE), se informa a los usuarios de los datos identificativos
                                del titular del presente sitio web.
                            </p>
                            <p className='mt-4'>
                                El acceso y uso de este sitio web atribuye la condición de usuario e implica la aceptación plena y sin
                                reservas de todas las disposiciones incluidas en este aviso legal, que podrán ser modificadas en cualquier
                                momento para adaptarse a cambios normativos o a la actividad de la empresa.
                            </p>
                            <ul className='mt-6 space-y-2 list-disc pl-6'>
                                <li><strong>Denominación social:</strong> AKOTAN Workshop S.L.</li>
                                <li><strong>CIF:</strong> B-00000000</li>
                                <li><strong>Domicilio social:</strong> Calle de la Mecánica, 12, 28001 Madrid, España</li>
                                <li><strong>Correo electrónico:</strong> contacto@akotan.com</li>
                                <li><strong>Teléfono:</strong> +34 600 000 000</li>
                            </ul>
                        </section>

                        {/* Privacidad */}
                        <section id='privacidad'>
                            <h2 className='text-2xl font-semibold mb-4'>Política de Privacidad</h2>
                            <p>
                                AKOTAN Workshop se compromete a garantizar la confidencialidad y seguridad de los datos personales
                                facilitados por los usuarios, cumpliendo con lo dispuesto en el Reglamento (UE) 2016/679 (RGPD)
                                y la normativa española vigente en materia de protección de datos.
                            </p>
                            <p className='mt-4'>
                                Los datos personales recogidos a través de los formularios del sitio web serán tratados con la finalidad
                                de gestionar solicitudes de información, presupuestos, citas de reparación, así como para mantener
                                comunicaciones relacionadas con los servicios contratados.
                            </p>
                            <p className='mt-4'>
                                El usuario garantiza que los datos proporcionados son veraces y se compromete a comunicar cualquier
                                modificación de los mismos. Los datos se conservarán únicamente durante el tiempo necesario para cumplir
                                con la finalidad para la que fueron recabados o mientras exista una obligación legal.
                            </p>
                            <p className='mt-4'>
                                En cualquier momento, el usuario podrá ejercer sus derechos de acceso, rectificación, supresión,
                                limitación, portabilidad y oposición mediante solicitud escrita dirigida a
                                <strong> privacidad@akotan.com</strong>.
                            </p>
                        </section>

                        {/* Términos */}
                        <section id='terminos'>
                            <h2 className='text-2xl font-semibold mb-4'>Términos y Condiciones</h2>

                            <h3 className='font-semibold mt-6'>1. Servicios y presupuestos</h3>
                            <p>
                                Todos los servicios ofrecidos por AKOTAN Workshop estarán sujetos a la elaboración previa de un
                                presupuesto, que deberá ser aceptado expresamente por el cliente antes de iniciar cualquier reparación
                                o intervención sobre el vehículo.
                            </p>

                            <h3 className='font-semibold mt-6'>2. Plazos y responsabilidad</h3>
                            <p>
                                Los plazos de entrega indicados tienen carácter orientativo y podrán variar en función de la
                                disponibilidad de piezas, la complejidad de la reparación o causas ajenas al taller.
                                AKOTAN Workshop no será responsable de retrasos derivados de dichas circunstancias.
                            </p>

                            <h3 className='font-semibold mt-6'>3. Garantía</h3>
                            <p>
                                Las reparaciones realizadas cuentan con una garantía legal de tres meses o 2.000 kilómetros,
                                lo que ocurra primero, excluyendo piezas sometidas a desgaste por uso normal.
                            </p>

                            <h3 className='font-semibold mt-6'>4. Formas de pago</h3>
                            <p>
                                El importe de los servicios deberá abonarse en el momento de la entrega del vehículo.
                                Se aceptan pagos en efectivo, tarjeta bancaria y otros métodos habilitados por el taller.
                            </p>
                        </section>

                    </div>

                    {/* Pie legal */}
                    <div className='border-t border-neutral-200 p-6 text-center text-sm text-neutral-600'>
                        <p>Última actualización: junio de 2025</p>
                        <p className='mt-1'>AKOTAN Workshop</p>
                    </div>
                </div>

                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className='mt-8 text-sm underline cursor-pointer'
                >
                    Volver arriba
                </button>
            </main>

            <Footer />
        </div>
    )
}

export default Legales