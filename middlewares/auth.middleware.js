export const auth = (req, res, next) => {
  if (req.session.userEmail) {
    next();
  } else {
    res.render("recruiter-login", { message: "Login is required...", role: null, userName: null, userEmail: null });
  }
};
