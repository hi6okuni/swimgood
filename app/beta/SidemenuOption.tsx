'use client'

import Link from 'next/link'
import { memo, useState } from 'react'
import { Tooltip } from './Tooltip'

type PropsType = {
	value: string
	isSelected: boolean
	iconPath: {
		outline: JSX.Element
		solid: JSX.Element
	}
}

export const SidemenuOption = memo(
	({ value, isSelected, iconPath }: PropsType) => {
		const [isHovered, setIsHovered] = useState(false)
		return (
			<OptionWrapper value={value}>
				<>
					<li
						key={value}
						className={'cursor-pointer'}
						onMouseEnter={() => setIsHovered(true)}
						onMouseLeave={() => setIsHovered(false)}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill={'none'}
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							className={
								isSelected ? 'w-6 h-6 fill-zinc-50' : 'w-6 h-6 stroke-zinc-400'
							}
							role='img'
							aria-label={value}
						>
							{isSelected && value !== 'search'
								? iconPath.solid
								: iconPath.outline}
						</svg>
					</li>
					<Tooltip isHovered={isHovered} value={value} />
				</>
			</OptionWrapper>
		)
	},
)

type OptionWrapperProps = {
	children: JSX.Element
	value: string
}

// searchはページ遷移せず、モーダル表示になる
const OptionWrapper = memo(({ children, value }: OptionWrapperProps) => {
	return value === 'search' ? (
		<div className='relative flex items-center'>{children}</div>
	) : (
		<Link
			href={`/beta/${value.toLowerCase()}`}
			className='relative flex items-center cursor-pointer' // `cursor-auto`ではなく`cursor-pointer`が適切かもしれません
		>
			{children}
		</Link>
	)
})
