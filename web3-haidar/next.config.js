/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        // Legacy avatar/character images currently hosted on ibb.co.
        // Kept so existing image URLs in About/Index keep working
        // until they are migrated into Cloudinary via the admin panel.
        protocol: "https",
        hostname: "i.ibb.co",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  async headers() {
    return [
      {
        // Applies to every route, including /admin — these are standard
        // defensive headers with no functional downside for this app.
        source: "/:path*",
        headers: [
          // Prevents this site from being embedded in an iframe on another
          // domain, which blocks clickjacking attacks against the admin
          // login page.
          { key: "X-Frame-Options", value: "DENY" },
          // Stops the browser from MIME-sniffing responses into an
          // executable type.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Limits how much referrer information is leaked to external
          // sites when a link is clicked.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Disables powerful browser APIs this app never uses.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
