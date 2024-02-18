type PropsType = {
	value: string
	isSelected: boolean
	iconPath: JSX.Element
}

export const SidemenuOption = ({ value, isSelected, iconPath }: PropsType) => {
	return (
		<li key={value} className={''}>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				fill={'none'}
				viewBox='0 0 24 24'
				strokeWidth={1.5}
				className='w-6 h-6 stroke-zinc-50'
				role='img'
				aria-label={value}
			>
				{iconPath}
			</svg>
		</li>
	)
}
