import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';




export const VentasChart = ({data}) => (
  <div className="h-80 w-full bg-base-300 text-base-content p-4 rounded-xl shadow-xl mt-6">
    <h3 className="font-bold mb-4">Flujo de Ventas</h3>
    <ResponsiveContainer width="100%" height="90%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3"  vertical={true} stroke="var(--color-base-content)" />
        <XAxis
          dataKey="name"
          axisLine={true}
          tickLine={true}
          tick={{ fill: 'var(--color-base-content)', fontSize: 12 }}
         
        />
        <YAxis
          axisLine={true}
          tickLine={true}
          tick={{ fill: 'var(--color-base-content)', fontSize: 12 }}
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
          activeDot={{ r: 6, fill: '#00fffd' }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);