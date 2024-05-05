import Recruiter from "../model/rec.model.new.js";

export default class RecruiterController {
  renderFrontPage(req, res) {
    let lastvisit = req.cookies.lastVisit || null;
    console.log(lastvisit);
    if (req.session.userEmail) {
      return res.render("front-page.ejs", {
        message: `Welcome, ${req.session.user.name}`,
        role: req.session.user.role,
        userName: req.session.user.name,
        userEmail: req.session.userEmail,
        lastVisit: lastvisit,
      });
    }
    return res.render("front-page.ejs", {
      message: null,
      role: null,
      userName: null,
      userEmail: null,
      lastVisit: lastvisit,
    });
  }

  renderRegistrationPage(req, res) {
    let lastvisit = req.cookies.lastVisit || null;
    res.render("recruiter-register", {
      message: null,
      role: null,
      userName: null,
      userEmail: null,
      lastVisit: lastvisit,
    });
  }

  renderLoginPage(req, res) {
    let lastvisit = req.cookies.lastVisit || null;
    res.render("recruiter-login", {
      message: null,
      role: null,
      userName: null,
      userEmail: null,
      lastVisit: lastvisit,
    });
  }

  async viewApplicants(req, res) {
    const recruitingPerson = await Recruiter.searchRecruiterByEmail(req.session.userEmail);
    const applicants = await Recruiter.getAllApplicants(recruitingPerson);
    let lastvisit = req.cookies.lastVisit || null;
    return res.render("all-jobseekers", {
      allJobSeekers: applicants,
      message: "Displaying all Applicants to the Jobs you have posted....",
      role: "recruiter",
      userName: req.session.user.name,
      userEmail: req.session.userEmail,
      lastVisit: lastvisit,
    });
  }
  async addNewJob(req, res) {
    const { company, type, designation, salary, location, vacancies, experience, skills, description } = req.body;
    const employer = await Recruiter.searchRecruiterByEmail(req.session.userEmail);
    try {
      await Recruiter.addNewJob(
        company,
        type,
        designation,
        salary,
        location,
        vacancies,
        experience,
        skills,
        description,
        employer
      );
      const allJobs = await Recruiter.getAllJobs();
      let lastvisit = req.cookies.lastVisit || null;
      return res.render("all-jobs", {
        allJobs,
        message: null,
        role: req.session.user.role,
        userName: req.session.user.name,
        userEmail: req.session.userEmail,
        lastVisit: lastvisit,
      });
    } catch (err) {
      console.log("Conctroller Method add New JOb Failed...", err);
    }
  }

  async deleteJob(req, res) {
    const iD = req.params.id;
    const result = await Recruiter.deleteJob(iD, req.session.userEmail);
    const allJobs = await Recruiter.getAllJobs();
    let lastvisit = req.cookies.lastVisit || null;
    if (result.success) {
      return res.render("all-jobs", {
        allJobs,
        message: `The Job has been Successfully Deleted... `,
        role: "recruiter",
        userName: req.session.user.name,
        userEmail: req.session.userEmail,
        lastVisit: lastvisit,
      });
    } else {
      return res.render("all-jobs", {
        allJobs,
        message: `The Job you want to delete not found in the record... `,
        role: "recruiter",
        userName: req.session.user.name,
        userEmail: req.session.userEmail,
        lastVisit: lastvisit,
      });
    }
  }

  async renderUpdateJobPage(req, res) {
    let lastvisit = req.cookies.lastVisit || null;
    try {
      const id = req.params.id;
      const recruiteR = await Recruiter.searchRecruiterByEmail(req.session.userEmail);
      const jobToUpdate = await Recruiter.searchJobById(id, recruiteR);

      // Once all asynchronous operations are completed, render the page
      res.render("update-job-form", {
        job: jobToUpdate,
        message: null,
        role: "recruiter",
        userName: eq.session.user.name,
        userEmail: req.session.userEmail,
        lastVisit: lastvisit,
      });
    } catch (error) {
      // Handle any errors that may occur during the asynchronous operations
      console.error("Error rendering update job page:", error);
      // You might want to send an error response or render an error page here
      res.status(500).send("Internal Server Error");
    }
  }

  async updateJob(req, res) {
    console.log(req.headers.referer);
    let lastvisit = req.cookies.lastVisit || null;
    try {
      console.log("input from user", req.body);
      const jobOwner = await Recruiter.searchRecruiterByEmail(req.session.userEmail);
      const updatedJob = req.body;
      await Recruiter.updateJob(updatedJob, jobOwner);
      const allJobs = await Recruiter.getAllJobs();
      return res.render("all-jobs", {
        allJobs,
        message: `${updatedJob.company}'s Job has been Successfully Updated... `,
        role: "recruiter",
        userName: req.session.user.name,
        userEmail: req.session.userEmail,
        lastVisit: lastvisit,
      });
    } catch (error) {
      console.error("Error updating job:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  renderCreateJobPage(req, res) {
    let lastvisit = req.cookies.lastVisit || null;
    return res.render("create-job-form", {
      message: null,
      role: "recruiter",
      userName: req.session.user.name,
      userEmail: req.session.userEmail,
      lastVisit: lastvisit,
    });
  }

  async getRegistration(req, res) {
    const status = await Recruiter.isValidRecruiter(req.body);
    let lastvisit = req.cookies.lastVisit || null;
    console.log(status);
    if (status) {
      res.render("recruiter-register", {
        message: "OOP's This Email is already registered....\nClick on the Register button to try again. ",
        role: null,
        userName: null,
        userEmail: null,
        lastVisit: lastvisit,
      });
    } else {
      await Recruiter.addRecruiter(req.body);
      res.render("recruiter-login", {
        message: "Registration successful....\nNow you can login.",
        role: null,
        userName: null,
        userEmail: null,
        lastVisit: lastvisit,
      });
    }
  }

  async renderAllJobsPage(req, res) {
    let lastvisit = req.cookies.lastVisit || null;
    const allJobs = await Recruiter.getAllJobs();
    if (req.session.userEmail) {
      const user = await Recruiter.searchRecruiterByEmail(req.session.userEmail);
      if (user) {
        var userRole = user.role;
      } else {
        userRole = "jobseeker";
      }

      console.log("userName :", req.session.user.name, "userRole", userRole);
      return res.render("all-jobs", {
        allJobs,
        message: null,
        role: userRole,
        userName: req.session.user.name,
        userEmail: req.session.userEmail,
        lastVisit: lastvisit,
      });
    }

    return res.render("all-jobs", {
      allJobs,
      message: null,
      role: null,
      userName: null,
      userEmail: null,
      lastVisit: lastvisit,
    });
  }

  async loginRecruiter(req, res) {
    let lastvisit = req.cookies.lastVisit || null;
    const { email, password } = req.body;
    const user = await Recruiter.isRegisteredRecruiter(email, password);
    if (!user) {
      return res.render("recruiter-login", {
        message: "Invalid Credentials",
        role: null,
        userName: null,
        userEmail: null,
        lastVisit: lastvisit,
      });
    } else {
      req.session.userEmail = email;
      req.session.user = user;
      const allJobs = await Recruiter.getAllJobs();
      return res.render("all-jobs", {
        allJobs,
        message: "Login Successful...",
        role: "recruiter",
        userName: user.name,
        userEmail: req.session.userEmail,
        lastVisit: lastvisit,
      });
    }
  }

  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/recruiter-login");
      }
    });
  }
}
