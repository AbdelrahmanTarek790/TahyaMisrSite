/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "tmbackend.tahyamisryu.com",
            },
            {
                protocol: "https",
                hostname: "tmbackend.tahyamisryu.com",
            },
        ],
    },
}

export default nextConfig
