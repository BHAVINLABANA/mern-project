const adminDashboard = (req, res) => {
  res.status(200).json({
    success: true,
    message: `Welcome SuperAdmin ${req.user.name}`,
  });
};

const vendorDashboard = (req, res) => {
  res.status(200).json({
    success: true,
    message: `Welcome Vendor ${req.user.name}`,
  });
};

const customerDashboard = (req, res) => {
  res.status(200).json({
    success: true,
    message: `Welcome Customer ${req.user.name}`,
  });
};

module.exports = {
  adminDashboard,
  vendorDashboard,
  customerDashboard,
};