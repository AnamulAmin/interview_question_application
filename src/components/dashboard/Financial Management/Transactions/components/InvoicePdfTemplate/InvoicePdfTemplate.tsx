import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Black and white styling for print-friendly design
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#000000", // Black text
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000", // Black for the title
    marginBottom: 8,
  },
  subTitle: {
    textAlign: "center",
    fontSize: 10,
    color: "#333333", // Dark gray for subtitle
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#000000", // Black for section titles
    backgroundColor: "#e0e0e0", // Light gray background
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginVertical: 10,
  },
  table: {
    display: "table",
    width: "100%",
    marginVertical: 10,
    borderWidth: 0.5,
    borderColor: "#999999", // Medium gray for table borders
    borderRadius: 5,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "16.67%",
    padding: 5,
    backgroundColor: "#d3d3d3", // Light gray for headers
    color: "#000000", // Black text for headers
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCol: {
    width: "16.67%",
    padding: 5,
    textAlign: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#cccccc", // Light gray for row dividers
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#cccccc", // Light gray for summary divider
  },
  boldText: {
    fontWeight: "bold",
    color: "#000000", // Black text for emphasis
  },
  positiveBalance: {
    color: "#000000", // Black text
    fontWeight: "bold",
  },
  negativeBalance: {
    color: "#555555", // Dark gray text for negative balance
    fontWeight: "bold",
  },
  summaryContainer: {
    padding: 10,
    backgroundColor: "#f7f7f7", // Very light gray for the summary container
    borderRadius: 5,
    marginTop: 10,
  },
  methodSummaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
});

// Utility function for calculating amounts
const calculateAmount = (data: any) => {
  return data?.transaction_type
    ? data?.amount
    : parseInt(data?.packageFee || 0) +
        parseInt(data?.admissionFee || 0) -
        parseInt(data?.discount || 0);
};

// PDF Document Component
const InvoicePdfTemplate = ({
  transactions = [],
  summary = {},
  cumulativeBalance = {},
  method_summary = [],
  profileData = {},
}: any): any => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View>
          <Text style={styles.title}>
            {profileData?.name || "Business Name"}
          </Text>
          <Text style={styles.subTitle}>
            {profileData?.address || "Address"}
          </Text>
          <Text style={styles.subTitle}>
            {profileData?.mobile || "Phone Number"}
          </Text>
          <Text style={styles.subTitle}>{profileData?.email || "Email"}</Text>
        </View>

        <Text style={styles.sectionTitle}>Transaction Report</Text>

        {/* Transactions Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text>SL. No.</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Transaction Type</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Member or Tran</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Purpose</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Payment Method</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Amount</Text>
            </View>
          </View>

          {/* Table Rows */}
          {transactions.map((data, index) => (
            <View style={styles.tableRow} key={data.receipt_no || index}>
              <View style={styles.tableCol}>
                <Text>{index + 1}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{data?.transaction_type || "Income"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>
                  {data?.member_id || data?.member_name
                    ? `${data?.member_id || ""} ${data?.member_name || ""}`
                    : data?.receipt_no || ""}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text>
                  {data?.transaction_name || data?.package_name || "N/A"}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{data?.payment_method || "N/A"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{calculateAmount(data)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Summary Section */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Summary</Text>

          <View style={styles.listItem}>
            <Text style={styles.boldText}>Cumulative Balance:</Text>
            <Text
              style={
                cumulativeBalance?.cumulativeBalance > 0
                  ? styles.positiveBalance
                  : styles.negativeBalance
              }
            >
              {cumulativeBalance?.cumulativeBalance || 0} BDT
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.boldText}>Total Expense (Filtered):</Text>
            <Text style={styles.negativeBalance}>
              {summary?.expense || 0} BDT
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.boldText}>Total Income (Filtered):</Text>
            <Text style={styles.positiveBalance}>
              {summary?.income || 0} BDT
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.boldText}>Total Discount (Filtered):</Text>
            <Text style={styles.positiveBalance}>
              {summary?.totalDiscount || 0} BDT
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.boldText}>Total Balance:</Text>
            <Text style={styles.positiveBalance}>{summary?.total} BDT</Text>
          </View>

          {method_summary?.map((item, index) => (
            <View style={styles.methodSummaryItem} key={index}>
              <Text style={[styles.boldText]}>
                {item?.method_name || "Method"}
              </Text>
              <Text style={styles.positiveBalance}>
                {parseInt(item?.totalIncome) - parseInt(item?.totalExpense)} BDT
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePdfTemplate;
