export default async function handler(req, res) {
  const target = "https://steffmetz.appswifts.com/api";
  const path = req.url.replace(/^\/api/, "") || "/";

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(200).end();
  }

  try {
    const headers = {
      "Accept": "application/json",
      "User-Agent": "Vercel-Proxy/1.0",
    };

    if (req.headers["content-type"]) {
      headers["Content-Type"] = req.headers["content-type"];
    }
    if (req.headers["authorization"]) {
      headers["Authorization"] = req.headers["authorization"];
    }

    const fetchOptions = {
      method: req.method,
      headers,
    };

    if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
      fetchOptions.body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    }

    const response = await fetch(target + path, fetchOptions);
    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await response.json() : await response.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(response.status);
    res.json(data);
  } catch (error) {
    res.status(502).json({ success: false, message: "API proxy error" });
  }
}
