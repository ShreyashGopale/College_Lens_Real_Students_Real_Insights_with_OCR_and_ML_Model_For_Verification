import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { authService } from "../services/api";

export function StudentRegisterModal({ isOpen, onClose, collegeId, collegeName, onSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    branch: '',
    roll_number: '',
  });
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileData(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!fileData) {
      setError('Please upload your 1st year marksheet.');
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append('username', formData.username);
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('branch', formData.branch);
      submitData.append('roll_number', formData.roll_number);
      submitData.append('college', collegeId);
      submitData.append('marksheet_first_year', fileData);

      const response = await authService.studentRegister(submitData);
      onSuccess(response);
      onClose();
    } catch (err) {
      console.error("Full Registration Error:", err.response?.data);
      if (err.response?.data && typeof err.response.data === 'object' && !err.response.data.detail && !err.response.data.error) {
        const errorMessages = Object.entries(err.response.data)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs[0] : msgs}`)
          .join(' | ');
        setError(errorMessages);
      } else {
        setError(err.response?.data?.detail || err.response?.data?.error || 'Failed to register student account. Check your details.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-blue-900">Create Student Account</DialogTitle>
          <DialogDescription>
            Create an account to verify your student status at {collegeName} and write reviews.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Student Name</Label>
            <Input id="username" name="username" placeholder="Full Name" required value={formData.username} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="student@example.com" required value={formData.email} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="Create a password" required value={formData.password} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Input id="branch" name="branch" placeholder="e.g. Computer Science" required value={formData.branch} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roll_number">Roll No</Label>
              <Input id="roll_number" name="roll_number" placeholder="Roll Number" required value={formData.roll_number} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="marksheet_first_year">1st Year Marksheet</Label>
            <Input id="marksheet_first_year" name="marksheet_first_year" type="file" accept=".pdf,.jpg,.jpeg,.png" required onChange={handleFileChange} />
            <p className="text-xs text-gray-500">Upload PDF or image to verify student status</p>
          </div>

          <div className="pt-4 flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
