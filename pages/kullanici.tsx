import React, { useState, useEffect, useRef, ReactPropTypes } from "react";
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

import { Kullanici } from "../types/types";

type Item = Kullanici;

const KullaniciList = () => {
  let emptyItem = {
    user_id: "",
    kullanici_adi: "",
    parola: "",
    yetki: "",
    ad: '',
    soyad: '',
    adres: ''
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

  let yetkiler = [{
    label: "Yönetici",
    value: "yonetici",
  },
  {
    label: "Kullanıcı",
    value: "kullanici",
  },
  {
    label: "Admin",
    value: "admin",
  }];

  useEffect(() => {
    axios.get("/kullanici").then((response) => setItems(response.data));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

    if (item.user_id) {
      let _items = [...items];
      let _item = { ...item };

      if (editType === "new") {
        axios
          .post("/kullanici", item)
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });

        _items.push(_item);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Item Created",
          life: 3000,
        });
      } else if (editType === "edit") {
        const index = findIndexById(item.user_id);

        axios
          .put("/kullanici", item)
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });

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
    let _items = items.filter((val) => val.user_id !== item.user_id);

    axios
      .delete("/kullanici", { data: item })
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
      if (items[i].user_id === id) {
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
        .delete("/kullanici", { data: item_del })
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
        <Button
          label="Delete"
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedItems || !selectedItems.length}
        />
      </React.Fragment>
    );
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  };

  const header = (
    <div className="table-header">
      <h5 className="mx-0 my-1">Kullanıcılar</h5>
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
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteItem}
      />
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
          dataKey="user_id"
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
            field="user_id"
            header="User ID"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            field="kullanici_adi"
            header="Kullanıcı Adı"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            field="parola"
            header="Parola"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            field="yetki"
            header="Yetki"
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
          <label htmlFor="user_id">User ID</label>
          <InputText
            id="user_id"
            value={item.user_id}
            autoFocus
            onChange={(e) => onInputChange(e, "user_id")}
            required
            className={classNames({ "p-invalid": submitted && !item.user_id })}
          />
          {submitted && !item.user_id && (
            <small className="p-error">User ID is required.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="kullanici_adi">Kullanıcı Adı</label>
          <InputText
            id="kullanici_adi"
            value={item.kullanici_adi}
            onChange={(e) => onInputChange(e, "kullanici_adi")}
            required
            className={classNames({
              "p-invalid": submitted && !item.kullanici_adi,
            })}
          />
          {submitted && !item.kullanici_adi && (
            <small className="p-error">Kullanıcı Adı is required.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="parola">Parola</label>
          <InputText
            id="parola"
            value={item.parola}
            onChange={(e) => onInputChange(e, "parola")}
            required
            className={classNames({ "p-invalid": submitted && !item.parola })}
          />
          {submitted && !item.parola && (
            <small className="p-error">Soyad is required.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="yetki">Yetki</label>
          <Dropdown
            id="yetki"
            options={yetkiler}
            value={item.yetki}
            virtualScrollerOptions={{ itemSize: 38 }}
            field="label"
            dropdown
            onChange={(e) => onInputChange(e, "yetki")}
          />
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
              Are you sure you want to delete <b>{item.name}</b>?
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

export default KullaniciList;
