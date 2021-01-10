import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, BarChart, Bar, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'


export default function BarRechart({ data, title, color}) {
  return (
    <ResponsiveContainer width="95%" height="95%">
      <BarChart 
        data={data}
        margin={{left: -10, top: 0, right: 10, bottom: 0}}
      >
        <XAxis dataKey="date" tick={{ fill: 'white' , fontSize: 10}}/>
        <YAxis tick={{ fill: 'white' , fontSize: 10}} tickFormatter={(value) => new Intl.NumberFormat('en').format(value)}/>
        <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
        {title.map((e, index) => {
          return(
            <Bar type="monotone" fillOpacity="1" dataKey={e} stackId="1" stroke={color[index]} fill={color[index]} />
          )
        })}
      </BarChart>
    </ResponsiveContainer>
)}
