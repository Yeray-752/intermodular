import coche from '../assets/img/coche.jpg'

function WhoWeAre() {
  return (
    <div className="min-h-screen bg-white text-gray-900 px-4 md:px-6 py-12 md:py-16">

      <div className="max-w-7xl mx-auto space-y-20">

        <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full shadow-sm">
          <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
          <span className="text-sm font-semibold text-gray-700">SOBRE NOSOTROS</span>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-28 items-center bg-neutral-50 p-5">

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={coche}
                alt="Taller Ekotan"
                className="w-full h-[300px] md:h-[400px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-orange-600 rounded-full opacity-10 -z-10"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-700 rounded-full opacity-10 -z-10"></div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              ¿Quiénes <span className="text-orange-600">somos</span>?
            </h2>
            <p className="text-lg text-gray-800 leading-relaxed">
              En <span className="font-semibold">Talleres Ekotan</span> somos una empresa familiar con más de 20 años de
              experiencia en venta y reparación de piezas. Contamos con un equipo de
              <span className="font-semibold"> 15 profesionales</span> apasionados por la mecánica y comprometidos con una
              atención cercana y de calidad.
            </p>
          </div>

        </section>

        <section className="bg-neutral-50 p-5">
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-1 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                ¿Qué hemos <span className="text-blue-700">logrado</span> y qué queremos <span className="text-orange-600">lograr</span>?
              </h2>

              <p className="text-lg text-gray-800 leading-relaxed max-w-3xl">
                Hemos logrado consolidarnos como uno de los talleres mejor valorados de
                Puerto del Rosario, recibiendo el premio a{" "}
                <span className="font-semibold">Centro de Reparación de Alta Calidad</span>.
                Nuestro objetivo ahora es expandirnos por toda la isla y, con esfuerzo,
                llegar a todas las Islas Canarias y posteriormente a España.
              </p>
            </div>
            <div>
              <ul className="timeline timeline-vertical">

                <li>
                  <div className="timeline-start ">
                    2002 -
                  </div>

                  <div className="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="text-orange-600 h-6 w-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  <div className="timeline-end timeline-box bg-white shadow-md border border-gray-200">
                    Creación de la empresa.
                  </div>

                  <hr className="bg-orange-500" />
                </li>

                <li>
                  <hr className="bg-orange-500" />

                  <div className="timeline-start ">
                    2004 -
                  </div>

                  <div className="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="text-orange-600 h-6 w-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  <div className="timeline-end timeline-box bg-white shadow-md border border-gray-200">
                    Más de 2000 clientes satisfechos.
                  </div>

                  <hr className="bg-orange-500" />
                </li>

                <li>
                  <hr className="bg-orange-500" />

                  <div className="timeline-start ">
                    2024 —
                  </div>

                  <div className="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="text-orange-600 h-6 w-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  <div className="timeline-end timeline-box bg-white shadow-md border border-gray-200">
                    Premio a Centro de Reparación de Alta Calidad.
                  </div>

                  <hr className="" />
                </li>

                <li>
                  <hr className="" />

                  <div className="timeline-start ">
                    Proximamente -
                  </div>

                  <div className="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className=" h-6 w-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  <div className="timeline-end timeline-box bg-white shadow-md border border-gray-200">
                    Expansión insular
                  </div>

                  <hr className="" />
                </li>

                <li>
                  <hr className="" />

                  <div className="timeline-start ">
                    Futuro -
                  </div>

                  <div className="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  <div className="timeline-end timeline-box bg-white shadow-md border border-gray-200">
                    Ekotan en toda España
                  </div>

                </li>

              </ul>
            </div>
          </section>
        </section>

        <section className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200 relative">

          <div className="absolute -top-4 left-8 bg-gray-900 text-white text-sm px-4 py-1 rounded-full font-semibold shadow-lg">
            CONTACTO
          </div>

          <h2 className="text-3xl font-bold mb-6">Ponte en contacto</h2>

          <p className="text-lg text-gray-800 leading-relaxed mb-8">
            Estamos disponibles para resolver cualquier duda o ayudarte con tu vehículo:
          </p>

          <div className="space-y-4 text-lg">
            <p>
              📞 Teléfono:{" "}
              <a href="#" className="text-blue-700 font-semibold underline">
                +34 912 345 678
              </a>
            </p>
            <p>
              📧 Correo:{" "}
              <a href="mailto:ekotan@gmail.com" className="text-orange-600 font-semibold underline">
                ekotan@gmail.com
              </a>
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}

export default WhoWeAre;
