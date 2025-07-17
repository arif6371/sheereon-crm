import express from 'express';
import User from '../models/User.js';
import Lead from '../models/Lead.js';
import Project from '../models/Project.js';
import Attendance from '../models/Attendance.js';
import Invoice from '../models/Invoice.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard data based on user role
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userRole = req.user.role;
    let dashboardData = {};

    switch (userRole) {
      case 'Admin':
        dashboardData = await getAdminDashboard(req.user);
        break;
      case 'HR':
        dashboardData = await getHRDashboard(req.user);
        break;
      case 'BDE':
      case 'DM':
        dashboardData = await getSalesDashboard(req.user);
        break;
      case 'DEV':
      case 'PCF':
        dashboardData = await getDevDashboard(req.user);
        break;
      case 'Accounts':
        dashboardData = await getAccountsDashboard(req.user);
        break;
      default:
        dashboardData = await getBasicDashboard(req.user);
    }

    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ 
      message: 'Failed to fetch dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Admin Dashboard
async function getAdminDashboard(user) {
  const [
    totalEmployees,
    activeProjects,
    totalLeads,
    monthlyRevenue,
    pendingUsers,
    todayAttendance,
    recentActivities
  ] = await Promise.all([
    User.countDocuments({ status: 'active' }),
    Project.countDocuments({ status: 'active' }),
    Lead.countDocuments(),
    Invoice.aggregate([
      { $match: { status: 'paid', paidDate: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]),
    User.countDocuments({ status: 'pending' }),
    Attendance.countDocuments({ date: { $gte: new Date().setHours(0, 0, 0, 0) } }),
    getRecentActivities()
  ]);

  return {
    stats: {
      totalEmployees,
      activeProjects,
      totalLeads,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      pendingUsers,
      attendanceRate: Math.round((todayAttendance / totalEmployees) * 100) || 0
    },
    recentActivities,
    leadStats: await getLeadStatsByStatus(),
    projectStats: await getProjectStatsByStatus()
  };
}

// HR Dashboard
async function getHRDashboard(user) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalEmployees,
    presentToday,
    pendingLeaves,
    pendingApprovals
  ] = await Promise.all([
    User.countDocuments({ status: 'active' }),
    Attendance.countDocuments({ date: { $gte: today }, status: 'present' }),
    Leave.countDocuments({ status: 'pending' }),
    User.countDocuments({ status: 'pending' })
  ]);

  return {
    stats: {
      totalEmployees,
      presentToday,
      pendingLeaves,
      pendingApprovals,
      attendanceRate: Math.round((presentToday / totalEmployees) * 100) || 0
    },
    attendanceData: await getAttendanceData(),
    leaveRequests: await getRecentLeaveRequests()
  };
}

// Sales Dashboard
async function getSalesDashboard(user) {
  const matchQuery = user.role === 'BDE' ? { assignedTo: user._id } : {};

  const [
    activeLeads,
    qualifiedLeads,
    paidLeads,
    pipelineValue
  ] = await Promise.all([
    Lead.countDocuments({ ...matchQuery, status: { $nin: ['paid', 'lost'] } }),
    Lead.countDocuments({ ...matchQuery, status: 'qualified' }),
    Lead.countDocuments({ ...matchQuery, status: 'paid' }),
    Lead.aggregate([
      { $match: matchQuery },
      { $group: { _id: null, total: { $sum: '$potentialValue' } } }
    ])
  ]);

  return {
    stats: {
      activeLeads,
      qualifiedLeads,
      paidLeads,
      pipelineValue: pipelineValue[0]?.total || 0,
      conversionRate: activeLeads > 0 ? Math.round((paidLeads / activeLeads) * 100) : 0
    },
    leadsByStatus: await getLeadStatsByStatus(matchQuery),
    recentLeads: await getRecentLeads(matchQuery)
  };
}

// Development Dashboard
async function getDevDashboard(user) {
  const matchQuery = user.role === 'DEV' ? { 'assignedTeam.user': user._id } : {};

  const [
    activeProjects,
    completedTasks,
    totalTasks,
    openIssues
  ] = await Promise.all([
    Project.countDocuments({ ...matchQuery, status: 'active' }),
    Project.aggregate([
      { $match: matchQuery },
      { $unwind: '$tasks' },
      { $match: { 'tasks.status': 'completed' } },
      { $count: 'completed' }
    ]),
    Project.aggregate([
      { $match: matchQuery },
      { $unwind: '$tasks' },
      { $count: 'total' }
    ]),
    Project.aggregate([
      { $match: matchQuery },
      { $unwind: '$issues' },
      { $match: { 'issues.status': { $in: ['open', 'in-progress'] } } },
      { $count: 'open' }
    ])
  ]);

  return {
    stats: {
      activeProjects,
      completedTasks: completedTasks[0]?.completed || 0,
      totalTasks: totalTasks[0]?.total || 0,
      openIssues: openIssues[0]?.open || 0
    },
    projectsByStatus: await getProjectStatsByStatus(matchQuery),
    recentProjects: await getRecentProjects(matchQuery)
  };
}

// Accounts Dashboard
async function getAccountsDashboard(user) {
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  const [
    monthlyRevenue,
    outstandingInvoices,
    overduePayments,
    totalInvoices
  ] = await Promise.all([
    Invoice.aggregate([
      { $match: { status: 'paid', paidDate: { $gte: currentMonth } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]),
    Invoice.countDocuments({ status: 'sent' }),
    Invoice.countDocuments({ status: 'overdue' }),
    Invoice.countDocuments()
  ]);

  return {
    stats: {
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      outstandingInvoices,
      overduePayments,
      totalInvoices
    },
    recentTransactions: await getRecentTransactions(),
    invoicesByStatus: await getInvoiceStatsByStatus()
  };
}

// Basic Dashboard for other roles
async function getBasicDashboard(user) {
  return {
    stats: {
      totalNotifications: 0,
      unreadNotifications: 0
    },
    recentActivities: []
  };
}

// Helper functions
async function getRecentActivities() {
  // This would typically come from an activity log table
  return [
    { action: 'New employee onboarded', user: 'John Doe', time: '2 hours ago', type: 'success' },
    { action: 'Project milestone completed', user: 'Team Alpha', time: '4 hours ago', type: 'success' },
    { action: 'Invoice payment received', user: 'Client ABC', time: '6 hours ago', type: 'success' },
    { action: 'Leave request pending', user: 'Jane Smith', time: '1 day ago', type: 'warning' }
  ];
}

async function getLeadStatsByStatus(matchQuery = {}) {
  return await Lead.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
}

async function getProjectStatsByStatus(matchQuery = {}) {
  return await Project.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
}

async function getAttendanceData() {
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  return await Attendance.aggregate([
    { $match: { date: { $gte: last7Days } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
        absent: { $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] } },
        late: { $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] } }
      }
    },
    { $sort: { _id: 1 } }
  ]);
}

async function getRecentLeaveRequests() {
  return await Leave.find({ status: 'pending' })
    .populate('employee', 'name userId')
    .sort({ appliedDate: -1 })
    .limit(5);
}

async function getRecentLeads(matchQuery = {}) {
  return await Lead.find(matchQuery)
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 })
    .limit(5);
}

async function getRecentProjects(matchQuery = {}) {
  return await Project.find(matchQuery)
    .populate('projectManager', 'name email')
    .sort({ createdAt: -1 })
    .limit(5);
}

async function getRecentTransactions() {
  return await Invoice.find({ status: 'paid' })
    .sort({ paidDate: -1 })
    .limit(5);
}

async function getInvoiceStatsByStatus() {
  return await Invoice.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        total: { $sum: '$total' }
      }
    }
  ]);
}

export default router;