type SymbolPageProps = {
	params: {
		ticker: string
	}
}

export default function SymbolPage({ params }: SymbolPageProps) {
	return <div className='text-zinc-900'>{params.ticker}</div>
}
