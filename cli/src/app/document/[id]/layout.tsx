// Updated DocumentLayout.tsx
import Link from "next/link";

export default function DocumentLayout({children}: {children: React.ReactNode}) {
    return (
        <>
            <ol className="flex items-center whitespace-nowrap h-10 px-10">
                <li className="inline-flex items-center">
                    <Link className="flex items-center text-sm text-gray-200 hover:text-blue-600 focus:outline-hidden focus:text-blue-600 dark:text-neutral-300 dark:hover:text-blue-500 dark:focus:text-blue-500" href="/">
                        Home
                    </Link>
                    <svg className="shrink-0 mx-2 size-4 text-gray-200 dark:text-neutral-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6"></path>
                    </svg>
                </li>
            </ol>
            <main>{children}</main>
        </>
    )
}