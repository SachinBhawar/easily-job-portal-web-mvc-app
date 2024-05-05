import Recruiter from "./rec.model.new.js";
import nodemailer from "nodemailer";

export default class JobSeeker {
  constructor(_name, _email, _password) {
    this.role = "jobseeker";
    this.name = _name;
    this.email = _email;
    this.password = _password;
    this.jobsApplied = [];
    this.profile = null;
  }

  static async isValidJobSeeker(jobseeker) {
    // Check if the jobseeker email is already registered
    return registeredJobSeeker.some((item) => item.email === jobseeker.email);
  }
  static async updateProfile(name, email, phone, gender, education, experience, skills, resume) {
    let skillsArray = skills.split(",");
    const profile = {
      name: name,
      email: email,
      phone: phone,
      gender: gender,
      education: education,
      experience: experience,
      skills: skillsArray,
      resume: resume,
    };
    const jobseeker = await registeredJobSeeker.find((js) => js.email == email);
    jobseeker.profile = profile;
  }

  static async applyJob(jobId, job, jobseekerEmail) {
    const user = await registeredJobSeeker.find((js) => js.email == jobseekerEmail);
    await job.applicants.push(user.profile);
    await user.jobsApplied.push(job);
  }

  static async searchJobSeekerByEmail(email) {
    const reqJobSeeker = await registeredJobSeeker.find((js) => js.email == email);
    if (reqJobSeeker) {
      return reqJobSeeker;
    } else {
      console.log(`required jobseeker with the email ${email} not found`);
      return null;
    }
  }

  static async sendEmailNotification(service, Password, senderEmail, receiverEmail, subject) {
    let transporter = nodemailer.createTransport({
      service: "gmail", // Use Gmail as the email service
      auth: {
        user: senderEmail, // Your Gmail address
        pass: Password, // Your Gmail password
      },
    });

    // Define the email options
    let mailOptions = {
      from: senderEmail, // Sender address
      to: receiverEmail, // Receiver address
      subject: subject, // Subject line
      text: "A job seeker has applied for the job.", // Plain text body
      html: "<b>A job seeker has applied for the job.</b>", // HTML body
    };

    // Send the email
    try {
      let info = await transporter.sendMail(mailOptions);
      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.error("Error occurred. Message not sent:", error);
    }
  }

  static async addJobSeeker(obj) {
    let jobseeker = new JobSeeker(obj.name, obj.email, obj.password);
    registeredJobSeeker.push(jobseeker);
    console.log("JobSeeker added", jobseeker);
  }

  static async isRegisteredJobSeeker(email, password) {
    return registeredJobSeeker.find((user) => user.email === email && user.password === password);
  }
}

const registeredJobSeeker = [
  {
    role: "jobseeker",
    name: "rani",
    email: "rani@gmail.com",
    password: "Tanu@123",
    jobsApplied: [],
    resume: [],
  },
];
