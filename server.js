const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
// Serve static frontend files
app.use(express.static(__dirname));

// Sequelize Setup
const sequelize = new Sequelize('taxmitra_db', 'root', 'opushona', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false // Disable timestamps globally
    }
});

// Define Models
const User = sequelize.define('Users', {
    user_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('taxpayer', 'consultant', 'admin'), allowNull: false }
}, {
    timestamps: false
})

const Taxpayer = sequelize.define('Taxpayers', {
    taxpayer_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, unique: true },
    pan: { type: DataTypes.STRING, unique: true, allowNull: false },
    aadhaar: { type: DataTypes.STRING, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    address: DataTypes.TEXT,
    phone: DataTypes.STRING,
    date_of_birth: DataTypes.DATE
});

const TaxProfile = sequelize.define('Tax_Profiles', {
    profile_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    taxpayer_id: { type: DataTypes.INTEGER },
    residential_status: { type: DataTypes.ENUM('resident', 'non-resident', 'not_ordinarily_resident'), allowNull: false },
    financial_year: { type: DataTypes.STRING, allowNull: false },
    filing_status: { type: DataTypes.ENUM('individual', 'HUF', 'firm', 'company'), allowNull: false },
    tax_regime: { type: DataTypes.ENUM('old', 'new'), allowNull: false }
});

const IncomeSource = sequelize.define('Income_Sources', {
    income_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    taxpayer_id: { type: DataTypes.INTEGER },
    source_type: { type: DataTypes.ENUM('salary', 'business', 'capital_gains', 'house_property', 'other'), allowNull: false },
    amount: { type: DataTypes.DECIMAL(15,2), allowNull: false },
    description: DataTypes.TEXT,
    financial_year: { type: DataTypes.STRING, allowNull: false }
});

const Deduction = sequelize.define('Deductions', {
    deduction_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    taxpayer_id: { type: DataTypes.INTEGER },
    section: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.DECIMAL(15,2), allowNull: false },
    description: DataTypes.TEXT,
    financial_year: { type: DataTypes.STRING, allowNull: false }
});

const TaxSlab = sequelize.define('Tax_Slabs', {
    slab_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    financial_year: { type: DataTypes.STRING, allowNull: false },
    regime: { type: DataTypes.ENUM('old', 'new'), allowNull: false },
    income_lower: { type: DataTypes.DECIMAL(15,2), allowNull: false },
    income_upper: { type: DataTypes.DECIMAL(15,2), allowNull: true },
    tax_rate: { type: DataTypes.DECIMAL(5,2), allowNull: false }
});

const TaxFiling = sequelize.define('Tax_Filings', {
    filing_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    taxpayer_id: { type: DataTypes.INTEGER },
    financial_year: { type: DataTypes.STRING, allowNull: false },
    itr_form: { type: DataTypes.STRING, allowNull: false },
    filing_date: DataTypes.DATE,
    status: { type: DataTypes.ENUM('draft', 'filed', 'verified'), allowNull: false },
    acknowledgment_number: DataTypes.STRING,
    total_taxable_income: DataTypes.DECIMAL(15,2),
    tax_liability: DataTypes.DECIMAL(15,2)
});

const Payment = sequelize.define('Payments', {
    payment_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    taxpayer_id: { type: DataTypes.INTEGER },
    amount: { type: DataTypes.DECIMAL(15,2), allowNull: false },
    payment_type: { type: DataTypes.ENUM('advance_tax', 'self_assessment', 'tds'), allowNull: false },
    payment_date: { type: DataTypes.DATE, allowNull: false },
    challan_number: DataTypes.STRING
});

const Invoice = sequelize.define('Invoices', {
    invoice_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    taxpayer_id: { type: DataTypes.INTEGER },
    consultant_id: { type: DataTypes.INTEGER },
    amount: { type: DataTypes.DECIMAL(15,2), allowNull: false },
    issue_date: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'paid'), allowNull: false },
    description: DataTypes.TEXT
});

const Consultant = sequelize.define('Consultants', {
    consultant_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, unique: true },
    license_number: DataTypes.STRING,
    specialization: DataTypes.STRING,
    experience_years: DataTypes.INTEGER
});

const TaxpayerConsultant = sequelize.define('Taxpayer_Consultant', {
    mapping_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    taxpayer_id: { type: DataTypes.INTEGER },
    consultant_id: { type: DataTypes.INTEGER },
    assigned_date: { type: DataTypes.DATE, allowNull: false }
});

const AuditLog = sequelize.define('Audit_Logs', {
    log_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER },
    action: { type: DataTypes.STRING, allowNull: false },
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    details: DataTypes.TEXT
});

const TaxpayerSummary = sequelize.define('taxpayer_summary', {
    summary_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    taxpayer_id: { type: DataTypes.INTEGER },
    financial_year: { type: DataTypes.STRING, allowNull: false },
    total_income: DataTypes.DECIMAL(15,2),
    total_deductions: DataTypes.DECIMAL(15,2),
    taxable_income: DataTypes.DECIMAL(15,2),
    tax_liability: DataTypes.DECIMAL(15,2),
    tds_deducted: DataTypes.DECIMAL(15,2)
});

const GSTRegistration = sequelize.define('GST_Registrations', {
    gst_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    taxpayer_id: { type: DataTypes.INTEGER },
    gstin: { type: DataTypes.STRING, unique: true, allowNull: false },
    registration_date: { type: DataTypes.DATE, allowNull: false },
    business_type: DataTypes.STRING,
    state_code: DataTypes.STRING
});

const GSTReturn = sequelize.define('GST_Returns', {
    return_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    gst_id: { type: DataTypes.INTEGER },
    return_type: { type: DataTypes.STRING, allowNull: false },
    filing_date: DataTypes.DATE,
    period: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM('draft', 'filed'), allowNull: false },
    total_tax: DataTypes.DECIMAL(15,2)
});

const TDSDeduction = sequelize.define('TDS_Deductions', {
    tds_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    taxpayer_id: { type: DataTypes.INTEGER },
    deductor_pan: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.DECIMAL(15,2), allowNull: false },
    tds_rate: { type: DataTypes.DECIMAL(5,2), allowNull: false },
    deduction_date: { type: DataTypes.DATE, allowNull: false },
    section: { type: DataTypes.STRING, allowNull: false }
});

const Notification = sequelize.define('Notifications', {
    notification_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER },
    message: { type: DataTypes.TEXT, allowNull: false },
    type: { type: DataTypes.ENUM('filing', 'payment', 'consultant'), allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    is_read: { type: DataTypes.BOOLEAN, defaultValue: false }
});

// Associations
User.hasOne(Taxpayer, { foreignKey: 'user_id' });
Taxpayer.belongsTo(User, { foreignKey: 'user_id' });
Taxpayer.hasMany(TaxProfile, { foreignKey: 'taxpayer_id' });
TaxProfile.belongsTo(Taxpayer, { foreignKey: 'taxpayer_id' });
Taxpayer.hasMany(IncomeSource, { foreignKey: 'taxpayer_id' });
IncomeSource.belongsTo(Taxpayer, { foreignKey: 'taxpayer_id' });
Taxpayer.hasMany(Deduction, { foreignKey: 'taxpayer_id' });
Deduction.belongsTo(Taxpayer, { foreignKey: 'taxpayer_id' });
Taxpayer.hasMany(TaxFiling, { foreignKey: 'taxpayer_id' });
TaxFiling.belongsTo(Taxpayer, { foreignKey: 'taxpayer_id' });
Taxpayer.hasMany(Payment, { foreignKey: 'taxpayer_id' });
Payment.belongsTo(Taxpayer, { foreignKey: 'taxpayer_id' });
Taxpayer.hasMany(Invoice, { foreignKey: 'taxpayer_id' });
Invoice.belongsTo(Taxpayer, { foreignKey: 'taxpayer_id' });
Consultant.hasMany(Invoice, { foreignKey: 'consultant_id' });
Invoice.belongsTo(Consultant, { foreignKey: 'consultant_id' });
User.hasOne(Consultant, { foreignKey: 'user_id' });
Consultant.belongsTo(User, { foreignKey: 'user_id' });
Taxpayer.hasMany(TaxpayerConsultant, { foreignKey: 'taxpayer_id' });
TaxpayerConsultant.belongsTo(Taxpayer, { foreignKey: 'taxpayer_id' });
Consultant.hasMany(TaxpayerConsultant, { foreignKey: 'consultant_id' });
TaxpayerConsultant.belongsTo(Consultant, { foreignKey: 'consultant_id' });
User.hasMany(AuditLog, { foreignKey: 'user_id' });
AuditLog.belongsTo(User, { foreignKey: 'user_id' });
Taxpayer.hasMany(TaxpayerSummary, { foreignKey: 'taxpayer_id' });
TaxpayerSummary.belongsTo(Taxpayer, { foreignKey: 'taxpayer_id' });
Taxpayer.hasMany(GSTRegistration, { foreignKey: 'taxpayer_id' });
GSTRegistration.belongsTo(Taxpayer, { foreignKey: 'taxpayer_id' });
GSTRegistration.hasMany(GSTReturn, { foreignKey: 'gst_id' });
GSTReturn.belongsTo(GSTRegistration, { foreignKey: 'gst_id' });
Taxpayer.hasMany(TDSDeduction, { foreignKey: 'taxpayer_id' });
TDSDeduction.belongsTo(Taxpayer, { foreignKey: 'taxpayer_id' });
User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

// Sync Database
sequelize.sync();

// Authentication Middleware
const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        req.user = decoded;
        next();
    });
};

// Role-Based Middleware
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};

// APIs
// Register User
app.post('/api/register', async (req, res) => {
    const { email, password, role, pan, name, aadhaar } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await User.create({ email, password: hashedPassword, role });
        if (role === 'taxpayer') {
            await Taxpayer.create({ user_id: user.user_id, pan, name, aadhaar });
        } else if (role === 'consultant') {
            await Consultant.create({ user_id: user.user_id });
        }
        await AuditLog.create({ user_id: user.user_id, action: 'register', details: `User ${email} registered as ${role}` });
        res.status(201).json({ message: 'User registered' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ user_id: user.user_id, role: user.role }, 'secret', { expiresIn: '1h' });
    await AuditLog.create({ user_id: user.user_id, action: 'login', details: `User ${email} logged in` });
    res.json({ token, role: user.role });
});

// Tax Calculation
app.post('/api/calculate-tax', authenticate, restrictTo('taxpayer'), async (req, res) => {
    console.log('Calculate tax request:', req.body);
    console.log('User:', req.user);
    try {
        const { taxpayer_id, financial_year, incomes, deductions, tax_regime } = req.body;
        if (!taxpayer_id || !financial_year || !Array.isArray(incomes) || !Array.isArray(deductions) || !tax_regime) {
            console.log('Missing or invalid required fields:', { taxpayer_id, financial_year, incomes, deductions, tax_regime });
            return res.status(400).json({ message: 'Missing or invalid required fields' });
        }
        const taxpayer = await Taxpayer.findOne({ where: { taxpayer_id, user_id: req.user.user_id } });
        if (!taxpayer) {
            console.log('Invalid taxpayer_id:', taxpayer_id, 'for user:', req.user.user_id);
            return res.status(400).json({ message: 'Invalid taxpayer ID' });
        }
        let total_income = 0;
        let total_deductions = 0;

        for (const income of incomes) {
            if (!income.source_type || income.amount == null) {
                console.log('Invalid income data:', income);
                return res.status(400).json({ message: 'Invalid income data' });
            }
            total_income += income.amount;
            await IncomeSource.create({ taxpayer_id, ...income, financial_year });
        }

        for (const deduction of deductions) {
            if (!deduction.section || deduction.amount == null) {
                console.log('Invalid deduction data:', deduction);
                return res.status(400).json({ message: 'Invalid deduction data' });
            }
            total_deductions += deduction.amount;
            await Deduction.create({ taxpayer_id, ...deduction, financial_year });
        }

        const taxable_income = Math.max(total_income - total_deductions, 0);
        const slabs = await TaxSlab.findAll({ where: { financial_year, regime: tax_regime } });
        console.log('Tax slabs:', slabs.map(slab => slab.toJSON()));
        if (slabs.length === 0) {
            console.log('No tax slabs found for:', { financial_year, tax_regime });
            return res.status(400).json({ message: 'No tax slabs found' });
        }
        let tax_liability = 0;

        for (const slab of slabs) {
            if (taxable_income > slab.income_lower && (taxable_income <= slab.income_upper || slab.income_upper === null)) {
                tax_liability = (taxable_income - slab.income_lower) * (slab.tax_rate / 100);
                break;
            }
        }

        tax_liability += tax_liability * 0.04; // 4% cess

        if (tax_liability > 10000) {
            await Notification.create({
                user_id: req.user.user_id,
                message: `Advance tax payment required for FY ${financial_year}. Liability: ₹${tax_liability}`,
                type: 'payment'
            });
        }

        await TaxpayerSummary.create({
            taxpayer_id,
            financial_year,
            total_income,
            total_deductions,
            taxable_income,
            tax_liability,
            tds_deducted: 0
        });

        await AuditLog.create({
            user_id: req.user.user_id,
            action: 'tax_calculation',
            details: `Calculated tax for FY ${financial_year}: ₹${tax_liability}`
        });

        res.json({ taxable_income, tax_liability });
    } catch (error) {
        console.error('Calculate tax error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GST Registration
app.post('/api/gst/register', authenticate, restrictTo('taxpayer'), async (req, res) => {
    try {
        await GSTRegistration.create(req.body);
        await AuditLog.create({
            user_id: req.user.user_id,
            action: 'gst_registration',
            details: `GST registered with GSTIN ${req.body.gstin}`
        });
        res.status(201).json({ message: 'GST registered' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// File GST Return
app.post('/api/gst/file', authenticate, restrictTo('taxpayer'), async (req, res) => {
    try {
        await GSTReturn.create(req.body);
        await AuditLog.create({
            user_id: req.user.user_id,
            action: 'gst_filing',
            details: `Filed ${req.body.return_type} for period ${req.body.period}`
        });
        res.status(201).json({ message: 'GST return filed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Assign Consultant
app.post('/api/consultant/assign', authenticate, restrictTo('consultant'), async (req, res) => {
    try {
        await TaxpayerConsultant.create(req.body);
        await AuditLog.create({
            user_id: req.user.user_id,
            action: 'consultant_assignment',
            details: `Assigned consultant to taxpayer ID ${req.body.taxpayer_id}`
        });
        res.status(201).json({ message: 'Consultant assigned' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Create Invoice
app.post('/api/invoice/create', authenticate, restrictTo('consultant'), async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { taxpayer_id, amount, issue_date, status, description } = req.body;

        // Validate required fields
        if (!taxpayer_id || !amount || !issue_date || !status || !description) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Verify taxpayer exists
        const taxpayer = await Taxpayer.findOne({ where: { taxpayer_id } }, { transaction });
        if (!taxpayer) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Invalid taxpayer ID' });
        }

        // Get consultant_id from authenticated user
        const consultant = await Consultant.findOne({ where: { user_id: req.user.user_id } }, { transaction });
        if (!consultant) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Consultant not found' });
        }

        // Create invoice
        const invoice = await Invoice.create({
            taxpayer_id,
            consultant_id: consultant.consultant_id,
            amount,
            issue_date,
            status,
            description
        }, { transaction });

        // Check if taxpayer-consultant mapping exists
        const existingMapping = await TaxpayerConsultant.findOne({
            where: { taxpayer_id, consultant_id: consultant.consultant_id },
            transaction
        });

        if (!existingMapping) {
            // Create new mapping in Taxpayer_Consultants
            await TaxpayerConsultant.create({
                taxpayer_id,
                consultant_id: consultant.consultant_id,
                assigned_date: new Date()
            }, { transaction });

            // Log consultant assignment
            await AuditLog.create({
                user_id: req.user.user_id,
                action: 'consultant_assignment',
                details: `Assigned consultant ID ${consultant.consultant_id} to taxpayer ID ${taxpayer_id} during invoice creation`
            }, { transaction });
        }

        // Log invoice creation
        await AuditLog.create({
            user_id: req.user.user_id,
            action: 'invoice_creation',
            details: `Created invoice ID ${invoice.invoice_id} for taxpayer ID ${taxpayer_id}`
        }, { transaction });

        await transaction.commit();
        res.status(201).json({ message: 'Invoice created successfully' });
    } catch (error) {
        await transaction.rollback();
        console.error('Error creating invoice:', error);
        res.status(400).json({ message: error.message });
    }
});

// Simplified Dashboard Endpoint (returns only IDs for frontend use)
app.get('/api/dashboard', authenticate, async (req, res) => {
    try {
        if (req.user.role === 'taxpayer') {
            const taxpayer = await Taxpayer.findOne({ where: { user_id: req.user.user_id } });
            if (!taxpayer) return res.status(404).json({ message: 'Taxpayer not found' });
            res.json({ role: 'taxpayer', taxpayer_id: taxpayer.taxpayer_id });
        } else if (req.user.role === 'consultant') {
            const consultant = await Consultant.findOne({ where: { user_id: req.user.user_id } });
            if (!consultant) return res.status(404).json({ message: 'Consultant not found' });
            res.json({ role: 'consultant', consultant_id: consultant.consultant_id });
        } else if (req.user.role === 'admin') {
            res.json({ role: 'admin' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Fetch Taxpayer Summary
app.get('/api/taxpayer/summary/:taxpayer_id', authenticate, restrictTo('taxpayer'), async (req, res) => {
    try {
        const { taxpayer_id } = req.params;
        // Verify taxpayer belongs to the authenticated user
        const taxpayer = await Taxpayer.findOne({ where: { taxpayer_id, user_id: req.user.user_id } });
        if (!taxpayer) {
            return res.status(400).json({ message: 'Invalid taxpayer ID' });
        }
        // Fetch the latest summary (order by financial_year descending)
        const summary = await TaxpayerSummary.findOne({
            where: { taxpayer_id },
            order: [['financial_year', 'DESC']]
        });
        if (!summary) {
            // Return default zeros if no summary exists
            return res.status(200).json({
                total_income: 0,
                total_deductions: 0,
                taxable_income: 0,
                tax_liability: 0,
                financial_year: null
            });
        }
        // Return summary data
        res.status(200).json({
            total_income: summary.total_income || 0,
            total_deductions: summary.total_deductions || 0,
            taxable_income: summary.taxable_income || 0,
            tax_liability: summary.tax_liability || 0,
            financial_year: summary.financial_year
        });
    } catch (error) {
        console.error('Error fetching taxpayer summary:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// New Endpoint: Fetch GST Registrations for a Taxpayer
app.get('/api/gst/registrations/:taxpayer_id', authenticate, restrictTo('taxpayer'), async (req, res) => {
    try {
        const { taxpayer_id } = req.params;
        // Verify taxpayer belongs to the authenticated user
        const taxpayer = await Taxpayer.findOne({ where: { taxpayer_id, user_id: req.user.user_id } });
        if (!taxpayer) {
            return res.status(400).json({ message: 'Invalid taxpayer ID' });
        }
        // Fetch the latest GST registration (order by registration_date descending)
        const registration = await GSTRegistration.findOne({
            where: { taxpayer_id },
            order: [['registration_date', 'DESC']]
        });
        if (!registration) {
            return res.status(404).json({ message: 'No GST registration found' });
        }
        // Return the gst_id and gstin for reference
        res.status(200).json({
            gst_id: registration.gst_id,
            gstin: registration.gstin
        });
    } catch (error) {
        console.error('Error fetching GST registrations:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));