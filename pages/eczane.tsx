import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";

import { Eczane, Kullanici } from "../types/types";
import { NextRouter, useRouter } from "next/router";

type Item = Eczane;

const EczaneList = (props: any) => {
  const emptyItem = {
    isim: "",
    adres: "",
    acilis_saati: "",
    kapanis_saati: "",
    telefon_no: "",
    yonetici_id: "",
    eczane_id: "",
  };

  const [items, setItems] = useState<Item[]>([]);
  const [kullanicilar, setKullanicilar] = useState<Kullanici[]>([]);
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

  let hours = Array.from({ length: 24 }).map((_, i) => ({
    label: `${i < 10 ? "0" : ""}${i}:00:00`,
    value: `${i < 10 ? "0" : ""}${i}:00:00`,
  }));

  const [user_id, setUserID] = useState<undefined | null | string>(null);
  const [yetki, setYetki] = useState<undefined | null | string>(null);

  const router: NextRouter = useRouter();

  useEffect(() => {
    setUserID(localStorage.getItem("user_id"));
    setYetki(localStorage.getItem("yetki"));

  }, [router.pathname]);

  useEffect(() => {
    axios.get("/eczane").then((response) => setItems(response.data));
    axios.get("/kullanici").then((response) => setKullanicilar(response.data));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  let kullanicilar_opt = Array.from(
    kullanicilar.map((kullanici) => ({
      label: `${kullanici.user_id}`,
      value: `${kullanici.user_id}`,
    }))
  );

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

    if (item.isim.trim()) {
      let _items = [...items];
      let _item = { ...item };

      if (editType === "new") {
        axios
          .post("/eczane", _item)
          .then((response) => {
            _item.eczane_id = response.data.eczane_id;
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
        const index = findIndexById(_item.eczane_id);

        axios
          .put("/eczane", _item)
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
    setItemDialog(true);
    setEditType("edit");
  };

  const confirmDeleteItem = (item: any) => {
    setItem(item);
    setDeleteItemDialog(true);
  };

  const deleteItem = () => {
    let _items = items.filter((val) => val.eczane_id !== item.eczane_id);

    axios
      .delete("/eczane", { data: item })
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
      if (items[i].eczane_id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const confirmDeleteSelected = () => {
    setDeleteItemsDialog(true);
  };

  const deleteSelectedItems = () => {
    let _items = items.filter((val) => !selectedItems.includes(val));
    let delete_items = items.filter((val) => selectedItems.includes(val));

    delete_items.forEach((item_del) =>
      axios
        .delete("/eczane", { data: item_del })
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
      yetki === "admin" ? <>
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
      </> : null
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
      <h5 className="mx-0 my-1">Eczaneler</h5>
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
          dataKey="eczane_id"
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
            field="isim"
            header="Eczane Adı"
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="yonetici_id"
            header="Yönetici TC No"
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="adres"
            header="Adres"
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="acilis_saati"
            header="Açılış Saati"
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="kapanis_saati"
            header="Kapanış Saati"
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="telefon_no"
            header="Telefon No"
            sortable
            style={{ minWidth: "10rem" }}
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
          <label htmlFor="isim">Eczane Adı</label>
          <InputText
            id="isim"
            value={item.isim}
            onChange={(e) => onInputChange(e, "isim")}
            required
            autoFocus
            className={classNames({ "p-invalid": submitted && !item.name })}
          />
          {submitted && !item.isim && (
            <small className="p-error">Name is required.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="yonetici_id">Yönetici TC No</label>
          <Dropdown
            id="yonetici_id"
            options={kullanicilar_opt}
            value={item.yonetici_id}
            onChange={(e) => onInputChange(e, "yonetici_id")}
            virtualScrollerOptions={{ itemSize: 38 }}
            field="label"
            dropdown
          />
          {submitted && !item.isim && (
            <small className="p-error">Name is required.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="adres">Adres</label>
          <InputTextarea
            id="adres"
            value={item.adres}
            onChange={(e) => onInputChange(e, "adres")}
            required
            rows={3}
            cols={20}
          />
        </div>
        <div className="field">
          <label htmlFor="acilis_saati">Açılış Saati</label>
          <Dropdown
            id="acilis_saati"
            options={hours}
            value={item.acilis_saati.toString()}
            virtualScrollerOptions={{ itemSize: 38 }}
            field="label"
            dropdown
            onChange={(e) => onInputChange(e, "acilis_saati")}
          />
        </div>
        <div className="field">
          <label htmlFor="kapanis_saati">Kapanış Saati</label>
          <Dropdown
            id="kapanis_saati"
            options={hours}
            value={item.kapanis_saati.toString()}
            virtualScrollerOptions={{ itemSize: 38 }}
            field="label"
            dropdown
            onChange={(e) => onInputChange(e, "kapanis_saati")}
          />
        </div>
        <div className="field">
          <label htmlFor="telefon_no">Telefon No</label>
          <InputText
            id="telefon_no"
            value={item.telefon_no}
            onChange={(e) => onInputChange(e, "telefon_no")}
            required
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

export default EczaneList;
