import React, { useState, useEffect, useRef, ReactPropTypes } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";

import { Satis, Eczane, Urun } from "../types/types";

type Item = Satis;

const UrunList = (props: any) => {
  let emptyItem = {
    eczane_id: "",
    urun_id: "",
    isim: "",
    urun_adı: "",
    satilma_tarihi: "",
  };

  const [items, setItems] = useState<Item[]>([]);
  const [eczaneler, setEczaneler] = useState<Eczane[]>([]);
  const [urunler, setUrunler] = useState<Urun[]>([]);
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

  let eczane_opt = Array.from(
    eczaneler.map((eczane) => ({
      label: `${eczane.isim}`,
      value: `${eczane.isim}`,
    }))
  );

  let urun_opt = Array.from(
    urunler.map((urun) => ({
      label: `${urun.urun_adı}`,
      value: `${urun.urun_adı}`,
    }))
  );

  useEffect(() => {
    axios.get("/satis").then((response) => setItems(response.data));
    axios.get("/eczane").then((response) => setEczaneler(response.data));
    axios.get("/urun").then((response) => setUrunler(response.data));
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

    if (item.eczane_id) {
      let _items = [...items];
      let _item = { ...item };

      if (editType === "new") {
        axios
          .post("/satis", _item)
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });

        _item.isim = eczaneler.filter(
          (eczane) => eczane.eczane_id === _item.eczane_id
        )[0].isim;
        _item.urun_adı = urunler.filter(
          (urun) => urun.urun_id === _item.urun_id
        )[0].urun_adı;

        _items.push(_item);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Item Created",
          life: 3000,
        });
      } else if (editType === "edit") {
        const index = findIndexById(_item.eczane_id, _item.urun_id);

        axios
          .put("/satis", _item)
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });

        console.log(
          eczaneler.filter((eczane) => eczane.eczane_id === _item.eczane_id)[0]
            .isim
        );

        _item.isim = eczaneler?.find((eczane) => {
          return eczane.eczane_id === _item.eczane_id;
        }).isim;
        _item.urun_adı = urunler?.find((urun) => {
          return urun.urun_id === _item.urun_id;
        }).urun_adı;
        _items[index] = _item;

        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Item Updated",
          life: 3000,
        });
      }

      console.log(_item);

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
    let _items = items.filter((val) => val.eczane_id !== item.eczane_id);

    axios
      .delete("/satis", { data: item })
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

  const findIndexById = (eczane_id: any, urun_id: any) => {
    let index = -1;
    for (let i = 0; i < items.length; i++) {
      if (items[i].eczane_id === eczane_id && items[i].urun_id === urun_id) {
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
        .delete("/satis", { data: item_del })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        })
    );

    console.log(delete_items);
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

  const onInputNumberChange = (e: any, name: any) => {
    const val = e.value || 0;
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
      <h5 className="mx-0 my-1">Manage Items</h5>
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
          onSelectionChange={(e) => {
            setSelectedItems(e.value);
            console.log(e.value);
          }}
          dataKey="id"
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
            field="urun_adı"
            header="Urun Adı"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            field="isim"
            header="Eczane Adı"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            field="adet"
            header="Adet"
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
          <label htmlFor="eczane_id">Eczane</label>
          <Dropdown
            id="eczane_id"
            options={eczane_opt}
            value={item.isim}
            virtualScrollerOptions={{ itemSize: 38 }}
            field="label"
            dropdown
            onChange={(e) => onInputChange(e, "eczane_id")}
          />
        </div>
        <div className="field">
          <label htmlFor="urun_id">Ürün</label>
          <Dropdown
            id="urun_id"
            options={urun_opt}
            value={item.urun_adı}
            virtualScrollerOptions={{ itemSize: 38 }}
            field="label"
            dropdown
            onChange={(e) => onInputChange(e, "urun_id")}
          />
        </div>
        <div className="field">
          <label htmlFor="adet">satis Adedi</label>
          <InputNumber
            id="adet"
            value={item.adet}
            onChange={(e) => onInputNumberChange(e, "adet")}
            required
            autoFocus
            className={classNames({ "p-invalid": submitted && !item.adet })}
          />
          {submitted && !item.adet && (
            <small className="p-error">Adet is required.</small>
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

export default UrunList;
