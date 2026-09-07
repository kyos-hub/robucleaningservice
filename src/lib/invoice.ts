import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { COMPANY, site } from "@/lib/site";

export type InvoiceLine = {
  description: string;
  quantity: number;
  unit?: string | null;
  unitPrice: number;
};

export type InvoiceData = {
  invoiceNumber: string;
  date: string;
  currency: string;
  status?: string | null;
  notes?: string | null;
  billTo: { name: string; company?: string | null; email?: string | null; phone?: string | null; country?: string | null };
  lines: InvoiceLine[];
  total?: number | null;
};

const GREEN: [number, number, number] = [30, 125, 50];

export function formatMoney(currency: string, amount: number) {
  const code = currency === "KES" ? "KSh" : currency;
  return `${code} ${Number(amount || 0).toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function buildInvoicePDF(data: InvoiceData): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();

  // Header band
  doc.setFillColor(...GREEN);
  doc.rect(0, 0, W, 90, "F");
  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(site.name, 40, 42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(COMPANY.name, 40, 58);
  doc.text(`Reg. No. ${site.registrationNo}`, 40, 71);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("INVOICE", W - 40, 46, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`No. ${data.invoiceNumber}`, W - 40, 64, { align: "right" });
  doc.text(new Date(data.date).toLocaleDateString("en-KE"), W - 40, 76, { align: "right" });

  // Parties
  doc.setTextColor(60);
  doc.setFontSize(9);
  let y = 125;
  doc.setFont("helvetica", "bold");
  doc.text("FROM", 40, y);
  doc.text("BILL TO", W / 2, y);
  doc.setFont("helvetica", "normal");
  const from = [COMPANY.name, COMPANY.address, site.postal, COMPANY.phone, COMPANY.email];
  const to = [
    data.billTo.company || data.billTo.name,
    data.billTo.company ? data.billTo.name : "",
    data.billTo.email ?? "",
    data.billTo.phone ?? "",
    data.billTo.country ?? "",
  ].filter(Boolean);
  from.forEach((l, i) => doc.text(String(l), 40, y + 14 + i * 12, { maxWidth: W / 2 - 60 }));
  to.forEach((l, i) => doc.text(String(l), W / 2, y + 14 + i * 12, { maxWidth: W / 2 - 60 }));
  y += 14 + Math.max(from.length, to.length) * 12 + 14;

  const lines = data.lines.length > 0 ? data.lines : [{ description: "Export order", quantity: 1, unit: null, unitPrice: data.total ?? 0 }];
  const computed = lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
  const total = data.total != null && data.total > 0 ? data.total : computed;

  autoTable(doc, {
    head: [["DESCRIPTION", "QTY", "UNIT", "UNIT PRICE", "AMOUNT"]],
    body: lines.map((l) => [
      l.description,
      String(l.quantity),
      l.unit ?? "—",
      formatMoney(data.currency, l.unitPrice),
      formatMoney(data.currency, l.quantity * l.unitPrice),
    ]),
    startY: y,
    margin: { left: 40, right: 40 },
    styles: { fontSize: 9, cellPadding: 6 },
    headStyles: { fillColor: GREEN, textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 249, 250] },
    columnStyles: { 1: { halign: "right" }, 3: { halign: "right" }, 4: { halign: "right" } },
  });

  type WithAT = jsPDF & { lastAutoTable?: { finalY: number } };
  let ty = ((doc as WithAT).lastAutoTable?.finalY ?? y) + 20;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text("TOTAL", W - 200, ty);
  doc.text(formatMoney(data.currency, total), W - 40, ty, { align: "right" });
  ty += 24;

  if (data.status) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(90);
    doc.text(`Order status: ${data.status.replace(/_/g, " ")}`, 40, ty);
    ty += 14;
  }
  if (data.notes) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(60);
    doc.text("Notes", 40, ty + 6);
    doc.setFont("helvetica", "normal");
    doc.text(String(data.notes), 40, ty + 20, { maxWidth: W - 80 });
  }

  const H = doc.internal.pageSize.getHeight();
  doc.setDrawColor(229, 231, 235);
  doc.line(40, H - 70, W - 40, H - 70);
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text(`${COMPANY.name} • ${COMPANY.phone} • ${COMPANY.email}`, 40, H - 52);
  doc.text("Thank you for your business. Payment terms as agreed in the sales contract.", 40, H - 40);

  return doc;
}

export function downloadInvoice(data: InvoiceData) {
  buildInvoicePDF(data).save(`invoice-${data.invoiceNumber}.pdf`);
}

export function invoicePDFBlob(data: InvoiceData): Blob {
  return buildInvoicePDF(data).output("blob");
}
