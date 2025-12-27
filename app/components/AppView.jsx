import { Form } from "react-router";
export default function AppView() {
  return (
    <s-page heading="Dashboard">
      <s-section>
        <s-heading>Enter product Details</s-heading>
        <Form
          data-save-bar
        // onSubmit={handleSubmit}  // Changed from string to function
        // onReset={handleDiscard}  // Changed from string to function
        >
          <s-stack direction="inline" gap="base" justifyContent="space-between">
            <s-text-field label="Name" />
            <s-text-field label="Value" />
          </s-stack>
          <s-button >Browse</s-button>

        </Form>

      </s-section>
    </s-page>
  );
}