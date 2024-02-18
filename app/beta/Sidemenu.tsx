'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { SidemenuOption } from './SidemenuOption'

export default function Sidemenu() {
	const options = useMemo(
		() => [
			{
				value: 'search',
				iconPath: {
					outline: (
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
						/>
					),
					solid: (
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
						/>
					),
				},
			},
			{
				value: 'portfolio',
				iconPath: {
					outline: (
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
					solid: (
						<>
							<path
								fillRule='evenodd'
								d='M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z'
								clipRule='evenodd'
							/>
							<path
								fillRule='evenodd'
								d='M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3Z'
								clipRule='evenodd'
							/>
						</>
					),
				},
			},
			{
				value: 'profile',
				iconPath: {
					outline: (
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
						/>
					),
					solid: (
						<path
							fillRule='evenodd'
							d='M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z'
							clipRule='evenodd'
						/>
					),
				},
			},
		],
		[],
	)

	const pathname = usePathname()
	const selectedOption = options.find(
		// betaがまだ入っているので、splitで分割してから3番目を取得
		// betaが外れたら2番目を取得
		(option) => option.value === (pathname?.split('/')[2] || ''),
	)

	return (
		<div className='h-screen flex flex-col justify-center items-center bg-zinc-800 w-[60px] border-x-2	border-solid border-zinc-600'>
			<ul className='flex flex-col gap-y-6'>
				{options.map((option, _) => (
					<SidemenuOption
						key={option.value}
						value={option.value}
						isSelected={option.value === selectedOption?.value}
						iconPath={option.iconPath}
					/>
				))}
			</ul>
		</div>
	)
}
