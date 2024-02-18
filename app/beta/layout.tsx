import Sidemenu from './Sidemenu'

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex'>
			<Sidemenu />
			{children}
		</div>
	)
}
