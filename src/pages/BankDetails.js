import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/BankDetails.css'; // Ensure you have the CSS styles for this component
import { useNavigate } from 'react-router-dom';

const BankDetails = () => {
    const [formData, setFormData] = useState({
        name: '',
        ac_no: '',
        paytm: '',
        gpay: '',
        phonepe: '',
        upi: ''
    });
    const [loading, setLoading] = useState(true);  // To handle loading state
    const navigate = useNavigate();

    // Fetch existing bank details when the component mounts
    useEffect(() => {
        const fetchBankDetails = async () => {
            try {
                const user_id = localStorage.getItem('user_id'); // Get user ID from localStorage
                if (user_id) {
                    const response = await axios.post('https://bhoom.miramatka.com/api/getBankDetails.php', { user_id });
                    if (response.data.success && response.data.details) {
                        setFormData(response.data.details);  // Set fetched bank details
                    }
                }
            } catch (error) {
                console.error('Error fetching bank details:', error);
            } finally {
                setLoading(false);  // Stop the loading state
            }
        };
        fetchBankDetails();  // Call the function to fetch bank details
    }, []);

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const user_id = localStorage.getItem('user_id'); // Get user ID from localStorage
            const response = await axios.post('https://bhoom.miramatka.com/api/saveBankDetails.php', {
                ...formData,
                user_id,
            });

            if (response.data.success) {
                alert('Bank details saved successfully');
                navigate('/home'); // Navigate to home or any other page
            } else {
                alert('Error: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error saving bank details:', error);
            alert('An error occurred while saving the bank details.');
        }
    };

    return (
        <div className="bank-details-container">
            <div className="header">
                <button onClick={() => navigate(-1)} className="back-buttonms">
                    <img src="/assets/back-arrow.png" alt="Back" />
                </button>
                <h2>Bank Details</h2>
            </div>
            <div className="form-container">
                {loading ? (
                    <div>Loading...</div>  // Loading message when fetching data
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <img src="/assets/user-icon.png" alt="User Icon" className="input-icon" />
                            <input
                                type="text"
                                name="name"
                                placeholder="Account Holder's Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <img src="/assets/user-icon.png" alt="User Icon" className="input-icon" />
                            <input
                                type="text"
                                name="ac_no"
                                placeholder="Account Number"
                                value={formData.ac_no}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <img src="/assets/paytm-icon.png" alt="Paytm Icon" className="input-icon" />
                            <input
                                type="text"
                                name="paytm"
                                placeholder="Paytm Number"
                                value={formData.paytm}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <img src="/assets/gpay-icon.png" alt="GPay Icon" className="input-icon" />
                            <input
                                type="text"
                                name="gpay"
                                placeholder="Gpay Number"
                                value={formData.gpay}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <img src="/assets/phonepe-icon.png" alt="PhonePe Icon" className="input-icon" />
                            <input
                                type="text"
                                name="phonepe"
                                placeholder="PhonePe Number"
                                value={formData.phonepe}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <img src="/assets/upi-icon.png" alt="UPI Icon" className="input-icon" />
                            <input
                                type="text"
                                name="upi"
                                placeholder="UPI ID (VPA)"
                                value={formData.upi}
                                onChange={handleInputChange}
                            />
                        </div>
                        <button type="submit" className="save-btn">Save</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default BankDetails;
