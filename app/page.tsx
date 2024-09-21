"use client"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import '@solana/wallet-adapter-react-ui/styles.css';
import { Airdrop } from "../components/Airdrop";
import { SolanaAirdropComponent } from "@/components/solana-airdrop";


export default function Home() {
  return (
    <>
      <ConnectionProvider endpoint={"url here"}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <SolanaAirdropComponent />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}
