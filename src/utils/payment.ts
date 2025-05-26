import { SystemResults } from '../types';

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string;
        email: string;
        amount: number;
        currency: string;
        ref: string;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
}

export const initializePayment = async (
  email: string,
  onSuccess: (reference: string) => void,
  onClose: () => void
) => {
  const amount = 3000 * 100; // Convert to kobo
  const reference = `SOLAR-${Date.now()}`;

  try {
    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email,
      amount,
      currency: 'NGN',
      ref: reference,
      callback: (response) => {
        onSuccess(response.reference);
      },
      onClose: () => {
        onClose();
      },
    });

    handler.openIframe();
  } catch (error) {
    console.error('Payment initialization error:', error);
    alert('Failed to initialize payment. Please try again.');
    onClose();
  }
}; 