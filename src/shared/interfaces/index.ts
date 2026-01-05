import { Request } from "express";

export interface ServerConfig {
  port: number;
  nodeEnv: string;
}

export interface CustomRequest extends Request {
  user: {
    id: string;
  };
}

/*for DB add: 
id: uidv4 , 
received : Timestamp,
...rest of PolicyAuditorRequest

all fields are string except bets Array which is JSON
*/
export interface PolicyAuditorRequest {
  country: string; // ISO 3166-1 alpha-2; currently "ES"
  operator: string; // Operator code (e.g. "SELAE")
  operatorTicketId?: string; // Operator-issed ticket ID (globally unique)
  operatorTicketCode: string; // Operator ticket code. QRCode or Barcode
  gameNameId: string; // Game name ID (e.g. "EUROMILLIONES", "PRIMITIVA")
  clientId: string; // POS client ID
  insurancePolicyId: string; // Insurance policy ID (AON range)
  policyRequestedAt: string; // ISO 8601 request timestamp
  bets: Array<{
    drawDateTime: string; //ISO 8601 draw datetime
    betData?: Record<string, unknown>; // Additional bet data (flexible object)
  }>;
}
