import React, { useState, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from 'framer-motion';

// Define all steps with unique IDs for each field
const steps = [
    {
        title: "Hall for Exhibition",
        fields: [
            { id: 'hallDimension', label: 'Hall Dimension', required: true, type: "text", helperText: "Dimension of the hall (LxB in meters). As large as possible (Min 15mx15m)" },
            { id: 'isEnclosedHall', label: "Is it an enclosed hall?", required: true, type: "text", helperText: "Enclosed hall required for safety" },
            { id: 'canBeDarkened', label: "Can the hall be darkened with curtains?", required: true, type: "text", helperText: "Hall should be dark to be able to see plasma properly" },
            { id: 'hasCooling', label: "Does the hall have A/C or fans?", required: false, type: "text", helperText: "Cooling is required to keep working models cool" },
            { id: 'isGroundFloor', label: "Is it on the ground floor?", required: true, type: "text", helperText: "Preferably on ground floor for easy unloading" },
            { id: 'hasStorageSpace', label: "Is there storage space for empty exhibit boxes?", required: false, type: "text", helperText: "Storage space is preferable for easy management" },
            { id: 'powerOutlets', label: "No. of 230V (5/15A) power outlets in the hall", required: true, type: "number", helperText: "Minimum 30 outlets needed" },
            { id: 'numTables', label: "Tables for placing the exhibits", required: false, type: "number", helperText: "35 tables and 20 chairs needed" },
            { id: 'vrSpace', label: "Space for VR", required: true, type: "text", helperText: "Min 3m x 3m for one VR exhibit" },
            { id: 'hasWifi', label: "WiFi Access", required: false, type: "text", helperText: "WiFi access needed for team members" }
        ]
    },
    {
        title: "Hall for Lectures/Quiz/Tokotoy Competition",
        fields: [
            { id: 'lectureHallArea', label: "Area of the hall", required: true, type: "text", helperText: "Should be able to comfortably seat the audience" },
            { id: 'seatingCapacity', label: "Seating capacity", required: true, type: "number", helperText: "Should be able to comfortably seat a minimum of 50 people" },
            { id: 'hasAVFacilities', label: "Does the hall have A/V facilities?", required: false, type: "text", helperText: "Requires digital projector (HDMI input) and audio system" },
            { id: 'distanceFromExhibition', label: "Distance of lecture hall from exhibition hall", required: false, type: "text", helperText: "As close to the exhibition hall as possible" }
        ]
    },
    {
        title: "Logistics and Accommodation",
        fields: [
            { id: 'accommodationProvided', label: "Accommodation for IPR team", required: true, type: "text", helperText: "8 rooms, A/C, single occupancy required" },
            { id: 'localTransportation', label: "Local transportation for IPR team", required: true, type: "text", helperText: "For minimum 8 people - airport/railway station pickup/drop" },
            { id: 'secureParkingSpace', label: "Secure parking space for IPR truck", required: true, type: "text", helperText: "Preferably within the campus" },
            { id: 'manpowerForLoading', label: "Manpower for loading/unloading", required: true, type: "text", helperText: "At least FOUR persons needed" }
        ]
    },
    {
        title: "Event Poster Details",
        fields: [
            { id: 'contactPersonName', label: "Name of the contact person", required: true, type: "text", helperText: "Will appear on event poster" },
            { id: 'contactPersonMobile', label: "Mobile Number", required: true, type: "text", helperText: "Will appear on event poster" },
            { id: 'contactPersonEmail', label: "E-mail", required: true, type: "text", helperText: "Will appear on event poster" },
            { id: 'venueLocation', label: "Location of the venue", required: true, type: "text", helperText: "Full address including hall name, building, etc." }
        ]
    },
    {
        title: "Teacher Training Program",
        fields: [
            { id: 'teacherInvitation', label: "Invitation to teachers", required: true, type: "number", helperText: "Minimum 25, Maximum 50 teachers" },
            { id: 'teacherRegistration', label: "Registration", required: true, type: "number", helperText: "Minimum 25, Maximum 50" },
            { id: 'providesWritingMaterials', label: "Writing materials provision", required: false, type: "text", helperText: "Writing pad/pen etc. for participants" },
            { id: 'providesRefreshments', label: "Refreshments arrangement", required: false, type: "text", helperText: "Tea/lunch arrangements for participants" }
        ]
    },
    {
        title: "Quiz Programme",
        fields: [
            { id: 'quizForSchoolStudents', label: "Quiz participation details", required: true, type: "text", helperText: "For school students (8-12 classes)" },
            { id: 'quizTeamSelection', label: "Team registration process", required: true, type: "text", helperText: "Minimum 10 teams, 2 participants per team" },
            { id: 'quizArrangements', label: "Quiz arrangements", required: true, type: "text", helperText: "Arrangements for organizing the quiz" },
            { id: 'quizRefreshments', label: "Refreshments for participants", required: false, type: "text", helperText: "Arrangements for participants" }
        ]
    }
];

const initialState = steps.reduce((acc, step) => {
    step.fields.forEach(field => {
        acc[field.id] = '';
    });
    return acc;
}, {});

const formReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        case 'RESET_FORM':
            return initialState;
        default:
            return state;
    }
};


const FormField = ({ id, label, required, helperText, value, onChange, error, type }) => (
    <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
    >
        <label className="block font-semibold text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            className={`w-full p-3 border rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
            required={required}
            value={value}
            onChange={onChange}
            placeholder={`Enter ${label.toLowerCase()}`}
        />
        {error && (
            <div className="mt-2 text-sm text-red-500">
                {error}
            </div>
        )}
        {helperText && <p className="text-sm text-gray-600 mt-2">{helperText}</p>}
    </motion.div>
);

const IPRExForm = () => {
    const [formData, dispatch] = useReducer(formReducer, initialState);
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateStep = () => {
        const currentFields = steps[currentStep].fields;
        const newErrors = {};
        let isValid = true;

        currentFields.forEach(field => {
            if (field.required && !formData[field.id]?.trim()) {
                newErrors[field.id] = `${field.label} is required`;
                isValid = false;
            } else if (['powerOutlets', 'numTables', 'seatingCapacity', 'teacherInvitation', 'teacherRegistration'].includes(field.id) && !Number(formData[field.id])) {
                newErrors[field.id] = `${field.label} must be a valid number`;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleNextStep = () => {
        if (validateStep()) {
            setCurrentStep(prevStep => prevStep + 1);
        }
    };

    const handlePreviousStep = () => {
        setCurrentStep(prevStep => prevStep - 1);
    };

    const handleInputChange = (id, value) => {
        dispatch({ type: 'SET_FIELD', field: id, value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep()) return;

        console.log("Form Data Being Submitted:", formData); // Add this line
        setIsSubmitting(true);


        try {
            const response = await fetch("http://localhost:3000/iprexhibition", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            toast.success("Form submitted successfully!", {
                autoClose: 5000, // Time in milliseconds
            });
            
            dispatch({ type: 'RESET_FORM' });
            setCurrentStep(0);// Redirect to success page
        } catch (error) {
            toast.error("Failed to submit form. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const progress = ((currentStep + 1) / steps.length) * 100;

    
   
    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <div className="flex justify-between mb-2">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className={`flex flex-col items-center ${
                                    index <= currentStep ? 'text-blue-500' : 'text-gray-400'
                                }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                    index <= currentStep ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-400'
                                }`}>
                                    {index + 1}
                                </div>
                                <div className="text-xs mt-1">{step.title}</div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="relative">
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 -translate-y-1/2"></div>
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                            className="absolute top-1/2 left-0 h-0.5 bg-blue-500 -translate-y-1/2 transition-all duration-300 ease-in-out"
                        ></motion.div>
                    </div>
                </div>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white shadow-xl rounded-lg overflow-hidden"
                >
                    <div className="px-6 py-8">
                        <ToastContainer />
                        <h1 className="text-3xl font-bold mb-6 text-gray-800">IPR Exhibition Form</h1>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <h2 className="text-2xl font-semibold mb-6 text-gray-700">{steps[currentStep].title}</h2>
                            {steps[currentStep].fields.map((field) => (
                                <FormField
                                    key={field.id}
                                    id={field.id}
                                    label={field.label}
                                    required={field.required}
                                    helperText={field.helperText}
                                    value={formData[field.id]}
                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    error={errors[field.id]}
                                    type={field.type}
                                />
                            ))}
                            <div className="flex justify-between mt-8">
                                {currentStep > 0 && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="button"
                                        className="bg-gray-300 text-gray-700 py-2 px-6 rounded-lg transition duration-150 ease-in-out hover:bg-gray-400"
                                        onClick={handlePreviousStep}
                                    >
                                        Previous
                                    </motion.button>
                                )}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    className="bg-blue-500 text-white py-2 px-6 rounded-lg transition duration-150 ease-in-out hover:bg-blue-600 disabled:opacity-50"
                                    onClick={currentStep === steps.length - 1 ? handleSubmit : handleNextStep}
                                    disabled={isSubmitting}
                                >
                                    {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default IPRExForm;
