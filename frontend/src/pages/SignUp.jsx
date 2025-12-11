import fondo from "../assets/img/fondo_Registro.jpg";
import { useNavigate, Link } from "react-router-dom";
import Header from '../components/Header'
import SignUp from '../components/SignUp'


function App() {
  return (
    <div>
      <Header />
      <SignUp />
    </div>


  );
}

export default App;