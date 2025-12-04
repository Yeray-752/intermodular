import { useNavigate } from "react-router";
import logo from '../assets/img/logo_no_background.webp'


function Header(){

    const hoverLink = 'text-blue-600 hover:text-white transition duration-200'
    const navigate = useNavigate();


    return(
        <header className="bg-gray-100 flex items-center justify-between pl-50">
          <img src={logo} className="w-20 h-20 object-cover" alt="logo de la web" />
          <h1 onClick={() => navigate('/')} className="text-xl font-bold text-black">Akotan</h1>

      <nav className="pr-50">
        <ul className="flex space-x-5 text-lg font-bold">
          <li>
            <a href="#" onClick={() => navigate('/reservas')} className={hoverLink}>Reservas</a>
          </li>
          <li>
            <a href="#" onClick={() => navigate('/productos')} className={hoverLink}>Market</a>
          </li>
          <li>
            <a href="#" onClick={() => navigate('/sobre-nosotros')} className={hoverLink}>About</a>
          </li>
          <li>
            <a href="#" onClick={() => navigate('/login')} className={hoverLink}>Login</a>
          </li>
        </ul>
      </nav>
    </header>
    );
}

export default Header;