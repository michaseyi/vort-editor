import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Open_Sans, Montserrat, Lato } from "next/font/google"

import "@/app/globals.css"
import Script from "next/script"

const inter = Inter({ subsets: ["cyrillic"] })
const jetbrains = JetBrains_Mono({ subsets: ["latin"] })
// const lato = Lato({ subsets: ["latin"], weight: ["400", "300", "700", "900"] })

export const metadata: Metadata = {
	title: "Untitled project - Vort",
	icons: { icon: "/icon2.png" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="">
			<head>
				<Script src="/Vort.js" strategy="beforeInteractive" />
			</head>
			<body className={jetbrains.className}>{children}</body>
		</html>
	)
}
