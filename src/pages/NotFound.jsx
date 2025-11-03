export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-6">Halaman tidak ditemukan</p>
      <a
        href="/"
        className="text-blue-600 hover:text-blue-800 underline transition"
      >
        Kembali ke Beranda
      </a>
    </div>
  );
}
