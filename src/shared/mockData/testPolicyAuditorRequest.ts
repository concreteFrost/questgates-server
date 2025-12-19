import { PolicyAuditorRequest } from "../../shared/interfaces";

export const testPolicyAuditorRequest: PolicyAuditorRequest = {
  country: "ES",
  operator: "SELAE",
  operatorTicketId: "TICKET-2025-0001",
  operatorTicketCode: "QR-ABC-123456789",
  gameNameId: "EUROMILLIONES",
  clientId: "POS-ES-001",
  insurancePolicyId: "AON-900000123",
  policyRequestedAt: "2025-01-15T10:30:00.000Z",
  bets: [
    {
      drawDateTime: "2025-01-16T20:45:00.000Z",
      betData: {
        numbers: [5, 12, 23, 34, 45],
        stars: [1, 7],
        system: "simple",
      },
    },
    {
      drawDateTime: "2025-01-18T20:45:00.000Z",
      betData: {
        numbers: [3, 15, 27, 36, 44],
        stars: [2, 9],
        system: "multiple",
        price: 4.5,
      },
    },
  ],
};
