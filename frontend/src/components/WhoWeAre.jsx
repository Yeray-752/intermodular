function WhoWeAre() {
    return (
      <div className="min-h-screen bg-white text-gray-900 px-4 md:px-6 py-12 md:py-16">
  
        <div className="max-w-6xl mx-auto space-y-20">
  
          {/* Etiqueta de sección */}
          <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full shadow-sm">
            <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
            <span className="text-sm font-semibold text-gray-700">SOBRE NOSOTROS</span>
          </div>
  
          {/* QUIÉNES SOMOS */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
  
            {/* Imagen con decoraciones */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/img/taller.jpg"
                  alt="Taller Ekotan"
                  className="w-full h-[300px] md:h-[400px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-orange-600 rounded-full opacity-10 -z-10"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-700 rounded-full opacity-10 -z-10"></div>
            </div>
  
            {/* Texto */}
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
  
          {/* LOGROS / META */}
          <section className="space-y-8">
  
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
  
            {/* TIMELINE estilizado */}
            <ul className="timeline timeline-snap-icon timeline-compact timeline-vertical">
  
              {[
                { year: "2002", text: "Creación de la empresa" },
                { year: "2004", text: "Más de 2000 clientes satisfechos" },
                { year: "2024", text: "Premio a Centro de Reparación de Alta Calidad" },
                { year: "20??", text: "Expansión insular" },
                { year: "20??", text: "Ekotan en toda España" }
              ].map((item, i) => (
                <li key={i}>
                  {i > 0 && <hr className="bg-orange-500" />}
                  <div className="timeline-start">
                    <span className="text-gray-700 font-medium">{item.year}</span>
                  </div>
                  <div className="timeline-middle">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center shadow-md">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    </div>
                  </div>
                  <div className="timeline-end timeline-box bg-white shadow-md border border-gray-200">
                    {item.text}
                  </div>
                  <hr className="bg-orange-500" />
                </li>
              ))}
            </ul>
  
          </section>
  
          {/* CONTACTO */}
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
                <a href="tel:+34XXXXXXXXX" className="text-blue-700 font-semibold underline">
                  +34 XXX XXX XXX
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
  