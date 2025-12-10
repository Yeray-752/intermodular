import fondo from "../assets/img/fondo_Registro.jpg";
import { useNavigate, Link } from "react-router-dom";
import Header from '../components/Header'
import Footer from '../components/Footer'

function SignUp() {
  const navigate = useNavigate();

  const handleRegistration = (e) => {
    e.preventDefault();
    //Aquí se harán cosas
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
            <p>Registro</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <fieldset className="fieldset flex flex-col">
              <label className="label">Nombre</label>
              <input
                type="text"
                className="input validator w-full"
                placeholder="Federico"
                required
              />
              <p className="validator-hint hidden">Este campo es requerido</p>
            </fieldset>


            <fieldset className="fieldset flex flex-col">
              <label className="label">Apellidos</label>
              <input
                type="text"
                className="input validator w-full"
                placeholder="Castillos Magallanes"
                required
              />
              <p className="validator-hint hidden">Este campo es requerido</p>
            </fieldset>
          </div>

          <fieldset className="fieldset flex flex-col">
            <label className="label">Correo electrónico</label>
            <input
              type="email"
              className="input validator w-full"
              placeholder="usuario@gmail.com"
              required
            />
            <p className="validator-hint hidden">Este campo es requerido</p>
          </fieldset>

          <fieldset className="fieldset flex flex-col">
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
              La contraseña nesesita cumplir los siguientes requisitos:
              <br />Hay que tener mínimo 8 carácteres.
              <br />Hay que tener por lo menos una mayúscula.
              <br />Hay que tener al menos un número.
              <br />no se permiten carácteres especiales "$,~,%,& o /".
            </span>
          </fieldset>

          <button type="submit" className="btn btn-neutral mt-4">
            Login
          </button>
          <button type="reset" className="btn btn-ghost mt-1">
            Reset
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;