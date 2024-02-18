import Link from 'next/link'

type PropsType = {
	value: string
	isSelected: boolean
	iconPath: {
		outline: JSX.Element
		solid: JSX.Element
	}
}

export const SidemenuOption = ({ value, isSelected, iconPath }: PropsType) => {
	// searchはページ遷移せず、モーダル表示になる
	return value === 'search' ? (
		<li key={value} className={'cursor-pointer'}>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				fill={'none'}
				viewBox='0 0 24 24'
				strokeWidth={1.5}
				className='w-6 h-6 stroke-zinc-50'
				role='img'
				aria-label={value}
			>
				{iconPath.outline}
			</svg>
		</li>
	) : (
		<Link href={`/beta/${value.toLowerCase()}`}>
			<li key={value} className={''}>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					fill={'none'}
					viewBox='0 0 24 24'
					strokeWidth={1.5}
					className={
						isSelected ? 'w-6 h-6 fill-zinc-50' : 'w-6 h-6 stroke-zinc-50'
					}
					role='img'
					aria-label={value}
				>
					{isSelected ? iconPath.solid : iconPath.outline}
				</svg>
			</li>
		</Link>
	)
}
