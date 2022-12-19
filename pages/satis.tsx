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
    adet: 0
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

  const find_eczane_id = (isim: any) => {
    let result = "";
    eczaneler.forEach((eczane) => {
      if (eczane.isim === isim) {
        result = eczane.eczane_id;
      }
    });

    return result;
  };

  const find_urun_id = (urun_adı: any) => {
    let result = "";
    urunler.forEach((urun) => {
      if (urun.urun_adı === urun_adı) {
        result = urun.urun_id;
      }
    });

    return result;
  };

  const saveItem = () => {
    setSubmitted(true);

    if (item.adet) {
      let _items = [...items];
      let _item = { ...item };

      if (editType === "new") {

        _item.eczane_id = find_eczane_id(_item.isim);
        _item.urun_id = find_urun_id(_item.urun_adı);

        axios
          .post("/satis", _item)
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
        const index = findIndexById(_item.eczane_id, _item.urun_id);

        _item.eczane_id = find_eczane_id(_item.isim);
        _item.urun_id = find_urun_id(_item.urun_adı);

        axios
          .put("/satis", _item)
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
    let _items = items.filter((val) => (val.eczane_id !== item.eczane_id) && (val.urun_id !== item.urun_id));

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
      <h5 className="mx-0 my-1">Stoklar</h5>
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
            style={{ minWidth: "13rem" }}
          ></Column>
          <Column
            field="isim"
            header="Eczane Adı"
            sortable
            style={{ minWidth: "13rem" }}
          ></Column>
          <Column
            field="adet"
            header="Adet"
            sortable
            style={{ minWidth: "13rem" }}
          ></Column>
          <Column
            field="satilma_tarihi"
            header="Satılma Tarihi"
            sortable
            style={{ minWidth: "13rem" }}
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
          <label htmlFor="isim">Eczane</label>
          <Dropdown
            id="isim"
            options={eczane_opt}
            value={item.isim}
            virtualScrollerOptions={{ itemSize: 38 }}
            field="label"
            dropdown
            onChange={(e) => onInputChange(e, "isim")}
          />
        </div>
        <div className="field">
          <label htmlFor="urun_adı">Ürün</label>
          <Dropdown
            id="urun_adı"
            options={urun_opt}
            value={item.urun_adı}
            virtualScrollerOptions={{ itemSize: 38 }}
            field="label"
            dropdown
            onChange={(e) => onInputChange(e, "urun_adı")}
          />
        </div>
        <div className="field">
          <label htmlFor="adet">Satış Adedi</label>
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
