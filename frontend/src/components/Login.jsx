import { useNavigate, Link } from "react-router-dom";
// 1. Importamos el hook de traducción
import { useTranslation } from "react-i18next";
import fondo from "/img/web/fondo_log.webp";

function Login() {
    const navigate = useNavigate();
    
    // 2. Inicializamos la traducción usando el namespace 'formulario'
    const { t } = useTranslation("login");

    const handleLogin = (e) => {
        e.preventDefault();
        // Aquí se harán cosas sobre la base de datos en el futuro
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
                        {/* Título: Inicio de sesión / Login */}
                        <p>{t("title")}</p>
                    </div>

                    <fieldset className="fieldset flex flex-col gap-2">
                        {/* Label: Correo electrónico / Email Address */}
                        <label className="label">{t("email")}</label>
                        <input
                            type="email"
                            className="input validator w-full"
                            placeholder="usuario@gmail.com"
                            required
                        />
                        {/* Hint: Campo requerido */}
                        <p className="validator-hint hidden">
                            {t("required_field")}
                        </p>
                    </fieldset>

                    <fieldset className="fieldset flex flex-col gap-2">
                        {/* Label: Contraseña / Password */}
                        <label className="label">{t("password")}</label>
                        <input
                            type="password"
                            className="input validator w-full"
                            placeholder="********"
                            required
                            minLength={8}
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[A-Za-z0-9]{8,}"
                        />
                        {/* Error: Campo vacío o incorrecto */}
                        <span className="validator-hint hidden">
                            {t("invalid_field")}
                        </span>
                    </fieldset>

                    {/* Botón: Entrar / Login */}
                    <button type="submit" className="btn btn-neutral mt-4">
                        {t("btn_submit")}
                    </button>

                    {/* Botón: Limpiar / Reset */}
                    <button type="reset" className="btn btn-ghost mt-1">
                        {t("btn_reset")}
                    </button>

                    {/* Link: ¿Deseas registrarte? / Don't have an account? */}
                    <Link to="/registro" className="link link-hover mt-2">
                        {t("link_signup")}
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default Login;