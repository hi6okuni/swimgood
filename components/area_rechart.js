import {
   AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

export default function AreaRechart({ data, keyword, color }) {
  return (
      <React.Fragment>
        {
          (() => {
            if ( keyword.length && keyword === "profit") {
              return(
                <React.Fragment>
                  <ResponsiveContainer width="95%" height="95%">
                    <AreaChart
                      data={data}
                      margin={{
                        top: 5, right: 0, left: 0, bottom: 10,
                      }}
                    >
                      <XAxis dataKey="date" tick={{ fontSize: 11}}/>
                      <YAxis tick={{ fontSize: 11}} tickFormatter={(value) => new Intl.NumberFormat('en').format(value)}/>
                      <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                      <Area type="monotone" fillOpacity="0.8" dataKey="純利益" stackId="1" stroke={color[3]} fill={color[3]} />
                      <Area type="monotone" fillOpacity="0.8" dataKey="非営業費用" stackId="1" stroke={color[2]} fill={color[2]} />
                      <Area type="monotone" fillOpacity="0.8" dataKey="営業費用" stackId="1" stroke={color[1]} fill={color[1]} />
                      <Area type="monotone" fillOpacity="0.8" dataKey="原価" stackId="1" stroke={color[0]} fill={color[0]} />
                    </AreaChart>
                  </ResponsiveContainer>
                </React.Fragment>
              );
            } else if ( keyword.length && keyword === "profitR") {
              return(
                <ResponsiveContainer width="95%" height="95%">
                  <AreaChart 
                    data={data}
                    margin={{left: 5, top: 0, right: 0, bottom: 10}}
                  >
                    <XAxis dataKey="date" tick={{ fontSize: 11}}/>
                    <YAxis unit="%" tick={{ fontSize: 11}} tickFormatter={(value) => new Intl.NumberFormat('en').format(value)}/>
                    <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                    <Area type="monotone" fillOpacity="0.8" dataKey="純利益率" stackId="1" stroke={color[3]} fill={color[3]} />
                    <Area type="monotone" fillOpacity="0.8" dataKey="非営業費用率" stackId="1" stroke={color[2]} fill={color[2]} />
                    <Area type="monotone" fillOpacity="0.8" dataKey="営業費用率" stackId="1" stroke={color[1]} fill={color[1]} />
                    <Area type="monotone" fillOpacity="0.8" dataKey="原価率" stackId="1" stroke={color[0]} fill={color[0]} />
                  </AreaChart>
                </ResponsiveContainer>
              );
            } else if (keyword.length && keyword === "expense") {
              return (
                <ResponsiveContainer width="95%" height="95%">
                  <AreaChart 
                    data={data}
                    margin={{left: 5, top: 0, right: 0, bottom: 10}}
                  >
                    <XAxis dataKey="date" tick={{ fontSize: 11}}/>
                    <YAxis tick={{ fontSize: 11}} tickFormatter={(value) => new Intl.NumberFormat('en').format(value)}/>
                    <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                    <Area type="monotone" fillOpacity="0.8" dataKey="販管費" stackId="1" stroke={color[1]} fill={color[1]} />
                    <Area type="monotone" fillOpacity="0.8" dataKey="研究開発費" stackId="1" stroke={color[0]} fill={color[0]} />
                  </AreaChart>
                </ResponsiveContainer>
              );
            } else if (keyword.length && keyword === "ebitda") {
              return (
                <ResponsiveContainer width="95%" height="95%">
                  <AreaChart
                    data={data}
                    margin={{
                      top: 5, right: 25, left: 0, bottom: 5,
                    }}
                  >
                    <XAxis dataKey="date" tick={{ fontSize: 11}}/>
                    <YAxis tick={{ fontSize: 11}} tickFormatter={(value) => new Intl.NumberFormat('en').format(value)}/>
                    <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                    <Area type="monotone" fillOpacity="0.8" dataKey="純利益" stackId="1" stroke={color[3]} fill={color[3]} />
                    <Area type="monotone" fillOpacity="0.8" dataKey="税金費用" stackId="1" stroke={color[2]} fill={color[2]} />
                    <Area type="monotone" fillOpacity="0.8" dataKey="支払利息" stackId="1" stroke={color[1]} fill={color[1]} />
                    <Area type="monotone" fillOpacity="0.8" dataKey="減価償却" stackId="1" stroke={color[0]} fill={color[0]} />
                  </AreaChart>
                </ResponsiveContainer>
              );
            } 
          })()
        }
      </React.Fragment>
      )
    }

