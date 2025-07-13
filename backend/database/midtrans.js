import midtransClient from 'midtrans-client';

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY, // Ganti dengan server key kamu
  clientKey: process.env.MIDTRANS_CLIENT_KEY, // Ganti jika pakai di frontend
});

export default snap