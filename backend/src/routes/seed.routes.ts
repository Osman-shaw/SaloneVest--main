import { Router, Request, Response } from 'express';
import Investment from '../models/Investment';

const router = Router();

/**
 * POST /api/seed/investments
 * Seeds the database with vetted investment opportunities
 * Only for development; should be secured in production
 */
router.post('/investments', async (req: Request, res: Response): Promise<void> => {
    try {
        // Check if already seeded
        const count = await Investment.countDocuments();
        if (count > 0) {
            res.status(400).json({
                error: 'Database already contains investments. Clear first if needed.',
                count
            });
            return;
        }

        const investments = [
            // STARTUPS - Technology Sector
            {
                name: "Monime Digital Payments",
                description: "Mobile money and digital payment platform bridging cash and digital finance in Sierra Leone",
                type: "startup",
                category: "growth",
                risk: "high",
                expectedYield: 24.5,
                minimumInvestment: 100,
                targetAmount: 200000,
                totalRaised: 45000,
                status: "active",
                details: {
                    sector: "Fintech",
                    location: "Freetown",
                    duration: "5 years",
                    verified: true,
                }
            },
            {
                name: "DirectEd Learning Platform",
                description: "EdTech platform providing online education and skills training for Sierra Leonean students",
                type: "startup",
                category: "impact",
                risk: "moderate",
                expectedYield: 18.0,
                minimumInvestment: 75,
                targetAmount: 150000,
                totalRaised: 60000,
                status: "active",
                details: {
                    sector: "Education Technology",
                    location: "Freetown, Bo",
                    duration: "4 years",
                    verified: true,
                }
            },
            {
                name: "Afro Mobile Tech",
                description: "Mobile app development and digital solutions for local businesses",
                type: "startup",
                category: "growth",
                risk: "high",
                expectedYield: 22.0,
                minimumInvestment: 150,
                targetAmount: 100000,
                totalRaised: 25000,
                status: "active",
                details: {
                    sector: "Technology",
                    location: "Freetown",
                    duration: "3 years",
                    verified: true,
                }
            },

            // STARTUPS - Agriculture Sector
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
                name: "Sierra Fresh Farms",
                description: "Organic vegetable farming and distribution network serving urban markets",
                type: "startup",
                category: "growth",
                risk: "moderate",
                expectedYield: 16.5,
                minimumInvestment: 200,
                targetAmount: 80000,
                totalRaised: 35000,
                status: "active",
                details: {
                    sector: "Agriculture",
                    location: "Bo, Kenema",
                    duration: "4 years",
                    verified: true,
                }
            },
            {
                name: "Cocoa Export Cooperative",
                description: "Fair-trade cocoa farming cooperative connecting farmers to international markets",
                type: "startup",
                category: "impact",
                risk: "moderate",
                expectedYield: 17.0,
                minimumInvestment: 250,
                targetAmount: 120000,
                totalRaised: 55000,
                status: "active",
                details: {
                    sector: "Agriculture",
                    location: "Kenema, Kailahun",
                    duration: "5 years",
                    verified: true,
                }
            },

            // STARTUPS - Energy Sector
            {
                name: "Easy Solar Distribution",
                description: "Leading distributor of solar energy solutions across West Africa",
                type: "startup",
                category: "impact",
                risk: "low",
                expectedYield: 12.5,
                minimumInvestment: 50,
                targetAmount: 100000,
                totalRaised: 75000,
                status: "active",
                details: {
                    sector: "Clean Energy",
                    location: "Nationwide",
                    duration: "4 years",
                    verified: true,
                }
            },
            {
                name: "Solar Power Distribution",
                description: "Clean energy solutions for rural communities with pay-as-you-go model",
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

            // STARTUPS - Healthcare Sector
            {
                name: "MediConnect Telemedicine",
                description: "Telemedicine platform connecting rural patients with healthcare professionals",
                type: "startup",
                category: "impact",
                risk: "high",
                expectedYield: 20.0,
                minimumInvestment: 100,
                targetAmount: 90000,
                totalRaised: 30000,
                status: "active",
                details: {
                    sector: "Healthcare",
                    location: "Freetown, Provincial",
                    duration: "4 years",
                    verified: true,
                }
            },
            {
                name: "PharmaSL Supply Chain",
                description: "Pharmaceutical distribution network ensuring medicine availability nationwide",
                type: "startup",
                category: "growth",
                risk: "moderate",
                expectedYield: 19.0,
                minimumInvestment: 300,
                targetAmount: 150000,
                totalRaised: 70000,
                status: "active",
                details: {
                    sector: "Healthcare",
                    location: "Nationwide",
                    duration: "5 years",
                    verified: true,
                }
            },

            // STARTUPS - Tourism & Hospitality
            {
                name: "Freetown Beach Resorts",
                description: "Eco-friendly beach resort development promoting sustainable tourism",
                type: "startup",
                category: "growth",
                risk: "high",
                expectedYield: 25.0,
                minimumInvestment: 500,
                targetAmount: 300000,
                totalRaised: 120000,
                status: "active",
                details: {
                    sector: "Tourism",
                    location: "Western Area",
                    duration: "6 years",
                    verified: true,
                }
            },

            // STARTUPS - Manufacturing
            {
                name: "Textiles SL Manufacturing",
                description: "Local textile manufacturing creating jobs and reducing import dependency",
                type: "startup",
                category: "growth",
                risk: "moderate",
                expectedYield: 17.5,
                minimumInvestment: 200,
                targetAmount: 180000,
                totalRaised: 85000,
                status: "active",
                details: {
                    sector: "Manufacturing",
                    location: "Freetown",
                    duration: "5 years",
                    verified: true,
                }
            },

            // GOVERNMENT BONDS & T-BILLS
            {
                name: "Sierra Leone Treasury Bills - 91 Day",
                description: "Government-backed short-term securities with guaranteed returns, 91-day maturity",
                type: "bond",
                category: "income",
                risk: "low",
                expectedYield: 12.0,
                minimumInvestment: 500,
                targetAmount: 100000,
                totalRaised: 75000,
                status: "active",
                details: {
                    sector: "Government Securities",
                    location: "Nationwide",
                    duration: "91 days",
                    verified: true,
                }
            },
            {
                name: "Sierra Leone Treasury Bills - 182 Day",
                description: "Government-backed short-term securities, 182-day maturity with higher yields",
                type: "bond",
                category: "income",
                risk: "low",
                expectedYield: 13.5,
                minimumInvestment: 500,
                targetAmount: 150000,
                totalRaised: 90000,
                status: "active",
                details: {
                    sector: "Government Securities",
                    location: "Nationwide",
                    duration: "182 days",
                    verified: true,
                }
            },
            {
                name: "Sierra Leone Treasury Bills - 364 Day",
                description: "Government-backed one-year securities with competitive yields",
                type: "bond",
                category: "income",
                risk: "low",
                expectedYield: 15.0,
                minimumInvestment: 1000,
                targetAmount: 200000,
                totalRaised: 120000,
                status: "active",
                details: {
                    sector: "Government Securities",
                    location: "Nationwide",
                    duration: "364 days",
                    verified: true,
                }
            },
            {
                name: "Infrastructure Development Bonds",
                description: "Finance critical road and bridge projects across Sierra Leone",
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
            {
                name: "Education Sector Bonds",
                description: "Government bonds financing school construction and educational infrastructure",
                type: "bond",
                category: "income",
                risk: "low",
                expectedYield: 13.0,
                minimumInvestment: 750,
                targetAmount: 120000,
                totalRaised: 65000,
                status: "active",
                details: {
                    sector: "Education",
                    location: "Nationwide",
                    duration: "7 years",
                    verified: true,
                }
            },

            // MUTUAL FUNDS & INDEX FUNDS
            {
                name: "Sierra Leone Growth Fund",
                description: "Diversified mutual fund investing in top-performing Sierra Leonean companies",
                type: "fund",
                category: "growth",
                risk: "moderate",
                expectedYield: 16.5,
                minimumInvestment: 100,
                targetAmount: 250000,
                totalRaised: 140000,
                status: "active",
                details: {
                    sector: "Diversified Portfolio",
                    location: "Nationwide",
                    duration: "Ongoing",
                    verified: true,
                }
            },
            {
                name: "Tech Skills Training Fund",
                description: "Invest in coding bootcamps empowering Sierra Leone youth with tech skills",
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
                name: "Microfinance Growth Fund",
                description: "Support small business lending across Sierra Leone, empowering entrepreneurs",
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
                name: "Women Entrepreneurs Fund",
                description: "Impact fund supporting women-owned businesses and gender equality",
                type: "fund",
                category: "impact",
                risk: "moderate",
                expectedYield: 14.5,
                minimumInvestment: 100,
                targetAmount: 80000,
                totalRaised: 42000,
                status: "active",
                details: {
                    sector: "Social Impact",
                    location: "Nationwide",
                    duration: "4 years",
                    verified: true,
                }
            },
            {
                name: "Agriculture Innovation Fund",
                description: "Fund investing in modern farming techniques and agri-tech startups",
                type: "fund",
                category: "growth",
                risk: "moderate",
                expectedYield: 17.0,
                minimumInvestment: 150,
                targetAmount: 100000,
                totalRaised: 50000,
                status: "active",
                details: {
                    sector: "Agriculture",
                    location: "Nationwide",
                    duration: "5 years",
                    verified: true,
                }
            },
            {
                name: "Clean Energy Impact Fund",
                description: "Renewable energy fund supporting solar, hydro, and wind projects",
                type: "fund",
                category: "impact",
                risk: "moderate",
                expectedYield: 15.5,
                minimumInvestment: 200,
                targetAmount: 150000,
                totalRaised: 75000,
                status: "active",
                details: {
                    sector: "Clean Energy",
                    location: "Nationwide",
                    duration: "6 years",
                    verified: true,
                }
            },
        ];

        const result = await Investment.insertMany(investments);

        res.status(201).json({
            success: true,
            message: 'Database seeded successfully',
            count: result.length,
            investments: result
        });
    } catch (error) {
        console.error('Error seeding investments:', error);
        res.status(500).json({
            error: 'Failed to seed investments',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * DELETE /api/seed/investments/clear
 * Clears all investment data (development only)
 */
router.delete('/investments/clear', async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await Investment.deleteMany({});
        res.json({
            success: true,
            message: 'All investments cleared',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error clearing investments:', error);
        res.status(500).json({
            error: 'Failed to clear investments',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;
