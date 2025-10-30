import { Typography } from "../../components/typography";

export default function Footer() {
  return (
    <footer className="bg-white py-8 text-center text-sm text-gray-500 border-t">
      <Typography type="caption2">
        Event Manager AirNav adalah platform terpadu untuk mengelola seluruh
        kegiatan dan acara AirNav Indonesia secara efisien.
      </Typography>
      <div className="mt-3">© 2025 AirNav Indonesia. All rights reserved.</div>
    </footer>
  );
}
