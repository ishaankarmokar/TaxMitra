const { Sequelize, DataTypes } = require('sequelize');

// Sequelize Setup
const sequelize = new Sequelize('taxmitra_db', 'root', 'opushona', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false
    }
});

// Define TaxSlab Model
const TaxSlab = sequelize.define('Tax_Slabs', {
    slab_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    financial_year: { type: DataTypes.STRING, allowNull: false },
    regime: { type: DataTypes.ENUM('old', 'new'), allowNull: false },
    income_lower: { type: DataTypes.DECIMAL(15,2), allowNull: false },
    income_upper: { type: DataTypes.DECIMAL(15,2), allowNull: true },
    tax_rate: { type: DataTypes.DECIMAL(5,2), allowNull: false }
});

// Seed Data
const taxSlabs = [
    // New Regime for FY 2023-24
    { financial_year: '2023-24', regime: 'new', income_lower: 0, income_upper: 300000, tax_rate: 0 },
    { financial_year: '2023-24', regime: 'new', income_lower: 300000, income_upper: 600000, tax_rate: 5 },
    { financial_year: '2023-24', regime: 'new', income_lower: 600000, income_upper: 900000, tax_rate: 10 },
    { financial_year: '2023-24', regime: 'new', income_lower: 900000, income_upper: 1200000, tax_rate: 15 },
    { financial_year: '2023-24', regime: 'new', income_lower: 1200000, income_upper: 1500000, tax_rate: 20 },
    { financial_year: '2023-24', regime: 'new', income_lower: 1500000, income_upper: null, tax_rate: 30 },

    // Old Regime for FY 2023-24
    { financial_year: '2023-24', regime: 'old', income_lower: 0, income_upper: 250000, tax_rate: 0 },
    { financial_year: '2023-24', regime: 'old', income_lower: 250000, income_upper: 500000, tax_rate: 5 },
    { financial_year: '2023-24', regime: 'old', income_lower: 500000, income_upper: 1000000, tax_rate: 20 },
    { financial_year: '2023-24', regime: 'old', income_lower: 1000000, income_upper: null, tax_rate: 30 },

    // New Regime for FY 2024-25
    { financial_year: '2024-25', regime: 'new', income_lower: 0, income_upper: 300000, tax_rate: 0 },
    { financial_year: '2024-25', regime: 'new', income_lower: 300000, income_upper: 600000, tax_rate: 5 },
    { financial_year: '2024-25', regime: 'new', income_lower: 600000, income_upper: 900000, tax_rate: 10 },
    { financial_year: '2024-25', regime: 'new', income_lower: 900000, income_upper: 1200000, tax_rate: 15 },
    { financial_year: '2024-25', regime: 'new', income_lower: 1200000, income_upper: 1500000, tax_rate: 20 },
    { financial_year: '2024-25', regime: 'new', income_lower: 1500000, income_upper: null, tax_rate: 30 },

    // Old Regime for FY 2024-25
    { financial_year: '2024-25', regime: 'old', income_lower: 0, income_upper: 300000, tax_rate: 0 },
    { financial_year: '2024-25', regime: 'old', income_lower: 300000, income_upper: 600000, tax_rate: 5 },
    { financial_year: '2024-25', regime: 'old', income_lower: 600000, income_upper: 1000000, tax_rate: 20 },
    { financial_year: '2024-25', regime: 'old', income_lower: 1000000, income_upper: 1500000, tax_rate: 25 },
    { financial_year: '2024-25', regime: 'old', income_lower: 1500000, income_upper: null, tax_rate: 30 },
];

async function seedTaxSlabs() {
    try {
        // Sync the model with the database
        await sequelize.sync({ force: false });

        // Insert the tax slabs
        await TaxSlab.bulkCreate(taxSlabs);
        console.log('Tax slabs seeded successfully!');
    } catch (error) {
        console.error('Error seeding tax slabs:', error);
    } finally {
        await sequelize.close();
    }
}

seedTaxSlabs();