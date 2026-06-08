// ============================================
// FINANCIALS WITH NANCY - MAIN APPLICATION
// ============================================

// Data Storage
const app = {
    users: [],
    savings: [],
    loans: [],
    payments: [],
    withdrawals: [],
    currentUser: null,
    nextUserId: 1,
    nextLoanId: 1,

    // Initialize the application
    init() {
        this.setupEventListeners();
        this.loadDemoData();
        this.updateDashboard();
    },

    // Setup all event listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const module = link.getAttribute('data-module');
                this.switchModule(module);
            });
        });

        // Registration Form
        document.getElementById('registration-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.registerUser();
        });

        // Savings Form
        document.getElementById('savings-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addSavings();
        });

        // Loans Form
        document.getElementById('loans-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.disburseLoan();
        });

        // Payment Form
        document.getElementById('payment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.recordPayment();
        });

        // Withdrawal Form
        document.getElementById('withdraw-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.processWithdrawal();
        });

        // Logout Button
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });

        // Reports
        document.getElementById('generate-report').addEventListener('click', () => {
            this.generateReport();
        });

        document.getElementById('print-report').addEventListener('click', () => {
            window.print();
        });

        // Update loan list when user changes in payment form
        document.getElementById('payment-user').addEventListener('change', (e) => {
            this.updateLoanSelect(e.target.value);
        });

        // Update available balance when user changes in withdraw form
        document.getElementById('withdraw-user').addEventListener('change', (e) => {
            this.updateAvailableBalance(e.target.value);
        });
    },

    // Switch between modules
    switchModule(moduleName) {
        // Hide all modules
        document.querySelectorAll('.module').forEach(module => {
            module.classList.remove('active');
        });

        // Show selected module
        document.getElementById(moduleName).classList.add('active');

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-module') === moduleName) {
                link.classList.add('active');
            }
        });

        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            registration: 'User Registration',
            savings: 'Savings Management',
            loans: 'Loan Management',
            payment: 'Loan Payment',
            withdraw: 'Withdrawal Management',
            reports: 'Financial Reports'
        };
        document.getElementById('page-title').textContent = titles[moduleName] || 'Dashboard';

        // Refresh relevant data
        if (moduleName === 'registration') {
            this.refreshUsersList();
        } else if (moduleName === 'savings') {
            this.refreshSavingsList();
            this.populateUserSelect('savings-user');
        } else if (moduleName === 'loans') {
            this.refreshLoansList();
            this.populateUserSelect('loan-user');
        } else if (moduleName === 'payment') {
            this.populateUserSelect('payment-user');
            this.refreshPaymentsList();
        } else if (moduleName === 'withdraw') {
            this.populateUserSelect('withdraw-user');
            this.refreshWithdrawalsList();
        }
    },

    // Register a new user
    registerUser() {
        const fullName = document.getElementById('full-name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const occupation = document.getElementById('occupation').value;

        // Validate unique email
        if (this.users.some(u => u.email === email)) {
            this.showNotification('Email already registered!', 'error');
            return;
        }

        const user = {
            id: this.nextUserId++,
            fullName,
            email,
            phone,
            address,
            occupation,
            status: 'active',
            registeredDate: new Date().toLocaleDateString()
        };

        this.users.push(user);
        this.saveToLocalStorage();
        this.showNotification(`User ${fullName} registered successfully!`, 'success');
        document.getElementById('registration-form').reset();
        this.refreshUsersList();
        this.updateDashboard();
    },

    // Add savings
    addSavings() {
        const userId = parseInt(document.getElementById('savings-user').value);
        const amount = parseFloat(document.getElementById('savings-amount').value);
        const type = document.getElementById('savings-type').value;

        if (!userId) {
            this.showNotification('Please select a user', 'error');
            return;
        }

        const user = this.users.find(u => u.id === userId);
        if (!user) {
            this.showNotification('User not found', 'error');
            return;
        }

        const saving = {
            id: Date.now(),
            userId,
            userName: user.fullName,
            amount,
            type,
            date: new Date().toLocaleDateString(),
            status: 'active'
        };

        this.savings.push(saving);
        this.saveToLocalStorage();
        this.showNotification(`$${amount.toFixed(2)} added to ${user.fullName}'s savings`, 'success');
        document.getElementById('savings-form').reset();
        this.refreshSavingsList();
        this.updateDashboard();
    },

    // Disburse a loan
    disburseLoan() {
        const userId = parseInt(document.getElementById('loan-user').value);
        const principal = parseFloat(document.getElementById('loan-amount').value);
        const period = parseInt(document.getElementById('loan-period').value);
        const interestRate = parseFloat(document.getElementById('interest-rate').value);
        const purpose = document.getElementById('loan-purpose').value;

        if (!userId) {
            this.showNotification('Please select a user', 'error');
            return;
        }

        const user = this.users.find(u => u.id === userId);
        if (!user) {
            this.showNotification('User not found', 'error');
            return;
        }

        // Calculate interest and total amount
        const interestAmount = (principal * interestRate * period) / (100 * 12);
        const totalAmount = principal + interestAmount;
        const monthlyPayment = totalAmount / period;

        const loan = {
            id: this.nextLoanId++,
            userId,
            userName: user.fullName,
            principal,
            interestRate,
            period,
            purpose,
            disbursedDate: new Date().toLocaleDateString(),
            balance: totalAmount,
            monthlyPayment: monthlyPayment.toFixed(2),
            status: 'active',
            totalAmount,
            paidAmount: 0
        };

        this.loans.push(loan);
        this.saveToLocalStorage();
        this.showNotification(`Loan of $${principal.toFixed(2)} disbursed to ${user.fullName}`, 'success');
        document.getElementById('loans-form').reset();
        this.refreshLoansList();
        this.updateDashboard();
    },

    // Record a loan payment
    recordPayment() {
        const userId = parseInt(document.getElementById('payment-user').value);
        const loanId = parseInt(document.getElementById('loan-to-pay').value);
        const amount = parseFloat(document.getElementById('payment-amount').value);
        const method = document.getElementById('payment-method').value;

        if (!userId || !loanId) {
            this.showNotification('Please select a user and loan', 'error');
            return;
        }

        const loan = this.loans.find(l => l.id === loanId && l.userId === userId);
        if (!loan) {
            this.showNotification('Loan not found', 'error');
            return;
        }

        if (amount > loan.balance) {
            this.showNotification(`Payment amount exceeds remaining balance of $${loan.balance.toFixed(2)}`, 'error');
            return;
        }

        // Update loan
        loan.balance -= amount;
        loan.paidAmount += amount;
        if (loan.balance <= 0) {
            loan.status = 'paid';
            loan.balance = 0;
        }

        const payment = {
            id: Date.now(),
            userId,
            userName: loan.userName,
            loanId,
            amount,
            method,
            date: new Date().toLocaleDateString(),
            status: 'completed'
        };

        this.payments.push(payment);
        this.saveToLocalStorage();
        this.showNotification(`Payment of $${amount.toFixed(2)} recorded successfully`, 'success');
        document.getElementById('payment-form').reset();
        this.refreshPaymentsList();
        this.refreshLoansList();
        this.updateDashboard();
    },

    // Process a withdrawal
    processWithdrawal() {
        const userId = parseInt(document.getElementById('withdraw-user').value);
        const amount = parseFloat(document.getElementById('withdraw-amount').value);
        const type = document.getElementById('withdraw-type').value;

        if (!userId) {
            this.showNotification('Please select a user', 'error');
            return;
        }

        // Calculate total savings for the user
        const totalSavings = this.savings
            .filter(s => s.userId === userId && s.status === 'active')
            .reduce((sum, s) => sum + s.amount, 0);

        if (amount > totalSavings) {
            this.showNotification(`Insufficient balance. Available: $${totalSavings.toFixed(2)}`, 'error');
            return;
        }

        const user = this.users.find(u => u.id === userId);

        // Deduct from savings (first in first out)
        let remaining = amount;
        for (let saving of this.savings) {
            if (saving.userId === userId && saving.status === 'active' && remaining > 0) {
                const deduct = Math.min(remaining, saving.amount);
                saving.amount -= deduct;
                remaining -= deduct;

                if (saving.amount === 0) {
                    saving.status = 'withdrawn';
                }
            }
        }

        const withdrawal = {
            id: Date.now(),
            userId,
            userName: user.fullName,
            amount,
            type,
            date: new Date().toLocaleDateString(),
            status: 'completed'
        };

        this.withdrawals.push(withdrawal);
        this.saveToLocalStorage();
        this.showNotification(`Withdrawal of $${amount.toFixed(2)} processed successfully`, 'success');
        document.getElementById('withdraw-form').reset();
        this.refreshWithdrawalsList();
        this.refreshSavingsList();
        this.updateDashboard();
    },

    // Generate reports
    generateReport() {
        const reportType = document.getElementById('report-type').value;
        const reportContent = document.getElementById('report-content');

        let html = '';

        switch (reportType) {
            case 'loans-overview':
                html = this.generateLoansOverviewReport();
                break;
            case 'overdue':
                html = this.generateOverdueLoansReport();
                break;
            case 'payment-schedule':
                html = this.generatePaymentScheduleReport();
                break;
            case 'user-summary':
                html = this.generateUserSummaryReport();
                break;
        }

        reportContent.innerHTML = html;
    },

    generateLoansOverviewReport() {
        let html = '<h3>Loans Overview Report</h3>';
        html += '<table class="report-table"><thead><tr>';
        html += '<th>User</th><th>Principal</th><th>Balance</th><th>Interest Rate</th><th>Period</th><th>Status</th>';
        html += '</tr></thead><tbody>';

        const activeLoans = this.loans.filter(l => l.status === 'active');

        if (activeLoans.length === 0) {
            html += '<tr><td colspan="6" style="text-align: center; padding: 20px;">No active loans</td></tr>';
        } else {
            activeLoans.forEach(loan => {
                html += `<tr>
                    <td>${loan.userName}</td>
                    <td>$${loan.principal.toFixed(2)}</td>
                    <td>$${loan.balance.toFixed(2)}</td>
                    <td>${loan.interestRate}%</td>
                    <td>${loan.period} months</td>
                    <td><span class="status-badge status-active">${loan.status}</span></td>
                </tr>`;
            });
        }

        html += '</tbody></table>';

        // Summary
        const totalLoans = activeLoans.reduce((sum, l) => sum + l.principal, 0);
        const totalBalance = activeLoans.reduce((sum, l) => sum + l.balance, 0);

        html += `<div class="report-summary">
            <h3>Summary</h3>
            <div class="summary-item">
                <strong>Total Active Loans:</strong>
                <span>${activeLoans.length}</span>
            </div>
            <div class="summary-item">
                <strong>Total Principal Disbursed:</strong>
                <span>$${totalLoans.toFixed(2)}</span>
            </div>
            <div class="summary-item">
                <strong>Total Outstanding Balance:</strong>
                <span>$${totalBalance.toFixed(2)}</span>
            </div>
        </div>`;

        return html;
    },

    generateOverdueLoansReport() {
        let html = '<h3>Overdue Loans Report</h3>';

        // For this simulation, mark loans unpaid for more than 2 months as overdue
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 60);

        const overdueLoans = this.loans.filter(l => {
            const loanDate = new Date(l.disbursedDate);
            return l.status === 'active' && loanDate < thirtyDaysAgo && l.balance > 0;
        });

        html += '<table class="report-table"><thead><tr>';
        html += '<th>User</th><th>Principal</th><th>Outstanding</th><th>Monthly Payment</th><th>Days Overdue</th>';
        html += '</tr></thead><tbody>';

        if (overdueLoans.length === 0) {
            html += '<tr><td colspan="5" style="text-align: center; padding: 20px;">No overdue loans</td></tr>';
        } else {
            overdueLoans.forEach(loan => {
                const daysOverdue = Math.floor((new Date() - new Date(loan.disbursedDate)) / (1000 * 60 * 60 * 24));
                html += `<tr>
                    <td>${loan.userName}</td>
                    <td>$${loan.principal.toFixed(2)}</td>
                    <td><span class="status-badge status-overdue">$${loan.balance.toFixed(2)}</span></td>
                    <td>$${loan.monthlyPayment}</td>
                    <td>${daysOverdue} days</td>
                </tr>`;
            });
        }

        html += '</tbody></table>';

        const totalOverdue = overdueLoans.reduce((sum, l) => sum + l.balance, 0);
        html += `<div class="report-summary">
            <h3>Summary</h3>
            <div class="summary-item">
                <strong>Total Overdue Loans:</strong>
                <span>${overdueLoans.length}</span>
            </div>
            <div class="summary-item">
                <strong>Total Overdue Amount:</strong>
                <span>$${totalOverdue.toFixed(2)}</span>
            </div>
        </div>`;

        return html;
    },

    generatePaymentScheduleReport() {
        let html = '<h3>Payment Schedule Report</h3>';
        html += '<table class="report-table"><thead><tr>';
        html += '<th>User</th><th>Loan ID</th><th>Monthly Payment</th><th>Remaining Months</th><th>Total Due</th>';
        html += '</tr></thead><tbody>';

        const activeLoans = this.loans.filter(l => l.status === 'active');

        if (activeLoans.length === 0) {
            html += '<tr><td colspan="5" style="text-align: center; padding: 20px;">No active loans</td></tr>';
        } else {
            activeLoans.forEach(loan => {
                const remainingMonths = Math.ceil(loan.balance / parseFloat(loan.monthlyPayment));
                html += `<tr>
                    <td>${loan.userName}</td>
                    <td>#${loan.id}</td>
                    <td>$${loan.monthlyPayment}</td>
                    <td>${Math.max(0, remainingMonths)} months</td>
                    <td>$${loan.balance.toFixed(2)}</td>
                </tr>`;
            });
        }

        html += '</tbody></table>';

        return html;
    },

    generateUserSummaryReport() {
        let html = '<h3>User Summary Report</h3>';
        html += '<table class="report-table"><thead><tr>';
        html += '<th>User</th><th>Total Savings</th><th>Active Loans</th><th>Total Debt</th><th>Paid Loans</th>';
        html += '</tr></thead><tbody>';

        if (this.users.length === 0) {
            html += '<tr><td colspan="5" style="text-align: center; padding: 20px;">No users registered</td></tr>';
        } else {
            this.users.forEach(user => {
                const totalSavings = this.savings
                    .filter(s => s.userId === user.id && s.status === 'active')
                    .reduce((sum, s) => sum + s.amount, 0);

                const activeLoans = this.loans.filter(l => l.userId === user.id && l.status === 'active');
                const totalDebt = activeLoans.reduce((sum, l) => sum + l.balance, 0);
                const paidLoans = this.loans.filter(l => l.userId === user.id && l.status === 'paid');

                html += `<tr>
                    <td>${user.fullName}</td>
                    <td>$${totalSavings.toFixed(2)}</td>
                    <td>${activeLoans.length}</td>
                    <td>$${totalDebt.toFixed(2)}</td>
                    <td>${paidLoans.length}</td>
                </tr>`;
            });
        }

        html += '</tbody></table>';

        return html;
    },

    // Helper functions

    populateUserSelect(selectId) {
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">-- Select a user --</option>';

        this.users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.fullName;
            select.appendChild(option);
        });
    },

    updateLoanSelect(userId) {
        const select = document.getElementById('loan-to-pay');
        select.innerHTML = '<option value="">-- Select a loan --</option>';

        const userLoans = this.loans.filter(l => l.userId === parseInt(userId) && l.status === 'active');
        userLoans.forEach(loan => {
            const option = document.createElement('option');
            option.value = loan.id;
            option.textContent = `Loan #${loan.id} - $${loan.balance.toFixed(2)} remaining`;
            select.appendChild(option);
        });
    },

    updateAvailableBalance(userId) {
        const input = document.getElementById('available-balance');
        const totalSavings = this.savings
            .filter(s => s.userId === parseInt(userId) && s.status === 'active')
            .reduce((sum, s) => sum + s.amount, 0);

        input.value = `$${totalSavings.toFixed(2)}`;
    },

    refreshUsersList() {
        const tbody = document.getElementById('users-tbody');
        tbody.innerHTML = '';

        this.users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${user.id}</td>
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td><span class="status-badge status-active">${user.status}</span></td>
                <td><button class="btn-delete" onclick="app.deleteUser(${user.id})">Delete</button></td>
            `;
            tbody.appendChild(row);
        });
    },

    refreshSavingsList() {
        const tbody = document.getElementById('savings-tbody');
        tbody.innerHTML = '';

        this.savings.forEach(saving => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${saving.userName}</td>
                <td>${saving.type}</td>
                <td>$${saving.amount.toFixed(2)}</td>
                <td>${saving.date}</td>
                <td><span class="status-badge status-active">${saving.status}</span></td>
            `;
            tbody.appendChild(row);
        });
    },

    refreshLoansList() {
        const tbody = document.getElementById('loans-tbody');
        tbody.innerHTML = '';

        this.loans.forEach(loan => {
            const row = document.createElement('tr');
            const statusClass = loan.status === 'active' ? 'status-active' : 'status-paid';
            row.innerHTML = `
                <td>${loan.userName}</td>
                <td>$${loan.principal.toFixed(2)}</td>
                <td>${loan.interestRate}%</td>
                <td>${loan.period} months</td>
                <td>$${loan.balance.toFixed(2)}</td>
                <td><span class="status-badge ${statusClass}">${loan.status}</span></td>
            `;
            tbody.appendChild(row);
        });
    },

    refreshPaymentsList() {
        const tbody = document.getElementById('payments-tbody');
        tbody.innerHTML = '';

        this.payments.forEach(payment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${payment.userName}</td>
                <td>$${payment.amount.toFixed(2)}</td>
                <td>${payment.method}</td>
                <td>${payment.date}</td>
                <td><span class="status-badge status-paid">${payment.status}</span></td>
            `;
            tbody.appendChild(row);
        });
    },

    refreshWithdrawalsList() {
        const tbody = document.getElementById('withdrawals-tbody');
        tbody.innerHTML = '';

        this.withdrawals.forEach(withdrawal => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${withdrawal.userName}</td>
                <td>$${withdrawal.amount.toFixed(2)}</td>
                <td>${withdrawal.type}</td>
                <td>${withdrawal.date}</td>
                <td><span class="status-badge status-paid">${withdrawal.status}</span></td>
            `;
            tbody.appendChild(row);
        });
    },

    updateDashboard() {
        // Update statistics
        document.getElementById('total-users').textContent = this.users.length;

        const totalSavings = this.savings
            .filter(s => s.status === 'active')
            .reduce((sum, s) => sum + s.amount, 0);
        document.getElementById('total-savings').textContent = `$${totalSavings.toFixed(2)}`;

        const totalLoans = this.loans.reduce((sum, l) => sum + l.principal, 0);
        document.getElementById('total-loans').textContent = `$${totalLoans.toFixed(2)}`;

        const outstandingLoans = this.loans
            .filter(l => l.status === 'active')
            .reduce((sum, l) => sum + l.balance, 0);
        document.getElementById('outstanding-loans').textContent = `$${outstandingLoans.toFixed(2)}`;

        // Update current user display
        if (this.currentUser) {
            document.getElementById('current-user').textContent = this.currentUser;
        }
    },

    deleteUser(userId) {
        if (confirm('Are you sure you want to delete this user?')) {
            this.users = this.users.filter(u => u.id !== userId);
            this.saveToLocalStorage();
            this.showNotification('User deleted successfully', 'success');
            this.refreshUsersList();
            this.updateDashboard();
        }
    },

    logout() {
        this.currentUser = null;
        document.getElementById('current-user').textContent = 'Guest';
        this.showNotification('Logged out successfully', 'success');
        this.switchModule('dashboard');
    },

    showNotification(message, type) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type} show`;

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    },

    // Local Storage Management
    saveToLocalStorage() {
        localStorage.setItem('financials-nancy', JSON.stringify({
            users: this.users,
            savings: this.savings,
            loans: this.loans,
            payments: this.payments,
            withdrawals: this.withdrawals,
            nextUserId: this.nextUserId,
            nextLoanId: this.nextLoanId
        }));
    },

    loadFromLocalStorage() {
        const data = localStorage.getItem('financials-nancy');
        if (data) {
            const parsed = JSON.parse(data);
            this.users = parsed.users || [];
            this.savings = parsed.savings || [];
            this.loans = parsed.loans || [];
            this.payments = parsed.payments || [];
            this.withdrawals = parsed.withdrawals || [];
            this.nextUserId = parsed.nextUserId || 1;
            this.nextLoanId = parsed.nextLoanId || 1;
        }
    },

    // Load demo data
    loadDemoData() {
        this.loadFromLocalStorage();

        // If no data exists, load demo data
        if (this.users.length === 0) {
            // Demo users
            this.users = [
                {
                    id: this.nextUserId++,
                    fullName: 'John Smith',
                    email: 'john@example.com',
                    phone: '555-0101',
                    address: '123 Main St',
                    occupation: 'Engineer',
                    status: 'active',
                    registeredDate: '2024-01-15'
                },
                {
                    id: this.nextUserId++,
                    fullName: 'Sarah Johnson',
                    email: 'sarah@example.com',
                    phone: '555-0102',
                    address: '456 Oak Ave',
                    occupation: 'Teacher',
                    status: 'active',
                    registeredDate: '2024-02-20'
                }
            ];

            // Demo savings
            this.savings = [
                {
                    id: Date.now(),
                    userId: 1,
                    userName: 'John Smith',
                    amount: 5000,
                    type: 'regular',
                    date: '2024-03-01',
                    status: 'active'
                },
                {
                    id: Date.now() + 1,
                    userId: 2,
                    userName: 'Sarah Johnson',
                    amount: 3500,
                    type: 'fixed',
                    date: '2024-03-05',
                    status: 'active'
                }
            ];

            // Demo loans
            this.loans = [
                {
                    id: this.nextLoanId++,
                    userId: 1,
                    userName: 'John Smith',
                    principal: 10000,
                    interestRate: 5,
                    period: 12,
                    purpose: 'Business expansion',
                    disbursedDate: '2024-01-20',
                    balance: 8500,
                    monthlyPayment: (10000 * 1.05 / 12).toFixed(2),
                    status: 'active',
                    totalAmount: 10500,
                    paidAmount: 1500
                }
            ];

            // Demo payments
            this.payments = [
                {
                    id: Date.now(),
                    userId: 1,
                    userName: 'John Smith',
                    loanId: 1,
                    amount: 875,
                    method: 'bank',
                    date: '2024-02-15',
                    status: 'completed'
                }
            ];

            this.saveToLocalStorage();
        }

        this.refreshUsersList();
        this.refreshSavingsList();
        this.refreshLoansList();
        this.refreshPaymentsList();
        this.refreshWithdrawalsList();
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app.init();
    app.currentUser = 'Administrator';
    app.updateDashboard();
});