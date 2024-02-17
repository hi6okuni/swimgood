import Sidemenu from "./Sidemenu";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<Sidemenu />
			{children}
		</div>
	);
}
