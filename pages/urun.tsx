
import React, { useState, useEffect, useRef, ReactPropTypes } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';

import { Urun } from "../types/types";

type Item = Urun;

const UrunList = (props: any) => {

  let emptyItem = {
    urun_id: '',
    urun_turu: '',
    urun_adi: ''
  };

  const [items, setItems] = useState<Item[]>([]);
  const [itemDialog, setItemDialog] = useState(false);
  const [deleteItemDialog, setDeleteItemDialog] = useState(false);
  const [deleteItemsDialog, setDeleteItemsDialog] = useState(false);
  const [item, setItem] = useState<Item>(emptyItem);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  const hours = Array.from({ length: 24 }).map((_, i) => ({ label: `${i}.00`, value: i }));

  useEffect(() => {
    //axios.get('/urun').then(data => setItems(data));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openNew = () => {
    setItem(emptyItem);
    setSubmitted(false);
    setItemDialog(true);
  }

  const hideDialog = () => {
    setSubmitted(false);
    setItemDialog(false);
  }

  const hideDeleteItemDialog = () => {
    setDeleteItemDialog(false);
  }

  const hideDeleteItemsDialog = () => {
    setDeleteItemsDialog(false);
  }

  const saveItem = () => {
    setSubmitted(true);

    if (item.urun_adi.trim()) {
      let _items = [...items];
      let _item = { ...item };
      if (item.urun_id) {
        const index = findIndexById(item.urun_id);

        _items[index] = _item;
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Item Updated', life: 3000 });
      }
      else {
        _item.urun_id = createId();
        _items.push(_item);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Item Created', life: 3000 });
      }

      console.log(item)

      setItems(_items);
      setItemDialog(false);
      setItem(emptyItem);
    }
  }

  const editItem = (item: any) => {
    setItem({ ...item });
    setItemDialog(true);
  }

  const confirmDeleteItem = (item: any) => {
    setItem(item);
    setDeleteItemDialog(true);
  }

  const deleteItem = () => {
    let _items = items.filter(val => val.urun_id !== item.urun_id);
    setItems(_items);
    setDeleteItemDialog(false);
    setItem(emptyItem);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Item Deleted', life: 3000 });
  }

  const findIndexById = (id: any) => {
    let index = -1;
    for (let i = 0; i < items.length; i++) {
      if (items[i].urun_id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  const createId = () => {
    let id = '';
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  const confirmDeleteSelected = () => {
    setDeleteItemsDialog(true);
  }

  const deleteSelectedItems = () => {
    let _items = items.filter(val => !selectedItems.includes(val));
    setItems(_items);
    setDeleteItemsDialog(false);
    setSelectedItems([]);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Items Deleted', life: 3000 });
  }

  const onInputChange = (e: any, name: any) => {
    const val = (e.target && e.target.value) || '';
    let _item = { ...item };
    _item[`${name}`] = val;

    setItem(_item);
  }

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
        <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedItems || !selectedItems.length} />
      </React.Fragment>
    )
  }

  const actionBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editItem(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteItem(rowData)} />
      </React.Fragment>
    );
  }

  const header = (
    <div className="table-header">
      <h5 className="mx-0 my-1">Manage Items</h5>
    </div>
  );

  const itemDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveItem} />
    </React.Fragment>
  );

  const deleteItemDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteItemDialog} />
      <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteItem} />
    </React.Fragment>
  );

  const deleteItemsDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteItemsDialog} />
      <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedItems} />
    </React.Fragment>
  );

  return (
    <div className="datatable-crud-demo">
      <Toast ref={toast} />

      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate} />

        <DataTable ref={dt} value={items} selection={selectedItems} onSelectionChange={(e) => setSelectedItems(e.value)}
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} items"
          globalFilter={globalFilter} header={header} responsiveLayout="scroll">
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
          <Column field="urun_id" header="Urun ID" sortable style={{ minWidth: '16rem' }}></Column>
          <Column field="urun_adi" header="Urun Adı" sortable style={{ minWidth: '16rem' }}></Column>
          <Column field="urun_turu" header="Urun Turu" sortable style={{ minWidth: '16rem' }}></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
        </DataTable>
      </div>

      <Dialog visible={itemDialog} style={{ width: '450px' }} header="Item Details" modal className="p-fluid" footer={itemDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="urun_adi">Urun Adı</label>
          <InputText id="urun_adi" value={item.urun_adi} onChange={(e) => onInputChange(e, 'urun_adi')} required autoFocus className={classNames({ 'p-invalid': submitted && !item.urun_adi })} />
          {submitted && !item.urun_adi && <small className="p-error">Name is required.</small>}
        </div>
        <div className="field">
          <label htmlFor="urun_turu">Urun Turu</label>
          <Dropdown id="urun_turu" options={hours} value={item.urun_turu} virtualScrollerOptions={{ itemSize: 38 }} field="label" dropdown onChange={(e) => onInputChange(e, 'urun_turu')} />
        </div>
        
      </Dialog>

      <Dialog visible={deleteItemDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteItemDialogFooter} onHide={hideDeleteItemDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {item && <span>Are you sure you want to delete <b>{item.urun_adi}</b>?</span>}
        </div>
      </Dialog>

      <Dialog visible={deleteItemsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteItemsDialogFooter} onHide={hideDeleteItemsDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {item && <span>Are you sure you want to delete the selected items?</span>}
        </div>
      </Dialog>
    </div>
  );
}

export default UrunList;