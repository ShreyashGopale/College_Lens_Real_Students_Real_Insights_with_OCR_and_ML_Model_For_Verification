import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { authService, collegeService } from "../services/api";
import { AlertCircle, CheckCircle2, FileText, Upload, ChevronRight } from "lucide-react";

export function StudentRegisterModal({ isOpen, onClose, collegeId, collegeName, onSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    degree_type: 'B.E/B.TECH',
    branch: '',
  });
  const [marksheetFile, setMarksheetFile] = useState(null);
  const [feesReceiptFile, setFeesReceiptFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationErrors, setVerificationErrors] = useState([]);
  
  const [collegeCourses, setCollegeCourses] = useState([]);
  const [availableBranches, setAvailableBranches] = useState([]);
  const DEGREE_TYPES = ['B.E/B.TECH', 'MBA', 'BCA', 'B.Sc', 'M.Tech', 'Diploma', 'Other'];

  // Fetch college courses to populate degree field dropdown
  useEffect(() => {
    if (isOpen && collegeId) {
      const fetchCollegeDetails = async () => {
        try {
          const data = await collegeService.getById(collegeId);
          setCollegeCourses(data.courses || []);
        } catch (err) {
          console.error("Failed to fetch college courses for registration", err);
        }
      };
      fetchCollegeDetails();
    }
  }, [isOpen, collegeId]);

  // Filter branches based on selected degree type
  useEffect(() => {
    if (formData.degree_type) {
      const filtered = collegeCourses
        .filter(c => c.degree_type === formData.degree_type)
        .map(c => c.name);
      setAvailableBranches(filtered);
      if (filtered.length > 0 && !filtered.includes(formData.branch)) {
        setFormData(prev => ({ ...prev, branch: filtered[0] }));
      }
    }
  }, [formData.degree_type, collegeCourses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setVerificationErrors([]);

    if (!marksheetFile || !feesReceiptFile) {
      setError('Please upload both your 1st year marksheet and the latest fees receipt.');
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append('username', formData.username);
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('first_name', formData.first_name);
      submitData.append('middle_name', formData.middle_name);
      submitData.append('last_name', formData.last_name);
      submitData.append('degree_type', formData.degree_type);
      submitData.append('branch', formData.branch);
      submitData.append('college', collegeId);
      submitData.append('marksheet_first_year', marksheetFile);
      submitData.append('fees_receipt', feesReceiptFile);

      const response = await authService.studentRegister(submitData);
      onSuccess(response);
      onClose();
    } catch (err) {
      console.error("Registration Error:", err.response?.data);
      const data = err.response?.data;
      
      if (data?.error === 'Verification Failed') {
        setError('Document Verification Failed');
        setVerificationErrors(data.details || []);
      } else if (data && typeof data === 'object') {
        const errorMessages = Object.entries(data)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs[0] : msgs}`)
          .join(' | ');
        setError(errorMessages);
      } else {
        setError('Failed to create account. Please check your details and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-900">Student Verification & Signup</DialogTitle>
          <DialogDescription className="text-gray-600">
            Verify your enrollment at <strong>{collegeName}</strong> using our ML-based document verification system.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-red-700 font-semibold text-sm">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
            {verificationErrors.length > 0 && (
              <ul className="list-disc list-inside text-xs text-red-600 space-y-1 ml-6">
                {verificationErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Personal Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase font-bold text-gray-500">First Name</Label>
              <Input name="first_name" required value={formData.first_name} onChange={handleChange} placeholder="First Name" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase font-bold text-gray-500">Middle Name</Label>
              <Input name="middle_name" required value={formData.middle_name} onChange={handleChange} placeholder="Middle Name" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase font-bold text-gray-500">Last Name</Label>
              <Input name="last_name" required value={formData.last_name} onChange={handleChange} placeholder="Last Name" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase font-bold text-gray-500">Choose Username</Label>
              <Input name="username" required value={formData.username} onChange={handleChange} placeholder="e.g. rahul_s" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase font-bold text-gray-500">Email Address</Label>
              <Input name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="email@college.edu" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs uppercase font-bold text-gray-500">Password</Label>
            <Input name="password" type="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" />
          </div>

          {/* Academic Info Grid */}
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-4">
            <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Academic Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase font-bold text-gray-500">Degree Type</Label>
                <select 
                  name="degree_type"
                  className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.degree_type}
                  onChange={handleChange}
                >
                  {DEGREE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase font-bold text-gray-500">Degree Field (Branch)</Label>
                <select 
                  name="branch"
                  required
                  className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.branch}
                  onChange={handleChange}
                >
                  {availableBranches.length > 0 ? (
                    availableBranches.map(branch => <option key={branch} value={branch}>{branch}</option>)
                  ) : (
                    <option value="">No branches found for this degree</option>
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Document Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-600" /> 1st Year Marksheet
              </Label>
              <div className="relative group cursor-pointer border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                <input 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={(e) => setMarksheetFile(e.target.files[0])}
                  required
                />
                <div className="text-center">
                  <p className="text-xs text-gray-500 font-medium">{marksheetFile ? marksheetFile.name : "Select PDF/Image"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Upload className="w-4 h-4 text-green-600" /> Latest Fees Receipt
              </Label>
              <div className="relative group cursor-pointer border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-green-400 hover:bg-green-50/30 transition-all">
                <input 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={(e) => setFeesReceiptFile(e.target.files[0])}
                  required
                />
                <div className="text-center">
                  <p className="text-xs text-gray-500 font-medium">{feesReceiptFile ? feesReceiptFile.name : "Select PDF/Image"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t flex flex-col items-center gap-4">
            <Button 
              type="submit" 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-200 transition-all disabled:opacity-70"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Running Neural OCR Logic...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Verify & Create Account <ChevronRight className="w-5 h-5" />
                </div>
              )}
            </Button>
            <p className="text-[10px] text-gray-400 text-center px-8">
              By clicking verify, you authorize our AI to extract text from your documents. This process may take up to 15 seconds to complete. Data is processed securely.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
