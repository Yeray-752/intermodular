import { useNavigate, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { loginSchema } from "../../schemas/loginSchema"
import { useState, useContext } from "react";
import fondo from "/img/web/fondo_log.webp";
import { AuthContext } from "../../context/AuthContext";
import ReCAPTCHA from "react-google-recaptcha";
import { GoogleLogin } from '@react-oauth/google';


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
            alert("Por favor, completa el captcha.");
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
                    password: data.password,
                    captchaToken: captchaToken
                }),
            });

            const json = await response.json();

            if (!response.ok) {
                alert(data.message || "Error al iniciar sesión, compruebe si su usuario o contraseña es correcta");
                return;
            }

            localStorage.setItem("token", json.token);
            localStorage.setItem("rol", json.rol);

            console.log("Login exitoso, actualizando contexto...");

            //si quieres comprar pero no tienes sesión, te manda al login, esta línea te manda de vuelta, y si no vienes
            // de ningun sitio, te manda a home
            const destino = location.state?.from?.pathname || "/";
            navigate(destino, { replace: true });

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
                            <ReCAPTCHA
                                sitekey="6LdVslcsAAAAAMbtWa8wBnuaYVmhM4O7h9mz7RMk"
                                onChange={(token) => setCaptchaToken(token)}
                                onExpired={() => setCaptchaToken(null)}
                            />
                        </div>
                        <div className="flex flex-col items-center gap-4 mt-6">
                            <div className="divider opacity-50 uppercase text-xs">O entra con</div>
                            <GoogleLogin
                                onSuccess={async (credentialResponse) => {
                                    try {
                                        const response = await fetch("http://localhost:3000/api/users/google-login", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ idToken: credentialResponse.credential }),
                                        });

                                        const json = await response.json();

                                        if (response.ok) {
                                            // 1. Guardar en localStorage
                                            localStorage.setItem("token", json.token);
                                            localStorage.setItem("rol", json.rol);

                                            // 2. ACTUALIZAR EL CONTEXTO (si tu función login espera el token)
                                            // login(json.token); 

                                            // 3. Redirigir (usando tu lógica de destino previo)
                                            const destino = location.state?.from?.pathname || "/";
                                            navigate(destino, { replace: true });
                                        } else {
                                            setErrors({ general: [json.error || "Error con Google"] });
                                        }
                                    } catch (error) {
                                        console.error("Error de red:", error);
                                        setErrors({ general: ["No se pudo conectar con el servidor"] });
                                    }
                                }}
                                onError={() => console.log('Error en Google Login')}
                                theme="filled_blue"
                                shape="circle"
                            />
                        </div>

                        <button type="submit" className="btn btn-neutral mt-2">
                            {t("btn_submit")}
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