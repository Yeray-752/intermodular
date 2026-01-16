import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
// Importamos el componente de la librería que instalaste
import Turnstile from "react-turnstile"; 
import fondo from "/img/web/fondo_log.webp";

function Login() {
    const navigate = useNavigate();
    
    // 1. Inicializamos la traducción
    const { t } = useTranslation("login");

    // 2. Estado para almacenar el token del CAPTCHA
    const [captchaToken, setCaptchaToken] = useState(null);

    const handleLogin = (e) => {
        e.preventDefault();

        // 3. Verificamos si el usuario completó el CAPTCHA
        if (!captchaToken) {
            alert("Por favor, completa la verificación de seguridad.");
            return;
        }

        // Aquí es donde en el futuro enviarás:
        // { email, password, captchaToken } a tu carpeta /backend
        console.log("Token de verificación listo:", captchaToken);
        
        // Por ahora, simulamos el éxito del login
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
                    onSubmit={handleLogin}
                >
                    <div className="text-2xl">
                        <p>{t("title")}</p>
                    </div>

                    <fieldset className="fieldset flex flex-col gap-2">
                        <label className="label">{t("email")}</label>
                        <input
                            type="email"
                            className="input validator w-full"
                            placeholder="usuario@gmail.com"
                            required
                        />
                        <p className="validator-hint hidden">
                            {t("required_field")}
                        </p>
                    </fieldset>

                    <fieldset className="fieldset flex flex-col gap-2">
                        <label className="label">{t("password")}</label>
                        <input
                            type="password"
                            className="input validator w-full"
                            placeholder="********"
                            required
                            minLength={8}
                            // Mantenemos tu validación por patrón
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[A-Za-z0-9]{8,}"
                        />
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
    );
}

export default Login;