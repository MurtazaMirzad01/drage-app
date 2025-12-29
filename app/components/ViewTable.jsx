import { useLoaderData, useFetcher } from "react-router";
import { useState, useEffect } from "react";
import EditAppView from "./EditAppView.jsx";
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
                <EditAppView />

                {/* DELETE BUTTON */}
                <fetcher.Form method="post">
                  <input type="hidden" name="_mode" value="delete" />
                  <input type="hidden" name="id" value={item.id} />
                  <s-button type="submit" variant="destructive">
                    Delete
                  </s-button>
                </fetcher.Form>
              </s-table-cell>
            </s-table-row>
          ))}
        </s-table-body>
      </s-table>

      {/* ===========================
            EDIT MODAL
          =========================== */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md w-[400px] shadow-md">
            <h3 style={{ marginBottom: "12px" }}>Edit Bundle</h3>

            <fetcher.Form method="post">
              <input type="hidden" name="_mode" value="update" />
              <input type="hidden" name="id" value={editing.id} />

              <label>Name</label>
              <input
                type="text"
                name="name"
                defaultValue={editing.name}
                className="input"
              />

              <label style={{ marginTop: "10px" }}>Value</label>
              <input
                type="text"
                name="value"
                defaultValue={editing.value}
                className="input"
              />

              <div
                style={{
                  display: "flex",
                  marginTop: "20px",
                  justifyContent: "space-between",
                }}
              >
                <s-button variant="secondary" onClick={() => setEditing(null)}>
                  Cancel
                </s-button>

                <s-button type="submit" variant="primary" onClick={() => setEditing(null)}>
                  Save
                </s-button>
              </div>
            </fetcher.Form>
          </div>
        </div>
      )}
    </s-section>
  );
}
