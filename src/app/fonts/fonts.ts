import localFont from 'next/font/local'

export const geistMono = localFont({
  src: [
    {
      path: './GeistMono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './GeistMono-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-geist-mono'
})
