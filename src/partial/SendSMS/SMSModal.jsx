import { useState, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import Swal from "sweetalert2";
import useSendSimpleSms from "../../../config/SMS/SendSimpleSms";
import useAxiosSecure from "../../../../useAxiosSecure";
import { useAuth } from "../../../providers/AuthProvider";

const SMSModal = ({ isOpen, onClose, contactNumber, userbranch }) => {
  const [smsMessage, setSmsMessage] = useState < any > "";
  const [template, setTemplate] = useState < any > "";
  const [smsType, setSmsType] = useState < any > "text";
  //   const [senderId, setSenderId] = useState<any>('');
  const axiosSecure = useAxiosSecure();
  const [templates, setTemplates] = useState < any > [];
  const [loading, setLoading] = useState < any > false;
  const [sentMessages, setSentMessages] = useState < any > []; // New state for sent messages
  const { branch } = useAuth();
  const { sendSimpleSms } = useSendSimpleSms();

  useEffect(() => {
    fetchTemplates();
    // fetchSenderIds();
    fetchSentMessages();
  }, [contactNumber]);

  const fetchTemplates = () => {
    setLoading(true);
    axiosSecure
      .get(`/smstemplates/?branch=${branch}`)
      .then((response) => {
        setTemplates(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching templates:", error);
        setLoading(false);
      });
  };

  //   const fetchSenderIds = () => {
  //     setLoading(true);
  //     axiosSecure.get(`/senderids/${branch}/get-all`)
  //       .then(response => {
  //         setSenderIds(response.data);
  //         if (response.data.length > 0) {
  //           setSenderId(response.data[0].ID);
  //           console.log(senderId); // Set default to the first sender ID
  //         }
  //         setLoading(false);
  //       })
  //       .catch(error => {
  //         console.error('Error fetching sender IDs:', error);
  //         setLoading(false);
  //       });
  //   };

  const fetchSentMessages = () => {
    setLoading(true);
    axiosSecure
      .get(`/smslogs/last7/88${contactNumber}`)
      .then((response) => {
        setSentMessages(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching sent messages:", error);
        setLoading(false);
      });
  };

  const handleTemplateChange = (e) => {
    const selectedTemplateId = e.target.value;
    const selectedTemplate = templates.find(
      (template) => template._id === selectedTemplateId
    );
    setTemplate(selectedTemplateId);
    setSmsMessage(selectedTemplate ? selectedTemplate.msg : "");
  };

  const validateSms = () => {
    if (!contactNumber) {
      Swal.fire("Validation Error", "Mobile number is required", "error");
      return false;
    }
    if (!smsMessage) {
      Swal.fire("Validation Error", "SMS body cannot be empty", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateSms()) return;

    setLoading(true);
    try {
      const responseData = await sendSimpleSms({
        name: "No Name",
        campaignName: "send_sms",
        senderid: "8809601010328",
        mobile: "88" + contactNumber,
        message: smsMessage,
        TransactionType: "T",
        branch,
        useSwal: true,
      });

      if (responseData) {
        console.log("Response Data:", responseData);
      }

      // Reset form fields
      setTemplate("");
      setSmsMessage("");
    } catch (error) {
      console.error("Error sending SMS:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSmsTypeChange = (e) => {
    setSmsType(e.target.value);
  };

  const getRemainingCharacters = () => {
    const maxChars = smsType === "text" ? 160 : 70;
    const remaining = maxChars - smsMessage.length;
    const smsCount = Math.ceil(smsMessage.length / maxChars);
    return {
      remaining,
      smsCount,
      maxChars,
    };
  };

  const { remaining, smsCount, maxChars } = getRemainingCharacters();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4">Send SMS</h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Contact Number
          </label>
          <p className="bg-gray-100 p-2 rounded-lg">{contactNumber}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Select from SMS Template
          </label>
          <select
            className="select select-bordered w-full"
            value={template}
            onChange={handleTemplateChange}
          >
            <option value="">Select SMS Template</option>
            {templates.map((template) => (
              <option key={template._id} value={template._id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            SMS Message
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Enter your SMS message here..."
            rows="4"
            value={smsMessage}
            onChange={(e) => setSmsMessage(e.target.value)}
            maxLength={1000}
          />
          <div className="text-right text-sm mt-2">
            <span>
              {remaining} Characters Left | SMS ({maxChars} Char./SMS)
            </span>
            <span className="block mt-1 text-gray-500">
              This message will be sent as {smsCount} SMS
              {smsCount > 1 ? "es" : ""}
            </span>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              "Sending..."
            ) : (
              <>
                <FaPaperPlane /> Send SMS
              </>
            )}
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>

        {/* Sent Messages History */}
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Sent Messages</h3>
          <div className="overflow-y-auto h-48">
            {sentMessages.length > 0 ? (
              sentMessages.map((msg, index) => (
                <div key={index} className="border-b py-2">
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs text-gray-500">
                    Sent On: {new Date(msg.send_on).toLocaleString()}
                  </p>
                  <p
                    className={`text-xs ${
                      msg.status === "Sent" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    Status: {msg.status}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No sent messages found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMSModal;
