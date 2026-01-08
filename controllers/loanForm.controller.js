import LoanForm from "../models/loanForm.model.js";

export const createStepOne = async (req, res) => {
  try {
    const loan = await LoanForm.create({
      applicationForm: req.body,
      currentStep: 1,
    });

    res.status(201).json({
      success: true,
      message: "Step 1 saved",
      applicationId: loan._id,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateStepTwo = async (req, res) => {
  try {
    const { id } = req.params;

    const loan = await LoanForm.findByIdAndUpdate(
      id,
      {
        businessInfo: req.body,
        currentStep: 2,
      },
      { new: true, runValidators: true }
    );

    if (!loan) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    res.json({ success: true, message: "Step 2 saved" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateStepThree = async (req, res) => {
  try {
    const { id } = req.params;

    const loan = await LoanForm.findByIdAndUpdate(
      id,
      {
        loadRequestDetails: req.body,
        currentStep: 3,
      },
      { new: true, runValidators: true }
    );

    if (!loan) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    res.json({ success: true, message: "Step 3 saved" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateStepFour = async (req, res) => {
  try {
    const { id } = req.params;

    const loan = await LoanForm.findByIdAndUpdate(
      id,
      {
        businessFinancialDetails: req.body,
        currentStep: 4,
      },
      { new: true, runValidators: true }
    );

    if (!loan) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    res.json({ success: true, message: "Step 4 saved" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateStepFive = async (req, res) => {
  try {
    const { id } = req.params;

    const loan = await LoanForm.findByIdAndUpdate(
      id,
      {
        documentsUpload: req.body,
        currentStep: 5,
        isCompleted: true,
      },
      { new: true, runValidators: true }
    );

    if (!loan) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    res.json({ success: true, message: "Application submitted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getLoanApplication = async (req, res) => {
  try {
    const loan = await LoanForm.findById(req.params.id);
    if (!loan) return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, data: loan });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
