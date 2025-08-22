import localFont from 'next/font/local'
import { JetBrains_Mono } from 'next/font/google'

export const romaGothic = localFont({
  src: './fonts/ramagothicbold.ttf',
  variable: '--font-roma-gothic',
  display: 'swap',
})

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})