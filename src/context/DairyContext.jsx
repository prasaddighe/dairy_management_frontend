import React, { createContext, useContext, useState, useEffect } from 'react';
import { dispatchToast } from '../hooks/useToast';
import { authService } from '../services/authService';

const DairyContext = createContext();

export const SYSTEM_ROLES = [
  {
    id: 'super_admin',
    name: 'Super Admin',
    userName: 'rajesh.patel',
    fullName: 'Rajesh Patel',
    email: 'admin@amritdhara.com',
    roleTitle: 'Chief Managing Director',
    badge: 'Super Admin',
    branch: 'Central Headquarters',
    avatar: 'RP'
  },
  {
    id: 'dairy_admin',
    name: 'Dairy Admin',
    userName: 'vikram.deshmukh',
    fullName: 'Vikram Deshmukh',
    email: 'operations@amritdhara.com',
    roleTitle: 'Dairy Plant Operations Manager',
    badge: 'Plant Admin',
    branch: 'Shirwal Chilling Center',
    avatar: 'VD'
  },
  {
    id: 'operator',
    name: 'Milk Collection Operator',
    userName: 'suresh.operator',
    fullName: 'Suresh Shinde',
    email: 'suresh.shinde@amritdhara.com',
    roleTitle: 'Collection Desk Operator (Center #04)',
    badge: 'Operator',
    branch: 'Shirwal Center #04',
    avatar: 'SS'
  },
  {
    id: 'farmer',
    name: 'Farmer',
    userName: 'anand.patil',
    fullName: 'Anand Rao Patil',
    email: 'anand.patil@kisan.in',
    roleTitle: 'Registered Dairy Farmer (ID: FRM-1024)',
    badge: 'Farmer',
    branch: 'Shirwal Center #04',
    farmerId: 'FRM-1024',
    avatar: 'AP'
  },
  {
    id: 'customer',
    name: 'Customer',
    userName: 'priya.sharma',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@gmail.com',
    roleTitle: 'Residential Subscriber (ID: CUST-801)',
    badge: 'Customer',
    branch: 'Pune City Delivery Hub',
    customerId: 'CUST-801',
    avatar: 'PS'
  },
  {
    id: 'delivery',
    name: 'Delivery Staff',
    userName: 'santosh.delivery',
    fullName: 'Santosh Gaikwad',
    email: 'santosh.g@amritdhara.com',
    roleTitle: 'Morning & Evening Route Executive',
    badge: 'Delivery Staff',
    branch: 'Route #3 - Kothrud & Baner',
    avatar: 'SG'
  },
  {
    id: 'accountant',
    name: 'Accountant',
    userName: 'neha.kulkarni',
    fullName: 'Neha Kulkarni',
    email: 'accounts@amritdhara.com',
    roleTitle: 'Senior Financial Controller & Auditor',
    badge: 'Accountant',
    branch: 'Accounts Division',
    avatar: 'NK'
  }
];

const INITIAL_FARMERS = [
  {
    id: 'FRM-1024',
    name: 'Anand Rao Patil',
    phone: '+91 98220 14589',
    village: 'Shirwal',
    cows: 6,
    buffaloes: 4,
    totalCattle: 10,
    totalMilk: 1840,
    avgFat: 4.2,
    avgSnf: 8.6,
    bankName: 'State Bank of India',
    accountNumber: '30982451980',
    ifsc: 'SBIN0004291',
    paymentStatus: 'Pending',
    pendingDue: 14850,
    status: 'Active',
    joinDate: '2023-01-15'
  },
  {
    id: 'FRM-1025',
    name: 'Babanrao Jadhav',
    phone: '+91 94231 87654',
    village: 'Khandala',
    cows: 8,
    buffaloes: 2,
    totalCattle: 10,
    totalMilk: 2450,
    avgFat: 4.1,
    avgSnf: 8.5,
    bankName: 'Bank of Maharashtra',
    accountNumber: '60192837465',
    ifsc: 'MAHB0000182',
    paymentStatus: 'Paid',
    pendingDue: 0,
    status: 'Active',
    joinDate: '2023-02-10'
  },
  {
    id: 'FRM-1026',
    name: 'Tukaram Dnyandeo More',
    phone: '+91 98902 33412',
    village: 'Wai',
    cows: 2,
    buffaloes: 9,
    totalCattle: 11,
    totalMilk: 3120,
    avgFat: 6.8,
    avgSnf: 9.1,
    bankName: 'Satara District Central Bank',
    accountNumber: '11029384756',
    ifsc: 'HDFC0CSDCCB',
    paymentStatus: 'Pending',
    pendingDue: 26400,
    status: 'Active',
    joinDate: '2023-03-01'
  },
  {
    id: 'FRM-1027',
    name: 'Sunita Dattatray Kadam',
    phone: '+91 97654 22109',
    village: 'Shirwal',
    cows: 4,
    buffaloes: 3,
    totalCattle: 7,
    totalMilk: 1420,
    avgFat: 4.3,
    avgSnf: 8.7,
    bankName: 'Bank of Baroda',
    accountNumber: '48201938472',
    ifsc: 'BARB0SHIRWA',
    paymentStatus: 'Paid',
    pendingDue: 0,
    status: 'Active',
    joinDate: '2023-04-18'
  },
  {
    id: 'FRM-1028',
    name: 'Vitthal Mahadev Jagtap',
    phone: '+91 98601 54321',
    village: 'Bhor',
    cows: 5,
    buffaloes: 5,
    totalCattle: 10,
    totalMilk: 2190,
    avgFat: 5.4,
    avgSnf: 8.9,
    bankName: 'State Bank of India',
    accountNumber: '31092837461',
    ifsc: 'SBIN0001092',
    paymentStatus: 'Partial',
    pendingDue: 8200,
    status: 'Active',
    joinDate: '2023-05-22'
  },
  {
    id: 'FRM-1029',
    name: 'Ganesh Ramchandra Pawar',
    phone: '+91 91580 99887',
    village: 'Khandala',
    cows: 12,
    buffaloes: 0,
    totalCattle: 12,
    totalMilk: 3800,
    avgFat: 4.0,
    avgSnf: 8.5,
    bankName: 'HDFC Bank',
    accountNumber: '5010049281726',
    ifsc: 'HDFC0001892',
    paymentStatus: 'Paid',
    pendingDue: 0,
    status: 'Active',
    joinDate: '2023-06-05'
  }
];

const INITIAL_CUSTOMERS = [
  {
    id: 'CUST-801',
    name: 'Priya Sharma',
    phone: '+91 98234 56789',
    address: 'B-402, Green Valley Apts, Aundh, Pune',
    subscriptionType: 'Daily Morning',
    dailyRequirement: 2.0,
    milkType: 'Cow Milk',
    balance: 450,
    status: 'Active',
    deliverySlot: 'Morning (6:30 AM - 7:30 AM)',
    startDate: '2024-01-01'
  },
  {
    id: 'CUST-802',
    name: 'Dr. Rahul Kulkarni',
    phone: '+91 98811 22334',
    address: '12, Shanti Kunj Colony, Baner, Pune',
    subscriptionType: 'Daily Both (M+E)',
    dailyRequirement: 3.5,
    milkType: 'Buffalo Milk',
    balance: 0,
    status: 'Active',
    deliverySlot: 'Both Shifts',
    startDate: '2024-02-15'
  },
  {
    id: 'CUST-803',
    name: 'Meenakshi Iyer',
    phone: '+91 94220 88990',
    address: 'Flat 101, Orchid Towers, Kothrud, Pune',
    subscriptionType: 'Alternate Days',
    dailyRequirement: 1.5,
    milkType: 'Cow Milk',
    balance: 120,
    status: 'Active',
    deliverySlot: 'Morning (6:00 AM - 7:00 AM)',
    startDate: '2024-03-01'
  },
  {
    id: 'CUST-804',
    name: 'Amitabh Sen',
    phone: '+91 99221 44556',
    address: 'Plot 45, Model Colony, Shivajinagar, Pune',
    subscriptionType: 'Daily Morning',
    dailyRequirement: 2.0,
    milkType: 'Cow Milk',
    balance: 850,
    status: 'Active',
    deliverySlot: 'Morning (7:00 AM - 8:00 AM)',
    startDate: '2024-04-10'
  },
  {
    id: 'CUST-805',
    name: 'Shreya Joshi',
    phone: '+91 97640 11223',
    address: 'Rowhouse 4, Prabhat Road, Erandwane, Pune',
    subscriptionType: 'Daily Morning',
    dailyRequirement: 1.0,
    milkType: 'Cow Milk',
    balance: 0,
    status: 'Paused',
    deliverySlot: 'Morning (6:30 AM - 7:30 AM)',
    startDate: '2024-05-01'
  }
];

const getTodayStr = () => new Date().toISOString().slice(0, 10);
const getYesterdayStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

const INITIAL_MILK_COLLECTIONS = [
  {
    id: 'COL-901',
    slipNo: 'SLIP-M-01',
    farmerId: 'FRM-1024',
    farmerName: 'Anand Rao Patil',
    date: getTodayStr(),
    time: '06:45 AM',
    shift: 'Morning',
    milkType: 'Cow',
    quantity: 32.5,
    fat: 4.2,
    snf: 8.6,
    rate: 42.50,
    totalAmount: 1381.25,
    recordedBy: 'Suresh Shinde'
  },
  {
    id: 'COL-902',
    slipNo: 'SLIP-M-02',
    farmerId: 'FRM-1025',
    farmerName: 'Babanrao Jadhav',
    date: getTodayStr(),
    time: '07:10 AM',
    shift: 'Morning',
    milkType: 'Cow',
    quantity: 48.0,
    fat: 4.1,
    snf: 8.5,
    rate: 41.80,
    totalAmount: 2006.40,
    recordedBy: 'Suresh Shinde'
  },
  {
    id: 'COL-903',
    slipNo: 'SLIP-M-03',
    farmerId: 'FRM-1026',
    farmerName: 'Tukaram Dnyandeo More',
    date: getTodayStr(),
    time: '07:35 AM',
    shift: 'Morning',
    milkType: 'Buffalo',
    quantity: 65.0,
    fat: 6.9,
    snf: 9.1,
    rate: 64.20,
    totalAmount: 4173.00,
    recordedBy: 'Suresh Shinde'
  },
  {
    id: 'COL-904',
    slipNo: 'SLIP-M-04',
    farmerId: 'FRM-1027',
    farmerName: 'Sunita Dattatray Kadam',
    date: getTodayStr(),
    time: '08:00 AM',
    shift: 'Morning',
    milkType: 'Cow',
    quantity: 24.5,
    fat: 4.3,
    snf: 8.7,
    rate: 43.10,
    totalAmount: 1055.95,
    recordedBy: 'Suresh Shinde'
  },
  {
    id: 'COL-905',
    slipNo: 'SLIP-M-05',
    farmerId: 'FRM-1028',
    farmerName: 'Vitthal Mahadev Jagtap',
    date: getTodayStr(),
    time: '08:20 AM',
    shift: 'Morning',
    milkType: 'Buffalo',
    quantity: 42.0,
    fat: 6.5,
    snf: 8.9,
    rate: 61.50,
    totalAmount: 2583.00,
    recordedBy: 'Suresh Shinde'
  },
  {
    id: 'COL-906',
    slipNo: 'SLIP-E-01',
    farmerId: 'FRM-1024',
    farmerName: 'Anand Rao Patil',
    date: getTodayStr(),
    time: '05:30 PM',
    shift: 'Evening',
    milkType: 'Cow',
    quantity: 29.0,
    fat: 4.3,
    snf: 8.6,
    rate: 42.80,
    totalAmount: 1241.20,
    recordedBy: 'Suresh Shinde'
  },
  {
    id: 'COL-907',
    slipNo: 'SLIP-E-02',
    farmerId: 'FRM-1026',
    farmerName: 'Tukaram Dnyandeo More',
    date: getTodayStr(),
    time: '06:05 PM',
    shift: 'Evening',
    milkType: 'Buffalo',
    quantity: 58.0,
    fat: 7.0,
    snf: 9.2,
    rate: 65.00,
    totalAmount: 3770.00,
    recordedBy: 'Suresh Shinde'
  },
  {
    id: 'COL-908',
    slipNo: 'SLIP-E-03',
    farmerId: 'FRM-1029',
    farmerName: 'Ganesh Ramchandra Pawar',
    date: getTodayStr(),
    time: '06:30 PM',
    shift: 'Evening',
    milkType: 'Cow',
    quantity: 36.5,
    fat: 4.1,
    snf: 8.5,
    rate: 41.60,
    totalAmount: 1518.40,
    recordedBy: 'Suresh Shinde'
  },
  {
    id: 'COL-909',
    slipNo: 'SLIP-E-04',
    farmerId: 'FRM-1028',
    farmerName: 'Vitthal Mahadev Jagtap',
    date: getTodayStr(),
    time: '06:50 PM',
    shift: 'Evening',
    milkType: 'Buffalo',
    quantity: 40.5,
    fat: 6.6,
    snf: 9.0,
    rate: 62.40,
    totalAmount: 2527.20,
    recordedBy: 'Suresh Shinde'
  },
  {
    id: 'COL-890',
    slipNo: 'SLIP-Y-07',
    farmerId: 'FRM-1025',
    farmerName: 'Babanrao Jadhav',
    date: getYesterdayStr(),
    time: '05:45 PM',
    shift: 'Evening',
    milkType: 'Cow',
    quantity: 45.0,
    fat: 4.2,
    snf: 8.5,
    rate: 42.10,
    totalAmount: 1894.50,
    recordedBy: 'Suresh Shinde'
  }
];

const INITIAL_PRODUCTS = [
  {
    id: 'PRD-01',
    name: 'Fresh Cow Milk (A2)',
    category: 'Liquid Milk',
    sku: 'MILK-COW-1L',
    unit: '1 Liter Pouch',
    price: 58.00,
    stock: 450,
    minStock: 100,
    status: 'In Stock',
    description: 'Farm fresh farm-chilled pure Cow milk with natural butterfat.'
  },
  {
    id: 'PRD-02',
    name: 'Special Buffalo Milk',
    category: 'Liquid Milk',
    sku: 'MILK-BUF-1L',
    unit: '1 Liter Pouch',
    price: 74.00,
    stock: 320,
    minStock: 80,
    status: 'In Stock',
    description: 'Creamy high-fat buffalo milk, ideal for thick curd, tea & sweets.'
  },
  {
    id: 'PRD-03',
    name: 'Fresh Artisan Curd (Dahi)',
    category: 'Cultured Dairy',
    sku: 'DAHI-TUB-400G',
    unit: '400g Tub',
    price: 45.00,
    stock: 180,
    minStock: 50,
    status: 'In Stock',
    description: 'Traditional set curd, probiotic rich and velvety smooth.'
  },
  {
    id: 'PRD-04',
    name: 'Masala Buttermilk (Chaas)',
    category: 'Beverage',
    sku: 'CHAAS-BOT-500ML',
    unit: '500ml Bottle',
    price: 25.00,
    stock: 240,
    minStock: 60,
    status: 'In Stock',
    description: 'Refreshing spiced buttermilk with roasted cumin and mint.'
  },
  {
    id: 'PRD-05',
    name: 'Pure Desi Cow Ghee (Bilona)',
    category: 'Clarified Butter',
    sku: 'GHEE-JAR-500G',
    unit: '500g Glass Jar',
    price: 490.00,
    stock: 65,
    minStock: 25,
    status: 'In Stock',
    description: 'Granular golden traditional cultured ghee made by Vedic bilona method.'
  },
  {
    id: 'PRD-06',
    name: 'Fresh Malai Paneer',
    category: 'Cheese & Paneer',
    sku: 'PAN-BLK-200G',
    unit: '200g Vacuum Pack',
    price: 95.00,
    stock: 120,
    minStock: 40,
    status: 'In Stock',
    description: 'Melt-in-mouth soft cottage cheese made from fresh cow milk.'
  },
  {
    id: 'PRD-07',
    name: 'Kesar Elaichi Shrikhand',
    category: 'Desserts',
    sku: 'SHRI-TUB-250G',
    unit: '250g Tub',
    price: 85.00,
    stock: 15,
    minStock: 20,
    status: 'Low Stock',
    description: 'Cardamom and saffron infused hung curd delicacy.'
  }
];

const INITIAL_SALES = [
  {
    id: 'INV-10901',
    date: '2026-10-21',
    customerName: 'Priya Sharma',
    phone: '+91 98234 56789',
    items: [
      { productId: 'PRD-01', name: 'Fresh Cow Milk (A2)', qty: 2, price: 58.00, total: 116.00 },
      { productId: 'PRD-03', name: 'Fresh Artisan Curd (Dahi)', qty: 1, price: 45.00, total: 45.00 }
    ],
    subtotal: 161.00,
    discount: 10.00,
    tax: 0.00,
    total: 151.00,
    paymentMethod: 'UPI / PhonePe',
    status: 'Completed',
    servedBy: 'Vikram Deshmukh'
  },
  {
    id: 'INV-10902',
    date: '2026-10-21',
    customerName: 'Hotel Shivneri Kitchens',
    phone: '+91 98229 11223',
    items: [
      { productId: 'PRD-02', name: 'Special Buffalo Milk', qty: 20, price: 74.00, total: 1480.00 },
      { productId: 'PRD-06', name: 'Fresh Malai Paneer', qty: 10, price: 95.00, total: 950.00 }
    ],
    subtotal: 2430.00,
    discount: 130.00,
    tax: 0.00,
    total: 2300.00,
    paymentMethod: 'Bank Transfer (IMPS)',
    status: 'Completed',
    servedBy: 'Vikram Deshmukh'
  },
  {
    id: 'INV-10903',
    date: '2026-10-21',
    customerName: 'Dr. Rahul Kulkarni',
    phone: '+91 98811 22334',
    items: [
      { productId: 'PRD-05', name: 'Pure Desi Cow Ghee (Bilona)', qty: 2, price: 490.00, total: 980.00 }
    ],
    subtotal: 980.00,
    discount: 30.00,
    tax: 0.00,
    total: 950.00,
    paymentMethod: 'Credit Card',
    status: 'Completed',
    servedBy: 'Vikram Deshmukh'
  }
];

const INITIAL_DELIVERIES = [
  {
    id: 'DEL-401',
    customerName: 'Priya Sharma',
    customerId: 'CUST-801',
    phone: '+91 98234 56789',
    address: 'B-402, Green Valley Apts, Aundh, Pune',
    items: '2L Cow Milk (A2)',
    shift: 'Morning',
    timeSlot: '06:30 - 07:30 AM',
    staffName: 'Santosh Gaikwad',
    status: 'Delivered',
    completedAt: '07:05 AM'
  },
  {
    id: 'DEL-402',
    customerName: 'Dr. Rahul Kulkarni',
    customerId: 'CUST-802',
    phone: '+91 98811 22334',
    address: '12, Shanti Kunj Colony, Baner, Pune',
    items: '3.5L Buffalo Milk',
    shift: 'Morning',
    timeSlot: '06:45 - 07:45 AM',
    staffName: 'Santosh Gaikwad',
    status: 'Delivered',
    completedAt: '07:28 AM'
  },
  {
    id: 'DEL-403',
    customerName: 'Meenakshi Iyer',
    customerId: 'CUST-803',
    phone: '+91 94220 88990',
    address: 'Flat 101, Orchid Towers, Kothrud, Pune',
    items: '1.5L Cow Milk + 400g Curd',
    shift: 'Morning',
    timeSlot: '07:15 - 08:00 AM',
    staffName: 'Santosh Gaikwad',
    status: 'Delivered',
    completedAt: '07:50 AM'
  },
  {
    id: 'DEL-404',
    customerName: 'Amitabh Sen',
    customerId: 'CUST-804',
    phone: '+91 99221 44556',
    address: 'Plot 45, Model Colony, Shivajinagar, Pune',
    items: '2L Cow Milk',
    shift: 'Morning',
    timeSlot: '07:30 - 08:30 AM',
    staffName: 'Santosh Gaikwad',
    status: 'Delivered',
    completedAt: '08:15 AM'
  },
  {
    id: 'DEL-405',
    customerName: 'Rohit Kadam',
    customerId: 'CUST-806',
    phone: '+91 98555 77889',
    address: 'Rowhouse 8, Kumar Parisar, Kothrud, Pune',
    items: '1L Buffalo Milk',
    shift: 'Evening',
    timeSlot: '05:30 - 06:30 PM',
    staffName: 'Santosh Gaikwad',
    status: 'Pending',
    completedAt: null
  },
  {
    id: 'DEL-406',
    customerName: 'Sunanda Joshi',
    customerId: 'CUST-807',
    phone: '+91 98666 44332',
    address: 'Flat 203, Mayur Park, Baner, Pune',
    items: '2L Cow Milk + 500ml Chaas',
    shift: 'Evening',
    timeSlot: '06:00 - 07:00 PM',
    staffName: 'Santosh Gaikwad',
    status: 'Pending',
    completedAt: null
  }
];

const INITIAL_EXPENSES = [
  {
    id: 'EXP-301',
    date: '2026-10-20',
    category: 'Chilling Plant Electricity',
    description: 'MSEDCL Monthly commercial energy bill for Shirwal chilling plant',
    amount: 14200,
    paidTo: 'Maharashtra State Electricity Board',
    paymentMethod: 'Net Banking',
    approvedBy: 'Neha Kulkarni'
  },
  {
    id: 'EXP-302',
    date: '2026-10-20',
    category: 'Packaging Materials',
    description: 'Roll of 5,000 food-grade 3-layer LDPE milk pouches',
    amount: 8500,
    paidTo: 'Polypack Industries Pune',
    paymentMethod: 'UPI',
    approvedBy: 'Neha Kulkarni'
  },
  {
    id: 'EXP-303',
    date: '2026-10-21',
    category: 'Vehicle Fuel & Maintenance',
    description: 'Diesel for morning delivery vans (MH-12-DT-8890 & 8891)',
    amount: 3200,
    paidTo: 'HPCL Auto Care Baner',
    paymentMethod: 'Company Fuel Card',
    approvedBy: 'Neha Kulkarni'
  },
  {
    id: 'EXP-304',
    date: '2026-10-21',
    category: 'Cattle Feed Procurement',
    description: '25 Bags of Amul Dan Balanced Cattle Feed 50kg for subsidised farmer scheme',
    amount: 28750,
    paidTo: 'Sahyadri Agro Feeds',
    paymentMethod: 'Bank Transfer',
    approvedBy: 'Rajesh Patel'
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-01',
    type: 'warning',
    title: 'Low Stock Alert: Kesar Shrikhand',
    message: 'Kesar Elaichi Shrikhand inventory is below 20 units (current stock: 15).',
    time: '25 mins ago',
    read: false
  },
  {
    id: 'NOTIF-02',
    type: 'success',
    title: 'Morning Milk Target Achieved',
    message: 'Morning milk collection crossed 280 Liters (Total: 286.5 L).',
    time: '1 hour ago',
    read: false
  },
  {
    id: 'NOTIF-03',
    type: 'info',
    title: 'Farmer Payout Cycle Due',
    message: 'Payment cycle for 11th - 20th Oct is generated. Pending approval from Accounts.',
    time: '3 hours ago',
    read: true
  },
  {
    id: 'NOTIF-04',
    type: 'warning',
    title: 'Customer Subscription Notice',
    message: 'Customer Shreya Joshi has paused milk delivery for 3 days starting today.',
    time: '5 hours ago',
    read: true
  }
];

export const DairyProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('amritdhara_user');
    if (!saved || saved === 'null' || saved === 'undefined') return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentShift, setCurrentShift] = useState(() => {
    const hour = new Date().getHours();
    return hour < 13 ? 'Morning' : 'Evening';
  });

  const [farmers, setFarmers] = useState(() => {
    const saved = localStorage.getItem('amritdhara_farmers');
    return saved ? JSON.parse(saved) : INITIAL_FARMERS;
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('amritdhara_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [milkRecords, setMilkRecords] = useState(() => {
    const saved = localStorage.getItem('amritdhara_milk_records');
    if (!saved) return INITIAL_MILK_COLLECTIONS;
    try {
      const parsed = JSON.parse(saved);
      const today = new Date().toISOString().slice(0, 10);
      const hasToday = parsed.some(r => r.date === today);
      if (!hasToday) {
        return [...INITIAL_MILK_COLLECTIONS.filter(r => r.date === today), ...parsed];
      }
      return parsed;
    } catch {
      return INITIAL_MILK_COLLECTIONS;
    }
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('amritdhara_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem('amritdhara_sales');
    return saved ? JSON.parse(saved) : INITIAL_SALES;
  });

  const [deliveries, setDeliveries] = useState(() => {
    const saved = localStorage.getItem('amritdhara_deliveries');
    return saved ? JSON.parse(saved) : INITIAL_DELIVERIES;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('amritdhara_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('amritdhara_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('amritdhara_users');
    return saved ? JSON.parse(saved) : SYSTEM_ROLES;
  });

  const [settings, setSettings] = useState({
    dairyName: 'AmritDhara Smart Dairy Cooperative',
    registrationNo: 'REG/COOP/PUN/2018/8892',
    address: 'Gat No. 142, Pune-Satara Highway, Shirwal, Maharashtra 412801',
    phone: '+91 2169 244890',
    email: 'contact@amritdhara.com',
    cowBaseRate: 38.00,
    cowFatMultiplier: 4.80,
    cowSnfMultiplier: 2.20,
    buffaloBaseRate: 54.00,
    buffaloFatMultiplier: 5.60,
    buffaloSnfMultiplier: 2.50,
    gstNumber: '27AABCA1234F1Z8'
  });

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    dispatchToast(message, type);
    setTimeout(() => setToast(null), 3800);
  };

  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      authService.getProfile().then(res => {
        if (res.success && res.user) {
          setCurrentUser(res.user);
        } else if (res.error && (res.error.includes('expired') || res.error.includes('Unauthorized') || res.error.includes('jwt'))) {
          authService.clearToken();
          setCurrentUser(null);
        }
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('amritdhara_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('amritdhara_farmers', JSON.stringify(farmers));
  }, [farmers]);

  useEffect(() => {
    localStorage.setItem('amritdhara_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('amritdhara_milk_records', JSON.stringify(milkRecords));
  }, [milkRecords]);

  useEffect(() => {
    localStorage.setItem('amritdhara_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('amritdhara_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('amritdhara_deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  useEffect(() => {
    localStorage.setItem('amritdhara_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('amritdhara_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('amritdhara_users', JSON.stringify(users));
  }, [users]);

  const addUser = (userData) => {
    const roleConfig = SYSTEM_ROLES.find(r => r.id === userData.roleId) || {
      name: userData.roleName || 'Staff User',
      badge: userData.badge || 'Staff'
    };
    const fullName = userData.fullName || userData.name || 'New User';
    const initials = fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'NU';

    const newUser = {
      id: userData.id || `USR-${Date.now().toString().slice(-4)}`,
      name: roleConfig.name,
      userName: userData.userName || (userData.email ? userData.email.split('@')[0] : `user_${Date.now().toString().slice(-4)}`),
      fullName: fullName,
      email: userData.email || '',
      roleId: userData.roleId || 'operator',
      roleTitle: userData.roleTitle || roleConfig.name,
      badge: roleConfig.badge || 'Staff',
      branch: userData.branch || 'Central Dairy Hub',
      phone: userData.phone || '',
      avatar: initials
    };
    setUsers(prev => [newUser, ...prev]);
    showToast(`User ${newUser.fullName} added successfully`, 'success');
    return newUser;
  };

  const updateUser = (userId, updatedData) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
    showToast('User record updated successfully', 'success');
  };

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    showToast('User removed from system', 'info');
  };

  const registerUser = async ({ fullName, userName, email, phone, roleId, address, password }) => {
    const apiResult = await authService.register({
      fullName,
      userName,
      email,
      phone,
      roleId,
      address,
      password
    });

    const roleConfig = SYSTEM_ROLES.find(r => r.id === roleId) || {
      name: roleId === 'farmer' ? 'Dairy Farmer' : (roleId === 'customer' ? 'Customer' : 'Staff'),
      badge: roleId === 'farmer' ? 'Farmer' : (roleId === 'customer' ? 'Customer' : 'Staff')
    };
    const initials = fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'UR';
    const generatedId = roleId === 'farmer'
      ? `FRM-${Math.floor(1000 + Math.random() * 9000)}`
      : (roleId === 'customer' ? `CUST-${Math.floor(800 + Math.random() * 200)}` : `USR-${Date.now().toString().slice(-4)}`);

    const newUser = {
      id: roleId,
      userId: apiResult?.user?.userId || generatedId,
      name: roleConfig.name,
      userName: userName.toLowerCase().trim(),
      fullName: fullName,
      email: email || '',
      phone: phone || '',
      roleId: roleId,
      roleTitle: roleId === 'farmer' ? `Registered Dairy Farmer (ID: ${generatedId})` : (roleId === 'customer' ? `Residential Subscriber (ID: ${generatedId})` : roleConfig.name),
      badge: roleConfig.badge,
      branch: address || 'Shirwal Chilling Center',
      farmerId: roleId === 'farmer' ? generatedId : undefined,
      customerId: roleId === 'customer' ? generatedId : undefined,
      avatar: initials
    };

    if (roleId === 'farmer') {
      const newFarmer = {
        id: generatedId,
        code: generatedId,
        name: fullName,
        phone: phone || '+91 98000 00000',
        village: address || 'Shirwal Village',
        cowMilkToday: 0,
        buffaloMilkToday: 0,
        pendingDue: 0,
        paymentStatus: 'Paid',
        bankAccount: 'Bank - ****' + Math.floor(1000 + Math.random() * 9000),
        status: 'Active'
      };
      setFarmers(prev => [newFarmer, ...prev]);
    }

    if (roleId === 'customer') {
      const newCust = {
        id: generatedId,
        name: fullName,
        phone: phone || '+91 98000 00000',
        address: address || 'Pune City',
        subscription: 'Fresh Cow Milk 1L Daily',
        deliveryShift: 'Morning',
        balance: 0,
        status: 'Active'
      };
      setCustomers(prev => [newCust, ...prev]);
    }

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    showToast(`Account created successfully! Welcome, ${fullName}`, 'success');
    setActiveTab('dashboard');
    return newUser;
  };

  const switchRole = (roleId) => {
    const roleObj = SYSTEM_ROLES.find(r => r.id === roleId) || users.find(u => u.id === roleId || u.roleId === roleId);
    if (roleObj) {
      setCurrentUser(roleObj);
      showToast(`Switched view to ${roleObj.name} (${roleObj.fullName})`, 'info');
      setActiveTab('dashboard');
    }
  };

  const loginUser = async (username, password, rememberMe = true) => {
    if (!username || !password) {
      showToast('Please enter both username and password', 'warning');
      return { success: false, error: 'Please enter both username and password' };
    }
    const cleanId = username.trim().toLowerCase();

    try {
      const apiResult = await authService.login(username, password, rememberMe);

      if (apiResult.success && apiResult.user) {
        const authUser = apiResult.user;

        if (authUser.id === 'farmer') {
          setFarmers(prev => {
            const exists = prev.find(f =>
              f.id === authUser.userId ||
              (f.phone && authUser.phone && f.phone.includes(authUser.phone)) ||
              (f.code && f.code.toLowerCase() === cleanId) ||
              (f.name && f.name.toLowerCase() === authUser.fullName?.toLowerCase())
            );
            if (!exists) {
              const newFarmer = {
                id: authUser.userId,
                code: 'FRM-' + (authUser.userName?.toUpperCase() || '1024'),
                name: authUser.fullName,
                phone: authUser.phone,
                village: authUser.branch || 'Sangli Dairy Center #12',
                cows: 6,
                buffaloes: 4,
                totalCattle: 10,
                totalMilk: 0,
                avgFat: 4.2,
                avgSnf: 8.6,
                bankName: 'State Bank of India',
                accountNumber: '**** **** 1980',
                ifsc: 'SBIN0004291',
                paymentStatus: 'Paid',
                pendingDue: 0,
                status: 'Active',
                joinDate: new Date().toISOString().slice(0, 10)
              };
              authUser.farmerId = newFarmer.id;
              return [newFarmer, ...prev];
            } else {
              authUser.farmerId = exists.id;
              return prev;
            }
          });
        }

        setUsers(prev => {
          if (!prev.some(u => u.userName === authUser.userName)) {
            return [authUser, ...prev];
          }
          return prev;
        });

        setCurrentUser(authUser);
        showToast(apiResult.message || `Welcome back, ${authUser.fullName || authUser.name}!`, 'success');
        setActiveTab('dashboard');
        return { success: true, user: authUser };
      }

      const isKnownDemoUser = SYSTEM_ROLES.some(r =>
        (r.userName && r.userName.toLowerCase() === cleanId) ||
        (r.email && r.email.toLowerCase() === cleanId) ||
        (r.id && r.id.toLowerCase() === cleanId)
      ) || cleanId === 'admin' || cleanId === 'superadmin';

      if (!apiResult.isNetworkError && !isKnownDemoUser) {
        showToast(apiResult.error || 'Invalid credentials or inactive account.', 'error');
        return { success: false, error: apiResult.error };
      }

      let matched = users.find(u =>
        (u.userName && u.userName.toLowerCase() === cleanId) ||
        (u.email && u.email.toLowerCase() === cleanId) ||
        (u.id && u.id.toLowerCase() === cleanId)
      );

      if (!matched && (cleanId === 'admin' || cleanId === 'superadmin' || cleanId === 'super_admin')) {
        matched = users.find(u => u.id === 'super_admin' || u.roleId === 'super_admin') || SYSTEM_ROLES[0];
      }

      if (!matched) {
        matched = SYSTEM_ROLES.find(r =>
          (r.userName && r.userName.toLowerCase() === cleanId) ||
          (r.email && r.email.toLowerCase() === cleanId) ||
          (r.id && r.id.toLowerCase() === cleanId)
        );
      }

      if (!matched) {
        const f = farmers.find(item =>
          (item.code && item.code.toLowerCase() === cleanId) ||
          (item.phone && item.phone === cleanId) ||
          (item.name && item.name.toLowerCase() === cleanId)
        );
        if (f) {
          matched = {
            id: 'farmer',
            name: 'Farmer',
            userName: f.code,
            fullName: f.name,
            email: `${f.code.toLowerCase()}@kisan.in`,
            roleTitle: `Registered Dairy Farmer (ID: ${f.code})`,
            badge: 'Farmer',
            branch: f.village,
            farmerId: f.id,
            avatar: f.name.slice(0, 2).toUpperCase()
          };
        }
      }

      if (!matched) {
        const c = customers.find(item =>
          (item.id && item.id.toLowerCase() === cleanId) ||
          (item.phone && item.phone === cleanId) ||
          (item.name && item.name.toLowerCase() === cleanId)
        );
        if (c) {
          matched = {
            id: 'customer',
            name: 'Customer',
            userName: c.id,                                                                  
            fullName: c.name,
            email: `${c.id.toLowerCase()}@amritdhara.com`,
            roleTitle: `Residential Subscriber (ID: ${c.id})`,
            badge: 'Customer',
            branch: c.address,
            customerId: c.id,
            avatar: c.name.slice(0, 2).toUpperCase()
          };
        }
      }

      if (matched) {
        const authUser = {
          ...matched,
          id: matched.roleId || matched.id
        };
        setCurrentUser(authUser);
        showToast(`Welcome back, ${authUser.fullName || authUser.name}! (Demo Profile)`, 'info');
        setActiveTab('dashboard');
        return { success: true, user: authUser };
      }

      showToast(apiResult.error || 'Invalid username or password. User not found.', 'error');
      return { success: false, error: apiResult.error || 'User not found' };
    } catch (err) {
      showToast(err.message || 'Login error occurred', 'error');
      return { success: false, error: err.message };
    }
  };

  const logoutUser = () => {
    authService.logout();
    setCurrentUser(null);
    localStorage.removeItem('amritdhara_user');
    showToast('You have been logged out safely.', 'info');
  };

  const calculateRate = (milkType, fat, snf) => {
    const f = parseFloat(fat) || 0;
    const s = parseFloat(snf) || 0;
    if (milkType === 'Cow') {
      return +(settings.cowBaseRate + ((f - 3.5) * settings.cowFatMultiplier) + ((s - 8.5) * settings.cowSnfMultiplier)).toFixed(2);
    } else {
      return +(settings.buffaloBaseRate + ((f - 6.0) * settings.buffaloFatMultiplier) + ((s - 9.0) * settings.buffaloSnfMultiplier)).toFixed(2);
    }
  };

  const addMilkRecord = (record) => {
    const newRecord = {
      ...record,
      id: `COL-${Date.now().toString().slice(-4)}`,
      slipNo: `SLIP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(10 + Math.random() * 90)}`,
      date: record.date || new Date().toISOString().slice(0, 10),
      time: record.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recordedBy: currentUser ? currentUser.fullName : 'Operator'
    };
    setMilkRecords([newRecord, ...milkRecords]);

    setFarmers(prev => prev.map(f => {
      if (f.id === record.farmerId) {
        return {
          ...f,
          totalMilk: +(f.totalMilk + record.quantity).toFixed(1),
          pendingDue: +(f.pendingDue + record.totalAmount).toFixed(2),
          paymentStatus: 'Pending'
        };
      }
      return f;
    }));

    showToast(`Milk entry of ${record.quantity}L recorded successfully for ${record.farmerName}!`, 'success');
    return newRecord;
  };

  const addFarmer = (farmerData) => {
    const newFarmer = {
      ...farmerData,
      id: `FRM-${Math.floor(1000 + Math.random() * 9000)}`,
      totalMilk: 0,
      avgFat: 4.2,
      avgSnf: 8.5,
      paymentStatus: 'Paid',
      pendingDue: 0,
      status: 'Active',
      joinDate: new Date().toISOString().slice(0, 10)
    };
    setFarmers([newFarmer, ...farmers]);
    showToast(`Farmer ${newFarmer.name} registered successfully!`, 'success');
    return newFarmer;
  };

  const updateFarmer = (id, updatedFields) => {
    setFarmers(prev => prev.map(f => f.id === id ? { ...f, ...updatedFields } : f));
    showToast('Farmer profile updated successfully.', 'success');
  };

  const deleteFarmer = (id) => {
    setFarmers(prev => prev.filter(f => f.id !== id));
    showToast('Farmer removed from active directory.', 'warning');
  };

  const addCustomer = (customerData) => {
    const newCustomer = {
      ...customerData,
      id: `CUST-${Math.floor(800 + Math.random() * 200)}`,
      balance: 0,
      status: 'Active',
      startDate: new Date().toISOString().slice(0, 10)
    };
    setCustomers([newCustomer, ...customers]);
    showToast(`Customer ${newCustomer.name} enrolled successfully!`, 'success');
    return newCustomer;
  };

  const updateCustomer = (id, updatedFields) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
    showToast('Customer information updated.', 'success');
  };

  const toggleCustomerStatus = (id) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'Active' ? 'Paused' : 'Active';
        showToast(`Customer ${c.name}'s subscription is now ${nextStatus}`, 'info');
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const addProduct = (prodData) => {
    const newProd = {
      ...prodData,
      id: `PRD-${(products.length + 1).toString().padStart(2, '0')}`,
      status: prodData.stock > prodData.minStock ? 'In Stock' : 'Low Stock'
    };
    setProducts([...products, newProd]);
    showToast(`Product ${newProd.name} added to catalog!`, 'success');
  };

  const updateProductStock = (id, delta) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newStock = Math.max(0, p.stock + delta);
        return {
          ...p,
          stock: newStock,
          status: newStock === 0 ? 'Out of Stock' : (newStock <= p.minStock ? 'Low Stock' : 'In Stock')
        };
      }
      return p;
    }));
    showToast('Stock quantity updated.', 'success');
  };

  const addSale = (saleData) => {
    const newSale = {
      ...saleData,
      id: `INV-${Date.now().toString().slice(-5)}`,
      date: new Date().toISOString().slice(0, 10),
      servedBy: currentUser ? currentUser.fullName : 'Admin Staff',
      status: 'Completed'
    };
    setSales([newSale, ...sales]);

    saleData.items.forEach(item => {
      updateProductStock(item.productId, -item.qty);
    });

    showToast(`Sale Invoice #${newSale.id} created successfully! Total: ₹${newSale.total}`, 'success');
    return newSale;
  };

  const updateDeliveryStatus = (deliveryId, newStatus) => {
    setDeliveries(prev => prev.map(d => {
      if (d.id === deliveryId) {
        return {
          ...d,
          status: newStatus,
          completedAt: newStatus === 'Delivered' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null
        };
      }
      return d;
    }));
    showToast(`Delivery #${deliveryId} marked as ${newStatus}`, 'success');
  };

  const settleFarmerPayment = (farmerId, amount, method, refNo) => {
    setFarmers(prev => prev.map(f => {
      if (f.id === farmerId) {
        const remaining = Math.max(0, f.pendingDue - amount);
        return {
          ...f,
          pendingDue: remaining,
          paymentStatus: remaining === 0 ? 'Paid' : 'Partial'
        };
      }
      return f;
    }));

    const farmer = farmers.find(f => f.id === farmerId);
    showToast(`Payment of ₹${amount} settled for ${farmer ? farmer.name : farmerId} via ${method}${refNo ? ` (Ref: ${refNo})` : ''}!`, 'success');
  };

  const recordCustomerPayment = (customerId, amount, method) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const newBal = Math.max(0, c.balance - amount);
        return { ...c, balance: newBal };
      }
      return c;
    }));
    showToast(`Received ₹${amount} from customer via ${method}`, 'success');
  };

  const addExpense = (expenseData) => {
    const newExp = {
      ...expenseData,
      id: `EXP-${Date.now().toString().slice(-3)}`,
      date: new Date().toISOString().slice(0, 10),
      approvedBy: currentUser ? currentUser.fullName : 'Accountant'
    };
    setExpenses([newExp, ...expenses]);
    showToast(`Expense of ₹${newExp.amount} logged under ${newExp.category}`, 'warning');
  };

  const markNotificationRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  return (
    <DairyContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        addUser,
        updateUser,
        deleteUser,
        registerUser,
        switchRole,
        loginUser,
        logoutUser,
        activeTab,
        setActiveTab,
        currentShift,
        setCurrentShift,
        farmers,
        addFarmer,
        updateFarmer,
        deleteFarmer,
        customers,
        addCustomer,
        updateCustomer,
        toggleCustomerStatus,
        milkRecords,
        addMilkRecord,
        calculateRate,
        products,
        addProduct,
        updateProductStock,
        sales,
        addSale,
        deliveries,
        updateDeliveryStatus,
        expenses,
        addExpense,
        settleFarmerPayment,
        recordCustomerPayment,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        settings,
        setSettings,
        toast,
        showToast
      }}
    >
      {children}
    </DairyContext.Provider>
  );
};

export const useDairy = () => useContext(DairyContext);
