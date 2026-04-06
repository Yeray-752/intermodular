import { useState } from 'react';

function CarFinder() {
  const [plate, setPlate] = useState('');
  const [car, setCar] = useState(null);

  const searchCar = async () => {
    const response = await fetch(`http://localhost:5000/get-car/${plate}`);
    const data = await response.json();
    if(data.success) setCar(data.model);
  };

  return (
    <div>
      <input 
        type="text" 
        value={plate} 
        onChange={(e) => setPlate(e.target.value)} 
        placeholder="Introduce matrícula"
      />
      <button onClick={searchCar}>Buscar Coche</button>
      
      {car && <h2>Vehículo: {car}</h2>}
    </div>
  );
}

export default CarFinder;