import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { PACKAGES_INVESTMENT_HISTORY } from "../../Api/Api_variables";
import { apiRequest } from "../../Services/Api";
import { useAuth } from "../../Context/UseAuth";
import { AlertCircle, Package, Calendar, DollarSign } from "lucide-react";
import { StatusBadge } from "../../Component/ui";

const Investment_table = ({ Trigger }) => {
  const [transaction, setTransaction] = useState([]);
  const [Loading, setLoading] = useState(false);
  const { token } = useAuth();

  const FetchTransactions = () => {
    setLoading(true);
    try {
      apiRequest({
        endpoint: PACKAGES_INVESTMENT_HISTORY,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          console.log("Investment API Response:", response);

          // Handle both nested and direct data structures
          setTransaction(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch investment data:", error);
          const errorMessage =
            error?.message ||
            error?.response?.data?.message ||
            "Failed to fetch investment data";
          enqueueSnackbar(errorMessage, { variant: "error" });
          setLoading(false);
        });
    } catch {
      console.error("Failed to fetch Api hitting investment data:");
    }
  };
  useEffect(() => {
    FetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Trigger]);

  if (Loading) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] p-8 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          Investment History
        </h2>
        <div className="text-center py-12 text-[var(--text-muted)]">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-(--bg-card) border border-(--border-primary) p-8 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold text-(--text-primary) mb-4">
        Investment History
      </h2>

      {transaction.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-(--bg-tertiary) rounded-lg border border-(--border-secondary) overflow-auto ">
          <AlertCircle className="w-16 h-16 text-(--text-muted) mb-4" />
          <p className="text-(--text-secondary) text-lg font-semibold">
            No Investment History Yet
          </p>
          <p className="text-(--text-muted) text-center mt-2 max-w-md">
            You haven't made any investments yet. Start by subscribing to a
            package above to begin your investment journey
          </p>
        </div>
      ) : (
        <div className="overflow-auto min-h-100 max-h-100">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-(--border-secondary) bg-(--bg-secondary)">
                <th className="text-left py-3 px-4 text-sm font-semibold text-(--text-secondary)">
                  S.No
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-(--text-secondary)">
                  Package
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-(--text-secondary)">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-(--text-secondary)">
                  Monthly ROI
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-(--text-secondary)">
                  Purchase Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-(--text-secondary)">
                  Closing Date
                </th>
                {/* <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--text-secondary)]">
                  Payout Date
                </th> */}
                <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--text-secondary)]">
                  ROI Earned
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--text-secondary)]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {transaction.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-(--border-primary) hover:bg-(--bg-tertiary) transition-colors"
                >
                  <td className="py-4 px-4 text-(--text-primary) font-medium">
                    {index + 1}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-(--accent-primary)" />
                      <span className="text-(--text-primary) font-medium">
                        {item.package_name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-(--status-success)" />
                      <span className="text-(--text-primary) font-semibold">
                        {item.formatted_amount}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-(--status-info) font-medium">
                    ${item.rate_percentage}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-(--text-secondary)">
                      <Calendar className="w-4 h-4 text-(--status-info)" />
                      {item.formatted_purchase_date}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-(--text-secondary)">
                    {item.formatted_closing_date}
                  </td>
                  {/* <td className="py-4 px-4 text-[var(--text-secondary)]">
                    {item.formatted_payout_date}
                  </td> */}
                  <td className="py-4 px-4">
                    <span className="text-(--status-success) font-semibold">
                      {item.formatted_roi}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Investment_table;
