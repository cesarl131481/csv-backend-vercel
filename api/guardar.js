export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { linea } = req.body;
  const nuevaLinea = linea + "\n";

  res.status(200).json({
    ok: true,
    recibida: nuevaLinea
  });
}
