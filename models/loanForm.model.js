import mongoose from 'mongoose';

const loanFormSchema = new mongoose.Schema({
  // Application ID
  id: {
    type: String,
    required: true,
    unique: true
  },
  
  // Applicant Information
  applicant: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    nationality: { type: String, required: true },
    address: { type: String, required: true },
    idType: { type: String, required: true },
    idNumber: { type: String, required: true }
  },
  
  // Business Information
  business: {
    name: { type: String, required: true },
    regNumber: { type: String, required: true },
    entity: { type: String, required: true },
    industry: { type: String, required: true },
    address: { type: String, required: true },
    established: { type: String, required: true },
    tin: { type: String, required: true },
    website: { type: String },
    ownerNames: { type: String, required: true },
    ownershipPercentage: { type: Number, required: true }
  },
  
  // Loan Details
  loan: {
    amount: { type: Number, required: true },
    purpose: { type: String, required: true },
    term: { type: Number, required: true },
    startDate: { type: String, required: true }
  },
  
  // Financial Information
  financial: {
    annualRevenue: { type: Number, required: true },
    monthlySales: { type: Number, required: true },
    monthlyExpenses: { type: Number, required: true },
    existingLoans: { type: String, required: true },
    lenderName: { type: String },
    outstandingBalance: { type: Number },
    monthlyRepayment: { type: Number }
  },
  
  // Documents (storing file names/paths)
  documents: {
    idDocument: { type: String },
    businessDocs: [{ type: String }],
    bankStatements: [{ type: String }],
    ownerIds: [{ type: String }]
  },
  
  // Consent and Signature
  consent: {
    certifyInfo: { type: Boolean, required: true },
    authorizeVerification: { type: Boolean, required: true },
    agreeTerms: { type: Boolean, required: true },
    digitalSignature: { type: String, required: true },
    preferredContact: { type: String }
  },
  
  // Application Status
  status: {
    type: String,
    enum: ['Pending Review', 'Under Review', 'Approved', 'Rejected'],
    default: 'Pending Review'
  },
  
  // Timestamps
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
loanFormSchema.index({ id: 1 });
loanFormSchema.index({ status: 1 });
loanFormSchema.index({ submittedAt: -1 });
loanFormSchema.index({ 'applicant.email': 1 });

const LoanForm = mongoose.model('LoanForm', loanFormSchema);

export default LoanForm;