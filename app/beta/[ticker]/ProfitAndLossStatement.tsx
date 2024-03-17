import { convertToMillions } from '../../../utils/convert'
import BarChart from './BarChart'

async function getPLData(ticker: string) {
	const apiKey = process.env.FMP_API_KEY
	const res = await fetch(
		`https://financialmodelingprep.com/api/v3/income-statement/${ticker}?limit=10&apikey=${apiKey}`,
	)
	if (!res.ok) {
		throw new Error('Failed to fetch')
	}
	const data = await res.json()
	return data
}

type PropsType = {
	ticker: string
}

export const ProfitAndLossStatement = async ({ ticker }: PropsType) => {
	const data = await getPLData(ticker)

	const revenue = data
		.map((item: any) => {
			return { value: convertToMillions(item.revenue) }
		})
		.reverse()

	return (
		<>
			<div className='text-zinc-900'>{ticker}</div>
			<BarChart data={revenue} title='revenue' width={300} height={300} />
		</>
	)
}
