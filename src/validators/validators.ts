import * as z from "zod";

export const AuthSchema = z.object({
  name: z.string("name required"),
  email: z.email("invalid email format").nonempty("email required"),
  password: z.string("password required"),
});

export const LoginSchema = z.object({
  email: z.email("invalid email format").nonempty("email required"),
  password: z.string("password required"),
});

export const PolicyRequestSchema = z.object({
  country: z.string("country can`t be blank or null"),
  operator: z.string("operator can`t be blank or null"),
  operatorTicketId: z.string("operator ticket id can`t be blank or null"),
  gameNameId: z.string("game name id can`t be blank or null"),
  clientId: z.string("client id can`t be blank or null"),
  insurancePolicyId: z.string("insurance policy id at can`t be blank or null"),
  policyRequestedAt: z.string("policy requested at can`t be blank or null"),
  bets: z.json("invalid bets format"),
});
