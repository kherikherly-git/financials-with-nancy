# Financials with Nancy - Financial Management System

A comprehensive web-based financial management system built with HTML, CSS, and JavaScript. Nancy helps manage user registrations, savings accounts, loan disbursements, payments, withdrawals, and financial reporting.

## Features

### 1. **User Registration Module**
- Register new users with complete profile information
- Unique email validation
- View all registered users
- User status tracking
- Delete user accounts

### 2. **Savings Management Module**
- Add savings for registered users
- Multiple savings types:
  - Regular Savings
  - Fixed Deposits
  - Emergency Funds
- Track savings history
- View all active and withdrawn savings

### 3. **Loan Management Module**
- Disburse loans to registered users
- Calculate interest automatically
- Set custom interest rates and loan periods
- Track loan purpose and details
- View all active and paid loans

### 4. **Loan Payment Module**
- Record loan payments
- Multiple payment methods:
  - Cash
  - Bank Transfer
  - Cheque
  - Online Payment
- Track payment history
- Automatic loan status updates (active/paid)

### 5. **Withdrawal Management Module**
- Process savings withdrawals
- Check available balance
- Withdrawal types:
  - Partial Withdrawal
  - Full Withdrawal
- Maintain withdrawal history
- FIFO (First In First Out) withdrawal processing

### 6. **Reports & Analytics Module**
- **Loans Overview Report**: Summary of all active loans
- **Overdue Loans Report**: Identify loans with outstanding balances
- **Payment Schedule Report**: View payment obligations
- **User Summary Report**: Comprehensive user financial summary
- Print-friendly reports
- Real-time statistics and summaries

### 7. **Dashboard**
- Real-time statistics:
  - Total registered users
  - Total savings amount
  - Total loans disbursed
  - Outstanding loan balance
- Quick overview of financial status

## System Architecture

### Data Storage
- Local browser storage (LocalStorage) for data persistence
- Demo data included for testing

### Technologies Used
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with flexbox and grid
- **JavaScript (ES6+)**: Core application logic

### Key Components
1. **Sidebar Navigation**: Easy access to all modules
2. **Top Header**: Page title and user information
3. **Main Content Area**: Module-specific content
4. **Notification System**: Real-time user feedback
5. **Responsive Design**: Mobile-friendly interface

## Getting Started

### Installation
1. Clone or download the repository
2. Ensure you have the following files:
   - `index.html`
   - `styles.css`
   - `app.js`

### Running the Application
1. Open `index.html` in a modern web browser
2. The application loads with demo data
3. Start using the system from the Dashboard

### Browser Compatibility
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Usage Guide

### Registering a User
1. Navigate to "Registration" from the sidebar
2. Fill in user details:
   - Full Name
   - Email (must be unique)
   - Phone number
   - Address
   - Occupation
3. Click "Register"
4. View registered users in the list below

### Adding Savings
1. Navigate to "Savings"
2. Select a registered user
3. Enter savings amount
4. Choose savings type
5. Click "Add to Savings"
6. Track savings in the history table

### Disbursing a Loan
1. Navigate to "Loans"
2. Select a user
3. Enter:
   - Loan amount
   - Loan period (months)
   - Interest rate (%)
   - Loan purpose
4. Click "Disburse Loan"
5. System calculates total amount and monthly payment

### Recording Loan Payments
1. Navigate to "Loan Payment"
2. Select user and their active loan
3. Enter payment amount (must not exceed balance)
4. Choose payment method
5. Click "Record Payment"
6. Loan status updates automatically when fully paid

### Processing Withdrawals
1. Navigate to "Withdrawals"
2. Select a user to see available balance
3. Enter withdrawal amount
4. Choose withdrawal type
5. Click "Process Withdrawal"
6. System deducts from savings (FIFO method)

### Generating Reports
1. Navigate to "Reports"
2. Select report type:
   - Loans Overview
   - Overdue Loans
   - Payment Schedule
   - User Summary
3. Click "Generate Report"
4. View report details or print using "Print Report"

## Demo Data

The system includes pre-loaded demo data:
- **Users**: John Smith, Sarah Johnson
- **Savings**: Sample entries with various amounts
- **Loans**: Active loan example with payment history
- **Transactions**: Sample payments and transactions

## Data Structure

### User Object
```javascript
{
  id: number,
  fullName: string,
  email: string,
  phone: string,
  address: string,
  occupation: string,
  status: 'active',
  registeredDate: date
}
```

### Loan Object
```javascript
{
  id: number,
  userId: number,
  userName: string,
  principal: number,
  interestRate: number,
  period: number,
  purpose: string,
  disbursedDate: date,
  balance: number,
  monthlyPayment: string,
  status: 'active' | 'paid',
  totalAmount: number,
  paidAmount: number
}
```

### Savings Object
```javascript
{
  id: number,
  userId: number,
  userName: string,
  amount: number,
  type: 'regular' | 'fixed' | 'emergency',
  date: date,
  status: 'active' | 'withdrawn'
}
```

## Features Highlight

### Automatic Calculations
- Interest calculation based on principal, rate, and period
- Monthly payment determination
- Loan balance tracking
- Available balance calculation for withdrawals

### Status Tracking
- User active/inactive status
- Loan active/paid status
- Savings active/withdrawn status
- Payment completion tracking
- Withdrawal completion tracking

### Data Validation
- Email uniqueness check
- Amount validation
- Insufficient balance prevention
- Required field validation

### User Experience
- Smooth module switching with animations
- Real-time data updates
- Confirmation dialogs for critical actions
- Notification system for feedback
- Responsive design for all devices
- Print-friendly reports

## Future Enhancements

- User authentication system
- Database integration
- Email notifications
- SMS alerts for overdue payments
- Advanced analytics and charts
- Multi-currency support
- Role-based access control
- Audit logging
- Export to Excel/PDF
- Mobile app version

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue in the repository.

---

**Financials with Nancy** - Manage Your Finances Smartly! 💰