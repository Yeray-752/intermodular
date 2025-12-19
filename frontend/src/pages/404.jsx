import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Error404() {
  const { t } = useTranslation("error");

  return (
    <div>
      <main className="grid min-h-full place-items-center bg-base-200 px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-primary">404</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-base-content sm:text-7xl">
            {t("title")}
          </h1>
          <p className="mt-6 text-lg font-medium text-base-content/70 sm:text-xl/8">
            {t("subtitle")}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/">
              <div className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-content shadow hover:bg-primary-focus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                {t("button")}
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
