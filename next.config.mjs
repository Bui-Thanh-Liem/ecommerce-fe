/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [new URL("https://www.lucidadvertising.com/**")],
  },
}

export default nextConfig
