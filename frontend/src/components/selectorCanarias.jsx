import React, { useState } from 'react';

const datosCanarias = {
  "Tenerife": ["Adeje", "Arafo", "Arico", "Arona", "Buenavista del Norte", "Candelaria", "El Rosario", "El Sauzal", "El Tanque", "Fasnia", "Garachico", "Granadilla de Abona", "Guía de Isora", "Güímar", "Icod de los Vinos", "La Guancha", "La Matanza de Acentejo", "La Orotava", "La Victoria de Acentejo", "Los Realejos", "Los Silos", "Puerto de la Cruz", "San Cristóbal de La Laguna", "San Juan de la Rambla", "San Miguel de Abona", "Santa Cruz de Tenerife", "Santa Úrsula", "Santiago del Teide", "Tacoronte", "Tegueste", "Vilaflor de Chasna"],
  "Gran Canaria": ["Agaete", "Agüimes", "Artenara", "Arucas", "Firgas", "Gáldar", "Ingenio", "La Aldea de San Nicolás", "Las Palmas de Gran Canaria", "Mogán", "Moya", "San Bartolomé de Tirajana", "Santa Brígida", "Santa Lucía de Tirajana", "Santa María de Guía de Gran Canaria", "Tejeda", "Telde", "Teror", "Valleseco", "Valsequillo de Gran Canaria", "Vega de San Mateo"],
  "Lanzarote": ["Arrecife", "Haría", "San Bartolomé", "Teguise", "Tías", "Tinajo", "Yaiza"],
  "Fuerteventura": ["Antigua", "Betancuria", "La Oliva", "Pájara", "Puerto del Rosario", "Tuineje"],
  "La Palma": ["Barlovento", "Breña Alta", "Breña Baja", "El Paso", "Fuencaliente de la Palma", "Garafía", "Los Llanos de Aridane", "Puntagorda", "Puntallana", "San Andrés y Sauces", "Santa Cruz de la Palma", "Tazacorte", "Tijarafe", "Villa de Mazo"],
  "La Gomera": ["Agulo", "Alajeró", "Hermigua", "San Sebastián de la Gomera", "Valle Gran Rey", "Vallehermoso"],
  "El Hierro": ["El Pinar de El Hierro", "La Frontera", "Valverde"]
};

const SelectorCanarias = () => {
  const [isla, setIsla] = useState("");
  const [municipio, setMunicipio] = useState("");

  const handleIslaChange = (e) => {
    setIsla(e.target.value);
    setMunicipio("");
  };

  return (
    <div className="w-full max-w-4xl p-6 bg-white rounded-xl shadow-md border border-gray-100 mt-5 mb-5">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Ubicación en Canarias</h2>
      
      {/* Contenedor Horizontal con Flexbox */}
      <div className="flex flex-col md:flex-row gap-6 items-end">
        
        {/* Selector de Isla */}
        <div className="w-full md:w-1/2 group">
          <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600">
            Isla
          </label>
          <select 
            value={isla} 
            onChange={handleIslaChange}
            className="w-full h-11 px-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer hover:bg-white"
          >
            <option value="">Selecciona isla...</option>
            {Object.keys(datosCanarias).sort().map(i => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>

        {/* Selector de Municipio */}
        <div className="w-full md:w-1/2 group">
          <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600">
            Municipio
          </label>
          <select 
            value={municipio} 
            onChange={(e) => setMunicipio(e.target.value)}
            disabled={!isla}
            className={`w-full h-11 px-4 text-sm rounded-lg border outline-none transition-all cursor-pointer
              ${!isla 
                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-white'
              }`}
          >
            <option value="">Selecciona municipio...</option>
            {isla && datosCanarias[isla].sort().map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Badge de confirmación */}
      {municipio && (
        <div className="mt-6 flex items-center gap-2 text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-100 animate-fade-in">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm">
            Localizado en <strong>{municipio}</strong>, {isla}.
          </span>
        </div>
      )}
    </div>
  );
};

export default SelectorCanarias;