import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { InvestmentEscrow } from "../target/types/investment_escrow";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createMint, createAccount, mintTo } from "@solana/spl-token";
import { assert } from "chai";

describe("investment-escrow", () => {
    // Configure the client to use the local cluster
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.InvestmentEscrow as Program<InvestmentEscrow>;

    // Test accounts
    let admin: Keypair;
    let investor: Keypair;
    let usdcMint: PublicKey;
    let adminTokenAccount: PublicKey;
    let investorTokenAccount: PublicKey;
    let escrowTokenAccount: PublicKey;

    before(async () => {
        // Create test keypairs
        admin = Keypair.generate();
        investor = Keypair.generate();

        // Airdrop SOL to test accounts
        await provider.connection.requestAirdrop(admin.publicKey, 10 * anchor.web3.LAMPORTS_PER_SOL);
        await provider.connection.requestAirdrop(investor.publicKey, 10 * anchor.web3.LAMPORTS_PER_SOL);

        // Wait for airdrops to confirm
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Create USDC mint (6 decimals like real USDC)
        usdcMint = await createMint(
            provider.connection,
            admin,
            admin.publicKey,
            null,
            6
        );

        // Create token accounts
        adminTokenAccount = await createAccount(
            provider.connection,
            admin,
            usdcMint,
            admin.publicKey
        );

        investorTokenAccount = await createAccount(
            provider.connection,
            investor,
            usdcMint,
            investor.publicKey
        );

        escrowTokenAccount = await createAccount(
            provider.connection,
            admin,
            usdcMint,
            admin.publicKey // Escrow authority will be PDA
        );

        // Mint USDC to investor for testing
        await mintTo(
            provider.connection,
            admin,
            usdcMint,
            investorTokenAccount,
            admin,
            1000 * 1e6 // 1000 USDC
        );
    });

    it("Initializes admin account", async () => {
        const [adminPDA] = PublicKey.findProgramAddressSync(
            [Buffer.from("admin")],
            program.programId
        );

        await program.methods
            .initializeAdmin([admin.publicKey])
            .accounts({
                adminAccount: adminPDA,
                admin: admin.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([admin])
            .rpc();

        const adminAccount = await program.account.adminAccount.fetch(adminPDA);
        assert.equal(adminAccount.admins.length, 1);
        assert.equal(adminAccount.admins[0].toString(), admin.publicKey.toString());
    });

    it("Creates an investment opportunity", async () => {
        const investmentId = "test-investment-1";
        const [investmentPDA] = PublicKey.findProgramAddressSync(
            [Buffer.from("investment"), Buffer.from(investmentId)],
            program.programId
        );

        const [adminPDA] = PublicKey.findProgramAddressSync(
            [Buffer.from("admin")],
            program.programId
        );

        await program.methods
            .createInvestment(
                investmentId,
                "Test Investment",
                new anchor.BN(10000 * 1e6), // 10,000 USDC target
                new anchor.BN(100 * 1e6),   // 100 USDC minimum
                1500,                        // 15% yield
                365                          // 1 year duration
            )
            .accounts({
                investmentAccount: investmentPDA,
                adminAccount: adminPDA,
                admin: admin.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([admin])
            .rpc();

        const investment = await program.account.investmentAccount.fetch(investmentPDA);
        assert.equal(investment.name, "Test Investment");
        assert.equal(investment.targetAmount.toNumber(), 10000 * 1e6);
        assert.equal(investment.minInvestment.toNumber(), 100 * 1e6);
    });

    it("Allows investor to invest USDC", async () => {
        const investmentId = "test-investment-1";
        const [investmentPDA] = PublicKey.findProgramAddressSync(
            [Buffer.from("investment"), Buffer.from(investmentId)],
            program.programId
        );

        const [investorPDA] = PublicKey.findProgramAddressSync(
            [Buffer.from("investor"), Buffer.from(investmentId), investor.publicKey.toBuffer()],
            program.programId
        );

        const investAmount = new anchor.BN(500 * 1e6); // 500 USDC

        await program.methods
            .investUsd(investAmount)
            .accounts({
                investmentAccount: investmentPDA,
                investorAccount: investorPDA,
                investorTokenAccount: investorTokenAccount,
                escrowTokenAccount: escrowTokenAccount,
                investor: investor.publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
            })
            .signers([investor])
            .rpc();

        const investorAccount = await program.account.investorAccount.fetch(investorPDA);
        assert.equal(investorAccount.principal.toNumber(), 500 * 1e6);

        const investment = await program.account.investmentAccount.fetch(investmentPDA);
        assert.equal(investment.totalRaised.toNumber(), 500 * 1e6);
    });

    it("Prevents investment below minimum", async () => {
        const investmentId = "test-investment-1";
        const [investmentPDA] = PublicKey.findProgramAddressSync(
            [Buffer.from("investment"), Buffer.from(investmentId)],
            program.programId
        );

        const [investorPDA] = PublicKey.findProgramAddressSync(
            [Buffer.from("investor"), Buffer.from(investmentId), investor.publicKey.toBuffer()],
            program.programId
        );

        const investAmount = new anchor.BN(50 * 1e6); // 50 USDC (below 100 minimum)

        try {
            await program.methods
                .investUsd(investAmount)
                .accounts({
                    investmentAccount: investmentPDA,
                    investorAccount: investorPDA,
                    investorTokenAccount: investorTokenAccount,
                    escrowTokenAccount: escrowTokenAccount,
                    investor: investor.publicKey,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    systemProgram: SystemProgram.programId,
                })
                .signers([investor])
                .rpc();

            assert.fail("Should have thrown error for below minimum investment");
        } catch (err) {
            assert.include(err.toString(), "BelowMinimumInvestment");
        }
    });

    it("Allows admin to distribute returns", async () => {
        const investmentId = "test-investment-1";
        const [investmentPDA] = PublicKey.findProgramAddressSync(
            [Buffer.from("investment"), Buffer.from(investmentId)],
            program.programId
        );

        const [investorPDA] = PublicKey.findProgramAddressSync(
            [Buffer.from("investor"), Buffer.from(investmentId), investor.publicKey.toBuffer()],
            program.programId
        );

        const [adminPDA] = PublicKey.findProgramAddressSync(
            [Buffer.from("admin")],
            program.programId
        );

        const returnAmount = new anchor.BN(75 * 1e6); // 75 USDC return (15% of 500)

        await program.methods
            .distributeReturns(returnAmount)
            .accounts({
                adminAccount: adminPDA,
                investmentAccount: investmentPDA,
                investorAccount: investorPDA,
                escrowTokenAccount: escrowTokenAccount,
                investorTokenAccount: investorTokenAccount,
                admin: admin.publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .signers([admin])
            .rpc();

        const investorAccount = await program.account.investorAccount.fetch(investorPDA);
        assert.equal(investorAccount.currentValue.toNumber(), 575 * 1e6); // 500 + 75
    });
});
