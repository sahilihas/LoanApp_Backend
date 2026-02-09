import LoanForm from "../models/loanForm.model.js";

/* ===============================
   CREATE LOAN APPLICATION
================================ */
export const createLoanApplication = async (req, res) => {
  try {
    console.log("📥 Incoming application");
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    /* ===============================
       FILE HANDLING (Cloudinary URLs)
    ============================== */
    const getFileUrls = (field) =>
      req.files?.[field]?.map((f) => f.path) || [];

    const applicationData = {
      applicant: {
        fullName: req.body.fullName?.trim(),
        email: req.body.email?.toLowerCase(),
        phone: req.body.phone,
        whatsapp: req.body.whatsapp,
        dateOfBirth: req.body.dateOfBirth,
        nationality: req.body.nationality,
        address: req.body.address,
        idType: req.body.idType,
        idNumber: req.body.idNumber,
      },

      business: {
        name: req.body.businessName,
        regNumber: req.body.businessRegNumber,
        entity: req.body.businessEntity,
        industry: req.body.industry,
        address: req.body.businessAddress,
        established: req.body.businessEstablished,
        tin: req.body.tin,
        website: req.body.businessWebsite || "",
        ownerNames: req.body.ownerNames,
        ownershipPercentage: Number(req.body.ownershipPercentage) || 0,
      },

      loan: {
        amount: Number(req.body.loanAmount) || 0,
        purpose: req.body.loanPurpose,
        term: Number(req.body.repaymentTerm) || 0,
        startDate: req.body.proposedStartDate,
      },

      financial: {
        annualRevenue: Number(req.body.annualRevenue) || 0,
        monthlySales: Number(req.body.monthlySales) || 0,
        monthlyExpenses: Number(req.body.monthlyExpenses) || 0,
        existingLoans: req.body.existingLoans,
        lenderName: req.body.lenderName || "",
        outstandingBalance: Number(req.body.outstandingBalance) || 0,
        monthlyRepayment: Number(req.body.monthlyRepayment) || 0,
      },

      documents: {
        idDocument: getFileUrls("idDocument")[0] || null,
        businessDocs: getFileUrls("businessDocs"),
        bankStatements: getFileUrls("bankStatements"),
        ownerIds: getFileUrls("ownerIds"),
      },

      consent: {
        certifyInfo: req.body.certifyInfo === "true" || req.body.certifyInfo === "on",
        authorizeVerification:
          req.body.authorizeVerification === "true" || req.body.authorizeVerification === "on",
        agreeTerms: req.body.agreeTerms === "true" || req.body.agreeTerms === "on",
        digitalSignature: req.body.digitalSignature,
        preferredContact: req.body.preferredContact || "email",
      },
    };

    const newApplication = await LoanForm.create(applicationData);

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: newApplication,
    });
  } catch (error) {
    console.error("❌ CREATE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit application",
      error: error.message,
    });
  }
};

/* ===============================
   GET ALL APPLICATIONS
================================ */
export const getAllApplications = async (req, res) => {
  try {
    const applications = await LoanForm.find().sort({ createdAt: -1 });
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===============================
   GET APPLICATION BY ID (_id)
================================ */
export const getApplicationById = async (req, res) => {
  try {
    const application = await LoanForm.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }
    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===============================
   UPDATE STATUS
================================ */
export const updateApplicationStatus = async (req, res) => {
  try {
    const validStatuses = ["Pending Review", "Under Review", "Approved", "Rejected"];
    if (!validStatuses.includes(req.body.status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const updated = await LoanForm.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===============================
   DELETE APPLICATION
================================ */
export const deleteApplication = async (req, res) => {
  try {
    const deleted = await LoanForm.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }
    res.json({ success: true, message: "Application deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===============================
   APPLICATION STATS
================================ */
export const getApplicationStats = async (req, res) => {
  try {
    const total = await LoanForm.countDocuments();
    const approved = await LoanForm.countDocuments({ status: "Approved" });

    res.json({
      success: true,
      data: {
        totalApplications: total,
        approvedApplications: approved,
        approvalRate: total ? ((approved / total) * 100).toFixed(2) : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
