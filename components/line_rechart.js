import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts'


export default function LineRechart({ data, title, color}) {
  return (
    <ResponsiveContainer width="95%" height="95%">
      <LineChart 
        data={data}
        margin={{left: 0, top: 0, right: 10, bottom: 0}}
      >
        <XAxis dataKey="date" tick={{ fontSize: 10}}/>
        <YAxis unit="%" tick={{ fontSize: 10}} tickFormatter={(value) => new Intl.NumberFormat('en').format(value)}/>
        { title.length > 1 ? <Legend align="center" wrapperStyle={{ fontSize: 9}} /> : null }
        <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
        {title.map((e, index) => (
          <Line type="monotone" fillOpacity="1" dataKey={e} stackId="1" stroke={color[index]} fill={color[index]} />
        ))}
      </LineChart>
    </ResponsiveContainer>
)}