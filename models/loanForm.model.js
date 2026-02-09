import mongoose from "mongoose";

const loanFormSchema = new mongoose.Schema(
  {
    /*APPLICANT INFO*/
    applicant: {
      fullName: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      phone: { type: String, required: true },
      whatsapp: { type: String },
      dateOfBirth: { type: String },
      nationality: { type: String },
      address: { type: String },
      idType: { type: String },
      idNumber: { type: String },
    },

    /*BUSINESS INFO */
    business: {
      name: { type: String },
      regNumber: { type: String },
      entity: { type: String },
      industry: { type: String },
      address: { type: String },
      established: { type: String },
      tin: { type: String },
      website: { type: String },
      ownerNames: { type: String },
      ownershipPercentage: { type: Number, min: 0, max: 100 },
    },

    /*LOAN DETAILS*/
    loan: {
      amount: { type: Number, min: 0 },
      purpose: { type: String },
      term: { type: Number },
      startDate: { type: String },
    },

    /*FINANCIAL INFO*/
    financial: {
      annualRevenue: { type: Number, min: 0 },
      monthlySales: { type: Number, min: 0 },
      monthlyExpenses: { type: Number, min: 0 },
      existingLoans: { type: String },
      lenderName: { type: String },
      outstandingBalance: { type: Number },
      monthlyRepayment: { type: Number },
    },

    /*DOCUMENTS (Cloudinary URLs)*/
    documents: {
      idDocument: { type: String },
      businessDocs: [{ type: String }],
      bankStatements: [{ type: String }],
      ownerIds: [{ type: String }],
    },

    /*CONSENT*/
    consent: {
      certifyInfo: { type: Boolean, default: false },
      authorizeVerification: { type: Boolean, default: false },
      agreeTerms: { type: Boolean, default: false },
      digitalSignature: { type: String },
      preferredContact: { type: String },
    },

    /*STATUS*/
    status: {
      type: String,
      enum: ["Pending Review", "Under Review", "Approved", "Rejected"],
      default: "Pending Review",
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Indexes
loanFormSchema.index({ status: 1 });
loanFormSchema.index({ submittedAt: -1 });
loanFormSchema.index({ "applicant.email": 1 });

const LoanForm = mongoose.model("LoanForm", loanFormSchema);

export default LoanForm;
