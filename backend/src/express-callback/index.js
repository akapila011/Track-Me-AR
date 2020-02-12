module.exports = function makeExpressCallabck (controller) {
  return (req, res) => {
    const httpRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
      ip: req.ip,
      method: req.method,
      path: req.path,
      headers: {
          'Authorization': req.get('Authorization'),
        'Content-Type': req.get('Content-Type'),
        Referer: req.get('referer'),
        'User-Agent': req.get('User-Agent')
      }
    };
    controller(httpRequest)
      .then(httpResponse => {
        // console.log("in then ", httpResponse)
        if (httpResponse.headers) {
          res.set(httpResponse.headers)
        }
        if (httpResponse.cookies) {
            Object.keys(httpResponse.cookies).forEach(key => {
                const value = httpResponse.cookies[key];
                res.cookie(key,new String(value), { maxAge: 900000, httpOnly: true });
            });
        }
        res.type('json');
        res.status(httpResponse.statusCode).send(httpResponse.body);
      })
      .catch(e => {
          // console.log("in catch ", e)
          res.status(500).send({ type: "error", message: 'An unknown error occurred.' })
      });
  }
}
