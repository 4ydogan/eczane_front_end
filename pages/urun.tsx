import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";

import { Urun } from "../types/types";
import { NextRouter, useRouter } from "next/router";
import { InputNumber } from "primereact/inputnumber";

type Item = Urun;

const UrunList = (props: any) => {
  let emptyItem = {
    urun_id: "",
    urun_turu: "",
    urun_adı: "",
    fiyat: 0
  };
  const [items, setItems] = useState<Item[]>([]);
  const [editType, setEditType] = useState<"edit" | "new">("new");
  const [itemDialog, setItemDialog] = useState(false);
  const [deleteItemDialog, setDeleteItemDialog] = useState(false);
  const [deleteItemsDialog, setDeleteItemsDialog] = useState(false);
  const [item, setItem] = useState<Item>(emptyItem);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  let hours = [
    {
      label: "Krem",
      value: "Krem",
    },
    {
      label: "Hap",
      value: "Hap",
    },
    {
      label: "Fitil",
      value: "Fitil",
    },
    {
      label: "Şurup",
      value: "Şurup",
    },
    {
      label: "İğne",
      value: "İğne",
    },
  ];

  useEffect(() => {
    axios.get("/urun").then((response) => setItems(response.data));
  }, [itemDialog]); // eslint-disable-line react-hooks/exhaustive-deps

  const [user_id, setUserID] = useState<undefined | null | string>(null);
  const [yetki, setYetki] = useState<undefined | null | string>(null);

  const router: NextRouter = useRouter();

  useEffect(() => {
    setUserID(localStorage.getItem("user_id"));
    setYetki(localStorage.getItem("yetki"));

  }, [router.pathname]);

  const openNew = () => {
    setItem(emptyItem);
    setEditType("new");
    setSubmitted(false);
    setItemDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setItemDialog(false);
  };

  const hideDeleteItemDialog = () => {
    setDeleteItemDialog(false);
  };

  const hideDeleteItemsDialog = () => {
    setDeleteItemsDialog(false);
  };

  const saveItem = () => {
    setSubmitted(true);

    if (item.urun_turu.trim()) {
      let _items = [...items];
      let _item = { ...item };

      if (editType === "new") {
        axios
          .post("/urun", _item)
          .then((response) => {
            _item.urun_id = response.data.urun_id;
            _items.push(_item);
          })
          .catch((error) => {
            console.log(error);
          });

        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Item Created",
          life: 3000,
        });
      } else if (editType === "edit") {
        axios
          .put("/urun", _item)
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });

        const index = findIndexById(item.urun_id);

        _items[index] = _item;
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Item Updated",
          life: 3000,
        });
      }

      setItems(_items);
      setItemDialog(false);
      setItem(emptyItem);
    }
  };

  const editItem = (item: any) => {
    setItem({ ...item });
    console.log(item);
    setItemDialog(true);
    setEditType("edit");
  };

  const confirmDeleteItem = (item: any) => {
    setItem(item);
    setDeleteItemDialog(true);
  };

  const deleteItem = () => {
    let _items = items.filter((val) => val.urun_id !== item.urun_id);

    axios
      .delete("/urun", { data: item })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });

    setItems(_items);
    setDeleteItemDialog(false);
    setItem(emptyItem);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Item Deleted",
      life: 3000,
    });
  };

  const findIndexById = (id: any) => {
    let index = -1;
    for (let i = 0; i < items.length; i++) {
      if (items[i].urun_id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const createId = () => {
    let id = "";
    let chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  const confirmDeleteSelected = () => {
    setDeleteItemsDialog(true);
  };

  const deleteSelectedItems = () => {
    let _items = items.filter((val) => !selectedItems.includes(val));
    let delete_items = items.filter((val) => selectedItems.includes(val));

    delete_items.forEach((item_del) =>
      axios
        .delete("/urun", { data: item_del })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        })
    );

    setItems(_items);
    setDeleteItemsDialog(false);
    setSelectedItems([]);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Items Deleted",
      life: 3000,
    });
  };

  const onInputChange = (e: any, name: any) => {
    const val = (e.target && e.target.value) || "";
    let _item = { ...item };
    _item[`${name}`] = val;

    setItem(_item);
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="New"
          icon="pi pi-plus"
          className="p-button-success mr-2"
          onClick={openNew}
        />
        {yetki === "admin" ? <>
          <Button
            label="Delete"
            icon="pi pi-trash"
            className="p-button-danger"
            onClick={confirmDeleteSelected}
            disabled={!selectedItems || !selectedItems.length}
          />
        </> : null}
      </React.Fragment>
    );
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
        {yetki === "admin" ? <>
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-success mr-2"
            onClick={() => editItem(rowData)}
          />

          <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-warning"
            onClick={() => confirmDeleteItem(rowData)}
          />
        </> : null
        }
      </React.Fragment >
    );
  };

  const onInputNumberChange = (e: any, name: any) => {
    const val = e.value || 0;
    let _item = { ...item };
    _item[`${name}`] = val;

    setItem(_item);
  };

  const header = (
    <div className="table-header">
      <h5 className="mx-0 my-1">Urunler</h5>
    </div>
  );

  const itemDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveItem}
      />
    </React.Fragment>
  );

  const deleteItemDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteItemDialog}
      />
      {yetki === "admin" ? <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteItem}
      /> : null}
    </React.Fragment>
  );

  const deleteItemsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteItemsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedItems}
      />
    </React.Fragment>
  );
  return (
    <div className="datatable-crud-demo">
      <Toast ref={toast} />

      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate} />

        <DataTable
          ref={dt}
          value={items}
          selection={selectedItems}
          onSelectionChange={(e) => setSelectedItems(e.value)}
          dataKey="urun_id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} items"
          globalFilter={globalFilter}
          header={header}
          responsiveLayout="scroll"
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
            exportable={false}
          ></Column>
          <Column
            field="urun_id"
            header="Urun ID"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            field="urun_adı"
            header="Urun Adı"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            field="urun_turu"
            header="Urun Turu"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            field="fiyat"
            header="Fiyat"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "8rem" }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={itemDialog}
        style={{ width: "450px" }}
        header="Item Details"
        modal
        className="p-fluid"
        footer={itemDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="urun_adı">Urun Adı</label>
          <InputText
            id="urun_adı"
            value={item.urun_adı}
            onChange={(e) => onInputChange(e, "urun_adı")}
            required
            autoFocus
            className={classNames({ "p-invalid": submitted && !item.urun_adı })}
          />
          {submitted && !item.urun_adı && (
            <small className="p-error">Name is required.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="urun_turu">Urun Turu</label>
          <Dropdown
            id="urun_turu"
            options={hours}
            value={item.urun_turu}
            virtualScrollerOptions={{ itemSize: 38 }}
            onChange={(e) => onInputChange(e, "urun_turu")}
          />
        </div>
        <div className="field">
          <label htmlFor="fiyat">Fiyat</label>
          <InputNumber
            id="fiyat"
            value={item.fiyat}
            onChange={(e) => onInputNumberChange(e, "fiyat")}
            required
            autoFocus
            mode="currency" currency="TRY" locale="en-US"
            className={classNames({ "p-invalid": submitted && !item.fiyat })}
          />
          {submitted && !item.fiyat && (
            <small className="p-error">Fiyat is required.</small>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={deleteItemDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={deleteItemDialogFooter}
        onHide={hideDeleteItemDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {item && (
            <span>
              Are you sure you want to delete <b>{item.urun_adı}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={deleteItemsDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={deleteItemsDialogFooter}
        onHide={hideDeleteItemsDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {item && (
            <span>Are you sure you want to delete the selected items?</span>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default UrunList;
