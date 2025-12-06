import fondo from "../assets/img/fondo_log.webp";
import { useNavigate } from "react-router";

function Login() {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        //Aquí se harán cosas sobre la base de datos
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
                        <p>Inicio de sesión.</p>
                    </div>
                    <fieldset className="fieldset flex flex-col gap-2">
                        <label className="label">Correo electrónico</label>
                        <input
                            type="email"
                            className="input validator w-full"
                            placeholder="usuario@gmail.com"
                            required
                        />
                        <p className="validator-hint hidden">Este campo es requerido</p>
                    </fieldset>

                    <fieldset className="fieldset flex flex-col gap-2">
                        <label className="label">Contraseña</label>
                        <input
                            type="password"
                            className="input validator w-full"
                            placeholder="Contraseña_123"
                            required
                            minLength={8}
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[A-Za-z0-9]{8,}"
                        />
                        <span className="validator-hint hidden">
                            Este campo está vacío o es incorrecto.
                        </span>
                    </fieldset>

                    <button type="submit" className="btn btn-neutral mt-4">
                        Login
                    </button>
                    <button type="reset" className="btn btn-ghost mt-1">
                        Reset
                    </button>

                    <Link to="/registro" className="link link-hover mt-2">
                        ¿Deseas registrarte?
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default Login;
