export const authRec = (req, res, next) => {
  if (req.session.user.email == req.session.userEmail && req.session.user.role == "recruiter") {
    next();
  } else {
    res.render("recruiter-login", {
      message: "Login as Recruiter is required...",
      role: null,
      userName: null,
      userEmail: null,
    });
  }
};
