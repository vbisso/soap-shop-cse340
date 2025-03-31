const flashMessages = (req, res, next) => {
  if (!req.session) {
    throw new Error(
      "Flash middleware requires session support. Use `express-session`."
    );
  }

  // Initialize flash storage
  //console.log(req.session);
  req.session.flash = req.session.flash || [];

  // Define `req.flash` to add messages
  req.flash = (type, message) => {
    req.session.flash.push({ type, message });
  };

  // Move flash messages to `res.locals.flash` for use in templates
  res.locals.flash = [...req.session.flash];

  req.session.flash = [];

  // Clear flash messages **after the response is sent**
  // req.session.save(() => {
  //   if (!req.session) {
  //     return;
  //   }
  //   req.session.flash = [];
  // });

  next();
};

export default flashMessages;
