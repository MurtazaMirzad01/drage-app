import { useLoaderData, useFetcher } from "react-router";
import { useState, useEffect } from "react";
import EditAppView from "./EditAppView.jsx";
import DeleteAppView from "./DeleteAppView.jsx";
export default function ViewTable() {
  const loaderData = useLoaderData();
  const fetcher = useFetcher();

  const [editing, setEditing] = useState(null); // stores item being edited

  const metaobjects =
    loaderData?.getData?.data?.metaobjects?.edges || [];

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
      // Update success
      if (fetcher.data.metaobjectUpdate) {
        setEditing(null);
        window.location.reload();
      }

      // Delete success
      if (fetcher.data.metaobjectDelete) {
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
                {/* EDIT BUTTON */}
                <EditAppView id={item.id} />

                {/* DELETE BUTTON */}
                <DeleteAppView id={item.id} />
              </s-table-cell>
            </s-table-row>
          ))}
        </s-table-body>
      </s-table>

    </s-section>
  );
}
