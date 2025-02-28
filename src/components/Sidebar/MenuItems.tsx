import { IoIosHome } from "react-icons/io";
import { IoFastFoodOutline, IoSettingsOutline } from "react-icons/io5";
import { MdAttachMoney, MdOutlineInventory } from "react-icons/md";
import { BiTable } from "react-icons/bi";
import { FaUserTie } from "react-icons/fa";
import { PiStudent } from "react-icons/pi";
function MenuItemsList() {
  const allMenuItems = [
    {
      title: "Manage Food",
      icon: <IoFastFoodOutline />,
      list: [
        { title: "Food Category", path: "/menu-category" },
        { title: " Food Subcategory", path: "/menu-subcategory" },
        { title: "Create Food Item", path: "/create-menu" },
        { title: "Manage Food Item", path: "/view-all-menu" },
        // { title: "Bulk Upload Menu", path: "/bulk-menu-upload" },
      ],
    },
    {
      title: "Inventory",
      icon: <MdOutlineInventory />,
      list: [
        {
          title: " Inventory Category",
          path: "/inventory-category",
        },
        {
          title: " Inventory Child Category",
          path: "/inventory-child-category",
        },
        {
          title: "Manage Inventory",
          path: "/inventory-tracking",
        },
      ],
    },
    {
      title: "Manage Order",
      icon: <MdOutlineInventory />,
      list: [
        {
          title: "Order List",
          path: "/all-orders",
        },
        {
          title: "Pending Order",
          path: "/pending-orders",
        },
        {
          title: "Processing Order",
          path: "/process-orders",
        },
        {
          title: "Completed Order",
          path: "/completed-orders",
        },
        {
          title: "Cancelled Order",
          path: "/canceled-orders",
        },

        {
          title: "Counter Dashboard",
          path: "/counter-dashboard",
        },
        {
          title: "Counter List",
          path: "/counter-settings",
        },
        {
          title: "POS Setting",
          path: "/pos-settings",
        },
        {
          title: "Sound Setting",
          path: "/sound-settings",
        },
      ],
    },
    {
      title: "Table & Reservation",
      icon: <BiTable />,
      list: [
        { title: "Manage Table", path: "/tables" },
        { title: "Manage Floor", path: "/floors" },
        { title: "Table Setting", path: "/table-setting" },
      ],
    },
    {
      title: {
        en: "Manage Student",
        bn: "ছাত্র/ছাত্রীর পরিচয়",
        ar: "الطلاب/الطالبات",
        urdu: "طالبہ/طالبہ کی معلومات",
      },
      icon: <PiStudent />,
      list: [
        {
          title: {
            en: "Student Admission",
            bn: "ছাত্র/ছাত্রীর আবেদন",
            ar: "الطلاب/الطالبات",
            urdu: " طالب الدخول",
          },
          path: "/student-manage",
        },
        {
          title: {
            en: "Student Selection",
            bn: "ছাত্র/ছাত্রীর নির্বাচন",
            ar: "الطلاب/الطالبات المختارة",
            urdu: "طالب کے ساتھ منتخب",
          },
          path: "/student-selection",
        },
        {
          title: {
            en: "Student Profile",
            bn: "ছাত্র/ছাত্রীর প্রোফাইল",
            ar: "ملف الطالب",
            urdu: "طالب علم پروفائل",
          },
          path: "/student-selection",
        },
        {
          title: {
            en: "Attendance",
            bn: "ছাত্র/ছাত্রীর উপস্থিতি",
            ar: "حاضری",
            urdu: "حاضری",
          },
          path: "/student-selection",
        },
        {
          title: {
            en: "Fee collection ",
            bn: "ছাত্র/ছাত্রীর ফি কালেকশন",
            ar: "تحصيل الرسوم",
            urdu: "فیس جمع کرنا",
          },
          path: "/student-selection",
        },
      ],
    },
    {
      title: {
        en: "Teacher & Staff",
        bn: "শিক্ষক ও কর্মচারীবৃন্দ",
        ar: "المعلمين والموظفين",
        urdu: "استاد اور عملہ",
      },
      icon: <PiStudent />,
      list: [
        {
          title: {
            en: "Registration and Profile",
            bn: " রেজিস্ট্রেশন ও প্রোফাইল",
            ar: "ملف التسجيل",
            urdu: " رجسٹریشن پروفائل",
          },
          path: "/student-manage",
        },
        {
          title: {
            en: "Student Selection",
            bn: "ছাত্র/ছাত্রীর নির্বাচন",
            ar: "الطلاب/الطالبات المختارة",
            urdu: "طالب کے ساتھ منتخب",
          },
          path: "/student-selection",
        },
        {
          title: {
            en: "Class and subject assignment",
            bn: "শ্রেণী ও বিষয় বরাদ্দ",
            ar: "الواجبات الدراسية والموضوعية",
            urdu: " کلاس اور مضمون کی تفویض",
          },
          path: "/student-selection",
        },
        {
          title: {
            en: "Payroll management",
            bn: " বেতন ব্যবস্থাপনা",
            ar: " إدارة الرواتب",
            urdu: " پے رول کا انتظام",
          },
          path: "/student-selection",
        },
        {
          title: {
            en: "Leave and attendance",
            bn: "ছুটি এবং উপস্থিতি",
            ar: "تتبع الإجازات والحضور",
            urdu: "رخصتی اور حاضری ۔",
          },
          path: "/student-selection",
        },
      ],
    },
    {
      title: {
        en: "Class & Course ",
        bn: "শ্রেণী ও কোর্স",
        ar: "الفصول والدورات",
        urdu: "کلاس اور کورس",
      },
      icon: <PiStudent />,
      list: [
        {
          title: {
            en: "Darse Nizami syllabus integration",
            bn: "ডার্স নিজাম সিলেবাস ইন্টারগ্রেশন",
            ar: "الواجبات الدراسية والموضوعية",
            urdu: "درس نظامی کے نصاب کا انضمام",
          },
          path: "/student-manage",
        },
        {
          title: {
            en: "Class scheduling and timetable",
            bn: "শ্রেণী এবং সময়সূচি",
            ar: "جدولة الفصول الدراسية والجدول الزمني",
            urdu: "کلاس کا نظام الاوقات اور ٹائم ٹیبل",
          },
          path: "/student-selection",
        },
        {
          title: {
            en: "Exam and result management",
            bn: "পরীক্ষা এবং ফলাফল পরিচয়",
            ar: "إدارة الاختبارات والنتائج",
            urdu: "اختبارات اور نتائج کا انتظام",
          },
          path: "/student-selection",
        },
        {
          title: {
            en: "Hostel Management",
            bn: "হোস্টেল ব্যবস্থাপনা",
            ar: "إدارة المباني",
            urdu: "ہاسٹل مینجمنٹ",
          },
          path: "/student-selection",
        },
        {
          title: {
            en: "Meal plan and kitchen inventory",
            bn: "খাবার পরিকল্পনা এবং রান্নাঘরের তালিকা",
            ar: "خطة الوجبات ومخزون المطبخ",
            urdu: "کھانے کا منصوبہ اور باورچی خانے کی انوینٹری",
          },
          path: "/student-selection",
        },
        {
          title: {
            en: "* Visitor log and security ",
            bn: "দর্শনার্থীর লগ এবং নিরাপত্তা ব্যবস্থাপনা",
            ar: " سجل الزوار وإدارة الأمان",
            urdu: "وزیٹر لاگ اور سیکیورٹی مینجمنٹ",
          },
          path: "/student-selection",
        },
      ],
    },
    {
      title: {
        en: "Library Management",
        bn: "লাইব্রেরি ব্যবস্থাপনা",
        ar: "إدارة المكتبة",
        urdu: "لائبریری مینجمنٹ",
      },
      icon: <PiStudent />,
      list: [
        {
          title: {
            en: "Book catalog and borrowing system",
            bn: "বইয়ের ক্যাটালগ এবং ধার নেওয়ার ব্যবস্থা",
            ar: "فهرس الكتب ونظام الاستعارة",
            urdu: "بک کیٹلاگ اور قرض لینے کا نظام",
          },
          path: "/student-manage",
        },
        {
          title: {
            en: "Islamic book records",
            bn: "ইসলামী বইয়ের রেকর্ড",
            ar: "سجلات الكتب الاسلامية",
            urdu: "اسلامی کتابوں کے ریکارڈ",
          },
          path: "/student-selection",
        },
      ],
    },
    {
      title: {
        en: "Donation & Finance ",
        bn: "যাকাত ও সাদাকাহ দান",
        ar: "التبرعات والتمويل",
        urdu: "عطیہ اور مالیات",
      },
      icon: <PiStudent />,
      list: [
        {
          title: {
            en: "Zakat & Sadaqah donations",
            bn: "যাকাত ও সাদাকাহ দান",
            ar: "الزكاة والصدقات",
            urdu: "زکوٰۃ اور صدقہ کے عطیات",
          },
          path: "/student-manage",
        },
        {
          title: {
            en: "Expense and budgeting system",
            bn: "ব্যয় এবং বাজেট ব্যবস্থা",
            ar: "نظام النفقات والميزانية",
            urdu: "اخراجات اور بجٹ کا نظام",
          },
          path: "/student-selection",
        },
      ],
    },
    {
      title: {
        en: "Authentication & Roles",
        bn: "প্রমাণীকরণ এবং ভূমিকা",
        ar: "المصادقة والأدوار",
        urdu: "تصدیق اور کردار",
      },
      icon: <PiStudent />,
      list: [
        {
          title: {
            en: "access control",
            bn: "অ্যাক্সেস কন্ট্রোল",
            ar: " التحكم في الوصول",
            urdu: "رسائی کنٹرول",
          },
          path: "/student-manage",
        },
      ],
    },
    {
      title: "Purchase",
      icon: <FaUserTie />,
      list: [
        { title: "Purchase List", path: "/purchase-list" },
        { title: "Purchase Return", path: "/purchase-return" },
        { title: "Supplier Manage", path: "/supplier-list" },
        { title: "Supplier Ledger", path: "/supplier-ledger" },
        { title: "Stock Out Ingredients", path: "/stock-out-ingredients" },
      ],
    },
    {
      title: "Employee",
      icon: <FaUserTie />,
      list: [
        { title: "Employee Roles", path: "/employee-role" },
        { title: "Manage Employees", path: "/employee" },
        { title: "Employee Attendance", path: "/employ_attendance" },
        { title: "Department", path: "/department" },
        { title: "Division", path: "/division" },
        { title: "Designation", path: "/designation" },
        { title: "Manage Expense Item", path: "/expense_item" },
        { title: "Manage Expense", path: "/employee_expense" },
        { title: "Employee Salary", path: "/employee_salary" },
        { title: "Manage Award", path: "/award" },
      ],
    },
    {
      title: "Bulk Upload",
      icon: <IoIosHome />,
      list: [
        { title: "Bulk Menu", path: "/bulk-menu-upload" },
        { title: "Bulk Inventory", path: "/bulk-inventory" },
        // { title: "Employee Attendance", path: "/employ_attendance" },
      ],
    },
    {
      title: "Finance Manage",
      icon: <MdAttachMoney className="text-lg" />,
      list: [
        {
          title: "Invoices and Billing",
          path: "transactions",
          // isAllowed: isAllowedRoute("invoices-billing"),
        },

        {
          title: "Reports",
          path: "invoices",
          // isAllowed: isAllowedRoute("reports"),
        },
        {
          title: "Expense Tracking",
          path: "expense",
          // isAllowed: isAllowedRoute("expense-tracking"),
        },

        {
          title: "Add Payment Method",
          path: "payment-method",
          // isAllowed: isAllowedRoute("payment-method"),
        },
        {
          title: "Create Transaction Type",
          path: "create-transaction-type",
          // isAllowed: isAllowedRoute("create-transaction-type"),
        },
      ],
    },
    {
      title: "Payment Method",
      icon: <IoSettingsOutline />,
      list: [
        { title: "Print", path: "/print" },
        { title: "Payment Method List", path: "/payment-method-list" },
        { title: "Payment Setup", path: "/payment-setup" },
        { title: "Shipping Method", path: "/shipping-method" },
      ],
    },
    {
      title: "Settings",
      icon: <IoSettingsOutline />,
      list: [
        { title: "Discount", path: "/discount" },
        { title: "Vat", path: "/vat" },
        { title: "Commission Settings", path: "/commission-settings" },
        { title: "Application Settings", path: "/application-settings" },
        // { title: "Employee Attendance", path: "/employ_attendance" },
      ],
    },
    // customer area
    {
      title: "Customer",
      icon: <IoSettingsOutline />,
      list: [
        { title: "Customer List", path: "/customer-list" },
        { title: "Custer Type List", path: "/customer-type-list" },
        { title: "Third-Party Customers", path: "/third-party-customers" },
        { title: "Card Terminal List", path: "/card-terminal-list" },
        // { title: "Employee Attendance", path: "/employ_attendance" },
      ],
    },
    // customer area
    {
      title: "Employee Leave",
      icon: <IoSettingsOutline />,
      list: [
        { title: "Weekly Holiday", path: "/weekly-holiday" },
        { title: "Holiday", path: "/holiday" },
        { title: "Leave Type", path: "/leave-type" },
        { title: "Leave Application", path: "/leave-application" },
      ],
    },
    {
      title: "Employee Loan",
      icon: <IoSettingsOutline />,
      list: [
        { title: "Grant Loan", path: "/grant-loan" },
        { title: "Loan Installment", path: "/loan-installment" },
        { title: "Loan Report", path: "/loan-report" },
      ],
    },
    {
      title: "Kitchen",
      icon: <IoSettingsOutline />,
      list: [
        { title: "Kitchen List", path: "/kitchen-list" },
        // { title: "Kitchen Assign", path: "/kitchen-assign" },
        {
          title: "Kitchen Dashboard",
          path: "/kitchen-dashboard",
        },
        {
          title: "Kitchen Dashboard Setting",
          path: "/kitchen-setting-dashboard",
        },
      ],
    },
    {
      title: "Employee Salary",
      icon: <IoSettingsOutline />,
      list: [
        { title: "Salary Setup", path: "/salary-setup" },
        { title: "Generate Salary", path: "/generate-salary" },
        { title: "Salary Type", path: "/salary-type" },
      ],
    },
    {
      title: "Bank",
      icon: <IoSettingsOutline />,
      list: [
        { title: "Bank List", path: "/bank-list" },
        { title: "Bank Transaction", path: "/bank-transaction" },
      ],
    },
    {
      title: "Permission",
      icon: <IoSettingsOutline />,
      list: [
        { title: "Manage Employee Role", path: "/manage-employee-role" },
        { title: "User Permission", path: "/user-permission" },
      ],
    },
    // Other sections like Category, Subcategory, etc.
  ];

  return allMenuItems;
}

export default MenuItemsList;
