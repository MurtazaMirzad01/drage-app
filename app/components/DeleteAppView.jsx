import { useFetcher } from "react-router";

export default function DeleteAppView({ id }) {

  const fetcher = useFetcher();

  function handleSubmit(event) {
    event.preventDefault();

    fetcher.submit(
      {
        id: id,
        actionType: "delete",
      },
      { method: "post" }
    );
  }

  return (
    <>
      <s-button
        icon="delete"
        tone="critical"
        commandFor="delete-modal"
        command="--show"
      >

      </s-button>

      <s-modal
        id="delete-modal"
      >
        <s-stack paddingBlockStart="base" paddingBlockEnd="base" >
          <s-heading>Are Sure You Want To Delete This Item? </s-heading>
        </s-stack>

        <s-button slot="secondary-actions" commandFor="delete-modal" command="--hide">
          Consel
        </s-button>
        <s-button
          slot="primary-action"
          variant="primary"
          commandFor="delete-modal"
          command="--hide"
          onClick={handleSubmit}
        >
          Delete
        </s-button>

      </s-modal>
    </>
  );
}