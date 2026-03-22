import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { name: 'Lun', ventas: 12 },
  { name: 'Mar', ventas: 19 },
  { name: 'Mié', ventas: 15 },
  { name: 'Jue', ventas: 82 },
  { name: 'Vie', ventas: 30 },
  { name: 'Sáb', ventas: 25 },
  { name: 'Dom', ventas: 18 },
];

export const VentasChart = () => (
  <div className="h-80 w-full bg-secondary-content p-4 rounded-xl shadow-xl mt-6">
    <h3 className="font-bold mb-4">Flujo de Ventas</h3>
    <ResponsiveContainer width="100%" height="90%">
      <LineChart data={data}>
        {/* Añadimos una cuadrícula sutil para mejorar la lectura */}
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
        <XAxis 
          dataKey="name" 
          axisLine={true} 
          tickLine={true} 
          tick={{fill: '#88888', fontSize: 12}} 
        />
        <YAxis 
          axisLine={true} 
          tickLine={true} 
          tick={{fill: '#88888', fontSize: 12}} 
        />
        <Tooltip 
          contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Line 
          type="monotone" 
          dataKey="ventas" 
          stroke="#ff6900" 
          strokeWidth={2} 
          dot={{ r: 3, fill: '#ff6900' }}
          activeDot={{ r: 6, fill: '#00fffd'}}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);