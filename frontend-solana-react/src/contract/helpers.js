import {
    Keypair,
    //   PublicKey,
    SYSVAR_CLOCK_PUBKEY,
    SYSVAR_RENT_PUBKEY,
    SystemProgram,
    Transaction,
    TransactionInstruction,
    sendAndConfirmTransaction,
    TransactionSignature,
    Connection,
    LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { NotificationManager } from "react-notifications";
import axios from 'axios';

import {
    ADMIN_WALLET_ON_SOLONA,
    TREASURY_WALLET_KEY,
    GLOBAL_STATE_SEED,
    USER_STATE_SEED,
    VAULT_SEED,
    BACKEND_URL
} from "../config";


const IDL = require("./rps_game.json");
const PublicKey = anchor.web3.PublicKey;
const connection = new anchor.web3.Connection(
    "https://api.devnet.solana.com/",
    // "https://api.metaplex.solana.com/",
    { commitment: "confirmed" }
);

const PROGRAM_ID = new PublicKey(
    "9L6feWtdrLB4nhByePzWRjkToRWbJLgjsN7kVCgvC9gj"
);

// devnet
const PYTH_ACCOUNT = new PublicKey(
    "J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix"
);

// mainnet
// const PYTH_ACCOUNT = new PublicKey(
//     "H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG"
// );

const ADMIN_WALLET = new PublicKey(ADMIN_WALLET_ON_SOLONA);

const TREASURY_WALLET = new PublicKey(TREASURY_WALLET_KEY);

export const getGlobalStateKey = () => {
    console.log("*************************");
    const [globalStateKey] = PublicKey.findProgramAddressSync(
        [Buffer.from(GLOBAL_STATE_SEED), ADMIN_WALLET.toBuffer()],
        PROGRAM_ID
    );
    console.log(
        "getGlobalStateKey*************************",
        globalStateKey.toBase58()
    );
    return globalStateKey;
};

export const getUserStateKey = (userPk) => {
    const [userStateKey] = PublicKey.findProgramAddressSync(
        [Buffer.from(USER_STATE_SEED), userPk.toBuffer()],
        PROGRAM_ID
    );
    console.log(
        "getUserStateKey*************************",
        userStateKey.toBase58()
    );
    return userStateKey;
};

export const getVaultKey = () => {
    const [vaultKey] = PublicKey.findProgramAddressSync(
        [Buffer.from(VAULT_SEED)],
        PROGRAM_ID
    );
    console.log("getVaultKey*************************", vaultKey.toBase58());
    return vaultKey;
};

export const getProgram = (wallet) => {
    console.log("999999999999999", wallet);
    let provider = new anchor.AnchorProvider(
        connection,
        wallet,
        anchor.AnchorProvider.defaultOptions()
    );
    const program = new anchor.Program(IDL, PROGRAM_ID, provider);
    console.log("&&&&&&&&&&&&&&&&&&");
    return program;
};

export const isInitialized = async (wallet) => {
    let program = getProgram(wallet);
    console.log("((((((((((((((");
    try {
        let res = await program.account.globalState.fetch(getGlobalStateKey());
        console.log("1111111111111111111");
        if (res.admin.toBase58() == ADMIN_WALLET.toBase58()) {
            return true;
        }
    } catch (error) { }
    return false;
};

export const initialize = async (wallet) => {
    if (wallet.publicKey === null) throw new WalletNotConnectedError();

    let program = getProgram(wallet);

    const tx = new Transaction().add(
        await program.methods
            .initialize()
            .accounts({
                admin: ADMIN_WALLET,
                globalState: getGlobalStateKey(),
                vault: getVaultKey(),
                systemProgram: SystemProgram.programId,
                rent: SYSVAR_RENT_PUBKEY,
            })
            .instruction()
    );

    return await send(wallet, tx);
};

export const checkBalance = async () => {
    let vaultBal = await connection.getBalance(getVaultKey());
    vaultBal = vaultBal / LAMPORTS_PER_SOL;
    vaultBal = vaultBal.toFixed(2);

    console.log("Vault balance : ", vaultBal);
    return vaultBal;
};

export const setGlobalData = async (
    wallet,
    winPercentage,
    rewardPolicy
) => {
    if (wallet.publicKey === null) throw new WalletNotConnectedError();
    let program = getProgram(wallet, connection);

    const tx = new Transaction().add(
        await program.methods
            .setInfo(
                winPercentage,
                rewardPolicy
            )
            .accounts({
                admin: ADMIN_WALLET,
                globalState: getGlobalStateKey(),
            })
            .instruction()
    );

    return await send(wallet, tx);
};

export const getGlobalData = async (wallet) => {
    if (!wallet.publicKey) {
        return null;
    }

    let program = getProgram(wallet);
    try {
        let res = await program.account.globalState.all([]);
        if (res.length == 0) {
            return null;
        }
        return res[0].account;
    } catch (error) {
        console.log("getGlobalData", error);
    }

    return null;
};

export const depositReward = async (wallet, amount) => {
    if (wallet.publicKey === null) throw new WalletNotConnectedError();

    let program = getProgram(wallet);

    const tx = new Transaction().add(
        await program.methods
            .depositReward(new anchor.BN(anchor.web3.LAMPORTS_PER_SOL * amount))
            .accounts({
                user: wallet.publicKey,
                globalState: getGlobalStateKey(),
                vault: getVaultKey(),
                systemProgram: SystemProgram.programId,
            })
            .instruction()
    );

    return await send(wallet, tx);
};

export const coinFlip = async (wallet, amount, type) => {
    if (wallet.publicKey === null) throw new WalletNotConnectedError();
    console.log("amount ==============> ", amount);
    let program = getProgram(wallet.publicKey);

    const tx = new Transaction().add(
        await program.methods
            .coinflip(
                new anchor.BN(anchor.web3.LAMPORTS_PER_SOL * amount)
            )
            .accounts({
                user: wallet.publicKey,
                pythAccount: PYTH_ACCOUNT,
                globalState: getGlobalStateKey(),
                vault: getVaultKey(),
                userState: getUserStateKey(wallet.publicKey),
                systemProgram: SystemProgram.programId,
                rent: SYSVAR_RENT_PUBKEY,
            })
            .instruction()
    );

    let result = await send(wallet, tx);

    if (result == null) {
        console.log("233-------------------");
        return null;
    }

    let userData = await program.account.userState.fetch(
        getUserStateKey(wallet.publicKey)
    );

    console.log("vault address : ", getVaultKey().toBase58());
    console.log("user data : ", userData);
    console.log("rewards : ", userData.rewardAmount.toString());

    // if (userData.lastSpinresult) {
    //     await program.methods.claimReward().accounts({
    //         user: wallet.publicKey,
    //         globalState: await getGlobalStateKey(globalData.admin),
    //         vault: vaultKey,
    //         userState: userStateKey,
    //     }).rpc();
    // }

    if(userData.lastSpinresult != null)
    {
        axios.post(`${BACKEND_URL}/set_history`, 
        { walletAddress: wallet.publicKey.toString(),
          betAmount:  amount,
          betType: type,
          win: userData.lastSpinresult
          });
    }

    return userData.lastSpinresult;
};

export const betSol = async (wallet, amount) => {
    if (wallet.publicKey === null) throw new WalletNotConnectedError();
    let program = getProgram(wallet);

    const tx = new Transaction().add(
        await program.methods
            .betSol(
                new anchor.BN(anchor.web3.LAMPORTS_PER_SOL * amount),
                new anchor.BN(93571)
            )
            .accounts({
                user: wallet.publicKey,
                pythAccount: PYTH_ACCOUNT,
                globalState: getGlobalStateKey(),
                vault: getVaultKey(),
                userState: getUserStateKey(wallet.publicKey),
                systemProgram: SystemProgram.programId,
                rent: SYSVAR_RENT_PUBKEY,
            })
            .instruction()
    );

    let result = await send(wallet, tx);

    if (result == null) {
        console.log("233-------------------");
        return null;
    }

    let userData = await program.account.userState.fetch(
        getUserStateKey(wallet.publicKey)
    );

    console.log("vault address : ", getVaultKey().toBase58());
    console.log("user data : ", userData);
    console.log("rewards : ", userData.rewardAmount.toString());

    // if (userData.lastSpinresult) {
    //     await program.methods.claimReward().accounts({
    //         user: wallet.publicKey,
    //         globalState: await getGlobalStateKey(globalData.admin),
    //         vault: vaultKey,
    //         userState: userStateKey,
    //     }).rpc();
    // }

    return userData.lastSpinresult;
};

export const isValidAddress = (addr) => {
    try {
        const pk = new PublicKey(addr);
        return true;
    } catch (error) {
        return false;
    }
};

export const getRandomParticipant = async (wallet) => {
    let program = getProgram(wallet);
    let allUsers = await program.account.userState.all([]);
    console.log("all users : ", allUsers);
    let randomIndex = Math.ceil(Math.random() * allUsers.length);
    if (randomIndex == allUsers.length) randomIndex = allUsers.length - 1;
    console.log("index--------------------", randomIndex);
    // console.log(
    //   "Key-------------------",
    //   allUsers[randomIndex].account.user.toBase58()
    // );
    return allUsers[randomIndex].account.user.toBase58();
};

async function send(wallet, transaction) {
    const txHash = await sendTransaction(wallet, transaction);
    if (txHash != null) {
        NotificationManager.info("Confirming Transaction ...");
        let res = await connection.confirmTransaction(txHash);
        console.log(txHash);
        if (res.value.err) {
            console.log("^^^^^^^^^^^^", res.value.err);
            NotificationManager.error(`Transaction Failed : ${txHash}`);
            return null;
        }
        NotificationManager.info(`Transaction Confirmed : ${txHash}`);
    } else {
        NotificationManager.error(`Transaction Failed : ${txHash}`);
        return null;
    }
    return txHash;
}

export async function sendTransaction(wallet, transaction) {
    if (wallet.publicKey === null || wallet.signTransaction === undefined) {
        console.log("375--------------------");
        return null;
    }
    try {
        transaction.recentBlockhash = (
            await connection.getLatestBlockhash()
        ).blockhash;
        transaction.feePayer = wallet.publicKey;
        const signedTransaction = await wallet.signTransaction(transaction);
        const rawTransaction = signedTransaction.serialize();

        NotificationManager.info("Sending Transaction ...");

        const txid = await connection.sendRawTransaction(rawTransaction, {
            skipPreflight: true,
            preflightCommitment: "processed",
        });
        return txid;
    } catch (e) {
        console.log("tx e = ", e);
        return null;
    }
}
