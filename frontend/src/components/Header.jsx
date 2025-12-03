import { useNavigate } from "react-router";
import logo from '../assets/img/logo_no_background.webp'


function Header(){

    const hoverLink = 'hover:text-white transition duration-200'
    const navigate = useNavigate();


    return(
        <header className="bg-blue-300 flex items-center justify-between">
          <img src={logo} className="w-32 h-32 object-cover" alt="logo de la web" />
      <h1 onClick={() => navigate('/')} className="text-xl font-bold text-gray-800">
        Titulo Taller
      </h1>

      
      <nav className="pr-10">
        <ul className="flex space-x-6 text-lg font-medium">
          <li>
            <a onClick={() => navigate('/reservas')} className={hoverLink}>Reservas</a>
          </li>
          <li>
            <a onClick={() => navigate('/productos')} className={hoverLink}>Market</a>
          </li>
          <li>
            <a onClick={() => navigate('/sobre-nosotros')} className={hoverLink}>About</a>
          </li>
          <li>
            <a onClick={() => navigate('/login')} className={hoverLink}>Login</a>
          </li>
        </ul>
      </nav>
    </header>
    );
}

export default Header;