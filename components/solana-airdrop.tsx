"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowRight, Sun, Moon } from "lucide-react"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"


const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
}

const slideIn = {
  hidden: { y: 25, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
}

export function SolanaAirdropComponent() {
  const [amount, setAmount] = useState("1")
  const [balance, setBalance] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [isPageLoaded, setIsPageLoaded] = useState(false)





  const wallet = useWallet();
  const { connection } = useConnection();

  async function showBalance() {
    if (wallet.publicKey) {
      const getBal = await connection.getBalance(wallet.publicKey);
      const balance = getBal / LAMPORTS_PER_SOL;
      setBalance(balance)
    }

  }
  
useEffect(()=>{
  showBalance();
},[wallet.publicKey])


  async function requestAirdrop() {

    try {
      setIsLoading(true)
      if (parseFloat(amount) <= 0 || isNaN(parseFloat(amount))) {
        setIsLoading(false)
        toast.error("Please enter a valid amount")
        return
      }


      await connection.requestAirdrop(wallet.publicKey, amount * LAMPORTS_PER_SOL)
      setIsLoading(false)
      toast.success("Airdropped " + amount + " SOL is Success ")
    } catch (error) {
      setIsLoading(false)
      console.error("Airdrop failed:", error);
      toast.error("Airdropping failed se console for logs ")
    }


  }


  const checkWalletConnection = () => {
    if (wallet.publicKey) {
      setIsWalletConnected(true);
      toast.success("Wallet connected successfully");
    } else {
      setIsWalletConnected(false);
      toast.warn("Wallet disconnected");
    }
  };




  useEffect(() => {
    checkWalletConnection();
  }, [wallet.publicKey]);


  useEffect(() => {
    setIsPageLoaded(true)
  }, [])



  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme)
  }






  return (
    <AnimatePresence>
      {isPageLoaded && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={fadeIn}
          className={`min-h-screen flex flex-col ${isDarkTheme ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-slate-100 via-purple-100 to-slate-100'}`}
        >
          <motion.header
            variants={slideIn}
            className="py-8 px-4 flex justify-between items-center"
          >
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <div className={`w-8 h-8 rounded-full ${isDarkTheme ? 'bg-gradient-to-r from-purple-400 to-indigo-500' : 'bg-gradient-to-r from-purple-300 to-indigo-400'}`} />
              </motion.div>
              <h1 className={`text-2xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>Solana Airdrop</h1>
            </div>
            <div className="flex items-center space-x-4">
              <motion.div
                variants={slideIn}
                className="flex items-center space-x-2"
              >
                <Switch
                  id="theme-switch"
                  checked={isDarkTheme}
                  onCheckedChange={toggleTheme}
                />
                <Label htmlFor="theme-switch" className="sr-only">
                  Toggle theme
                </Label>
                {isDarkTheme ? <Moon className="h-4 w-4 text-white" /> : <Sun className="h-4 w-4 text-gray-800" />}
              </motion.div>
              <motion.div variants={slideIn}>

                <WalletMultiButton />
              </motion.div>
            </div>
          </motion.header>

          <main className="flex-grow flex items-center justify-center px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.0, delay: 0.2 }}
            >
              <Card className={`w-full  max-w-md ${isDarkTheme ? 'bg-slate-800/50 backdrop-blur-lg' : 'bg-white'} border-0 shadow-2xl`}>
                <CardHeader>
                  <CardTitle className={`text-3xl font-bold text-center ${isDarkTheme ? 'text-white' : 'text-purple-600'}`}>
                    Claim Your free SOLANA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.0, delay: 0.3 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="amount" className={isDarkTheme ? "text-gray-200" : "text-gray-700"}>
                      Amount of SOL to claim
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount of SOL"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className={isDarkTheme ? "bg-slate-700/50 border-slate-600 text-white placeholder-gray-400" : "bg-purple-50 border-purple-200 text-gray-900 placeholder-gray-500"}
                    />
                  </motion.div>
                </CardContent>
                <CardFooter>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="w-full"
                  >
                    <Button
                      className={`w-full ${isDarkTheme ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600' : 'bg-gradient-to-r from-purple-400 to-indigo-400 hover:from-purple-500 hover:to-indigo-500'} text-white`}
                      onClick={requestAirdrop}
                      disabled={isLoading || !isWalletConnected}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Claiming...
                        </>
                      ) : (
                        <>
                          Claim {amount} SOL
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    {isWalletConnected ? <div></div> : <div className="text-red-600 mt-2">Please connect the Wallet First</div>}
                    {wallet.publicKey ? <div className="text-green-500 font-bold mt-4">Your Balance is: {balance} SOL</div> : null}
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          </main>

          <motion.footer
            variants={slideIn}
            className={`py-4 text-center text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}
          >
            <div>
              Made with ❤️ by <b>Rahul</b>
            </div>
            © 2024 Solana Airdrop. All rights reserved. Not affiliated with Solana Foundation.
          </motion.footer>

          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={isDarkTheme ? "dark" : "light"}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}