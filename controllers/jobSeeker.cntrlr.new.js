import JobSeeker from "../model/jobS.model.new.js";
import Recruiter from "../model/rec.model.new.js";
import nodemailer from "nodemailer";

export default class JobSeekerController {
  renderJobSeekerRegistrationPage(req, res) {
    res.render("user-register", {
      message: null,
      role: null,
      userName: null,
      userEmail: null,
      lastVisit: req.cookies.lastVisit,
    });
  }

  renderJobSeekerLoginPage(req, res) {
    res.render("user-login", {
      message: null,
      role: null,
      userName: null,
      userEmail: null,
      lastVisit: req.cookies.lastVisit,
    });
  }

  async getJobSeekerRegistration(req, res) {
    const status = await JobSeeker.isValidJobSeeker(req.body);

    if (status) {
      res.render("user-register", {
        message: "OOP's This Email is already registered....\nPlease try again. ",
        role: null,
        userName: null,
        userEmail: null,
        lastVisit: req.cookies.lastVisit,
      });
    } else {
      await JobSeeker.addJobSeeker(req.body);
      res.render("user-login", {
        message: "Registration successful. Now you can login.",
        role: null,
        userName: null,
        userEmail: null,
        lastVisit: req.cookies.lastVisit,
      });
    }
  }

  async isProfileUpdated(req, res, next) {
    const jobseekerEmail = req.session.userEmail;
    const jobSeeker = await JobSeeker.searchJobSeekerByEmail(jobseekerEmail);
    if (jobSeeker.profile) {
      next();
    } else {
      const appliedJobs = jobSeeker.jobsApplied;
      return res.render("all-jobs", {
        allJobs: appliedJobs,
        message: `Please update profile before Applying to the job`,
        role: "jobseeker",
        userName: req.session.user.name,
        userEmail: req.session.userEmail,
        lastVisit: req.cookies.lastVisit,
      });
    }
  }
  renderUpdateProfilePage(req, res) {
    res.render("update-profile", {
      message: null,
      role: "jobseeker",
      userName: req.session.user.name,
      userEmail: req.session.userEmail,
      lastVisit: req.cookies.lastVisit,
    });
  }
  async updateProfile(req, res, next) {
    const { name, email, phone, gender, education, experience, skills, url } = req.body;
    const resume = req.file.filename;
    await JobSeeker.updateProfile(name, email, phone, gender, education, experience, skills, resume);
    res.redirect("/all-jobs");
  }

  async applyJob(req, res, next) {
    const jobid = req.params.id;
    const jobToApply = await Recruiter.findJobById(jobid);
    await JobSeeker.applyJob(jobid, jobToApply, req.session.userEmail);
    // await JobSeeker.sendEmailNotification(jobToApply.recruiter_email);
    const loggedInUser = await JobSeeker.searchJobSeekerByEmail(req.session.userEmail);
    const appliedJobs = loggedInUser.jobsApplied;
    res.render("send-email", {
      message: null,
      role: "jobseeker",
      userName: req.session.user.name,
      userEmail: req.session.userEmail,
      lastVisit: req.cookies.lastVisit,
      receiverEmail: jobToApply.recruiter_email,
    });

    // return res.render("all-jobs", {
    //   allJobs: appliedJobs,
    //   message: `Application to the job sent successfully...`,
    //   role: "jobseeker",
    //   userName: req.session.user.name,
    //   userEmail: req.session.userEmail,
    //   lastVisit: req.cookies.lastVisit,
    // });
  }

  postEmailNotification(req, res, next) {
    const { service, Password, senderEmail, receiverEmail, subject } = req.body;
    JobSeeker.sendEmailNotification(service, Password, senderEmail, receiverEmail, subject);
    res.redirect("all-jobs");
  }

  async viewAppliedJobs(req, res) {
    const loggedInUser = await JobSeeker.searchJobSeekerByEmail(req.session.userEmail);
    const appliedJobs = loggedInUser.jobsApplied;
    return res.render("all-jobs", {
      allJobs: appliedJobs,
      message: `Showing all jobs applied by ${req.session.user.name}.`,
      role: "jobseeker",
      userName: req.session.user.name,
      userEmail: req.session.userEmail,
      lastVisit: req.cookies.lastVisit,
    });
  }
  async loginJobSeeker(req, res) {
    const { email, password } = req.body;
    const user = await JobSeeker.isRegisteredJobSeeker(email, password);
    if (!user) {
      return res.render("user-login", {
        message: "Invalid Credentials",
        role: null,
        userName: null,
        userEmail: null,
        lastVisit: req.cookies.lastVisit,
      });
    } else {
      req.session.user = user;
      req.session.userEmail = email;
      res.redirect("/all-jobs");
    }
  }

  logout(req, res) {
    // on logout, destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/user-login");
      }
    });
  }
}
