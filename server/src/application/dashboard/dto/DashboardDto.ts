export interface OverviewStats {
  totalPurchases: number;
  totalRefundsApproved: number;
  netTotal: number;
}

export interface PendingRefunds {
  pendingRefunds: number;
}

export interface ContractClosed {
  name: string;
  totalPurchases: number;
}
