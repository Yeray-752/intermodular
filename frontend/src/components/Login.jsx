import { useNavigate, Link, useLocation } from "react-router-dom"; // MODIFICADO: Importa useLocation
import { useTranslation } from "react-i18next";
import { loginSchema } from "../schemas/loginSchema"
import { useState } from "react";
import Turnstile from "react-turnstile";
import fondo from "/img/web/fondo_log.webp";

function Login() {
    const navigate = useNavigate();
    const location = useLocation(); // MODIFICADO: Captura el estado de la navegación
    const [errors, setErrors] = useState({});
    const [captchaToken, setCaptchaToken] = useState(null);

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

            localStorage.setItem("token", json.token);
            localStorage.setItem("rol", json.rol);

            console.log("Login exitoso, token guardado.");

            // MODIFICADO: Lógica de redirección inteligente
            // Si venimos de un producto/servicio, location.state.from tendrá esa ruta.
            // Si entramos al login directamente, irá a "/"
            const destino = location.state?.from?.pathname || "/";
            navigate(destino, { replace: true });

        } catch (error) {
            console.error("Error de conexión:", error);
            setErrors({ general: ["No se pudo conectar con el servidor"] });
        }
    };

    return (
        // ... El resto de tu JSX permanece igual
        <div>
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

                            {/* 4. Widget de Cloudflare Turnstile */}
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
            </div >
        </div>
    );
}
export default Login;