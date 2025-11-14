#  TESTING CHECKLIST

## Step 1: Login
- [ ] Go to http://localhost:3000/login
- [ ] Login with your USN and password
- [ ] Verify redirect to dashboard

## Step 2: Dashboard
- [ ] See your name and USN in header
- [ ] View total pending amount
- [ ] See 4 fee cards (Tuition, Development, Hostel, Exam)
- [ ] Click "View Breakdown" on any fee
- [ ] See detailed breakdown items

## Step 3: Select Fees
- [ ] Check 1 or more fee checkboxes
- [ ] See floating payment button appear
- [ ] Verify total amount calculation
- [ ] Click "Proceed to Payment"

## Step 4: Payment Page
- [ ] Verify correct fee names and amount
- [ ] See live clock updating
- [ ] See 4 payment method buttons
- [ ] Click through each method (slider works)

## Step 5: Crypto Payment
- [ ] Select Crypto payment method
- [ ] Click "Connect Wallet"
- [ ] See MetaMask and other wallets
- [ ] Connect wallet (browser or mobile)
- [ ] Click "Pay 0.0001 ETH"
- [ ] Confirm in wallet
- [ ] Wait for blockchain confirmation
- [ ] See success message

## Step 6: Verify Dashboard Update
- [ ] Auto-redirected to dashboard
- [ ] Previously selected fees now in "Paid Fees" section
- [ ] Paid fees show green checkmark
- [ ] Total pending amount decreased
- [ ] Total paid amount increased

## Step 7: Transaction History
- [ ] Scroll to "Transaction History"
- [ ] See your payment listed
- [ ] Verify fee names shown
- [ ] Verify amount shown
- [ ] Click "View on Etherscan"
- [ ] Etherscan opens in new tab
- [ ] Verify transaction on blockchain

## Step 8: Chat (Bonus)
- [ ] Click chat button (bottom-right)
- [ ] Send global message
- [ ] Click on online user
- [ ] Send private message
- [ ] Verify real-time delivery

##  All Tests Pass = SUPREME PROJECT COMPLETE! 