export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const { linea } = req.body;

    const owner = "cesarl131481";
    const repo = "csv-backend-vercel";
    const branch = "main";
    const filePath = "registro.csv";

    const token = process.env.GITHUB_TOKEN;

    // 1️⃣ Leer archivo actual
    const fileResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    const fileData = await fileResponse.json();
    const contenidoActual = Buffer.from(
      fileData.content,
      "base64"
    ).toString("utf-8");

    // 2️⃣ Agregar nueva línea
    const nuevoContenido = contenidoActual + linea + "\n";
    const contenidoBase64 = Buffer.from(nuevoContenido).toString("base64");

    // 3️⃣ Subir archivo actualizado
    const updateResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify({
          message: "append registro.csv",
          content: contenidoBase64,
          sha: fileData.sha,
          branch: branch,
        }),
      }
    );

    if (!updateResponse.ok) {
      throw new Error("Error al actualizar el archivo");
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
