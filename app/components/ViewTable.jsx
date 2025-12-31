import { useLoaderData, useFetcher } from "react-router";
import { useEffect } from "react";
import EditAppView from "./EditAppView";
import DeleteAppView from "./DeleteAppView";
export default function ViewTable() {
  const loaderData = useLoaderData();
  const fetcher = useFetcher();

  const metaobjects = loaderData?.getData?.data?.metaobjects?.edges || [];

  const data = metaobjects.map(({ node }) => {
    const nameField = node.fields.find((f) => f.key === "name");
    const valueField = node.fields.find((f) => f.key === "value");

    return {
      id: node.id,
      name: nameField?.value || "",
      value: valueField?.value || "",
    };
  });

  // refresh on mutation complete
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.metaobjectUpdate || fetcher.data.metaobjectDelete) {
        window.location.reload();
      }
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <s-section>
      <s-table>
        <s-table-header-row>
          <s-table-header>Name</s-table-header>
          <s-table-header>Value</s-table-header>
          <s-table-header>Actions</s-table-header>
        </s-table-header-row>

        <s-table-body>
          {data.map((item) => (
            <s-table-row key={item.id}>
              <s-table-cell>{item.name}</s-table-cell>
              <s-table-cell>{item.value}</s-table-cell>
              <s-table-cell style={{ display: "flex", gap: "8px" }}>
                {/* EDIT BUTTON - Pass unique modal ID */}
                <EditAppView
                  id={item.id}
                  modalId={`edit-modal-${item.id.replace(/[^a-zA-Z0-9]/g, '-')}`}
                />

                {/* DELETE BUTTON - Pass unique modal ID */}
                <DeleteAppView
                  id={item.id}
                  modalId={`delete-modal-${item.id.replace(/[^a-zA-Z0-9]/g, '-')}`}
                />
              </s-table-cell>
            </s-table-row>
          ))}
        </s-table-body>
      </s-table>
    </s-section>
  );
}