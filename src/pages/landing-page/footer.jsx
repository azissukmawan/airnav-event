import { Typography } from "../../components/typography";

export default function Footer() {
  return (
    <footer className="bg-white py-8 text-center text-sm text-gray-500">
      <Typography type="caption2" className="px-4 text-center md:px-0">
        Sistem untuk mengelola berbagai acara AirNav Indonesia secara efisien dan profesional.
      </Typography>
      <div className="mt-3">© 2025 AirNav Indonesia. All rights reserved.</div>
    </footer>
  );
}
