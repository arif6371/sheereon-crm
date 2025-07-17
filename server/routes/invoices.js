import express from 'express';
import Invoice from '../models/Invoice.js';
import { authenticateToken, requireAccounts } from '../middleware/auth.js';

const router = express.Router();

// Get all invoices
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, clientCompany, startDate, endDate } = req.query;
    
    let query = {};
    
    // Apply filters
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (clientCompany) {
      query['client.company'] = { $regex: clientCompany, $options: 'i' };
    }
    
    if (startDate && endDate) {
      query.issueDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const invoices = await Invoice.find(query)
      .populate('project', 'name projectId')
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ issueDate: -1 })
      .limit(100);

    res.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ 
      message: 'Failed to fetch invoices',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Create new invoice
router.post('/', authenticateToken, requireAccounts, async (req, res) => {
  try {
    const { 
      client, 
      project, 
      items, 
      tax, 
      discount, 
      dueDate, 
      notes, 
      terms 
    } = req.body;

    // Validate required fields
    if (!client || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        message: 'Client information and items are required' 
      });
    }

    // Calculate amounts
    const subtotal = items.reduce((sum, item) => {
      item.amount = item.quantity * item.rate;
      return sum + item.amount;
    }, 0);

    const taxRate = tax?.rate || 18;
    const taxAmount = (subtotal * taxRate) / 100;
    const discountAmount = discount || 0;
    const total = subtotal + taxAmount - discountAmount;

    // Generate unique invoice ID
    const invoiceId = Invoice.generateInvoiceId();

    const invoice = new Invoice({
      invoiceId,
      client,
      project,
      items,
      subtotal,
      tax: {
        rate: taxRate,
        amount: taxAmount
      },
      discount: discountAmount,
      total,
      dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
      notes: notes?.trim(),
      terms: terms?.trim(),
      createdBy: req.user._id
    });

    await invoice.save();
    await invoice.populate('project', 'name projectId');
    await invoice.populate('createdBy', 'name email');

    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to('role_accounts').emit('invoice_created', {
        invoice: {
          id: invoice._id,
          invoiceId: invoice.invoiceId,
          client: invoice.client.company,
          total: invoice.total,
          status: invoice.status
        },
        notification: {
          type: 'info',
          title: 'New Invoice Created',
          message: `Invoice ${invoice.invoiceId} created for ${invoice.client.company}`,
          priority: 'medium'
        }
      });
    }

    res.status(201).json({
      message: 'Invoice created successfully',
      invoice
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ 
      message: 'Failed to create invoice',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update invoice
router.put('/:id', authenticateToken, requireAccounts, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Don't allow editing paid invoices
    if (invoice.status === 'paid') {
      return res.status(400).json({ message: 'Cannot edit paid invoices' });
    }

    const allowedUpdates = [
      'client', 'items', 'tax', 'discount', 'dueDate', 'notes', 'terms'
    ];

    // Update allowed fields
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        invoice[field] = req.body[field];
      }
    });

    // Recalculate totals if items changed
    if (req.body.items) {
      invoice.subtotal = invoice.items.reduce((sum, item) => {
        item.amount = item.quantity * item.rate;
        return sum + item.amount;
      }, 0);
      
      invoice.tax.amount = (invoice.subtotal * invoice.tax.rate) / 100;
      invoice.total = invoice.subtotal + invoice.tax.amount - invoice.discount;
    }

    await invoice.save();

    res.json({
      message: 'Invoice updated successfully',
      invoice
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ 
      message: 'Failed to update invoice',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update invoice status
router.put('/:id/status', authenticateToken, requireAccounts, async (req, res) => {
  try {
    const { status, paymentMethod, paymentReference } = req.body;
    
    if (!['draft', 'sent', 'paid', 'overdue', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    invoice.status = status;

    if (status === 'paid') {
      invoice.paidDate = new Date();
      if (paymentMethod) invoice.paymentMethod = paymentMethod;
      if (paymentReference) invoice.paymentReference = paymentReference;
    }

    await invoice.save();

    // Emit real-time notification for payment
    if (status === 'paid') {
      const io = req.app.get('io');
      if (io) {
        io.emit('payment_received', {
          invoice: {
            id: invoice._id,
            invoiceId: invoice.invoiceId,
            client: invoice.client.company,
            total: invoice.total
          },
          notification: {
            type: 'success',
            title: 'Payment Received',
            message: `Payment received for invoice ${invoice.invoiceId}`,
            priority: 'high'
          }
        });
      }
    }

    res.json({
      message: 'Invoice status updated successfully',
      invoice
    });
  } catch (error) {
    console.error('Error updating invoice status:', error);
    res.status(500).json({ 
      message: 'Failed to update invoice status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get invoice statistics
router.get('/stats', authenticateToken, requireAccounts, async (req, res) => {
  try {
    const { year, month } = req.query;
    
    let dateQuery = {};
    if (year && month) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);
      dateQuery = {
        issueDate: {
          $gte: startDate,
          $lte: endDate
        }
      };
    } else if (year) {
      const startDate = new Date(parseInt(year), 0, 1);
      const endDate = new Date(parseInt(year), 11, 31);
      dateQuery = {
        issueDate: {
          $gte: startDate,
          $lte: endDate
        }
      };
    }

    const stats = await Invoice.aggregate([
      { $match: dateQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$total' }
        }
      }
    ]);

    const totalInvoices = await Invoice.countDocuments(dateQuery);
    const totalRevenue = await Invoice.aggregate([
      { $match: { ...dateQuery, status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const overdueInvoices = await Invoice.countDocuments({
      ...dateQuery,
      status: { $in: ['sent', 'overdue'] },
      dueDate: { $lt: new Date() }
    });

    res.json({
      totalInvoices,
      totalRevenue: totalRevenue[0]?.total || 0,
      overdueInvoices,
      statusBreakdown: stats
    });
  } catch (error) {
    console.error('Error fetching invoice stats:', error);
    res.status(500).json({ 
      message: 'Failed to fetch invoice statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;