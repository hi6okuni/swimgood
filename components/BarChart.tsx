import {
	XAxis,
	YAxis,
	BarChart as RechartBarChart,
	Bar,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Label,
} from 'recharts'

type BarRechartProps = {
	data: { value: number }[]
	title: string
	width?: number
	height?: number
}

export const BarChart = ({
	data,
	title,
	width = 300,
	height = 300,
}: BarRechartProps) => {
	return (
		<div className='flex flex-col items-center m-4'>
			<span>{title}</span>
			<RechartBarChart
				data={data}
				margin={{ left: 0, top: 0, right: 10, bottom: 0 }}
				width={width}
				height={height}
			>
				<XAxis dataKey='date' tick={{ fontSize: 10 }} />
				<YAxis
					tick={{ fontSize: 10 }}
					tickFormatter={(value) => new Intl.NumberFormat('en').format(value)}
				/>
				<Legend align='center' wrapperStyle={{ fontSize: 9 }} />
				<Tooltip />
				<Bar
					type='monotone'
					fillOpacity='1'
					dataKey='value'
					stackId='1'
					stroke={'green'}
					fill={'green'}
				/>
			</RechartBarChart>
		</div>
	)
}
