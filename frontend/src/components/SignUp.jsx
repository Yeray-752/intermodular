import fondo from "/img/web/fondo_Registro.jpg";
import { useNavigate, Link } from "react-router-dom";
// 1. Importar el hook
import { useTranslation } from "react-i18next";

function SignUp() {
  const navigate = useNavigate();
  // 2. Inicializar la traducción apuntando al namespace 'formulario'
  const { t } = useTranslation("signup");

  const handleRegistration = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div
      className="w-screen h-screen flex justify-center items-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${fondo})` }}
    >
      <div className="absolute inset-0 backdrop-blur-md bg-black/30" />

      <div className="relative z-10">
        <form
          className="fieldset object-center bg-base-200 border-base-300 rounded-box w-md border-2 p-4 flex flex-col gap-4"
          onSubmit={handleRegistration}
        >
          <div className="text-2xl">
            {/* 3. Usar la función t() */}
            <p>{t("signup.title")}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <fieldset className="fieldset flex flex-col">
              <label className="label">{t("signup.name")}</label>
              <input
                type="text"
                className="input validator w-full"
                placeholder="Federico"
                required
              />
              <p className="validator-hint hidden">{t("signup.required_field")}</p>
            </fieldset>

            <fieldset className="fieldset flex flex-col">
              <label className="label">{t("signup.lastname")}</label>
              <input
                type="text"
                className="input validator w-full"
                placeholder="Castillos Magallanes"
              />
              <p className="validator-hint hidden">{t("signup.optional_field")}</p>
            </fieldset>
          </div>

          <fieldset className="fieldset flex flex-col">
            <label className="label">{t("signup.email")}</label>
            <input
              type="email"
              className="input validator w-full"
              placeholder="usuario@gmail.com"
              required
            />
            <p className="validator-hint hidden">{t("signup.required_field")}</p>
          </fieldset>

          <fieldset className="fieldset flex flex-col">
            <label className="label">{t("signup.password")}</label>
            <input
              type="password"
              className="input validator w-full"
              placeholder="********"
              required
              minLength={8}
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[A-Za-z0-9]{8,}"
            />
            <span className="validator-hint hidden">
              {t("signup.pass_hint")}
              <br />• {t("signup.pass_req_1")}
              <br />• {t("signup.pass_req_2")}
              <br />• {t("signup.pass_req_3")}
              <br />• {t("signup.pass_req_4")}
            </span>
          </fieldset>

          <button type="submit" className="btn btn-neutral mt-4">
            {t("signup.btn_submit")}
          </button>
          <button type="reset" className="btn btn-ghost mt-1">
            {t("signup.btn_reset")}
          </button>

          <Link to="/Login" className="link link-hover mt-2">
            {t("signup.link_login")}
          </Link>
        </form>
      </div>
    </div>
  );
}

export default SignUp;