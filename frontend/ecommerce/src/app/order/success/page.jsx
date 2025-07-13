export default function OrderSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-600">
          Pembayaran Berhasil!
        </h1>
        <p className="mt-4 text-lg">Terima kasih telah melakukan pembelian.</p>
        <a
          href="/dashboard"
          className="mt-6 inline-block text-blue-500 underline"
        >
          Kembali ke Dashboard
        </a>
      </div>
    </div>
  );
}
