"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowRight, Sun, Moon, Copy, Send } from "lucide-react"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from "@solana/web3.js"
import { ed25519 } from '@noble/curves/ed25519'
import bs58 from 'bs58'

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
  const [balance, setBalance] = useState<number>()
  const [signature, setSignature] = useState("")
  const [txsignature, setTxSignature] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [recipientAddress, setRecipientAddress] = useState("")
  const [sendAmount, setSendAmount] = useState("")
  const [isSending, setIsSending] = useState(false)

  const { publicKey, signMessage, sendTransaction } = useWallet()
  const wallet = useWallet()
  const { connection } = useConnection()

  async function signTheMessage() {
    if (!publicKey) toast.warn('Wallet not connected!')
    if (!signMessage) toast.warning('Wallet does not support message signing!')
    const message = "rahulhere"
    const encodedMessage = new TextEncoder().encode(message)
    const signature = await signMessage(encodedMessage)

    if (!ed25519.verify(signature, encodedMessage, publicKey?.toBytes())) toast.error('Message signature invalid!')
    toast.success("message signature :" + bs58.encode(signature))
    setSignature(bs58.encode(signature))
  }

  async function showBalance() {
    if (wallet.publicKey) {
      const getBal = await connection.getBalance(wallet.publicKey)
      const balance = getBal / LAMPORTS_PER_SOL
      setBalance(balance)
    }
  }

  useEffect(() => {
    showBalance()
  }, [wallet.publicKey])

  async function requestAirdrop() {
    try {
      setIsLoading(true)
      if (parseFloat(amount) <= 0 || isNaN(parseFloat(amount))) {
        setIsLoading(false)
        toast.error("Please enter a valid amount")
        return
      }

      await connection.requestAirdrop(wallet.publicKey, parseFloat(amount) * LAMPORTS_PER_SOL)
      setIsLoading(false)
      toast.success("Airdropped " + amount + " SOL is Success ")
      showBalance()
    } catch (error) {
      setIsLoading(false)
      console.error("Airdrop failed:", error)
      toast.error("Airdropping failed see console for logs ")
    }
  }

  async function sendSol() {
    if (!publicKey) {
      toast.error("Please connect your wallet")
      return
    }
    if (!recipientAddress || !sendAmount) {
      toast.error("Please enter recipient address and amount")
      return
    }
    try {
      setIsSending(true)
      const recipientPubKey = new PublicKey(recipientAddress)


      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubKey,
          lamports: parseFloat(sendAmount) * LAMPORTS_PER_SOL
        })
      )
      const tansignature = await sendTransaction(transaction, connection)
      // await connection.confirmTransaction(tansignature, 'confirmed')
      toast.success(`Sent ${sendAmount} SOL to ${recipientAddress}`)
      setTxSignature(tansignature)
      showBalance()
    } catch (error) {
      console.error("Failed to send SOL:", error)
      toast.error("Failed to send SOL. See console for details.")
    } finally {
      setIsSending(false)
    }
  }

  const checkWalletConnection = () => {
    if (wallet.publicKey) {
      setIsWalletConnected(true)
      toast.success("Wallet connected successfully")
    } else {
      setIsWalletConnected(false)
      toast.warn("Wallet disconnected")
    }
  }

  useEffect(() => {
    checkWalletConnection()
  }, [wallet.publicKey])

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
              <h1 className={`text-2xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>Airdrop Sol</h1>
            </div>
            <div className="flex items-center space-x-4 ">
              <motion.div
                variants={slideIn}
                className="flex items-center space-x-2 "
              >
                <Switch
                  id="theme-switch"
                  checked={isDarkTheme}
                  onCheckedChange={toggleTheme}
                  className="hidden sm:block"
                />
                <Label htmlFor="theme-switch" className="sr-only">
                  Toggle theme
                </Label>
                {isDarkTheme ? <Moon className="h-4 w-4 text-white  hidden sm:block" /> : <Sun className="h-4 w-4 text-gray-800  hidden sm:block" />}
              </motion.div>
              <motion.div variants={slideIn}>
                <WalletMultiButton />
              </motion.div>
            </div>
          </motion.header>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="w-full"
          >
            <div className="text-white mt-11 pl-24 flex flex-col">
              <Button className={` w-32 ${isDarkTheme ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600' : 'bg-gradient-to-r from-purple-400 to-indigo-400 hover:from-purple-500 hover:to-indigo-500'} text-white`}
                onClick={signTheMessage}
                disabled={!wallet.publicKey}
              >
                {signature ? <div>AUTHENTICATED</div> : <div>AUTHENTICATE</div>}
              </Button>
              {signature ? <div onClick={() => {
                navigator.clipboard.writeText(signature)
                toast.success("Signature Copied to Clipboard")
              }}
                className={`pt-3 text-sm flex flex-row cursor-pointer ${isDarkTheme ? "text-white" : "text-black"}`}>Copy  Signature  <Copy className="w-4  ml-2" /> </div> : null}
            </div>
          </motion.div>

          <main className="flex-grow flex items-center justify-center px-4 py-12">
            <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 1.0, delay: 0.2 }}
              >
                <Card className={`w-[400px] h-[350px] max-w-md ${isDarkTheme ? 'bg-slate-800/50 backdrop-blur-lg' : 'bg-white'} border-0 shadow-2xl`}>
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

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 1.0, delay: 0.4 }}
              >
                <Card className={`w-[400px] h-[350px] max-w-md ${isDarkTheme ? 'bg-slate-800/50 backdrop-blur-lg' : 'bg-white'} border-0 shadow-2xl`}>
                  <CardHeader>
                    <CardTitle className={`text-3xl font-bold text-center ${isDarkTheme ? 'text-white' : 'text-purple-600'}`}>
                      Send SOLANA
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.0, delay: 0.5 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="recipientAddress" className={isDarkTheme ? "text-gray-200" : "text-gray-700"}>
                        Recipient&apos;s Public Address
                      </Label>
                      <Input
                        id="recipientAddress"
                        type="text"
                        placeholder="Enter recipient's address"
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                        className={isDarkTheme ? "bg-slate-700/50 border-slate-600 text-white placeholder-gray-400" : "bg-purple-50 border-purple-200 text-gray-900 placeholder-gray-500"}
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.0, delay: 0.6 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="sendAmount" className={isDarkTheme ? "text-gray-200"

                        : "text-gray-700"}>
                        Amount of SOL to send
                      </Label>
                      <Input
                        id="sendAmount"
                        type="number"
                        placeholder="Enter amount of SOL"
                        value={sendAmount}
                        onChange={(e) => setSendAmount(e.target.value)}
                        className={isDarkTheme ? "bg-slate-700/50 border-slate-600 text-white placeholder-gray-400" : "bg-purple-50 border-purple-200 text-gray-900 placeholder-gray-500"}
                      />
                    </motion.div>
                  </CardContent>
                  <CardFooter>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      className="w-full"
                    >
                      <Button
                        className={`w-full ${isDarkTheme ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600' : 'bg-gradient-to-r from-purple-400 to-indigo-400 hover:from-purple-500 hover:to-indigo-500'} text-white`}
                        onClick={sendSol}
                        disabled={isSending || !isWalletConnected}
                      >
                        {isSending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send {sendAmount} SOL
                            <Send className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                      {isWalletConnected ? <div></div> : <div className="text-red-600 mt-2">Please connect the Wallet First</div>}
                      {txsignature ? <div onClick={() => {
                navigator.clipboard.writeText(txsignature)
                toast.success("Transaction Signature Copied to Clipboard")
              }}
                className={`pt-3 text-sm flex flex-row cursor-pointer ${isDarkTheme ? "text-white" : "text-black"}`}>Copy tan Signature  <Copy className="w-4  ml-2" /> </div> : null}
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </main>

          <motion.footer
            variants={slideIn}
            className={`py-4 text-center text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}
          >
            <div>
              Made with ❤️ by <b>Rahul</b>
            </div>
            © 2024 Solana Airdrop & Send. All rights reserved. Not affiliated with Solana Foundation.
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