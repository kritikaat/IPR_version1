import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import mapIPR from "./mapIPR.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InputField = ({
  label,
  name,
  type,
  value,
  onChange,
  error,
  placeholder,
}) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-gray-800 font-semibold mb-2">
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const VisitorsForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    institutionName: "",
    studentBranch: "",
    studentSem: "",
    numStudents: "",
    numFaculty: "",
    name: "",
    position: "",
    email: "",
    mobile: "",
    campus: [],
    ipr_time: "",
    fcipt_time: "",
    visit_date: "",
    visit_time: "",
    materials: [],
  });

  const [errors, setErrors] = useState({});
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
            ? [...prev[name], value]
            : prev[name].filter((item) => item !== value)
          : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep = () => {
    let stepErrors = {};
    switch (step) {
      case 2:
        if (!formData.institutionName.trim())
          stepErrors.institutionName = "Institution name is required";
        if (!formData.studentBranch.trim())
          stepErrors.studentBranch = "Student branch is required";
        if (!formData.studentSem.trim() || !/^\d+$/.test(formData.studentSem))
          stepErrors.studentSem = "Valid semester is required";
        break;
      case 3:
        if (!formData.numStudents.trim() || parseInt(formData.numStudents) <= 0)
          stepErrors.numStudents = "Valid number of students is required";
        if (!formData.numFaculty.trim() || parseInt(formData.numFaculty) <= 0)
          stepErrors.numFaculty = "Valid number of faculty is required";
        break;
      case 4:
        if (!formData.name.trim()) stepErrors.name = "Name is required";
        if (!formData.position.trim())
          stepErrors.position = "Position is required";
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
          stepErrors.email = "Valid email is required";
        if (!formData.mobile.trim() || !/^\d{10}$/.test(formData.mobile))
          stepErrors.mobile = "Valid 10-digit mobile number is required";
        break;
      case 5:
        if (formData.campus.length === 0)
          stepErrors.campus = "Please select at least one campus";
        if (!formData.visit_date)
          stepErrors.visit_date = "Visit date is required";
        if (!formData.visit_time)
          stepErrors.visit_time = "Visit time is required";
        break;
      default:
        break;
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (validateStep()) {
        try {
          const response = await fetch("http://localhost:4000/api/visitor/submit-form", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...formData,
              studentSem: parseInt(formData.studentSem),
              numStudents: parseInt(formData.numStudents),
              numFaculty: parseInt(formData.numFaculty),
            }),
          });
          if (response.ok) {
            const data = await response.json();
            toast.success(data.message);
            // Reset form or redirect as needed
            setFormData({
              institutionName: "",
              studentBranch: "",
              studentSem: "",
              numStudents: "",
              numFaculty: "",
              name: "",
              position: "",
              email: "",
              mobile: "",
              campus: [],
              ipr_time: "",
              fcipt_time: "",
              visit_date: "",
              visit_time: "",
              materials: [],
            });
            setStep(1);
          } else {
            const errorData = await response.json();
            toast.error(errorData.message || "Failed to submit form");
          }
        } catch (error) {
          console.error("Error submitting form:", error);
          toast.error("An error occurred while submitting the form");
        }
      }
    };
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">
              Welcome to IPR Scientific Visit
            </h2>
            <p className="text-gray-600 mb-4">
              It would be a pleasure to welcome you to the Institute for Plasma
              Research (IPR). Please fill up this form for permission to
              undertake a scientific visit to IPR.
            </p>
            <div className="contact-info border-b border-gray-300 mb-4 pb-4">
              <strong className="text-gray-800">Contact Person:</strong> Mr.
              Gattu Ramesh Babu / Mr. Narendra Chauhan
              <br />
              <strong className="text-gray-800">Email:</strong>{" "}
              academicvisit@ipr.res.in
              <br />
              <strong className="text-gray-800">Phone:</strong> 079-2966 4446
              <br />
              <strong className="text-gray-800">Mobile:</strong> 94087 85633
              (Gattu Ramesh) | 97777 46866 (Narendra)
            </div>
            <div className="note bg-gray-100 p-4 rounded-lg border-l-4 border-red-600 mb-4">
              <h3 className="text-lg text-red-600 mb-2">NOTE:</h3>
              <ul className="list-disc pl-5">
                <li className="text-gray-700 mb-2">
                  Group needs to confirm their arrival THREE days prior to their
                  visit, as well as once again by 9:00 AM on the day of the
                  visit by emailing <strong>academicvisit@ipr.res.in</strong>{" "}
                  AND calling/WhatsApp{" "}
                  <strong>94087 85633 / 97777 46866</strong>.
                </li>
                <li className="text-gray-700 mb-2">
                  IPR reserves the right to cancel/reschedule your pre-confirmed
                  visit if required. IPR will inform you as early as possible.
                </li>
                <li className="text-gray-700 mb-2">
                  Visit to IPR is restricted to only one day (WEDNESDAY) in a
                  week. Please confirm with IPR if your proposed date of visit
                  is available.
                </li>
                <li className="text-gray-700 mb-2">
                  Strict COVID protocols will have to be followed while inside
                  the campus.
                </li>
              </ul>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">
              Details of the Student Group
            </h2>
            <InputField
              label="Name of the Institution"
              name="institutionName"
              type="text"
              value={formData.institutionName}
              onChange={handleChange}
              error={errors.institutionName}
              placeholder="Enter institution name"
            />
            <InputField
              label="Branch of Students"
              name="studentBranch"
              type="text"
              value={formData.studentBranch}
              onChange={handleChange}
              error={errors.studentBranch}
              placeholder="Enter student branch"
            />
            <InputField
              label="Semester of Students"
              name="studentSem"
              type="number"
              value={formData.studentSem}
              onChange={handleChange}
              error={errors.studentSem}
              placeholder="Enter semester"
            />
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">
              Details of Visiting Group
            </h2>
            <p className="text-gray-700 mb-4">
              Please email a separate list of ALL the visitors (Students and
              accompanying staff). Even though there is no restriction on the
              number of students, 30 would be an ideal number in order to finish
              the tours within the prescribed time. The format for the list
              should be: Name, M/F, position, course/year, email, mobile No. to{" "}
              <strong>outreach@ipr.res.in</strong> for making the entry passes.
            </p>
            <InputField
              label="Number of Students in the group"
              name="numStudents"
              type="number"
              value={formData.numStudents}
              onChange={handleChange}
              error={errors.numStudents}
              placeholder="Enter number of students"
            />
            <InputField
              label="Number of Faculty members in the group"
              name="numFaculty"
              type="number"
              value={formData.numFaculty}
              onChange={handleChange}
              error={errors.numFaculty}
              placeholder="Enter number of faculty members"
            />
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">
              Details of Group in-charge
            </h2>
            <InputField
              label="Name of Group in-charge"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Enter name"
            />
            <InputField
              label="Position of Group in-charge"
              name="position"
              type="text"
              value={formData.position}
              onChange={handleChange}
              error={errors.position}
              placeholder="Enter position"
            />
            <InputField
              label="Email-ID of Group in-charge"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter email"
            />
            <InputField
              label="Mobile number of Group in-charge"
              name="mobile"
              type="tel"
              value={formData.mobile}
              onChange={handleChange}
              error={errors.mobile}
              placeholder="Enter 10-digit mobile number"
            />
          </motion.div>
        );
      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">Visit Options</h2>
            <p className="text-gray-700 mb-4">
              IPR has three campuses. Depending on the time you have, please
              choose the campuses that your group would like to visit. Visits
              are scheduled only on the 2nd and 4th Wednesdays of the month.
            </p>
            <div className="mb-4">
            <table className="w-full border-collapse mb-4">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 bg-blue-600 text-white p-3">Select Campus</th>
                            <th className="border border-gray-300 bg-blue-600 text-white p-3">Campus</th>
                            <th className="border border-gray-300 bg-blue-600 text-white p-3">Location</th>
                            <th className="border border-gray-300 bg-blue-600 text-white p-3">Things to observe</th>
                            <th className="border border-gray-300 bg-blue-600 text-white p-3">Time required</th>
                        </tr>
                    </thead>
              {[
                {
                  id: "ipr_main",
                  name: "IPR Main Campus",
                  location: "Near Indira Bridge, Bhat, India",
                  observe:
                    "Interactive tour, labs, fusion technology, plasma applications",
                  time: "1.5 Hours",
                },
                {
                  id: "labs",
                  name: "Various Labs",
                  location: "Fission Technology Complex",
                  observe:
                    "Astra, SST-1, Accelerator, Technology Park, Laboratories",
                  time: "2-3 Hours",
                },
                {
                  id: "fcipt",
                  name: "FCIPT",
                  location: "GIDC Gandhinagar",
                  observe:
                    "Industrial, medical, and energy applications of plasma",
                  time: "2 Hours",
                },
              ].map((campus) =>  <tr key={campus.id}>
              <td className="border border-gray-300 p-3">
                  <input
                      type="checkbox"
                      id={`select_${campus.id}`}
                      name="campus"
                      value={campus.id}
                      onChange={handleChange}
                      className="form-checkbox h-4 w-4 text-blue-600"
                  />
              </td>
              <td className="border border-gray-300 p-3">{campus.name}</td>
              <td className="border border-gray-300 p-3">{campus.location}</td>
              <td className="border border-gray-300 p-3">{campus.observe}</td>
              <td className="border border-gray-300 p-3">{campus.time}</td>
             </tr>)}
            </table>  
            </div>

            <div className="mb-4">
                    <label className="block text-gray-800 font-semibold mb-2">Campuses your group wishes to visit<span className="text-red-500">*</span></label>
                    <div className="mb-4">
                        <label className="block text-gray-800 font-semibold mb-2">IPR Main Campus</label>
                        <div className="flex gap-4">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="ipr_main_morning"
                                    name="ipr_time"
                                    value="morning"
                                    onChange={handleChange}
                                    className="form-radio h-4 w-4 text-blue-600"
                                />
                                <label htmlFor="ipr_main_morning" className="ml-2 text-gray-700">Morning</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="ipr_main_afternoon"
                                    name="ipr_time"
                                    value="afternoon"
                                    onChange={handleChange}
                                    className="form-radio h-4 w-4 text-blue-600"
                                />
                                <label htmlFor="ipr_main_afternoon" className="ml-2 text-gray-700">Afternoon</label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-800 font-semibold mb-2">FCIPT (GIDC Gandhinagar)</label>
                        <div className="flex gap-4">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="fcipt_morning"
                                    name="fcipt_time"
                                    value="morning"
                                    onChange={handleChange}
                                    className="form-radio h-4 w-4 text-blue-600"
                                />
                                <label htmlFor="fcipt_morning" className="ml-2 text-gray-700">Morning</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="fcipt_afternoon"
                                    name="fcipt_time"
                                    value="afternoon"
                                    onChange={handleChange}
                                    className="form-radio h-4 w-4 text-blue-600"
                                />
                                <label htmlFor="fcipt_afternoon" className="ml-2 text-gray-700">Afternoon</label>
                            </div>
                        </div>
                    </div>
                </div>

            <InputField
              label="Date of IPR visit"
              name="visit_date"
              type="date"
              value={formData.visit_date}
              onChange={handleChange}
            />
            <InputField
              label="Time for IPR visit"
              name="visit_time"
              type="time"
              value={formData.visit_time}
              onChange={handleChange}
            />
              <div className="mb-4">
              <label className="block text-gray-800 font-semibold mb-2">
                IPR to FCIPT and Extension Lab
              </label>
              <img
                src={mapIPR}
                alt="Map showing the route from IPR to FCIPT"
                className="w-full border border-gray-300 rounded-md"
                style={{ width: "30%", height: "30%" }}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-800 font-semibold mb-2">
                Resource materials on plasma that require
              </label>
              {[
                "Posters (set of 10 , in English)",
                "Posters (set of 10 , in Hindi)",
                'Book entitled "Living with plasma (in English)"',
                'Book entitled "Living with plasma (in Hindi)"',
              ].map((material, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`material_${index}`}
                    name="materials"
                    value={material}
                    checked={formData.materials.includes(material)}
                    onChange={handleChange}
                    className="form-checkbox h-4 w-4 text-blue-600 mr-2"
                  />
                  <label
                    htmlFor={`material_${index}`}
                    className="text-gray-700"
                  >
                    {material}
                  </label>
                </div>
              ))}
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
        Application Form for IPR Scientific Visit
      </h1>

      <div className="mb-6">
        <div className="flex justify-between">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                i <= step
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {i}
            </motion.div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute left-0 w-full h-1 bg-gray-200"></div>
          <motion.div
            className="absolute left-0 h-1 bg-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${(step - 1) * 25}%` }}
            transition={{ duration: 0.5 }}
          ></motion.div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <motion.button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back
            </motion.button>
          )}
          {step < 5 ? (
            <motion.button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next
            </motion.button>
          ) : (
            <motion.button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit
            </motion.button>
          )}
        </div>
      </form>
    </div>
  );
};

export default VisitorsForm;
