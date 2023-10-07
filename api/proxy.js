import fetch from "node-fetch";

export default async (req, res) => {
  const { domain, path } = req.query;
  const targetUrl = `https://${domain}/${path}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: req.headers,
    });

    const responseBody = await response.text();
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("text/html")) {
      const modifiedBody = responseBody.replace(
        /<head>/,
        '<head><base href="https://' + domain + '/">'
      );
      res.setHeader("content-type", contentType);
      res.send(modifiedBody);
    } else {
      res.setHeader("content-type", contentType);
      res.send(responseBody);
    }
  } catch (error) {
    res.status(500).send("Error processing the request.");
  }
};
