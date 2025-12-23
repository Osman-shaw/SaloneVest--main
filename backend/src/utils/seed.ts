import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Investment from '../models/Investment';
import connectDB from '../config/db';

dotenv.config();

const seedInvestments = async () => {
    try {
        await connectDB();

        // Clear existing investments
        await Investment.deleteMany({});

        const investments = [
            {
                name: "Freetown Agro-Processing Hub",
                description: "Modern cassava processing facility creating local jobs and export opportunities",
                type: "startup",
                category: "growth",
                risk: "moderate",
                expectedYield: 18.5,
                minimumInvestment: 100,
                targetAmount: 50000,
                totalRaised: 12500,
                status: "active",
                details: {
                    sector: "Agriculture",
                    location: "Freetown",
                    duration: "3 years",
                    verified: true,
                }
            },
            {
                name: "Sierra Leone Treasury Bills",
                description: "Government-backed short-term securities with guaranteed returns",
                type: "bond",
                category: "income",
                risk: "low",
                expectedYield: 12.0,
                minimumInvestment: 500,
                targetAmount: 100000,
                totalRaised: 75000,
                status: "active",
                details: {
                    sector: "Government",
                    location: "Nationwide",
                    duration: "91 days",
                    verified: true,
                }
            },
            {
                name: "Tech Skills Training Fund",
                description: "Invest in coding bootcamps empowering Sierra Leone youth",
                type: "fund",
                category: "impact",
                risk: "moderate",
                expectedYield: 15.0,
                minimumInvestment: 50,
                targetAmount: 25000,
                totalRaised: 8000,
                status: "active",
                details: {
                    sector: "Education",
                    location: "Freetown, Bo, Kenema",
                    duration: "2 years",
                    verified: true,
                }
            },
            {
                name: "Solar Power Distribution",
                description: "Clean energy solutions for rural communities",
                type: "startup",
                category: "impact",
                risk: "high",
                expectedYield: 22.0,
                minimumInvestment: 250,
                targetAmount: 75000,
                totalRaised: 15000,
                status: "active",
                details: {
                    sector: "Energy",
                    location: "Provincial Districts",
                    duration: "4 years",
                    verified: true,
                }
            },
            {
                name: "Microfinance Growth Fund",
                description: "Support small business lending across Sierra Leone",
                type: "fund",
                category: "growth",
                risk: "moderate",
                expectedYield: 16.5,
                minimumInvestment: 200,
                targetAmount: 60000,
                totalRaised: 30000,
                status: "active",
                details: {
                    sector: "Financial Services",
                    location: "Nationwide",
                    duration: "3 years",
                    verified: true,
                }
            },
            {
                name: "Infrastructure Development Bonds",
                description: "Finance critical road and bridge projects",
                type: "bond",
                category: "income",
                risk: "low",
                expectedYield: 14.0,
                minimumInvestment: 1000,
                targetAmount: 150000,
                totalRaised: 90000,
                status: "active",
                details: {
                    sector: "Infrastructure",
                    location: "National Projects",
                    duration: "5 years",
                    verified: true,
                }
            },
        ];

        await Investment.insertMany(investments);

        console.log('✅ Seed data inserted successfully');
        console.log(`📊 ${investments.length} investments created`);

        mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedInvestments();
