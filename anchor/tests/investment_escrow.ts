import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import * as token from "@solana/spl-token";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { SalonevestProgram } from "../target/types/investment_escrow";

describe("SaloneVest Investment Program", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SalonevestProgram as Program<SalonevestProgram>;

  let investmentEscrowProgram: PublicKey;
  let usdcMint: PublicKey;
  let adminTokenAccount: PublicKey;
  let investorTokenAccount: PublicKey;
  let escrowTokenAccount: PublicKey;

  const investor = Keypair.generate();
  const admin = provider.wallet.publicKey;

  // USDC Mint on Devnet
  const USDC_MINT = new PublicKey("4zMMC9srt5Ri1KseAPa9KUKFdgS2uK4JCT2TSXDKXrm");
  const STARTUP_ID = new PublicKey("11111111111111111111111111111111");

  before(async () => {
    // Airdrop SOL to investor
    await provider.connection.requestAirdrop(investor.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);

    // Get or create token accounts
    adminTokenAccount = (await token.getOrCreateAssociatedTokenAccount(
      provider.connection,
      provider.wallet as any,
      USDC_MINT,
      admin
    )).address;

    investorTokenAccount = (await token.getOrCreateAssociatedTokenAccount(
      provider.connection,
      investor,
      USDC_MINT,
      investor.publicKey
    )).address;

    const escrowPda = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow_authority")],
      program.programId
    )[0];

    escrowTokenAccount = (await token.getOrCreateAssociatedTokenAccount(
      provider.connection,
      provider.wallet as any,
      USDC_MINT,
      escrowPda,
      true
    )).address;
  });

  it("Initializes the program", async () => {
    const configPda = PublicKey.findProgramAddressSync(
      [Buffer.from("config")],
      program.programId
    )[0];

    const escrowStatePda = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow")],
      program.programId
    )[0];

    const tx = await program.methods
      .initializeProgram(admin, new anchor.BN(1_000_000), new anchor.BN(10_000_000_000), 500)
      .accounts({
        payer: admin,
        config: configPda,
        escrowState: escrowStatePda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("✅ Program initialized");
    console.log("Transaction signature:", tx);

    // Verify config was set
    const config = await program.account.programConfig.fetch(configPda);
    console.log("Config:", {
      admin: config.admin.toString(),
      minInvestment: config.minInvestment.toString(),
      maxInvestment: config.maxInvestment.toString(),
      platformFeeBps: config.platformFeeBps,
    });
  });

  it("Records an investment with USDC transfer", async () => {
    // First, mint some USDC to investor (in real scenario, swap fiat to USDC)
    const mintAuthorityKeypair = Keypair.generate();
    
    // Mint 100 USDC to investor
    const mintTx = new anchor.web3.Transaction().add(
      token.createMintToInstruction(
        USDC_MINT,
        investorTokenAccount,
        mintAuthorityKeypair.publicKey,
        100_000_000 // 100 USDC with 6 decimals
      )
    );

    // Create investment record PDA
    const [investmentPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("investment"),
        investor.publicKey.toBuffer(),
        STARTUP_ID.toBuffer(),
      ],
      program.programId
    );

    const [escrowPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow_authority")],
      program.programId
    );

    const [configPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("config")],
      program.programId
    );

    const [escrowStatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow")],
      program.programId
    );

    const investmentAmount = new anchor.BN(50_000_000); // 50 USDC

    const investTx = await program.methods
      .investUsd(investmentAmount, STARTUP_ID, 25) // 25% expected return
      .accounts({
        investor: investor.publicKey,
        investorTokenAccount: investorTokenAccount,
        programEscrowAta: escrowTokenAccount,
        escrowPda: escrowPda,
        investmentRecord: investmentPda,
        config: configPda,
        escrowState: escrowStatePda,
        usdcMint: USDC_MINT,
        tokenProgram: token.TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
      })
      .signers([investor])
      .rpc();

    console.log("✅ Investment recorded");
    console.log("Transaction signature:", investTx);

    // Verify investment record
    const investmentRecord = await program.account.investmentAccount.fetch(investmentPda);
    console.log("Investment Record:", {
      investor: investmentRecord.investor.toString(),
      startupId: investmentRecord.startupId.toString(),
      principalUsd: investmentRecord.principalUsd.toString(),
      expectedReturn: investmentRecord.expectedReturn,
      status: investmentRecord.status,
      investmentDate: investmentRecord.investmentDate.toString(),
    });

    // Verify escrow state was updated
    const escrowState = await program.account.escrowState.fetch(escrowStatePda);
    console.log("Escrow State:", {
      totalEscrow: escrowState.totalEscrow.toString(),
      activeInvestments: escrowState.activeInvestments.toString(),
    });
  });

  it("Releases funds from escrow", async () => {
    const destinationTokenAccount = (await token.getOrCreateAssociatedTokenAccount(
      provider.connection,
      provider.wallet as any,
      USDC_MINT,
      new PublicKey("11111111111111111111111111111112") // dummy startup wallet
    )).address;

    const [escrowPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow_authority")],
      program.programId
    );

    const [configPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("config")],
      program.programId
    );

    const [escrowStatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow")],
      program.programId
    );

    const releaseAmount = new anchor.BN(25_000_000); // 25 USDC

    const releaseTx = await program.methods
      .releaseFunds(STARTUP_ID, releaseAmount)
      .accounts({
        releaseAuthority: admin,
        escrowState: escrowStatePda,
        config: configPda,
        escrowAta: escrowTokenAccount,
        destinationAta: destinationTokenAccount,
        escrowPda: escrowPda,
        usdcMint: USDC_MINT,
        tokenProgram: token.TOKEN_PROGRAM_ID,
      })
      .rpc();

    console.log("✅ Funds released");
    console.log("Transaction signature:", releaseTx);

    // Verify escrow state was updated
    const escrowState = await program.account.escrowState.fetch(escrowStatePda);
    console.log("Updated Escrow State:", {
      totalEscrow: escrowState.totalEscrow.toString(),
      activeInvestments: escrowState.activeInvestments.toString(),
    });
  });
});
