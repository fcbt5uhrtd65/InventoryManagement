export const generateQRCode = async (text: string): Promise<string> => {
  // Usando una API pública para generar QR codes
  const size = 200;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
  return qrCodeUrl;
};

export const generateBarcode = (code: string): string => {
  // Usando una API pública para generar códigos de barras
  const barcodeUrl = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(code)}&code=Code128&translate-esc=on`;
  return barcodeUrl;
};

export const downloadQRCode = async (text: string, filename: string) => {
  const qrCodeUrl = await generateQRCode(text);
  const link = document.createElement('a');
  link.href = qrCodeUrl;
  link.download = `${filename}_qr.png`;
  link.click();
};

export const printQRCode = async (text: string) => {
  const qrCodeUrl = await generateQRCode(text);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir QR Code</title>
          <style>
            body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            img { max-width: 100%; }
          </style>
        </head>
        <body>
          <img src="${qrCodeUrl}" />
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
};
