import { useNavigate, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { loginSchema } from "../../schemas/loginSchema"
import { useState, useContext } from "react";
import Turnstile from "react-turnstile";
import fondo from "/img/web/fondo_log.webp";
import { AuthContext } from "../../context/AuthContext";


function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [errors, setErrors] = useState({});
    const [captchaToken, setCaptchaToken] = useState(null);
    const { login } = useContext(AuthContext);

    const { t } = useTranslation("login");

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!captchaToken) {
            alert("Por favor, completa la verificación de seguridad.");
            return;
        }

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        const result = loginSchema.safeParse(data);
        if (!result.success) {
            setErrors(result.error.flatten().fieldErrors);
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: data.email,
                    contraseña: data.password
                }),
            });

            const json = await response.json();

            if (!response.ok) {
                setErrors({ general: [json.error || "Error al iniciar sesión"] });
                return;
            }

            // 1. Guardamos en el almacenamiento persistente
            localStorage.setItem("token", json.token);
            localStorage.setItem("rol", json.rol);

            console.log("Login exitoso, actualizando contexto...");

            // 2. ¡IMPORTANTE! Actualizamos el estado GLOBAL con el token real (json.token)
            login(json.token);

            // 3. Ahora que el contexto tiene al usuario, navegamos
            // El Header cambiará automáticamente y las rutas protegidas te dejarán pasar
            navigate("/");

        } catch (error) {
            console.error("Error de conexión:", error);
            setErrors({ general: ["No se pudo conectar con el servidor"] });
        }
    }


    return (
        <div>
            <div
                className="w-screen h-screen flex justify-center items-center bg-cover bg-center relative"
                style={{ backgroundImage: `url(${fondo})` }}
            >
                <div className="absolute inset-0 backdrop-blur-md bg-black/30" />

                <div className="relative z-10">
                    <form
                        className="fieldset object-center bg-base-200 border-base-300 rounded-box w-md border-2 p-4 flex flex-col gap-4"
                        onSubmit={handleLogin}
                    >
                        <div className="text-2xl">
                            <p>{t("title")}</p>
                        </div>

                        <fieldset className="fieldset flex flex-col gap-2">
                            <label className="label">{t("email")}</label>
                            <input
                                name="email"
                                type="email"
                                className={`input w-full ${errors.email ? 'border-error' : ''}`}
                                placeholder="usuario@gmail.com"
                            />
                            {errors.email && (
                                <span className="text-error text-sm">{errors.email[0]}</span>
                            )}
                            <p className="validator-hint hidden">
                                {t("required_field")}
                            </p>
                        </fieldset>

                        <fieldset className="fieldset flex flex-col gap-2">
                            <label className="label">{t("password")}</label>
                            <input
                                name="password"
                                type="password"
                                className={`input w-full ${errors.password ? 'border-error' : ''}`}
                                placeholder="Contraseña_123"
                            />
                            {errors.password && (
                                <span className="text-error text-sm">{errors.password[0]}</span>
                            )}
                            <span className="validator-hint hidden">
                                {t("invalid_field")}
                            </span>
                        </fieldset>

                        <div className="flex justify-center my-2">
                            <Turnstile
                                sitekey="3x00000000000000000000FF" // Llave de prueba (cámbiala en producción)
                                onVerify={(token) => setCaptchaToken(token)}
                                onExpire={() => setCaptchaToken(null)}
                                onError={() => setCaptchaToken(null)}
                            />
                        </div>

                        <button type="submit" className="btn btn-neutral mt-2">
                            {t("btn_submit")}
                        </button>

                        <button
                            type="reset"
                            className="btn btn-ghost mt-0"
                            onClick={() => setCaptchaToken(null)}
                        >
                            {t("btn_reset")}
                        </button>

                        <Link to="/registro" className="link link-hover mt-2 text-center">
                            {t("link_signup")}
                        </Link>
                    </form>
                </div>
            </div>
        </div>

    )
}

export default Login;