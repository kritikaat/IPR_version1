import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IPRForm from './components/mainexhibitionpage'; // Import the IPRForm component
import './index.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<IPRForm />} /> {/* Home route with IPRForm */}
            </Routes>
        </Router>
    );
};

export default App;
