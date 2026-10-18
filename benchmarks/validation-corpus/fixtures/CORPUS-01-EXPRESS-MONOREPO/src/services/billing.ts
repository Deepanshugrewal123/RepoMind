import axios from 'axios';
import _ from 'lodash';

export async function processInvoice(invoiceId: string, amount: number) {
  const payload = _.pick({ id: invoiceId, amount, status: 'PENDING' }, ['id', 'amount']);
  const response = await axios.post('https://api.paymentgateway.internal/invoices', payload);
  return response.data;
}
