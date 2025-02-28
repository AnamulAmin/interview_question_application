import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Define elegant, refined styles for a sophisticated look
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    color: "#333333",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: "#cccccc",
    paddingBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 9,
    color: "#555555",
  },
  separator: {
    width: "40%",
    height: 1,
    backgroundColor: "#cccccc",
    marginVertical: 12,
    alignSelf: "center",
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#8e44ad", // Elegant purple for emphasis
    marginBottom: 20,
    textAlign: "center",
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#34495e",
    marginBottom: 12,
    textAlign: "left",
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    paddingBottom: 6,
  },
  table: {
    display: "table",
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dddddd",
    overflow: "hidden",
    marginBottom: 24,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    backgroundColor: "#ecf0f1", // Light gray background
    padding: 8,
    fontWeight: "bold",
    fontSize: 10,
    color: "#2c3e50",
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#bdc3c7",
  },
  tableCol: {
    padding: 8,
    fontSize: 10,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: "#f7f9fc", // Soft blue background
    borderColor: "#cccccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    fontSize: 12,
  },
  boldText: {
    fontWeight: "bold",
    color: "#2c3e50",
  },
  balanceText: (balance: any) => ({
    fontWeight: "bold",
    fontSize: 13,
    color: balance > 0 ? "#27ae60" : "#e74c3c",
  }),
});

// Document Component with Elegant Design
const MonthlyInvoicePdfTemplate = ({
  data,
  summary,
  cumulativeBalance,
  method_summary,
  profileData,
  month,
}: any): any => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Month Title */}
      <Text style={styles.monthTitle}>{month}</Text>

      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>{profileData?.name || "Business Name"}</Text>
        <Text style={styles.subTitle}>{profileData?.address || "Address"}</Text>
        <Text style={styles.subTitle}>
          {profileData?.mobile || "Phone Number"}
        </Text>
        <Text style={styles.subTitle}>{profileData?.email || "Email"}</Text>
      </View>

      {/* Table Section */}
      <Text style={styles.sectionTitle}>Monthly Transactions</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableColHeader, { width: "20%" }]}>Date</Text>
          <Text style={[styles.tableColHeader, { width: "27%" }]}>Incomes</Text>
          <Text style={[styles.tableColHeader, { width: "27%" }]}>
            Expenses
          </Text>
          <Text style={[styles.tableColHeader, { width: "26%" }]}>Total</Text>
        </View>

        {data.map((row: any, index: any) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCol, { width: "20%" }]}>{row.date}</Text>
            <Text style={[styles.tableCol, { width: "27%" }]}>
              {row.income || 0}
            </Text>
            <Text style={[styles.tableCol, { width: "27%" }]}>
              {row.expenses || 0}
            </Text>
            <Text style={[styles.tableCol, { width: "26%" }]}>
              {(row.income || 0) - (row.expenses || 0)}
            </Text>
          </View>
        ))}
      </View>

      {/* Summary Section */}
      <View style={styles.summaryContainer}>
        <Text style={styles.sectionTitle}>Financial Summary</Text>
        <View style={styles.summaryItem}>
          <Text style={styles.boldText}>Cumulative Balance:</Text>
          <Text
            style={styles.balanceText(cumulativeBalance?.cumulativeBalance)}
          >
            {cumulativeBalance?.cumulativeBalance || 0} BDT
          </Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.boldText}>Total Admission Fees:</Text>
          <Text>{summary?.totalAdmissionFees || 0} BDT</Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.boldText}>Total Package Fees:</Text>
          <Text>{summary?.totalPackageFees || 0} BDT</Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.boldText}>Total Discount:</Text>
          <Text>{summary?.totalDiscount || 0} BDT</Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.boldText}>Total Balance:</Text>
          <Text>{summary?.total} BDT</Text>
        </View>

        {/* Payment Method Summary */}
        {method_summary?.map((item: any, index: number) => (
          <View style={styles.summaryItem} key={index}>
            <Text>{item?.method_name || "Method"}:</Text>
            <Text>
              {parseInt(item?.totalIncome) - parseInt(item?.totalExpense)} BDT
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default MonthlyInvoicePdfTemplate;
