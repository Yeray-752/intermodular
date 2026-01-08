import coche from '../assets/img/coche.jpg'
import { useTranslation } from "react-i18next";

function WhoWeAre() {
  const { t } = useTranslation("about");

  return (
    <div className="min-h-screen bg-base-200 text-base-content px-4 md:px-6 py-12 md:py-16">
      <div className="max-w-7xl mx-auto space-y-20">

        <div className="inline-flex items-center gap-2 bg-base-100 px-4 py-2 rounded-full shadow-sm">
          <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
          <span className="text-sm font-semibold text-base-content/70">{t("sobre_nosotros_badge")}</span>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-28 items-center bg-base-200 p-5">
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
              {t("quienes_somos_h2").split('somos')[0]}<span className="text-orange-600">{t("quienes_somos_h2").includes('somos') ? 'somos' : 'are we'}</span>?
            </h2>
            <p className="text-lg text-base-content/90 leading-relaxed">
              {t("quienes_somos_p1")}
            </p>
          </div>
        </section>

        <section className="bg-base-200 p-5">
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-1 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                {t("logros_h2")}
              </h2>

              <p className="text-lg text-base-content/90 leading-relaxed max-w-3xl">
                {t("logros_p1")}
              </p>
            </div>
            <div>
              <ul className="timeline timeline-vertical">
                <li>
                  <div className="timeline-start ">2002 -</div>
                  <div className="timeline-middle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="text-orange-600 h-6 w-6">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="timeline-end timeline-box bg-base-100 shadow-md border border-base-300">
                    {t("creacion_empresa")}
                  </div>
                  <hr className="bg-orange-500" />
                </li>

                <li>
                  <hr className="bg-orange-500" />
                  <div className="timeline-start ">2004 -</div>
                  <div className="timeline-middle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="text-orange-600 h-6 w-6">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="timeline-end timeline-box bg-base-100 shadow-md border border-base-300">
                    {t("clientes_satisfechos")}
                  </div>
                  <hr className="bg-orange-500" />
                </li>

                <li>
                  <hr className="bg-orange-500" />
                  <div className="timeline-start ">2024 —</div>
                  <div className="timeline-middle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="text-orange-600 h-6 w-6">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="timeline-end timeline-box bg-base-100 shadow-md border border-base-300">
                    {t("premio_calidad")}
                  </div>
                  <hr className="" />
                </li>

                <li>
                  <hr className="" />
                  <div className="timeline-start ">{t("proximamente")} -</div>
                  <div className="timeline-middle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className=" h-6 w-6">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="timeline-end timeline-box bg-base-100 shadow-md border border-base-300">
                    {t("expansion_insular")}
                  </div>
                </li>

                <li>
                  <hr className="" />
                  <div className="timeline-start ">{t("futuro")} -</div>
                  <div className="timeline-middle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="timeline-end timeline-box bg-base-100 shadow-md border border-base-300">
                    {t("espana")}
                  </div>
                </li>

              </ul>
            </div>
          </section>
        </section>

        <section className="bg-base-100 p-8 md:p-12 rounded-2xl shadow-xl border border-base-300 relative">

          <div className="absolute -top-4 left-8 bg-base-content text-base-100 text-sm px-4 py-1 rounded-full font-semibold shadow-lg">
            {t("contacto_badge")}
          </div>

          <h2 className="text-3xl font-bold mb-6">{t("contacto_h2")}</h2>

          <p className="text-lg text-base-content/90 leading-relaxed mb-8">
            {t("contacto_p1")}
          </p>

          <div className="space-y-4 text-lg">
            <p>
              📞 {t("telefono")}:{" "}
              <a href="#" className="text-blue-700 font-semibold underline">
                +34 912 345 678
              </a>
            </p>
            <p>
              📧 {t("correo")}:{" "}
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