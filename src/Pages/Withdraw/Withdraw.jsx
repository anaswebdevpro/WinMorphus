import WalletInfo from "./Components/WalletInfo";
import Stats_30days from "./Components/Stats_30days";
import Withdraw_Form from "./Components/Withdraw_Form";
import Withdraw_table from "./Components/Withdraw_table";

const Withdraw = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pb-10">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-2">
              Withdraw Funds
            </h1>
            <p className="text-[var(--text-secondary)]">
              Withdraw your earnings to your preferred wallet
            </p>
          </div>
        </div>

        {/* Wallet Info Component */}
        <WalletInfo />

        {/* Statistics Component */}
        <Stats_30days />

        {/* Withdrawal Form Component */}
        <Withdraw_Form />

        {/* Withdrawal History Table Component */}
        <Withdraw_table />
      </div>
    </div>
  );
};

export default Withdraw;
