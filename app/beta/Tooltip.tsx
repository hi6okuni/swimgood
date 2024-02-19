import { memo } from 'react'

type PropsType = {
	value: string
	isHovered: boolean
}

export const Tooltip = memo(({ value, isHovered }: PropsType) => {
	const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
	return (
		<div
			className={[
				'text-xs whitespace-nowrap text-zinc-50 bg-zinc-950 absolute left-7 rounded-lg px-3 py-2 transition duration-300 opacity-0',
				isHovered && 'opacity-100 translate-x-1',
			]
				.filter(Boolean)
				.join(' ')}
		>
			{capitalizedValue}
		</div>
	)
})
