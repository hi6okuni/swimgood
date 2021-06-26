import {
  ComposedChart, Brush, XAxis, YAxis, BarChart, Bar, Area, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

export default function ComposedRechart({ data, color, keyword}) {
  return (
  <React.Fragment>
    {
      (() => {
        if ( keyword.length && keyword === "cfs") {
          return(
            <React.Fragment>
              <ResponsiveContainer width="95%" height="95%">
                <ComposedChart 
                  data={data}
                  margin={{top: 5, right: 0, left: 0, bottom: 10}}
                >
                  <XAxis dataKey="date" tick={{ fontSize: 11}}/>
                  <YAxis tick={{ fontSize: 11}} tickFormatter={(value) => new Intl.NumberFormat('en').format(value)}/>
                  <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                  <Legend align="center" wrapperStyle={{ fontSize: 9}}/>
                  <Area type="monotone" dataKey="operatingCashFlow"  fillOpacity="0.4" stroke={color.yellow} fill={color.yellow} />
                  <Bar dataKey="capitalExpenditure" stackId="1"  fill={color.pink3} />
                  <Bar dataKey="acquisitionsNet" stackId="1"  fill={color.pink2} />
                  <Bar dataKey="debtRepayment" stackId="1"  fill={color.pink1} />
                  <Bar dataKey="returnToShareholders" stackId="1"  fill={color.blue} />
                  <Brush dataKey="name" height={10} stroke="#656565"/>
                </ComposedChart>
              </ResponsiveContainer>
            </React.Fragment>
          );
        } else if ( keyword.length && keyword === "profit") {
          return(
            <ResponsiveContainer width="95%" height="95%">
              <BarChart
                data={data}
                margin={{top: 5, right: 0, left: 0, bottom: 10}}
              >
                <XAxis dataKey="date" tick={{ fontSize: 11}}/>
                <YAxis  tick={{ fontSize: 11}} tickFormatter={(value) => new Intl.NumberFormat('en').format(value)}/>
                <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                <Legend align="center" wrapperStyle={{ fontSize: 9}}/>
                <Bar dataKey="totalStockholdersEquity" stackId="a" fill={color.green} />
                <Bar dataKey="totalLiabilities"  stackId="a" fill={color.dark_green} />
                <Bar dataKey="netIncome" stackId="b" fill={color.purple} />
                <Bar dataKey="costs"  stackId="b" fill={color.dark_purple} />
              </BarChart>
            </ResponsiveContainer>
          );
        } else if ( keyword.length && keyword === "bsDebit") {
          return(
            <ResponsiveContainer width="90%" height="90%">
              <BarChart
                data={data}
                margin={{
                  top: 5, right: 0, left: 0, bottom: 5,
                }}
                barGap={0}
              >
                <XAxis dataKey="date" tick={{ fontSize: 11}}/>
                <YAxis  tick={{ fontSize: 11}} tickFormatter={(value) => new Intl.NumberFormat('en').format(value)}/>
                <Legend align="center" margin={{top: 0, right: 10, left: 10, bottom: 0}} wrapperStyle={{ fontSize: 9}}/>
                <Bar dataKey="otherNonCurrentAssets"  stackId="a" fill={color.debit6} />
                <Bar dataKey="propertyPlantEquipmentNet"  stackId="a" fill={color.debit5} />
                <Bar dataKey="otherCurrentAssets" stackId="a" fill={color.debit4} />
                <Bar dataKey="inventory"  stackId="a" fill={color.debit3} />
                <Bar dataKey="netReceivables"  stackId="a" fill={color.debit2} />
                <Bar dataKey="cashAndCashEquivalents" stackId="a" fill={color.debit1} />
              </BarChart>
            </ResponsiveContainer>
          );
        } else if ( keyword.length && keyword === "bsDebitR") {
          return(
            <ResponsiveContainer width="90%" height="90%">
              <BarChart
                data={data}
                margin={{
                  top: 5, right: 0, left: 0, bottom: 5,
                }}
                barGap={0}
              >
                <XAxis dataKey="date" tick={{ fontSize: 11}}/>
                <YAxis  tick={{ fontSize: 11}} tickFormatter={(value) => new Intl.NumberFormat('en').format(value)}/>
                <Legend align="center"/>
                <Bar dataKey="otherNonCurrentAssetsR"  stackId="a" fill={color.debit6} />
                <Bar dataKey="propertyPlantEquipmentNetR"  stackId="a" fill={color.debit5} />
                <Bar dataKey="otherCurrentAssetsR" stackId="a" fill={color.debit4} />
                <Bar dataKey="inventoryR"  stackId="a" fill={color.debit3} />
                <Bar dataKey="netReceivablesR"  stackId="a" fill={color.debit2} />
                <Bar dataKey="cashAndCashEquivalentsR" stackId="a" fill={color.debit1} />
              </BarChart>
            </ResponsiveContainer>
          );
        } else if ( keyword.length && keyword === "bsCredit") {
          return(
            <ResponsiveContainer width="90%" height="90%">
              <BarChart
                data={data}
                margin={{
                  top: 5, right: 0, left: 0, bottom: 5,
                }}
                barGap={0}
              >
                <XAxis dataKey="date" tick={{ fill: 'white' , fontSize: 11}}/>
                <YAxis  tick={{ fill: 'white' , fontSize: 11}} tickFormatter={(value) => new Intl.NumberFormat('en').format(value)}/>
                <Legend align="center"/>
                <Bar dataKey="otherNonCurrentAssetsR"  stackId="a" fill={color.blue} />
                <Bar dataKey="propertyPlantEquipmentNetR"  stackId="a" fill={color.purple} />
                <Bar dataKey="otherCurrentAssetsR" stackId="a" fill={color.green} />
                <Bar dataKey="inventoryR"  stackId="a" fill={color.purple} />
                <Bar dataKey="netReceivablesR"  stackId="a" fill={color.blue} />
                <Bar dataKey="cashAndCashEquivalentsR" stackId="a" fill={color.red} />
              </BarChart>
            </ResponsiveContainer>
          );
        } 
      })()
    }
  </React.Fragment>
)}