const InvoiceHead = ({ addPackageButton }) => {
        return (
        <div>
            {addPackageButton && (
                <InvoiceRow
                    invoiceData={invoiceData}
                    data={data}
                    setIsShowNote={setIsShowNote}
                    setIsDeleteInvoice={setIsDeleteInvoice}
                    setIsDeleteMember={setIsDeleteMember}
                />
            )}
        </div>
    );
};

export default InvoiceHead;