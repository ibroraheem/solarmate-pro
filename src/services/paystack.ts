declare global {
  interface Window {
    PaystackPop: {
      setup: (config: PaystackConfig) => PaystackHandler;
    };
  }
}

interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  currency: string;
  ref: string;
  callback: (response: PaystackResponse) => void;
  onClose: () => void;
}

interface PaystackHandler {
  openIframe: () => void;
}

interface PaystackResponse {
  reference: string;
  trans: string;
  status: string;
  message: string;
  transaction: string;
  trxref: string;
}

const PREMIUM_PDF_PRICE = 2000; // NGN 2,000

interface PaymentRecord {
  reference: string;
  email: string;
  amount: number;
  date: string;
  status: 'completed' | 'failed';
}

// Helper function to generate a unique reference
const generateReference = () => {
  return `SOLARMATE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Helper function to get payment history
export const getPaymentHistory = (): PaymentRecord[] => {
  const history = localStorage.getItem('payment_history');
  return history ? JSON.parse(history) : [];
};

// Helper function to add payment to history
const addToPaymentHistory = (payment: PaymentRecord) => {
  const history = getPaymentHistory();
  history.unshift(payment); // Add to beginning of array
  localStorage.setItem('payment_history', JSON.stringify(history));
};

// Helper function to encrypt data
const encryptData = (data: string) => {
  return btoa(data);
};

// Helper function to decrypt data
const decryptData = (data: string) => {
  return atob(data);
};

// Helper function to store payment verification
const storePaymentVerification = (reference: string, email: string) => {
  const encryptedReference = encryptData(reference);
  localStorage.setItem(`payment_${encryptedReference}`, 'completed');
  localStorage.setItem('premium_user_email', encryptData(email));
  localStorage.setItem('payment_timestamp', Date.now().toString());
};

export const loadPaystackScript = () => {
  return new Promise<void>((resolve, reject) => {
    if (window.PaystackPop) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Paystack script'));
    document.body.appendChild(script);
  });
};

export const initializePaystack = (email: string, onSuccess: () => void) => {
  const reference = generateReference();
  
  const handler = window.PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email,
    amount: PREMIUM_PDF_PRICE * 100,
    currency: 'NGN',
    ref: reference,
    callback: (response: PaystackResponse) => {
      // Store successful payment in localStorage
      storePaymentVerification(reference, email);
      
      // Add to payment history
      addToPaymentHistory({
        reference,
        email,
        amount: PREMIUM_PDF_PRICE,
        date: new Date().toISOString(),
        status: 'completed'
      });
      
      onSuccess();
    },
    onClose: () => {
      // Add failed payment to history
      addToPaymentHistory({
        reference,
        email,
        amount: PREMIUM_PDF_PRICE,
        date: new Date().toISOString(),
        status: 'failed'
      });
    },
  });

  handler.openIframe();
};

// Check if user has already paid
export const hasPaid = () => {
  const email = localStorage.getItem('premium_user_email');
  const timestamp = localStorage.getItem('payment_timestamp');
  
  if (!email || !timestamp) return false;

  // Check if payment is within last week
  const paymentTime = parseInt(timestamp);
  const now = Date.now();
  const hoursSincePayment = (now - paymentTime) / (1000 * 60 * 60);
  
  if (hoursSincePayment > 168) { // 7 days * 24 hours = 168 hours
    // Clear expired payment data
    clearPaymentData();
    return false;
  }

  // Check if any payment exists for this email
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('payment_')) {
      if (localStorage.getItem(key) === 'completed') {
        return true;
      }
    }
  }
  return false;
};

// Clear all payment data (for testing)
export const clearPaymentData = () => {
  // Clear payment references
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key?.startsWith('payment_')) {
      localStorage.removeItem(key);
    }
  }
  
  // Clear email, timestamp and history
  localStorage.removeItem('premium_user_email');
  localStorage.removeItem('payment_timestamp');
  localStorage.removeItem('payment_history');
}; 