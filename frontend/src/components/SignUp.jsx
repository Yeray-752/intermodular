import { useState } from "react";
import fondo from "/img/web/fondo_Registro.jpg";
import { useNavigate, Link } from "react-router-dom";
// 1. Importar el hook
import { useTranslation } from "react-i18next";
import { registerSchema } from "../schemas/registerSchema";

function SignUp() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  // 2. Inicializar la traducción apuntando al namespace 'formulario'
  const { t } = useTranslation("signup");

  const handleRegistration = (e) => {
    e.preventDefault();

    // Capturamos los datos
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Validamos con Zod
    const result = registerSchema.safeParse(data);

    if (!result.success) {
      // Si hay errores, los guardamos en el estado
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      return;
    }

    // Si todo está bien
    setErrors({});
    console.log("Registro exitoso:", result.data);
    navigate("/");
  };

  return (
    <div
      className="w-screen h-screen flex justify-center items-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${fondo})` }}
    >
      <div className="absolute inset-0 backdrop-blur-md bg-black/30" />
      <div className="relative z-10">
        <form className="fieldset bg-base-200 border-base-300 rounded-box w-md border-2 p-4 flex flex-col gap-4" onSubmit={handleRegistration}>
          <div className="text-2xl">
            {/* 3. Usar la función t() */}
            <p>{t("signup.title")}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <fieldset className="fieldset flex flex-col">
              <label className="label">{t("signup.name")}</label>
              <input name="nombre" type="text" className={`input w-full ${errors.nombre ? 'border-error' : ''}`} placeholder="Federico" />
              {errors.nombre && <span className="text-error text-xs mt-1">{errors.nombre[0]}</span>}
              <p className="validator-hint hidden">{t("signup.required_field")}</p>
            </fieldset>

            <fieldset className="fieldset flex flex-col">
              <label className="label">{t("signup.lastname")}</label>
              <input name="apellidos" type="text" className="input w-full" placeholder="Castillos Magallanes" />
              <p className="validator-hint hidden">{t("signup.optional_field")}</p>
            </fieldset>
          </div>






          <fieldset className="fieldset flex flex-col">
            <label className="label">{t("signup.email")}</label>
            <input name="email" type="email" className={`input w-full ${errors.email ? 'border-error' : ''}`} placeholder="usuario@gmail.com" />
            {errors.email && <span className="text-error text-xs mt-1">{errors.email[0]}</span>}

            <p className="validator-hint hidden">{t("signup.required_field")}</p>
          </fieldset>




          <fieldset className="fieldset flex flex-col">
            <label className="label">{t("signup.password")}</label>
            <input name="password" type="password" className={`input w-full ${errors.password ? 'border-error' : ''}`} placeholder="Contraseña_123" />
            {errors.password ? (
              <span className="text-error text-xs mt-1">{errors.password[0]}</span>
            ) : (
              <span className="text-gray-500 text-[10px] leading-tight mt-1">
                Min. 8 caracteres, una mayúscula, un número. Sin caracteres especiales.
              </span>
            )}
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