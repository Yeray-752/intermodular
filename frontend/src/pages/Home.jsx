import { useTranslation, Trans } from "react-i18next";
import Footer from "../components/Principal/Footer";
import Header from "../components/Principal/Header";
import { useState } from 'react';
import ImagenPrincipal from "/img/web/taller.jpg";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { t } = useTranslation("home");
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );
  document.documentElement.setAttribute("data-theme", theme);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-200">
      <Header />

      <main className="flex-1 px-4 md:px-6 py-12 md:py-16">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center mb-20 md:mb-28">
          <div className="order-2 lg:order-1 space-y-6 md:space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <Trans
                i18nKey="heroTitle"
                components={{
                  1: <span className="text-primary" />,
                  2: <span className="text-secondary" />
                }}
              />
            </h1>

            <p className="text-lg md:text-xl text-base-content/80 leading-relaxed">
              {t("heroDescription")}
            </p>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition duration-500">
              <img
                src={ImagenPrincipal}
                alt={t("heroAlt")}
                className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent rounded-2xl md:rounded-3xl"></div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 md:w-32 md:h-32 bg-primary opacity-20 rounded-full -z-10"></div>
            <div className="absolute -top-4 -left-4 w-20 h-20 md:w-28 md:h-28 bg-secondary opacity-10 rounded-full -z-10"></div>
          </div>
        </section>

        {/* Offers Section */}
        <section className="mb-20 md:mb-28">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-20">
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                <Trans
                  i18nKey="offersTitle"
                  components={{
                    1: <span className=" text-base-content" />,
                    2: <span className="text-primary" />
                  }}
                />
              </h2>
              <p className="text-base-content/80 text-lg max-w-2xl mx-auto">
                {t("offersDescription")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Oferta 1 */}
              <div className="bg-base-100 p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-primary relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-content px-4 py-1 rounded-full text-sm font-bold">
                    {t("offerMostPopular")}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-base-content mb-3">
                  {t("offer1Title")}
                </h3>
                <p className="text-base-content/80 mb-6">{t("offer1Desc")}</p>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-bold text-base-content">
                    29,99€
                  </span>
                  <span className="text-sm bg-base-300 px-3 py-1 rounded-full">
                    {t("offerVATIncluded")}
                  </span>
                </div>
                <button className="w-full py-3 btn btn-base-200 text-base-100">
                  {t("bookNow")}
                </button>
              </div>

              {/* Oferta 2 */}
              <div className="bg-base-100 p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-base-300">
                <h3 className="text-xl md:text-2xl font-bold text-base-content mb-3">
                  {t("offer2Title")}
                </h3>
                <p className="text-base-content/80 mb-6">{t("offer2Desc")}</p>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-bold text-base-content">
                    49,99€
                  </span>
                  <span className="text-sm bg-base-300 px-3 py-1 rounded-full">
                    {t("offerVATIncluded")}
                  </span>
                </div>
                <button className="w-full py-3 btn btn-base-200 text-base-100">
                  {t("bookNow")}
                </button>
              </div>

              {/* Oferta 3 */}
              <div className="bg-base-100 p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-base-300">
                <h3 className="text-xl md:text-2xl font-bold text-base-content mb-3">
                  {t("offer3Title")}
                </h3>
                <p className="text-base-content/80 mb-6">{t("offer3Desc")}</p>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-bold text-base-content">
                    39,99€
                  </span>
                  <span className="text-sm bg-base-300 px-3 py-1 rounded-full">
                    {t("offerVATIncluded")}
                  </span>
                </div>
                <button className="w-full py-3 btn btn-base-200 text-base-100">
                  {t("bookNow")}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="mb-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="relative">
              <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={ImagenPrincipal}
                  alt={t("aboutUsAlt")}
                  className="w-full h-[300px] md:h-[400px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-secondary rounded-full opacity-5 -z-10"></div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                <Trans
                  i18nKey="aboutUsTitle"
                  components={{
                    1: <span className="text-secondary" />,
                    2: <span className="text-primary" />
                  }}
                />
              </h2>
              <p className="text-base-content text-lg leading-relaxed">
                {t("aboutUsDescription")}
              </p>
              <ul className="space-y-4">
                {t("aboutUsList", { returnObjects: true }).map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                    <span className="text-base-content">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
