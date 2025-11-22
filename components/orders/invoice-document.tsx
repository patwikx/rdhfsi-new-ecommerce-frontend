'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';

interface InvoiceDocumentProps {
  order: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    companyName: string | null;
    taxId: string | null;
    paymentMethod: string;
    paymentStatus: string;
    shippingMethod: string;
    trackingNumber: string | null;
    subtotal: number;
    taxAmount: number;
    shippingAmount: number;
    discountAmount: number;
    totalAmount: number;
    createdAt: Date;
    items: {
      id: string;
      productName: string;
      productSku: string;
      quantity: number;
      unitPrice: number;
      subtotal: number;
    }[];
    taxBreakdown: {
      id: string;
      taxName: string;
      taxCode: string;
      taxRate: number;
      taxableAmount: number;
      taxAmount: number;
    }[];
  };
}

export function InvoiceDocument({ order }: InvoiceDocumentProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDownload = () => {
    if (!invoiceRef.current) return;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Write the invoice HTML to the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${order.orderNumber}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              background: white;
              color: black;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 2px solid #333;
            }
            .company-info {
              text-align: right;
            }
            h1 {
              font-size: 32px;
              margin-bottom: 10px;
            }
            h2 {
              font-size: 20px;
              margin-bottom: 5px;
            }
            h3 {
              font-size: 16px;
              margin-bottom: 10px;
            }
            .info-row {
              font-size: 14px;
              margin: 5px 0;
            }
            .bill-to {
              margin-bottom: 30px;
            }
            .order-details {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
              margin-bottom: 30px;
              font-size: 14px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            th {
              background: #f5f5f5;
              padding: 12px;
              text-align: left;
              font-size: 14px;
              border-bottom: 2px solid #333;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #ddd;
              font-size: 14px;
            }
            .text-right {
              text-align: right;
            }
            .totals {
              margin-left: auto;
              width: 300px;
            }
            .totals-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              font-size: 14px;
            }
            .totals-row.total {
              border-top: 2px solid #333;
              font-size: 18px;
              font-weight: bold;
              padding-top: 12px;
              margin-top: 8px;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              font-size: 14px;
            }
            @media print {
              body {
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          ${invoiceRef.current.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  return (
    <>
      <Button
        onClick={handleDownload}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Download className="w-4 h-4" />
        Download Invoice
      </Button>

      {/* Hidden invoice template */}
      <div ref={invoiceRef} className="hidden">
        <div className="invoice-container">
          {/* Header */}
          <div className="header">
            <div>
              <h1>INVOICE</h1>
              <div className="info-row">Invoice #: {order.orderNumber}</div>
              <div className="info-row">Date: {formatDate(order.createdAt)}</div>
            </div>
            <div className="company-info">
              <h2>RD Hardware</h2>
              <div className="info-row">& Fishing Supply, Inc.</div>
              <div className="info-row" style={{ marginTop: '10px' }}>
                Santiago Boulevard, General Santos City<br />
                South Cotabato, Philippines, 9500<br />
              </div>
              <div className="info-row" style={{ marginTop: '10px' }}>
                Phone: 0939 912 4032<br />
                Email: rdh_santiago@rdretailgroup.com.ph
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="bill-to">
            <h3>Bill To:</h3>
            <div className="info-row"><strong>{order.customerName}</strong></div>
            {order.companyName && <div className="info-row">{order.companyName}</div>}
            <div className="info-row">{order.customerEmail}</div>
            <div className="info-row">{order.customerPhone}</div>
            {order.taxId && <div className="info-row">TIN: {order.taxId}</div>}
          </div>

          {/* Order Details */}
          <div className="order-details">
            <div>
              <div style={{ color: '#666' }}>Payment Method:</div>
              <div><strong>{order.paymentMethod}</strong></div>
            </div>
            <div>
              <div style={{ color: '#666' }}>Payment Status:</div>
              <div><strong>{order.paymentStatus}</strong></div>
            </div>
            <div>
              <div style={{ color: '#666' }}>Shipping Method:</div>
              <div><strong>{order.shippingMethod}</strong></div>
            </div>
          </div>

          {/* Items Table */}
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>SKU</th>
                <th className="text-right">Qty</th>
                <th className="text-right">Unit Price</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.productName}</td>
                  <td>{item.productSku}</td>
                  <td className="text-right">{item.quantity}</td>
                  <td className="text-right">₱{formatPrice(item.unitPrice)}</td>
                  <td className="text-right"><strong>₱{formatPrice(item.subtotal)}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="totals">
            <div className="totals-row">
              <span>Subtotal:</span>
              <span><strong>₱{formatPrice(order.subtotal)}</strong></span>
            </div>

            {order.discountAmount > 0 && (
              <div className="totals-row" style={{ color: 'green' }}>
                <span>Discount:</span>
                <span><strong>-₱{formatPrice(order.discountAmount)}</strong></span>
              </div>
            )}

            {order.taxBreakdown.map((tax) => (
              <div key={tax.id} className="totals-row">
                <span>{tax.taxName} ({tax.taxRate}%):</span>
                <span><strong>₱{formatPrice(tax.taxAmount)}</strong></span>
              </div>
            ))}

            <div className="totals-row">
              <span>Shipping:</span>
              <span><strong>{order.shippingAmount === 0 ? 'FREE' : `₱${formatPrice(order.shippingAmount)}`}</strong></span>
            </div>

            <div className="totals-row total">
              <span>Total:</span>
              <span>₱{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="footer">
            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Thank you for your business!</div>
            <div>For inquiries, please contact us at 0939 912 4032 or rdh_santiago@rdretailgroup.com.phs</div>
          </div>
        </div>
      </div>
    </>
  );
}
