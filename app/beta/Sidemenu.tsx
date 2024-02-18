import { useMemo } from 'react'
import { SidemenuOption } from './SidemenuOption'

export default function Sidemenu() {
	const options = useMemo(
		() => [
			{
				value: 'Analyse',
				iconPath: (
					<>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z'
						/>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z'
						/>
					</>
				),
			},
			{
				value: 'Mine',
				iconPath: (
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
					/>
				),
			},
		],
		[],
	)

	return (
		<div className='h-screen flex flex-col justify-center items-center bg-zinc-800 w-[60px] border-x-2	border-solid border-zinc-600'>
			<ul className='flex flex-col gap-y-3'>
				{options.map((option, _) => (
					<SidemenuOption
						key={option.value}
						value={option.value}
						isSelected={option.value === 'Analyse'}
						iconPath={option.iconPath}
					/>
				))}
			</ul>
		</div>
	)
}
