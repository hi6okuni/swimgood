import { ProfitAndLossStatement } from './ProfitAndLossStatement'

type SymbolPageProps = {
	params: {
		ticker: string
	}
}

export default async function SymbolPage({ params }: SymbolPageProps) {
	return (
		<>
			<div className='text-zinc-900'>{params.ticker}</div>
			<div>aaa</div>
			<ProfitAndLossStatement ticker={params.ticker} />
		</>
	)
}
