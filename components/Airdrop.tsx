import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";




export function Airdrop(){


    const wallet = useWallet();
    const { connection } = useConnection();

    async function requestAirdrop() {
        const amount = document.getElementById("amount").value;
        try {
            await connection.requestAirdrop(wallet.publicKey, LAMPORTS_PER_SOL * amount);
            alert("Airdropped " + amount + " SOL to " + wallet.publicKey.toBase58());
        } catch (error) {
            console.error("Airdrop failed:", error);
            alert("Airdrop failed: " + error.message);
        }
    }

    return <div>
        <br/><br/>
        {wallet.publicKey?.toBase58()}
        <input id="amount" type="text" placeholder="Amount" />
        <button onClick={requestAirdrop}>Request Airdrop</button>
    </div>
}