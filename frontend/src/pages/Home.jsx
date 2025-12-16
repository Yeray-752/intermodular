import { useNavigate } from "react-router";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ImagenPrincipal from "../assets/img/taller.jpg";

export default function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-gray-50 to-gray-100 text-gray-900">
      <Header />

      <main className="flex-1 px-4 md:px-6 py-12 md:py-16">
        <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center mb-20 md:mb-28">
          <div className="order-2 lg:order-1 space-y-6 md:space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-orange-600">Personalización</span> y{" "}
              <span className="text-blue-700">Reparación</span> de Vehículos
            </h1>
            <p className="text-lg md:text-xl text-gray-800 leading-relaxed">
              En Akotan transformamos tu vehículo con precisión y calidad. Desde 
              mantenimiento profesional hasta modificaciones exclusivas, cada proyecto 
              recibe atención experta y dedicación total.
            </p>
            <div className="mt-15 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/servicios")}
                className="px-8 py-4 bg-linear-to-r from-orange-600 to-orange-700 text-white rounded-xl font-bold hover:from-orange-700 hover:to-orange-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Ver Servicios
              </button>
              <button
                onClick={() => navigate("/contacto")}
                className="px-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-800"
              >
                Contactar
              </button>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative">
            <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition duration-500">
              <img
                src={ImagenPrincipal}
                alt="Taller mecánico profesional"
                className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent rounded-2xl md:rounded-3xl"></div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 md:w-32 md:h-32 bg-orange-600 rounded-full opacity-20 -z-10"></div>
            <div className="absolute -top-4 -left-4 w-20 h-20 md:w-28 md:h-28 bg-blue-700 rounded-full opacity-10 -z-10"></div>
          </div>
        </section>

        <section className="mb-20 md:mb-28">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-gray-900">Ofertas</span>{" "}
                <span className="text-orange-600">Especiales</span>
              </h2>
              <p className="text-gray-800 text-lg max-w-2xl mx-auto">
                Aprovecha nuestras promociones mensuales con calidad garantizada
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Cambio de Aceite Premium",
                  desc: "Incluye revisión completa y diagnóstico",
                  price: "29,99€",
                  popular: true
                },
                {
                  title: "Revisión General",
                  desc: "Inspección completa de 50 puntos",
                  price: "49,99€",
                  popular: false
                },
                {
                  title: "Alineación y Balanceo",
                  desc: "Completo ajuste de dirección",
                  price: "39,99€",
                  popular: false
                }
              ].map((oferta, i) => (
                <div
                  key={i}
                  className={`bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border ${
                    oferta.popular ? "border-orange-500 relative" : "border-gray-200"
                  }`}
                >
                  {oferta.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                        MÁS POPULAR
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                    {oferta.title}
                  </h3>
                  <p className="text-gray-800 mb-6">
                    {oferta.desc}
                  </p>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-bold text-gray-900">{oferta.price}</span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      IVA incluido
                    </span>
                  </div>
                  <button className="w-full py-3 bg-linear-to-r from-gray-900 to-gray-800 text-white rounded-xl font-bold hover:from-gray-800 hover:to-gray-700 transition-all duration-300">
                    Reservar Ahora
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="relative">
              <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={ImagenPrincipal}
                  alt="Técnico trabajando en vehículo"
                  className="w-full h-[300px] md:h-[400px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-blue-700 rounded-full opacity-5 -z-10"></div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span className="text-sm font-semibold text-gray-700">SOBRE NOSOTROS</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Pasión por la <span className="text-blue-700">Precisión</span>, 
                Compromiso con la <span className="text-orange-600">Excelencia</span>
              </h2>
              
              <p className="text-lg text-gray-900 leading-relaxed">
                Más de 15 años de experiencia nos respaldan. Nuestro equipo combina 
                tecnología de vanguardia con habilidades artesanales, asegurando 
                resultados que superan expectativas en cada proyecto.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Técnicos certificados y especializados",
                  "Garantía en todos nuestros trabajos",
                  "Atención personalizada y asesoramiento experto",
                  "Uso de repuestos y materiales de primera calidad"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-900">{item}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => navigate("/servicios")}
                className="px-8 py-4 bg-linear-to-r from-blue-700 to-blue-800 text-white rounded-xl font-bold hover:from-blue-800 hover:to-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Descubrir Servicios
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}