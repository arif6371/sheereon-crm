import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  invoiceId: {
    type: String,
    unique: true,
    required: true
  },
  client: {
    company: String,
    contact: String,
    email: String,
    phone: String,
    address: String
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  items: [{
    description: String,
    quantity: Number,
    rate: Number,
    amount: Number
  }],
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    rate: {
      type: Number,
      default: 18
    },
    amount: Number
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  paidDate: Date,
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'cheque', 'cash', 'online', 'upi']
  },
  paymentReference: String,
  notes: String,
  terms: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Generate Invoice ID
invoiceSchema.statics.generateInvoiceId = function() {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 9999) + 1;
  return `INV-${year}${month}-${random.toString().padStart(4, '0')}`;
};

// Calculate totals before saving
invoiceSchema.pre('save', function(next) {
  this.subtotal = this.items.reduce((sum, item) => sum + item.amount, 0);
  this.tax.amount = (this.subtotal * this.tax.rate) / 100;
  this.total = this.subtotal + this.tax.amount - this.discount;
  next();
});

export default mongoose.model('Invoice', invoiceSchema);