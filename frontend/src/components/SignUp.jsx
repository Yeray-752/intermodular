import { useState } from "react";
import fondo from "/img/web/fondo_Registro.jpg";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { registerSchema } from "../schemas/registerSchema";

function SignUp() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const { t } = useTranslation("signup");

  const handleRegistration = async (e) => { // Añadimos async
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // 1. Validar con Zod
    const result = registerSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      // 2. Enviar a la API (Ruta que creamos con transacción)
      const response = await fetch("https://yeray.informaticamajada.es/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          contraseña: data.password, // Mapeo para el Backend
          nombre: data.nombre,
          apellidos: data.apellidos,
          direccion: data.direccion || ""
        }),
      });

      const json = await response.json();

      if (response.ok) {
        console.log("Usuario y Cliente creados con éxito");
        // Opcional: Podrías loguearlo automáticamente aquí o redirigir
        alert("Registro completado. Ahora puedes iniciar sesión.");
        navigate("/Login");
      } else {
        // Manejar errores del servidor (ej: email ya existe)
        setErrors({ email: [json.error || "Error en el registro"] });
      }
    } catch (error) {
      /* console.error("Error de red:", error); */
      setErrors({ general: ["Error al conectar con el servidor"] });
    }
  };

  return (
    <div
      className="w-screen h-screen flex justify-center items-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${fondo})` }}
    >
      <div className="absolute inset-0 backdrop-blur-md bg-black/30" />
      <div className="relative z-10">
        <form className="fieldset bg-base-200 border-base-300 rounded-box w-md border-2 p-4 flex flex-col gap-4" onSubmit={handleRegistration}>
          
          {errors.general && (
            <div className="alert alert-error text-sm py-2">{errors.general[0]}</div>
          )}

          <div className="text-2xl">
            <p>{t("signup.title")}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <fieldset className="fieldset flex flex-col">
              <label className="label">{t("signup.name")}</label>
              <input name="nombre" type="text" className={`input w-full ${errors.nombre ? 'border-error' : ''}`} placeholder="Federico" />
              {errors.nombre && <span className="text-error text-xs mt-1">{errors.nombre[0]}</span>}
            </fieldset>

            <fieldset className="fieldset flex flex-col">
              <label className="label">{t("signup.lastname")}</label>
              <input name="apellidos" type="text" className={`input w-full ${errors.apellidos ? 'border-error' : ''}`} placeholder="Castillos" />
              {errors.apellidos && <span className="text-error text-xs mt-1">{errors.apellidos[0]}</span>}
            </fieldset>
          </div>

          <fieldset className="fieldset flex flex-col">
            <label className="label">{t("signup.email")}</label>
            <input name="email" type="email" className={`input w-full ${errors.email ? 'border-error' : ''}`} placeholder="usuario@gmail.com" />
            {errors.email && <span className="text-error text-xs mt-1">{errors.email[0]}</span>}
          </fieldset>

          <fieldset className="fieldset flex flex-col">
            <label className="label">{t("signup.password")}</label>
            <input name="password" type="password" className={`input w-full ${errors.password ? 'border-error' : ''}`} placeholder="Contraseña_123" />
            {errors.password ? (
              <span className="text-error text-xs mt-1">{errors.password[0]}</span>
            ) : (
              <span className="text-gray-500 text-[10px] leading-tight mt-1">
                Min. 8 caracteres, una mayúscula, un número.
              </span>
            )}
          </fieldset>

          <button type="submit" className="btn btn-neutral mt-4">
            {t("signup.btn_submit")}
          </button>
          
          <Link to="/Login" className="link link-hover mt-2 text-center text-sm">
            {t("signup.link_login")}
          </Link>

        </form>
      </div>
    </div>
  );
}

export default SignUp;