import {
  XAxis, YAxis, BarChart, Bar, Tooltip, Legend, ResponsiveContainer
} from 'recharts'


export default function BarRechart({ data, title, color}) {
  return (
    <ResponsiveContainer width="95%" height="95%">
      <BarChart 
        data={data}
        margin={{left: -10, top: 0, right: 10, bottom: 0}}
      >
        <XAxis dataKey="date" tick={{ fontSize: 10}}/>
        <YAxis tick={{ fontSize: 10}} tickFormatter={(value) => new Intl.NumberFormat('en').format(value)}/>
        <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
        {title.map((e, index) => {
          return(
            <Bar type="monotone" fillOpacity="1" dataKey={e} stackId="1" stroke={color[index]} fill={color[index]} />
          )
        })}
      </BarChart>
    </ResponsiveContainer>
)}
