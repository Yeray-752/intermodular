function WhoWeAre() {

    return (
        <div className="w-4xl">

            <details className="collapse bg-base-100 border border-base-300" name="my-accordion-det-1" open>
                <summary className="collapse-title font-semibold">¿Quienes somos?</summary>
                <div className="collapse-content text-sm">En talleres Ekotan somos una familia que lleva en el
                    negocio de la venta y reparación de piezas desde el 2002,constamos actualmente de 15 miembros y somos muy apasionados
                    en lo que hacemos.
                </div>
            </details>
            <details className="collapse bg-base-100 border border-base-300" name="my-accordion-det-1">
                <summary className="collapse-title font-semibold">¿Qué hemos logrado y qué queremos lograr?</summary>
                <div className="collapse-content text-sm">De momento hemos conseguido posicionarnos como el mejor taller en todo Puerto del Rosario, a tal punto de que pudimos conseguir el premio a Centro de reparación de alta calidad,
                    ahora, con esta página web esperamos poder impulsarnos al resto de la isla, y con un poco de empeño, quizas a toda Canarias.</div>

                <ul className="timeline">
                    <li>
                        <div className="timeline-start timeline-box">Creación de la empresa.</div>
                        <div className="timeline-middle">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="text-primary h-5 w-5"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="timeline-end">2002</div>
                        <hr className="bg-primary" />
                    </li>
                    <li>
                        <hr className="bg-primary" />
                        <div className="timeline-start ">2004</div>
                        <div className="timeline-middle">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="text-primary h-5 w-5"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="timeline-end timeline-box">Más de 2000 <br /> clientes satisfechos.</div>
                        <hr className="bg-primary" />
                    </li>
                    <li>
                        <hr className="bg-primary" />
                        <div className="timeline-start timeline-box">Premio a Centro de reparación <br /> de alta calidad.</div>
                        <div className="timeline-middle">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="text-primary h-5 w-5"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="timeline-end">2024</div>
                        <hr />
                    </li>
                    <li>
                        <hr />
                        <div className="timeline-start ">20??</div>
                        <div className="timeline-middle">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="h-5 w-5"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="timeline-end timeline-box">Extencion insular.</div>
                        <hr />
                    </li>
                    <li>
                        <hr />
                        <div className="timeline-start timeline-box">Ekotan en toda España.</div>
                        <div className="timeline-middle">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="h-5 w-5"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="timeline-end">20??</div>
                    </li>
                </ul>
            </details>
            <details className="collapse bg-base-100 border border-base-300" name="my-accordion-det-1">
                <summary className="collapse-title font-semibold">Contacto</summary>
                <div className="collapse-content text-sm">Puedes contactar con nosotros mediante el teléfono
                    <a href="#" className="underline"> +34 XXX-XX-XX-XX </a>
                    o por el correo
                    <a href="#" className="underline"> ekotan@gmail.com</a>
                    .
                </div>
            </details>
        </div>
    );
}

export default WhoWeAre;