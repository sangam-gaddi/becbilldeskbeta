import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  usn: {
    type: String,
    required: true,
    index: true,
  },
  feeIds: [{
    type: String,
    required: true,
  }],
  amount: {
    type: Number,
    required: true,
  },
  transactionHash: {
    type: String,
    required: true,
    unique: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['crypto', 'upi', 'netbanking', 'cash'],
  },
  status: {
    type: String,
    default: 'completed',
    enum: ['pending', 'completed', 'failed'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);

export default Payment;