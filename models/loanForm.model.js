import mongoose from "mongoose";

const loanFormSchema = new mongoose.Schema(
  {
    applicationForm: {
      fullName: {
        type: String,
        required: function () {
          return this.currentStep >= 1;
        },
        trim: true,
      },
      email: {
        type: String,
        required: function () {
          return this.currentStep >= 1;
        },
        lowercase: true,
      },
      phoneNumber: {
        type: String,
        required: function () {
          return this.currentStep >= 1;
        },
      },
      whatsAppNumber: {
        type: String,
        required: function () {
          return this.currentStep >= 1;
        },
      },
      dateOfBirth: {
        type: Date,
        required: function () {
          return this.currentStep >= 1;
        },
      },
      nationality: {
        type: String,
        required: function () {
          return this.currentStep >= 1;
        },
      },
      residentialAddress: {
        type: String,
        required: function () {
          return this.currentStep >= 1;
        },
      },
      idType: {
        type: String,
        required: function () {
          return this.currentStep >= 1;
        },
      },
      idNumber: {
        type: String,
        required: function () {
          return this.currentStep >= 1;
        },
      },
      govtIdIssued: [
        {
          type: String,
          required: function () {
            return this.currentStep >= 1;
          },
        },
      ],
    },

    businessInfo: {
      businessName: {
        type: String,
        required: function () {
          return this.currentStep >= 2;
        },
      },
      businessRegistrationNumber: {
        type: String,
        required: function () {
          return this.currentStep >= 2;
        },
      },
      businessType: {
        type: String,
        enum: [
          "Sole Proprietorship",
          "Partnership",
          "Limited Company (ltd.)",
          "Corporation",
          "Other",
        ],
        required: function () {
          return this.currentStep >= 2;
        },
      },
      businessAddress: {
        type: String,
        required: function () {
          return this.currentStep >= 2;
        },
      },
      businessSector: {
        type: String,
        required: function () {
          return this.currentStep >= 2;
        },
      },
      businessEstablishmentDate: {
        type: Date,
        required: function () {
          return this.currentStep >= 2;
        },
      },
      taxIdentificationNumber: {
        type: String,
        required: function () {
          return this.currentStep >= 2;
        },
      },
      businessWebsite: { type: String },

      ownerDetails: {
        ownerName: {
          type: String,
          required: function () {
            return this.currentStep >= 2;
          },
        },
        ownershipPercentage: {
          type: Number,
          min: 0,
          max: 100,
          required: function () {
            return this.currentStep >= 2;
          },
        },
      },

      businessRegistrationDocument: [
        {
          type: String,
          required: function () {
            return this.currentStep >= 2;
          },
        },
      ],
    },

    loanRequestDetails: {
      loanAmountInUSD: {
        type: Number,
        min: 1,
        required: function () {
          return this.currentStep >= 3;
        },
      },
      loanPurpose: {
        type: String,
        enum: [
          "Working Capital",
          "Equipment Purchase",
          "Inventory",
          "Business Expansion",
          "Real Estate",
          "Other",
        ],
        required: function () {
          return this.currentStep >= 3;
        },
      },
      repaymentPeriodMonths: {
        type: Number,
        enum: [6, 12, 18, 24, 36],
        required: function () {
          return this.currentStep >= 3;
        },
      },
      proposedStartDate: {
        type: Date,
        required: function () {
          return this.currentStep >= 3;
        },
      },
    },

    businessFinancialDetails: {
      annualRevenueUSD: {
        type: Number,
        required: function () {
          return this.currentStep >= 4;
        },
      },
      monthlyExpensesUSD: {
        type: Number,
        required: function () {
          return this.currentStep >= 4;
        },
      },
      monthlyAverageSalesUSD: {
        type: Number,
        required: function () {
          return this.currentStep >= 4;
        },
      },
      existingDebts: {
        type: String,
        enum: ["yes", "no"],
        required: function () {
          return this.currentStep >= 4;
        },
      },
      bankStatements: [
        {
          type: String,
          required: function () {
            return this.currentStep >= 4;
          },
        },
      ],
    },

    documentsUpload: {
      ownerId: [{ type: String }],
      digitalSignature: [{ type: String }],
      preferredContactMethod: {
        type: String,
        enum: ["Email", "Phone", "Whatsapp"],
        required: function () {
          return this.currentStep >= 5;
        },
      },
      submissionDate: { type: Date, default: Date.now },
    },

    currentStep: { type: Number, default: 1 },
    isCompleted: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["draft", "submitted", "under_review", "approved", "rejected"],
      default: "draft",
    },
  },
  { timestamps: true }
);

const LoanForm = mongoose.model("LoanForm", loanFormSchema);

export default LoanForm;
