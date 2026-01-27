import LoanForm from "../models/loanForm.model.js";

// CREATE - Submit new loan application
export const createLoanApplication = async (req, res) => {
  try {
    const files = req.files;

    const getFileUrls = (field) =>
      files?.[field] ? files[field].map((file) => file.path) : [];

    console.log("📥 Received application data:", req.body);

    // Generate unique application ID
    const applicationId = "APP-" + Date.now();

    // Prepare application data
    const applicationData = {
      id: applicationId,
      applicant: {
        fullName: req.body.fullName,
        email: req.body.email,
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
        ownershipPercentage: parseInt(req.body.ownershipPercentage),
      },
      loan: {
        amount: parseFloat(req.body.loanAmount),
        purpose: req.body.loanPurpose,
        term: parseInt(req.body.repaymentTerm),
        startDate: req.body.proposedStartDate,
      },
      financial: {
        annualRevenue: parseFloat(req.body.annualRevenue),
        monthlySales: parseFloat(req.body.monthlySales),
        monthlyExpenses: parseFloat(req.body.monthlyExpenses),
        existingLoans: req.body.existingLoans,
        lenderName: req.body.lenderName || "",
        outstandingBalance: parseFloat(req.body.outstandingBalance) || 0,
        monthlyRepayment: parseFloat(req.body.monthlyRepayment) || 0,
      },
      documents: {
        idDocument: files?.idDocument?.[0]?.path || "",
        businessDocs: getFileUrls("businessDocs"),
        bankStatements: getFileUrls("bankStatements"),
        ownerIds: getFileUrls("ownerIds"),
      },
      consent: {
        certifyInfo:
          req.body.certifyInfo === "on" || req.body.certifyInfo === true,
        authorizeVerification:
          req.body.authorizeVerification === "on" ||
          req.body.authorizeVerification === true,
        agreeTerms:
          req.body.agreeTerms === "on" || req.body.agreeTerms === true,
        digitalSignature: req.body.digitalSignature,
        preferredContact: req.body.preferredContact || "email",
      },
      status: "Pending Review",
    };

    // Create and save the application
    const newApplication = new LoanForm(applicationData);
    await newApplication.save();

    console.log("✅ Application saved successfully:", applicationId);

    res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      applicationId: applicationId,
      data: newApplication,
    });
  } catch (error) {
    console.error("❌ Error submitting application:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit application",
      error: error.message,
    });
  }
};

// READ - Get all loan applications
export const getAllApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 100 } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await LoanForm.find(query)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await LoanForm.countDocuments(query);

    console.log(`📊 Fetched ${applications.length} applications`);

    res.status(200).json({
      success: true,
      count: applications.length,
      totalCount: totalCount,
      page: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      data: applications,
    });
  } catch (error) {
    console.error("❌ Error fetching applications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
};

// READ - Get single application by ID
export const getApplicationById = async (req, res) => {
  try {
    const application = await LoanForm.findOne({ id: req.params.id });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    console.log(`📄 Fetched application: ${req.params.id}`);

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error("❌ Error fetching application:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch application",
      error: error.message,
    });
  }
};

// UPDATE - Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "Pending Review",
      "Under Review",
      "Approved",
      "Rejected",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const application = await LoanForm.findOneAndUpdate(
      { id: req.params.id },
      { status: status },
      { new: true },
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    console.log(`✏️ Updated application ${req.params.id} status to: ${status}`);

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: application,
    });
  } catch (error) {
    console.error("❌ Error updating status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message,
    });
  }
};

// DELETE - Delete application
export const deleteApplication = async (req, res) => {
  try {
    const application = await LoanForm.findOneAndDelete({ id: req.params.id });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    console.log(`🗑️ Deleted application: ${req.params.id}`);

    res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting application:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete application",
      error: error.message,
    });
  }
};

// GET - Get application statistics
export const getApplicationStats = async (req, res) => {
  try {
    const totalApplications = await LoanForm.countDocuments();
    const pendingApplications = await LoanForm.countDocuments({
      status: "Pending Review",
    });
    const approvedApplications = await LoanForm.countDocuments({
      status: "Approved",
    });
    const rejectedApplications = await LoanForm.countDocuments({
      status: "Rejected",
    });
    const underReviewApplications = await LoanForm.countDocuments({
      status: "Under Review",
    });

    const loanAmountAgg = await LoanForm.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$loan.amount" },
          averageAmount: { $avg: "$loan.amount" },
        },
      },
    ]);

    const totalLoanAmount =
      loanAmountAgg.length > 0 ? loanAmountAgg[0].totalAmount : 0;
    const averageLoanAmount =
      loanAmountAgg.length > 0 ? loanAmountAgg[0].averageAmount : 0;

    res.status(200).json({
      success: true,
      data: {
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        underReviewApplications,
        totalLoanAmount,
        averageLoanAmount,
        approvalRate:
          totalApplications > 0
            ? ((approvedApplications / totalApplications) * 100).toFixed(2)
            : 0,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: error.message,
    });
  }
};
