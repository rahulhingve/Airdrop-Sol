"use client"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import '@solana/wallet-adapter-react-ui/styles.css';

import { SolanaAirdropComponent } from "@/components/solana-airdrop";


export default function Home() {
  return (
    <>
      <ConnectionProvider endpoint={process.env.NEXT_PUBLIC_DEVNET_ENDPOINT as string}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <SolanaAirdropComponent />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}
