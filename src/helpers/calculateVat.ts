function calculateVAT(subtotal: any): any {
  const storedVatData = localStorage.getItem("vat");
  const vatData = storedVatData ? JSON.parse(storedVatData) : null;

  if (vatData && vatData?.isEnabled) {
    const vatPercentage = Number(vatData?.vatPercentage);

    if (!subtotal || vatPercentage <= 0) return { vat: 0, total: subtotal };
    const vat = (subtotal * vatPercentage) / 100;
    const total = subtotal + vat;
    return { vat, total };
  }
  return { vat: 0, total: 0 };
}

export default calculateVAT;
