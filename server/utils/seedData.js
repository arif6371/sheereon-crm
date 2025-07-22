import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Lead from '../models/Lead.js';
import Project from '../models/Project.js';
import Notice from '../models/Notice.js';
import Meeting from '../models/Meeting.js';
import Invoice from '../models/Invoice.js';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database with sample data...');

    // Check if data already exists
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('📊 Database already contains data, skipping seed');
      return { message: 'Data already exists' };
    }

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const users = await User.create([
      {
        userId: 'AD-25-001',
        name: 'Admin User',
        email: 'admin@seereon.com',
        password: hashedPassword,
        role: 'Admin',
        department: 'Management',
        status: 'active',
        isEmailVerified: true,
        joinDate: new Date('2020-01-01'),
        onlineStatus: 'offline'
      },
      {
        userId: 'HR-25-002',
        name: 'HR Manager',
        email: 'hr@seereon.com',
        password: hashedPassword,
        role: 'HR',
        department: 'Human Resources',
        status: 'active',
        isEmailVerified: true,
        joinDate: new Date('2021-03-15'),
        onlineStatus: 'offline'
      },
      {
        userId: 'PCF-25-003',
        name: 'Pre-Sales Coordinator',
        email: 'pcf@seereon.com',
        password: hashedPassword,
        role: 'PCF',
        department: 'Pre-Sales',
        status: 'active',
        isEmailVerified: true,
        joinDate: new Date('2022-01-10'),
        onlineStatus: 'offline'
      },
      {
        userId: 'SL-25-004',
        name: 'Sales Executive',
        email: 'sales@seereon.com',
        password: hashedPassword,
        role: 'SALES',
        department: 'Sales',
        status: 'active',
        isEmailVerified: true,
        joinDate: new Date('2022-06-15'),
        onlineStatus: 'offline'
      },
      {
        userId: 'DV-25-005',
        name: 'Senior Developer',
        email: 'dev@seereon.com',
        password: hashedPassword,
        role: 'DEV',
        department: 'Development',
        status: 'active',
        isEmailVerified: true,
        joinDate: new Date('2023-05-20'),
        onlineStatus: 'offline'
      },
      {
        userId: 'DM-25-006',
        name: 'Development Manager',
        email: 'dm@seereon.com',
        password: hashedPassword,
        role: 'DM',
        department: 'Development',
        status: 'active',
        isEmailVerified: true,
        joinDate: new Date('2021-08-15'),
        onlineStatus: 'offline'
      },
      {
        userId: 'AC-25-007',
        name: 'Accounts Manager',
        email: 'accounts@seereon.com',
        password: hashedPassword,
        role: 'Accounts',
        department: 'Finance',
        status: 'active',
        isEmailVerified: true,
        joinDate: new Date('2022-08-15'),
        onlineStatus: 'offline'
      }
    ]);

    console.log('✅ Users created');

    // Create sample leads
    const leads = await Lead.create([
      {
        leadId: Lead.generateLeadId(),
        company: 'TechCorp Solutions',
        industry: 'Technology',
        contact: 'John Smith',
        email: 'john@techcorp.com',
        phone: '+1-555-0123',
        status: 'qualified',
        priority: 'high',
        source: 'Website',
        potentialValue: 75000,
        clientQuotation: 80000,
        finalQuotation: 75000,
        interestedPlatforms: ['Web Development', 'Mobile App'],
        slaAgreed: true,
        ndaSigned: true,
        assignedTo: users[3]._id, // Sales
        assignedBy: users[0]._id, // Admin
        assignedDate: new Date(),
        projectNotes: [
          {
            note: 'Initial discussion completed, client interested in full-stack solution',
            addedBy: users[3]._id,
            addedAt: new Date()
          }
        ]
      },
      {
        leadId: Lead.generateLeadId(),
        company: 'HealthPlus Medical',
        industry: 'Healthcare',
        contact: 'Sarah Johnson',
        email: 'sarah@healthplus.com',
        phone: '+1-555-0124',
        status: 'proposal',
        priority: 'high',
        source: 'Referral',
        potentialValue: 120000,
        clientQuotation: 125000,
        interestedPlatforms: ['ERP System', 'Data Analytics'],
        slaAgreed: false,
        ndaSigned: true,
        assignedTo: users[3]._id,
        assignedBy: users[0]._id,
        assignedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        projectNotes: [
          {
            note: 'Proposal sent, awaiting client feedback',
            addedBy: users[3]._id,
            addedAt: new Date()
          }
        ]
      },
      {
        leadId: Lead.generateLeadId(),
        company: 'FinanceFlow Inc',
        industry: 'Finance',
        contact: 'Mike Wilson',
        email: 'mike@financeflow.com',
        phone: '+1-555-0125',
        status: 'new',
        priority: 'medium',
        source: 'LinkedIn',
        potentialValue: 45000,
        interestedPlatforms: ['Web Development', 'CRM System'],
        slaAgreed: false,
        ndaSigned: false,
        projectNotes: [
          {
            note: 'Lead created, needs initial contact',
            addedBy: users[0]._id,
            addedAt: new Date()
          }
        ]
      }
    ]);

    console.log('✅ Leads created');

    // Create sample projects
    const projects = await Project.create([
      {
        projectId: Project.generateProjectId(),
        name: 'E-commerce Platform Development',
        description: 'Full-stack e-commerce solution with payment integration',
        client: {
          company: 'RetailMax Corp',
          contact: 'Alice Brown',
          email: 'alice@retailmax.com',
          phone: '+1-555-0126'
        },
        status: 'active',
        priority: 'high',
        progress: 65,
        budget: {
          allocated: 150000,
          spent: 97500
        },
        timeline: {
          startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          estimatedHours: 800,
          actualHours: 520
        },
        assignedTeam: [
          {
            user: users[4]._id,
            role: 'Lead Developer',
            assignedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
          }
        ],
        projectManager: users[4]._id,
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        tasks: [
          {
            title: 'User Authentication System',
            description: 'Implement JWT-based authentication',
            assignedTo: users[4]._id,
            status: 'completed',
            priority: 'high',
            estimatedHours: 40,
            actualHours: 35,
            completedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          },
          {
            title: 'Product Catalog Management',
            description: 'Build product CRUD operations',
            assignedTo: users[4]._id,
            status: 'in-progress',
            priority: 'high',
            estimatedHours: 60,
            actualHours: 45
          }
        ]
      },
      {
        projectId: Project.generateProjectId(),
        name: 'Mobile Banking App',
        description: 'Secure mobile banking application for iOS and Android',
        client: {
          company: 'SecureBank Ltd',
          contact: 'Robert Davis',
          email: 'robert@securebank.com',
          phone: '+1-555-0127'
        },
        status: 'planning',
        priority: 'high',
        progress: 15,
        budget: {
          allocated: 200000,
          spent: 30000
        },
        timeline: {
          startDate: new Date(),
          endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
          estimatedHours: 1200
        },
        assignedTeam: [
          {
            user: users[4]._id,
            role: 'Project Manager',
            assignedAt: new Date()
          }
        ],
        projectManager: users[4]._id,
        technologies: ['React Native', 'Node.js', 'PostgreSQL', 'AWS']
      }
    ]);

    console.log('✅ Projects created');

    // Create sample notices
    await Notice.create([
      {
        title: 'Welcome to Seereon CRM System',
        content: 'We are excited to announce the launch of our new CRM system. This platform will help streamline our operations and improve collaboration across all departments.',
        type: 'announcement',
        priority: 'high',
        targetAudience: 'all',
        postedBy: users[0]._id,
        isActive: true
      },
      {
        title: 'Holiday Notice - Independence Day',
        content: 'The office will be closed on August 15th in observance of Independence Day. All employees are requested to plan their work accordingly.',
        type: 'holiday',
        priority: 'medium',
        targetAudience: 'all',
        postedBy: users[1]._id,
        isActive: true,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'New Sales Process Guidelines',
        content: 'Updated sales process guidelines are now available. All sales team members must review and follow the new procedures for lead management and client communication.',
        type: 'policy',
        priority: 'high',
        targetAudience: 'sales',
        postedBy: users[0]._id,
        isActive: true
      }
    ]);

    console.log('✅ Notices created');

    // Create sample meetings
    await Meeting.create([
      {
        title: 'Weekly Team Standup',
        description: 'Weekly development team standup meeting',
        type: 'team',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // Tomorrow + 1 hour
        location: 'office',
        organizer: users[4]._id,
        attendees: [
          { user: users[4]._id, status: 'accepted' }
        ],
        status: 'scheduled'
      },
      {
        title: 'Client Presentation - TechCorp',
        description: 'Project proposal presentation for TechCorp Solutions',
        type: 'client',
        startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 3 days + 2 hours
        location: 'online',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        organizer: users[3]._id,
        attendees: [
          { user: users[3]._id, status: 'accepted' },
          { user: users[0]._id, status: 'invited' }
        ],
        status: 'scheduled'
      }
    ]);

    console.log('✅ Meetings created');

    // Create sample invoice
    await Invoice.create([
      {
        invoiceId: Invoice.generateInvoiceId(),
        client: {
          company: 'TechCorp Solutions',
          contact: 'John Smith',
          email: 'john@techcorp.com',
          phone: '+1-555-0123',
          address: '123 Tech Street, Silicon Valley, CA 94000'
        },
        project: projects[0]._id,
        items: [
          {
            description: 'Web Development Services',
            quantity: 1,
            rate: 75000,
            amount: 75000
          }
        ],
        subtotal: 75000,
        tax: {
          rate: 18,
          amount: 13500
        },
        total: 88500,
        status: 'paid',
        issueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        paidDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        paymentMethod: 'bank_transfer',
        paymentReference: 'TXN123456789',
        createdBy: users[6]._id
      }
    ]);

    console.log('✅ Invoice created');
    console.log('🎉 Database seeded successfully!');

    return {
      users: users.length,
      leads: leads.length,
      projects: projects.length,
      notices: 3,
      meetings: 2,
      invoices: 1
    };
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};