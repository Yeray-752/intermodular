import fondo from "/img/web/fondo_log.webp";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { loginSchema } from "../schemas/loginSchema"
import { useState } from "react";


function Login() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const handleLogin = (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        
        const result = loginSchema.safeParse(data);

        if (!result.success) {
            const formattedErrors = result.error.flatten().fieldErrors;
            setErrors(formattedErrors);
            return; 
        }

        setErrors({});
        console.log("Datos válidos, enviando login...", result.data);
        navigate("/");
        // Aquí iría tu fetch o llamada a Firebase/Auth
    };

    return (
        <div className="w-screen h-screen flex justify-center items-center bg-cover bg-center relative" style={{ backgroundImage: `url(${fondo})` }}>
      <div className="absolute inset-0 backdrop-blur-md bg-black/30" />
      <div className="relative z-10">
        <form className="fieldset bg-base-200 border-base-300 rounded-box w-md border-2 p-4 flex flex-col gap-4" onSubmit={handleLogin}>
          <div className="text-2xl">
            <p>Inicio de sesión.</p>
          </div>

          <fieldset className="fieldset flex flex-col gap-2">
            <label className="label">Correo electrónico</label>
            <input
              name="email" 
              type="email"
              className={`input w-full ${errors.email ? 'border-error' : ''}`}
              placeholder="usuario@gmail.com"
            />
            {errors.email && (
              <span className="text-error text-sm">{errors.email[0]}</span>
            )}
          </fieldset>

          <fieldset className="fieldset flex flex-col gap-2">
            <label className="label">Contraseña</label>
            <input
              name="password" 
              type="password"
              className={`input w-full ${errors.password ? 'border-error' : ''}`}
              placeholder="Contraseña_123"
            />
            {errors.password && (
              <span className="text-error text-sm">{errors.password[0]}</span>
            )}
          </fieldset>

          <button type="submit" className="btn btn-neutral mt-4">Login</button>
          <button type="reset" className="btn btn-ghost mt-1" onClick={() => setErrors({})}>Reset</button>

          <Link to="/registro" className="link link-hover mt-2">¿Deseas registrarte?</Link>
        </form>
      </div>
    </div>
    );
}

export default Login;