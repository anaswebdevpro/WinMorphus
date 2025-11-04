import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import Input from "../../../Component/ui/Input";
import Button from "../../../Component/ui/Button";
import Card from "../../../Component/ui/Card";

const BankDetailsForm = ({
  bankAccounts,
  isLoading,
  onAddBankAccount,
  onDeleteBankAccount,
}) => {
  const validationSchema = Yup.object({
    bankName: Yup.string()
      .min(2, "Bank name must be at least 2 characters")
      .max(100, "Bank name must be less than 100 characters")
      .required("Bank name is required"),
    accountHolderName: Yup.string()
      .min(2, "Account holder name must be at least 2 characters")
      .max(100, "Account holder name must be less than 100 characters")
      .required("Account holder name is required"),
    accountNumber: Yup.string()
      .min(8, "Account number must be at least 8 digits")
      .max(20, "Account number must be less than 20 digits")
      .matches(/^[0-9]+$/, "Account number must contain only digits")
      .required("Account number is required"),
    routingNumber: Yup.string()
      .length(9, "Routing number must be exactly 9 digits")
      .matches(/^[0-9]+$/, "Routing number must contain only digits"),
    swiftCode: Yup.string()
      .min(8, "SWIFT code must be at least 8 characters")
      .max(11, "SWIFT code must be less than 11 characters"),
    iban: Yup.string()
      .min(8, "IFSC code must be at least 8 characters")
      .max(11, "IFSC code must be less than 11 characters")
      .required("IFSC code is required"),
  });

  const form = useFormik({
    initialValues: {
      bankName: "",
      accountHolderName: "",
      accountNumber: "",
      routingNumber: "",
      swiftCode: "",
      iban: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      await onAddBankAccount(values);
      form.resetForm();
    },
  });

  const handleDeleteAccount = async (accountId) => {
    if (window.confirm("Are you sure you want to delete this bank account?")) {
      await onDeleteBankAccount(accountId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Bank Account */}
      <Card
        title="Add Bank Account"
        subtitle="Add a new bank account for withdrawals"
      >
        <div className="mb-4 p-3 bg-emerald-900/30 border border-emerald-700/50 rounded-lg">
          <p className="text-sm text-emerald-200">
            <strong>Note:</strong> IFSC code is required for Indian bank
            accounts. It's an 11-character code (e.g., SBIN0001234) that
            identifies your bank branch.
          </p>
        </div>
        <form onSubmit={form.handleSubmit} className="space-y-6">
          {/* Required Fields */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">
              Required Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Bank Name"
                name="bankName"
                type="text"
                value={form.values.bankName}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={
                  form.touched.bankName && form.errors.bankName
                    ? String(form.errors.bankName)
                    : undefined
                }
                required
                placeholder="Enter bank name"
              />
              <Input
                label="Account Holder Name"
                name="accountHolderName"
                type="text"
                value={form.values.accountHolderName}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={
                  form.touched.accountHolderName &&
                  form.errors.accountHolderName
                    ? String(form.errors.accountHolderName)
                    : undefined
                }
                required
                placeholder="Enter account holder name"
              />
              <Input
                label="Account Number"
                name="accountNumber"
                type="text"
                value={form.values.accountNumber}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={
                  form.touched.accountNumber && form.errors.accountNumber
                    ? String(form.errors.accountNumber)
                    : undefined
                }
                required
                placeholder="Enter account number"
              />
              <Input
                label="IFSC Code"
                name="iban"
                type="text"
                value={form.values.iban}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={
                  form.touched.iban && form.errors.iban
                    ? String(form.errors.iban)
                    : undefined
                }
                required
                placeholder="Enter IFSC code (e.g., SBIN0001234)"
              />
            </div>
          </div>

          {/* Optional Fields */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">
              Optional Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Routing Number"
                name="routingNumber"
                type="text"
                value={form.values.routingNumber}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={
                  form.touched.routingNumber && form.errors.routingNumber
                    ? String(form.errors.routingNumber)
                    : undefined
                }
                placeholder="Enter routing number (US)"
              />
              <Input
                label="SWIFT Code"
                name="swiftCode"
                type="text"
                value={form.values.swiftCode}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={
                  form.touched.swiftCode && form.errors.swiftCode
                    ? String(form.errors.swiftCode)
                    : undefined
                }
                placeholder="Enter SWIFT code (International)"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading || !form.isValid}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isLoading ? "Adding Account..." : "Add Bank Account"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Existing Bank Accounts */}
      <Card title="Bank Accounts" subtitle="Manage your existing bank accounts">
        {bankAccounts.length > 0 ? (
          <div className="space-y-4">
            {bankAccounts.map((account) => (
              <div
                key={account.id}
                className="border border-slate-700 bg-slate-800/50 rounded-lg p-4 hover:border-slate-600 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-emerald-900/50 border border-emerald-700/50 rounded-full">
                      <CreditCard className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">
                        {account.bankName}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {account.accountHolderName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Account: ••••{account.accountNumber.slice(-4)}
                      </p>
                      {account.isDefault && (
                        <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-emerald-900/50 text-emerald-300 border border-emerald-700/50 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      Added {new Date(account.createdAt).toLocaleDateString()}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAccount(account.id)}
                      disabled={isLoading}
                      className="text-red-400 border-red-600 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No Bank Accounts
            </h3>
            <p className="text-gray-400">
              Add a bank account to enable withdrawals from your trading
              account.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BankDetailsForm;
