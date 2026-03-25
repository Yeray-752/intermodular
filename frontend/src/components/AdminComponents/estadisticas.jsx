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
  <div className="h-64 w-full bg-base-100 p-4 rounded-xl shadow-xl mt-6">
    <h3 className="font-bold mb-4">Flujo de Ventas</h3>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{fill: '#888', fontSize: 12}} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{fill: '#888', fontSize: 12}} 
        />
        <Tooltip 
          contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Line 
          type="monotone" 
          dataKey="ventas" 
          stroke="#570df8" 
          strokeWidth={3} 
          dot={{ r: 4, fill: '#570df8' }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);