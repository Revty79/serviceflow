"use server";

export type RequestLeadActionState = {
  message?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitLeadRequestAction(
  _state: RequestLeadActionState,
  _formData: FormData,
): Promise<RequestLeadActionState> {
  return {
    message: "Lead submission is not wired yet.",
  };
}
