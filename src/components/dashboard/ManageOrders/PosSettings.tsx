// // import { useState, useEffect } from "react";
// // import {
// //   Card,
// //   CardBody,
// //   CardHeader,
// //   Input,
// //   Button,
// //   Switch,
// //   Select,
// //   SelectItem,
// //   Tabs,
// //   Tab,
// // } from "@nextui-org/react";
// // import toast from "react-hot-toast";

// // const PosSettings = () => {
// //   const [settings, setSettings] = useState<any>({
// //     taxRate: 0,
// //     serviceCharge: 0,
// //     receiptHeader: "",
// //     receiptFooter: "",
// //     printerName: "",
// //     allowDiscount: false,
// //     defaultDiscountRate: 0,
// //     roundAmounts: true,
// //     currencySymbol: "$",
// //     paymentMethods: ["Cash", "Card"],
// //   });

// //   const [loading, setLoading] = useState(false);

// //   useEffect(() => {
// //     fetchSettings();
// //   }, []);

// //   const fetchSettings = async () => {
// //     try {
// //       const response = await window.ipcRenderer.invoke("get-pos-settings");
// //       if (response.success) {
// //         setSettings(response.data);
// //       }
// //     } catch (error) {
// //       toast.error("Failed to load POS settings");
// //     }
// //   };

// //   const handleSave = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await window.ipcRenderer.invoke("update-pos-settings", {
// //         data: settings,
// //       });
// //       if (response.success) {
// //         toast.success("Settings saved successfully");
// //       } else {
// //         toast.error(response.message);
// //       }
// //     } catch (error) {
// //       toast.error("Failed to save settings");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="p-6">
// //       <Card>
// //         <CardHeader>
// //           <h2 className="text-xl font-bold">POS Settings</h2>
// //         </CardHeader>
// //         <CardBody>
// //           <Tabs>
// //             <Tab key="general" title="General Settings">
// //               <div className="space-y-4 p-4">
// //                 <Input
// //                   label="Tax Rate (%)"
// //                   type="number"
// //                   value={settings.taxRate.toString()}
// //                   onChange={(e) =>
// //                     setSettings({
// //                       ...settings,
// //                       taxRate: Number(e.target.value),
// //                     })
// //                   }
// //                 />
// //                 <Input
// //                   label="Service Charge (%)"
// //                   type="number"
// //                   value={settings.serviceCharge.toString()}
// //                   onChange={(e) =>
// //                     setSettings({
// //                       ...settings,
// //                       serviceCharge: Number(e.target.value),
// //                     })
// //                   }
// //                 />
// //                 <Input
// //                   label="Currency Symbol"
// //                   value={settings.currencySymbol}
// //                   onChange={(e) =>
// //                     setSettings({
// //                       ...settings,
// //                       currencySymbol: e.target.value,
// //                     })
// //                   }
// //                 />
// //                 <Switch
// //                   isSelected={settings.roundAmounts}
// //                   onValueChange={(checked) =>
// //                     setSettings({ ...settings, roundAmounts: checked })
// //                   }
// //                 >
// //                   Round Amounts
// //                 </Switch>
// //               </div>
// //             </Tab>

// //             <Tab key="receipt" title="Receipt Settings">
// //               <div className="space-y-4 p-4">
// //                 <Input
// //                   label="Receipt Header"
// //                   value={settings.receiptHeader}
// //                   onChange={(e) =>
// //                     setSettings({
// //                       ...settings,
// //                       receiptHeader: e.target.value,
// //                     })
// //                   }
// //                 />
// //                 <Input
// //                   label="Receipt Footer"
// //                   value={settings.receiptFooter}
// //                   onChange={(e) =>
// //                     setSettings({
// //                       ...settings,
// //                       receiptFooter: e.target.value,
// //                     })
// //                   }
// //                 />
// //                 <Input
// //                   label="Printer Name"
// //                   value={settings.printerName}
// //                   onChange={(e) =>
// //                     setSettings({ ...settings, printerName: e.target.value })
// //                   }
// //                 />
// //               </div>
// //             </Tab>

// //             <Tab key="discount" title="Discount Settings">
// //               <div className="space-y-4 p-4">
// //                 <Switch
// //                   isSelected={settings.allowDiscount}
// //                   onValueChange={(checked) =>
// //                     setSettings({ ...settings, allowDiscount: checked })
// //                   }
// //                 >
// //                   Allow Discounts
// //                 </Switch>
// //                 <Input
// //                   label="Default Discount Rate (%)"
// //                   type="number"
// //                   value={settings.defaultDiscountRate.toString()}
// //                   onChange={(e) =>
// //                     setSettings({
// //                       ...settings,
// //                       defaultDiscountRate: Number(e.target.value),
// //                     })
// //                   }
// //                   isDisabled={!settings.allowDiscount}
// //                 />
// //               </div>
// //             </Tab>
// //           </Tabs>

// //           <div className="flex justify-end mt-4">
// //             <Button color="primary" onPress={handleSave} isLoading={loading}>
// //               Save Settings
// //             </Button>
// //           </div>
// //         </CardBody>
// //       </Card>
// //     </div>
// //   );
// // };

// // export default PosSettings;

// import {
//   Card,
//   CardBody,
//   CardHeader,
//   Input,
//   Button,
//   Switch,
//   Select,
//   SelectItem,
//   Tabs,
//   Tab,
// } from "@nextui-org/react";
// import { useEffect, useState } from "react";
// import { toast } from "react-hot-toast";

// interface POSSettings {
//   taxRate: number;
//   serviceCharge: number;
//   receiptHeader: string;
//   receiptFooter: string;
//   printerName: string;
//   allowDiscount: boolean;
//   defaultDiscountRate: number;
//   roundAmounts: boolean;
//   currencySymbol: string;
//   paymentMethods: string[];
//   waiterName: string;
//   tableCount: number;
//   cookingTime: number;
//   tableMap: string;
//   isSoundEnabled: boolean;
//   quickOrder: boolean;
// }

// const PosSettings = () => {
//   const [settings, setSettings] = useState<POSSettings>({
//     taxRate: 0,
//     serviceCharge: 0,
//     receiptHeader: "",
//     receiptFooter: "",
//     printerName: "",
//     allowDiscount: false,
//     defaultDiscountRate: 0,
//     roundAmounts: true,
//     currencySymbol: "$",
//     paymentMethods: ["Cash", "Card"],
//     waiterName: "",
//     tableCount: 0,
//     cookingTime: 0,
//     tableMap: "",
//     isSoundEnabled: false,
//     quickOrder: false,
//   });

//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchSettings();
//   }, []);

//   const fetchSettings = async () => {
//     try {
//       const response = await window.ipcRenderer.invoke("get-pos-settings");
//       if (response.success) {
//         setSettings(response.data);
//       }
//     } catch (error) {
//       toast.error("Failed to load POS settings");
//     }
//   };

//   const handleSave = async () => {
//     try {
//       setLoading(true);
//       const response = await window.ipcRenderer.invoke("update-pos-settings", {
//         data: settings,
//       });
//       if (response.success) {
//         toast.success("Settings saved successfully");
//       } else {
//         toast.error(response.message);
//       }
//     } catch (error) {
//       toast.error("Failed to save settings");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6">
//       <Card>
//         <CardHeader>
//           <h2 className="text-xl font-bold">POS Settings</h2>
//         </CardHeader>
//         <CardBody>
//           <Tabs>
//             <Tab key="general" title="General Settings">
//               <div className="space-y-4 p-4">
//                 <Input
//                   label="Tax Rate (%)"
//                   type="number"
//                   value={settings.taxRate.toString()}
//                   onChange={(e) =>
//                     setSettings({
//                       ...settings,
//                       taxRate: Number(e.target.value),
//                     })
//                   }
//                 />
//                 <Input
//                   label="Service Charge (%)"
//                   type="number"
//                   value={settings.serviceCharge.toString()}
//                   onChange={(e) =>
//                     setSettings({
//                       ...settings,
//                       serviceCharge: Number(e.target.value),
//                     })
//                   }
//                 />
//                 <Input
//                   label="Currency Symbol"
//                   value={settings.currencySymbol}
//                   onChange={(e) =>
//                     setSettings({ ...settings, currencySymbol: e.target.value })
//                   }
//                 />
//                 <Switch
//                   isSelected={settings.roundAmounts}
//                   onValueChange={(checked) =>
//                     setSettings({ ...settings, roundAmounts: checked })
//                   }
//                 >
//                   Round Amounts
//                 </Switch>
//               </div>
//             </Tab>

//             <Tab key="order" title="Order Settings">
//               <div className="space-y-4 p-4">
//                 <Input
//                   label="Waiter Name"
//                   value={settings.waiterName}
//                   onChange={(e) =>
//                     setSettings({ ...settings, waiterName: e.target.value })
//                   }
//                 />
//                 <Input
//                   label="Table Count"
//                   type="number"
//                   value={settings.tableCount.toString()}
//                   onChange={(e) =>
//                     setSettings({
//                       ...settings,
//                       tableCount: Number(e.target.value),
//                     })
//                   }
//                 />
//                 <Input
//                   label="Cooking Time (minutes)"
//                   type="number"
//                   value={settings.cookingTime.toString()}
//                   onChange={(e) =>
//                     setSettings({
//                       ...settings,
//                       cookingTime: Number(e.target.value),
//                     })
//                   }
//                 />
//                 <Input
//                   label="Table Map"
//                   value={settings.tableMap}
//                   onChange={(e) =>
//                     setSettings({ ...settings, tableMap: e.target.value })
//                   }
//                 />
//                 <Switch
//                   isSelected={settings.isSoundEnabled}
//                   onValueChange={(checked) =>
//                     setSettings({ ...settings, isSoundEnabled: checked })
//                   }
//                 >
//                   Enable Sound
//                 </Switch>
//                 <Switch
//                   isSelected={settings.quickOrder}
//                   onValueChange={(checked) =>
//                     setSettings({ ...settings, quickOrder: checked })
//                   }
//                 >
//                   Quick Order
//                 </Switch>
//               </div>
//             </Tab>

//             <Tab key="receipt" title="Receipt Settings">
//               <div className="space-y-4 p-4">
//                 <Input
//                   label="Receipt Header"
//                   value={settings.receiptHeader}
//                   onChange={(e) =>
//                     setSettings({ ...settings, receiptHeader: e.target.value })
//                   }
//                 />
//                 <Input
//                   label="Receipt Footer"
//                   value={settings.receiptFooter}
//                   onChange={(e) =>
//                     setSettings({ ...settings, receiptFooter: e.target.value })
//                   }
//                 />
//                 <Input
//                   label="Printer Name"
//                   value={settings.printerName}
//                   onChange={(e) =>
//                     setSettings({ ...settings, printerName: e.target.value })
//                   }
//                 />
//               </div>
//             </Tab>

//             <Tab key="discount" title="Discount Settings">
//               <div className="space-y-4 p-4">
//                 <Switch
//                   isSelected={settings.allowDiscount}
//                   onValueChange={(checked) =>
//                     setSettings({ ...settings, allowDiscount: checked })
//                   }
//                 >
//                   Allow Discounts
//                 </Switch>
//                 <Input
//                   label="Default Discount Rate (%)"
//                   type="number"
//                   value={settings.defaultDiscountRate.toString()}
//                   onChange={(e) =>
//                     setSettings({
//                       ...settings,
//                       defaultDiscountRate: Number(e.target.value),
//                     })
//                   }
//                   isDisabled={!settings.allowDiscount}
//                 />
//               </div>
//             </Tab>
//           </Tabs>

//           <div className="flex justify-end mt-4">
//             <Button color="primary" onPress={handleSave} isLoading={loading}>
//               Save Settings
//             </Button>
//           </div>
//         </CardBody>
//       </Card>
//     </div>
//   );
// };

// export default PosSettings;

import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Switch,
  Select,
  SelectItem,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface POSSettings {
  taxRate: number;
  serviceCharge: number;
  receiptHeader: string;
  receiptFooter: string;
  printerName: string;
  allowDiscount: boolean;
  defaultDiscountRate: number;
  roundAmounts: boolean;
  currencySymbol: string;
  paymentMethods: string[];
  waiterName: string;
  tableCount: number;
  cookingTime: number;
  tableMap: string;
  isSoundEnabled: boolean;
  quickOrder: boolean;
}

const PosSettings = () => {
  const [settings, setSettings] = useState<POSSettings>({
    taxRate: 0,
    serviceCharge: 0,
    receiptHeader: "",
    receiptFooter: "",
    printerName: "",
    allowDiscount: false,
    defaultDiscountRate: 0,
    roundAmounts: true,
    currencySymbol: "$",
    paymentMethods: ["Cash", "Card"],
    waiterName: "",
    tableCount: 0,
    cookingTime: 0,
    tableMap: "",
    isSoundEnabled: false,
    quickOrder: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await window.ipcRenderer.invoke("get-pos-settings");
      if (response.success) {
        setSettings(response.data);
      }
    } catch (error) {
      toast.error("Failed to load POS settings");
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await window.ipcRenderer.invoke("update-pos-settings", {
        data: settings,
      });
      if (response.success) {
        toast.success("Settings saved successfully");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">POS Settings</h2>
        </CardHeader>
        <CardBody>
          <Tabs>
            <Tab key="general" title="General Settings">
              <div className="space-y-4 p-4">
                <Input
                  label="Tax Rate (%)"
                  type="number"
                  value={settings.taxRate.toString()}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      taxRate: Number(e.target.value),
                    })
                  }
                />
                <Input
                  label="Service Charge (%)"
                  type="number"
                  value={settings.serviceCharge.toString()}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      serviceCharge: Number(e.target.value),
                    })
                  }
                />
                <Input
                  label="Currency Symbol"
                  value={settings.currencySymbol}
                  onChange={(e) =>
                    setSettings({ ...settings, currencySymbol: e.target.value })
                  }
                />
                <Switch
                  isSelected={settings.roundAmounts}
                  onValueChange={(checked) =>
                    setSettings({ ...settings, roundAmounts: checked })
                  }
                >
                  Round Amounts
                </Switch>
              </div>
            </Tab>

            <Tab key="order" title="Order Settings">
              <div className="space-y-4 p-4">
                <Input
                  label="Waiter Name"
                  value={settings.waiterName}
                  onChange={(e) =>
                    setSettings({ ...settings, waiterName: e.target.value })
                  }
                />
                <Input
                  label="Table Count"
                  type="number"
                  value={settings.tableCount.toString()}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      tableCount: Number(e.target.value),
                    })
                  }
                />
                <Input
                  label="Cooking Time (minutes)"
                  type="number"
                  value={settings.cookingTime.toString()}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      cookingTime: Number(e.target.value),
                    })
                  }
                />
                <Input
                  label="Table Map"
                  value={settings.tableMap}
                  onChange={(e) =>
                    setSettings({ ...settings, tableMap: e.target.value })
                  }
                />
                <Switch
                  isSelected={settings.isSoundEnabled}
                  onValueChange={(checked) =>
                    setSettings({ ...settings, isSoundEnabled: checked })
                  }
                >
                  Enable Sound
                </Switch>
                <Switch
                  isSelected={settings.quickOrder}
                  onValueChange={(checked) =>
                    setSettings({ ...settings, quickOrder: checked })
                  }
                >
                  Quick Order
                </Switch>
              </div>
            </Tab>

            <Tab key="receipt" title="Receipt Settings">
              <div className="space-y-4 p-4">
                <Input
                  label="Receipt Header"
                  value={settings.receiptHeader}
                  onChange={(e) =>
                    setSettings({ ...settings, receiptHeader: e.target.value })
                  }
                />
                <Input
                  label="Receipt Footer"
                  value={settings.receiptFooter}
                  onChange={(e) =>
                    setSettings({ ...settings, receiptFooter: e.target.value })
                  }
                />
                <Input
                  label="Printer Name"
                  value={settings.printerName}
                  onChange={(e) =>
                    setSettings({ ...settings, printerName: e.target.value })
                  }
                />
              </div>
            </Tab>

            <Tab key="discount" title="Discount Settings">
              <div className="space-y-4 p-4">
                <Switch
                  isSelected={settings.allowDiscount}
                  onValueChange={(checked) =>
                    setSettings({ ...settings, allowDiscount: checked })
                  }
                >
                  Allow Discounts
                </Switch>
                <Input
                  label="Default Discount Rate (%)"
                  type="number"
                  value={settings.defaultDiscountRate.toString()}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      defaultDiscountRate: Number(e.target.value),
                    })
                  }
                  isDisabled={!settings.allowDiscount}
                />
              </div>
            </Tab>
          </Tabs>

          <div className="flex justify-end mt-4">
            <Button color="primary" onPress={handleSave} isLoading={loading}>
              Save Settings
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default PosSettings;
