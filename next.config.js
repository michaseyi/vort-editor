/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: false,
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    {
                        key: 'cross-origin-opener-policy',
                        value: 'same-origin'
                    } , 
                    {
                        key: 'cross-origin-embedder-policy',
                        value: 'require-corp'
                    }
                ]
            }
        ]
    }
}

module.exports = nextConfig
