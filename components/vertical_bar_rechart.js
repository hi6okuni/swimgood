import {
  XAxis, YAxis, BarChart, Bar, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

export default function VerticalBarRechart({ data, color}) {
  return (
    <ResponsiveContainer width="95%" height="95%">
      <BarChart
        data={data}
        margin={{left: 0, top: 5, right: 0, bottom: 5}}
      >
        <YAxis tick={{ fontSize: 10}} tickFormatter={(value) => new Intl.NumberFormat('en').format(value)}/>
        <XAxis dataKey="date" tick={{ fontSize: 10}}/>
        <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
        <Legend align="center"/>
        <Bar type="monotone" fillOpacity="1" dataKey="dio" stackId="1" stroke={color[0]} fill={color[0]} />
        <Bar type="monotone" fillOpacity="1" dataKey="dso" stackId="1" stroke={color[1]} fill={color[1]} />
        <Bar type="monotone" fillOpacity="1" dataKey="dpo" stackId="2" stroke={color[2]} fill={color[2]} />
        <Bar type="monotone" fillOpacity="1" dataKey="ccc" stackId="2" stroke={color[3]} fill={color[3]} />
      </BarChart>
    </ResponsiveContainer>
)}