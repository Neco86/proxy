import fetch from "node-fetch";

export default async (req, res) => {
  const { target, http, ...others } = req.query;

  if (!target) {
    res.send(null);
    return;
  }

  const targetUrl = `http${http ? '' : 's'}://${target}${req.url}?${Object.keys(others).map(key => `${key}=${others[key]}`).join("&")}`;

  req.headers.host = target;

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
        `<head><base href="http${http ? '' : 's'}://${target}/">`
      );
      res.setHeader("content-type", contentType);
      res.send(modifiedBody);
    } else {
      res.setHeader("content-type", contentType);
      res.send(responseBody);
    }
  } catch (error) {
    console.log(error)
    res.status(500).send("Error processing the request.");
  }
};
