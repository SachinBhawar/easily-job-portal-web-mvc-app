class Job {
  constructor(jobID, recruiter_email, company, type, designation, salary, location, vacancies, experience, skills, description) {
    this.jobID = jobID;
    this.recruiter_email = recruiter_email;
    this.company = company;
    this.type = type;
    this.designation = designation;
    this.salary = salary;
    this.location = location;
    this.vacancies = vacancies;
    this.experience = experience;
    this.skills = skills;
    this.description = description;
    this.applicants = [];
    this.applicantsResume = [];
  }
}

export default class Recruiter {
  constructor(_name, _email, _password) {
    this.role = "recruiter";
    this.name = _name;
    this.email = _email;
    this.password = _password;
    this.jobPosted = [];
  }

  static async isValidRecruiter(recruiter) {
    return registeredRecruiters.some((item) => item.email == recruiter.email); // returns true if the recruiter email is already present else return false
  }

  static async isRegisteredRecruiter(email, password) {
    return registeredRecruiters.find((user) => user.email == email && password == user.password);
  }

  static async searchRecruiterByEmail(email) {
    return registeredRecruiters.find((rec) => rec.email == email);
  }

  static findJobById(jobId) {
    return registeredRecruiters.flatMap((recruiter) => recruiter.jobPosted).find((job) => job.jobID == jobId);
  }
  static async searchJobById(id, recruiter_) {
    let foundJob = recruiter_.jobPosted.find((job) => job.jobID === id);

    if (foundJob) {
      return foundJob;
    }
  }
  static async deleteJob(id, recruiterEmail) {
    try {
      // Find the recruiter with the specified email
      const recr = await registeredRecruiters.find((recr) => recr.email === recruiterEmail);
      // If recruiter with specified email is not found, return error
      if (!recr) {
        throw new Error("Recruiter not found");
      }
      // Find the index of the job with the specified job ID
      const jobIndex = await recr.jobPosted.findIndex((job) => job.jobID == id);
      // If job with specified ID is not found, return error
      if (jobIndex === -1) {
        throw new Error("Job not found");
      }
      // Remove the job from the recruiter's jobs array
      recr.jobPosted.splice(jobIndex, 1);

      return {
        success: true,
        message: "Job deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async updateJob(updatedJob, recruiTer) {
    const jobId = updatedJob.jobID;
    const jobIndex = recruiTer.jobPosted.findIndex((job) => job.jobID === jobId);
    if (jobIndex !== -1) {
      await (async () => {
        // Update the job properties
        recruiTer.jobPosted[jobIndex].company = updatedJob.company;
        recruiTer.jobPosted[jobIndex].type = updatedJob.type;
        recruiTer.jobPosted[jobIndex].designation = updatedJob.designation;
        recruiTer.jobPosted[jobIndex].salary = updatedJob.salary;
        recruiTer.jobPosted[jobIndex].location = updatedJob.location;
        recruiTer.jobPosted[jobIndex].vacancies = updatedJob.vacancies;
        recruiTer.jobPosted[jobIndex].experience = updatedJob.experience;
        recruiTer.jobPosted[jobIndex].skills = updatedJob.skills.split(",");
        recruiTer.jobPosted[jobIndex].description = updatedJob.description;
      })();
      console.log("job updated");
    }
  }
  static async addRecruiter(obj) {
    let reC = new Recruiter(obj.name, obj.email, obj.password);
    registeredRecruiters.push(reC);
  }

  static generateJobId(user) {
    return user.name.substring(0, 3).toLowerCase() + Date.now();
  }

  static async addNewJob(company, type, designation, salary, location, vacancies, experience, skills, description, recruiter) {
    var jobID = this.generateJobId(recruiter);
    var skillsArray = skills.split(",");
    const newJob = new Job(
      jobID,
      recruiter.email,
      company,
      type,
      designation,
      salary,
      location,
      vacancies,
      experience,
      skillsArray,
      description
    );

    const rec = registeredRecruiters.find((rec) => rec.email == recruiter.email && rec.name == recruiter.name);
    console.log(rec);
    rec.jobPosted.push(newJob);
    console.log(`job posted by recruiter ${rec.name}....end`, newJob);
  }

  static async getAllApplicants(rec_) {
    const allApplicants = rec_.jobPosted.flatMap((job) => job.applicants);
    return allApplicants;
  }
  static async getAllJobs() {
    let allJobs = [];
    registeredRecruiters.forEach((recruiter) => {
      allJobs = allJobs.concat(recruiter.jobPosted);
    });
    return allJobs;
  }
}

const registeredRecruiters = [
  {
    role: "recruiter",
    name: "tanishq",
    email: "tanishq@gmail.com",
    password: "tanu@123",
    jobPosted: [
      {
        jobID: "tan1710261170100",
        recruiter_email: "tanishq@gmail.com",
        company: "TCS Technologies",
        type: "Tech",
        designation: "Full Stack Developer",
        salary: "14-20LPA",
        location: "New Delhi",
        vacancies: "5",
        experience: "0-1yrs",
        skills: ["REACT", "NodeJs", "JS", "SQL", "MongoDB", "Express", "AWS"],
        description: "This is coding ninjas position for the professionals having experience more than 3ys.",
        applicants: [],
        applicantsResume: [],
      },
      {
        jobID: "tan1710261170200",
        recruiter_email: "tanishq@gmail.com",
        company: "Tata Consultancy",
        type: "Non-Tech",
        designation: "HR",
        salary: "14-20LPA",
        location: "Mumbai",
        vacancies: "2",
        experience: "0-1yrs",
        skills: ["REACT", "NodeJs", "JS", "SQL", "MongoDB", "Express", "AWS"],
        description: "This is coding ninjas position for the professionals having experience more than 3ys.",
        applicants: [],
        applicantsResume: [],
      },
      {
        jobID: "tan1710261170300",
        recruiter_email: "tanishq@gmail.com",
        company: "Wipro",
        type: "Tech",
        designation: "SDE",
        salary: "14-20LPA",
        location: "Bengluru",
        vacancies: "5",
        experience: "0-1yrs",
        skills: ["REACT", "NodeJs", "JS", "SQL", "MongoDB", "Express", "AWS"],
        description: "This is coding ninjas position for the professionals having experience more than 3ys.",
        applicants: [],
        applicantsResume: [],
      },
      {
        jobID: "tan1710261170400",
        recruiter_email: "tanishq@gmail.com",
        company: "Team Lease",
        type: "Tech",
        designation: "MERN Stack Developer",
        salary: "14-20LPA",
        location: "Gurugram HR IND",
        vacancies: "5",
        experience: "0-1yrs",
        skills: ["REACT", "NodeJs", "JS", "SQL", "MongoDB", "Express", "AWS"],
        description: "This is coding ninjas position for the professionals having experience more than 3ys.",
        applicants: [],
        applicantsResume: [],
      },
      {
        jobID: "tan1710261170500",
        recruiter_email: "tanishq@gmail.com",
        company: "Jindal Steel",
        type: "Tech",
        designation: "SDE",
        salary: "14-20LPA",
        location: "Kolkata",
        vacancies: "5",
        experience: "0-1yrs",
        skills: ["REACT", "NodeJs", "JS", "SQL", "MongoDB", "Express", "AWS"],
        description: "This is coding ninjas position for the professionals having experience more than 3ys.",
        applicants: [],
        applicantsResume: [],
      },
    ],
  },
  {
    role: "recruiter",
    name: "Sachin",
    email: "sac@gmail.com",
    password: "tanu@123",
    jobPosted: [
      {
        jobID: "tan1710261170600",
        recruiter_email: "sac@gmail.com",
        company: "Sun Pharma",
        type: "Non-Tech",
        designation: "HR",
        salary: "14-20LPA",
        location: "Gurugram HR IND",
        vacancies: "5",
        experience: "0-1yrs",
        skills: ["REACT", "NodeJs", "JS", "SQL", "MongoDB", "Express", "AWS"],
        description: "This is coding ninjas position for the professionals having experience more than 3ys.",
        applicants: [],
        applicantsResume: [],
      },
      {
        jobID: "tan1710261170700",
        recruiter_email: "sac@gmail.com",
        company: "Rudram Software Solutions",
        type: "Tech",
        designation: "Full Stack Developer",
        salary: "14-20LPA",
        location: "Gurugram HR IND",
        vacancies: "5",
        experience: "0-1yrs",
        skills: ["REACT", "NodeJs", "JS", "SQL", "MongoDB", "Express", "AWS"],
        description: "This is coding ninjas position for the professionals having experience more than 3ys.",
        applicants: [],
        applicantsResume: [],
      },
      {
        jobID: "tan1710261170800",
        recruiter_email: "sac@gmail.com",
        company: "Randstad",
        type: "Tech",
        designation: "SDE",
        salary: "14-20LPA",
        location: "Chennai",
        vacancies: "5",
        experience: "0-1yrs",
        skills: ["REACT", "NodeJs", "JS", "SQL", "MongoDB", "Express", "AWS"],
        description: "This is coding ninjas position for the professionals having experience more than 3ys.",
        applicants: [],
        applicantsResume: [],
      },
      {
        jobID: "tan1710261170900",
        recruiter_email: "sac@gmail.com",
        company: "Apple",
        type: "Tech",
        designation: "SDE",
        salary: "14-20LPA",
        location: "Gurugram HR IND",
        vacancies: "5",
        experience: "0-1yrs",
        skills: ["REACT", "NodeJs", "JS", "SQL", "MongoDB", "Express", "AWS"],
        description: "This is coding ninjas position for the professionals having experience more than 3ys.",
        applicants: [],
        applicantsResume: [],
      },
      {
        jobID: "tan1710261171000",
        recruiter_email: "sac@gmail.com",
        company: "Apple",
        type: "Tech",
        designation: "SDE",
        salary: "14-20LPA",
        location: "Gurugram HR IND",
        vacancies: "5",
        experience: "0-1yrs",
        skills: ["REACT", "NodeJs", "JS", "SQL", "MongoDB", "Express", "AWS"],
        description: "This is coding ninjas position for the professionals having experience more than 3ys.",
        applicants: [],
        applicantsResume: [],
      },
    ],
  },
  {
    role: "recruiter",
    name: "rani",
    email: "ran@gmail.com",
    password: "tanu@123",
    jobPosted: [
      {
        jobID: "tan1710261171100",
        recruiter_email: "ran@gmail.com",
        company: "Apple",
        type: "Tech",
        designation: "SDE",
        salary: "14-20LPA",
        location: "Gurugram HR IND",
        vacancies: "5",
        experience: "0-1yrs",
        skills: ["REACT", "NodeJs", "JS", "SQL", "MongoDB", "Express", "AWS"],
        description: "This is coding ninjas position for the professionals having experience more than 3ys.",
        applicants: [],
        applicantsResume: [],
      },
      {
        jobID: "tan1710261171200",
        recruiter_email: "ran@gmail.com",
        company: "Samsung",
        type: "Tech",
        designation: "SDE",
        salary: "14-20LPA",
        location: "Gurugram HR IND",
        vacancies: "5",
        experience: "0-1yrs",
        skills: ["REACT", "NodeJs", "JS", "SQL", "MongoDB", "Express", "AWS"],
        description: "This is coding ninjas position for the professionals having experience more than 3ys.",
        applicants: [],
        applicantsResume: [],
      },
      {
        jobID: "tan1710261171300",
        recruiter_email: "ran@gmail.com",
        company: "Apple",
        type: "Tech",
        designation: "SDE",
        salary: "14-20LPA",
        location: "Gurugram HR IND",
        vacancies: "5",
        experience: "0-1yrs",
        skills: ["REACT", "NodeJs", "JS", "SQL", "MongoDB", "Express", "AWS"],
        description: "This is coding ninjas position for the professionals having experience more than 3ys.",
        applicants: [],
        applicantsResume: [],
      },
      {
        jobID: "tan1710261171400",
        recruiter_email: "ran@gmail.com",
        company: "Apple",
        type: "Tech",
        designation: "SDE",
        salary: "14-20LPA",
        location: "Gurugram HR IND",
        vacancies: "5",
        experience: "0-1yrs",
        skills: ["REACT", "NodeJs", "JS", "SQL", "MongoDB", "Express", "AWS"],
        description: "This is coding ninjas position for the professionals having experience more than 3ys.",
        applicants: [],
        applicantsResume: [],
      },
      {
        jobID: "tan1710261171500",
        recruiter_email: "ran@gmail.com",
        company: "Lava",
        type: "Tech",
        designation: "SDE",
        salary: "14-20LPA",
        location: "Gurugram HR IND",
        vacancies: "5",
        experience: "0-1yrs",
        skills: ["REACT", "NodeJs", "JS", "SQL", "MongoDB", "Express", "AWS"],
        description: "This is coding ninjas position for the professionals having experience more than 3ys.",
        applicants: [],
        applicantsResume: [],
      },
    ],
  },
];
