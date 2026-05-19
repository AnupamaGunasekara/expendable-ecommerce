const crypto = require('crypto');

/**
 * Generate the PayHere checkout hash.
 *
 * Formula (PayHere docs):
 *   hash = strtoupper(md5(
 *     merchant_id +
 *     order_id +
 *     amount_formatted +   <- 2 decimal places, e.g. "2500.00"
 *     currency +
 *     strtoupper(md5(merchant_secret))
 *   ))
 *
 * @param {string} merchantId
 * @param {string} orderId       - Your internal order reference (orderNumber)
 * @param {number|string} amount - Total charge amount
 * @param {string} currency      - e.g. "LKR"
 * @param {string} merchantSecret
 * @returns {string} Uppercase MD5 hash
 */
const generateCheckoutHash = (merchantId, orderId, amount, currency, merchantSecret) => {
  const hashedSecret = crypto
    .createHash('md5')
    .update(merchantSecret)
    .digest('hex')
    .toUpperCase();

  const amountFormatted = parseFloat(amount).toFixed(2);

  const raw = `${merchantId}${orderId}${amountFormatted}${currency}${hashedSecret}`;

  return crypto.createHash('md5').update(raw).digest('hex').toUpperCase();
};

/**
 * Verify the hash sent in PayHere's notify_url POST.
 *
 * Formula (PayHere docs):
 *   local_hash = strtoupper(md5(
 *     merchant_id +
 *     order_id +
 *     payhere_amount +
 *     payhere_currency +
 *     status_code +
 *     strtoupper(md5(merchant_secret))
 *   ))
 *   valid = local_hash === md5sig (from POST body)
 *
 * @param {object} payload  - The raw POST body from PayHere notify_url
 * @param {string} merchantSecret
 * @returns {boolean}
 */
const verifyNotifyHash = (payload, merchantSecret) => {
  const {
    merchant_id,
    order_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig,
  } = payload;

  if (!merchant_id || !order_id || !payhere_amount || !payhere_currency || !status_code || !md5sig) {
    return false;
  }

  const hashedSecret = crypto
    .createHash('md5')
    .update(merchantSecret)
    .digest('hex')
    .toUpperCase();

  const raw = `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${hashedSecret}`;

  const localHash = crypto.createHash('md5').update(raw).digest('hex').toUpperCase();

  return localHash === md5sig.toUpperCase();
};

module.exports = { generateCheckoutHash, verifyNotifyHash };
