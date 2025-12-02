


function Header(){

    const hoverLink = 'hover:text-white transition duration-200'


    return(
        <header className="bg-blue-300 p-4 flex items-center justify-between">

      <h1 className="text-xl font-bold text-gray-800">
        Titulo Taller
      </h1>

      
      <nav>
        <ul className="flex space-x-6 text-lg font-medium">
          <li>
            <a href="#" className={hoverLink}>Reservas</a>
          </li>
          <li>
            <a href="#" className={hoverLink}>Market</a>
          </li>
          <li>
            <a href="#" className={hoverLink}>About</a>
          </li>
          <li>
            <a href="#" className={hoverLink}>Login</a>
          </li>
        </ul>
      </nav>
    </header>
    );
}

export default Header;