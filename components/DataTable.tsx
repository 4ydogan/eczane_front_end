
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
import axios from 'axios';

type Item = {}

const DataList = (props: any) => {

  let emptyItem = {
    id: null,
    name: '',
    image: null,
    description: '',
    category: null,
    price: 0,
    quantity: 0,
    rating: 0,
    inventoryStatus: 'INSTOCK'
  };

  const [items, setItems] = useState<Item[]>([]);
  const [itemDialog, setItemDialog] = useState(false);
  const [deleteItemDialog, setDeleteItemDialog] = useState(false);
  const [deleteItemsDialog, setDeleteItemsDialog] = useState(false);
  const [item, setItem] = useState<Item>({});
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    //axios.get('/eczane').then(data => setItems(data));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const formatCurrency = (value: any) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

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

    if (item.name.trim()) {
      let _items = [...items];
      let _item = { ...item };
      if (item.id) {
        const index = findIndexById(item.id);

        _items[index] = _item;
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Item Updated', life: 3000 });
      }
      else {
        _item.id = createId();
        _item.image = 'item-placeholder.svg';
        _items.push(_item);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Item Created', life: 3000 });
      }

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
    let _items = items.filter(val => val.id !== item.id);
    setItems(_items);
    setDeleteItemDialog(false);
    setItem(emptyItem);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Item Deleted', life: 3000 });
  }

  const findIndexById = (id: any) => {
    let index = -1;
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === id) {
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
    setSelectedItems(null);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Items Deleted', life: 3000 });
  }

  const onCategoryChange = (e: any) => {
    let _item = { ...item };
    _item['category'] = e.value;
    setItem(_item);
  }

  const onInputChange = (e: any, name: any) => {
    const val = (e.target && e.target.value) || '';
    let _item = { ...item };
    _item[`${name}`] = val;

    setItem(_item);
  }

  const onInputNumberChange = (e: any, name: any) => {
    const val = e.value || 0;
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

  const priceBodyTemplate = (rowData: any) => {
    return formatCurrency(rowData.price);
  }

  const statusBodyTemplate = (rowData: any) => {
    return <span className={`item-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
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
          <Column field="code" header="Code" sortable style={{ minWidth: '12rem' }}></Column>
          <Column field="name" header="Name" sortable style={{ minWidth: '16rem' }}></Column>
          <Column field="price" header="Price" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
          <Column field="category" header="Category" sortable style={{ minWidth: '10rem' }}></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
        </DataTable>
      </div>

      <Dialog visible={itemDialog} style={{ width: '450px' }} header="Item Details" modal className="p-fluid" footer={itemDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="name">Name</label>
          <InputText id="name" value={item.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !item.name })} />
          {submitted && !item.name && <small className="p-error">Name is required.</small>}
        </div>
        <div className="field">
          <label htmlFor="description">Description</label>
          <InputTextarea id="description" value={item.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
        </div>

        <div className="field">
          <label className="mb-3">Category</label>
          <div className="formgrid grid">
            <div className="field-radiobutton col-6">
              <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={item.category === 'Accessories'} />
              <label htmlFor="category1">Accessories</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton inputId="category2" name="category" value="Clothing" onChange={onCategoryChange} checked={item.category === 'Clothing'} />
              <label htmlFor="category2">Clothing</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton inputId="category3" name="category" value="Electronics" onChange={onCategoryChange} checked={item.category === 'Electronics'} />
              <label htmlFor="category3">Electronics</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton inputId="category4" name="category" value="Fitness" onChange={onCategoryChange} checked={item.category === 'Fitness'} />
              <label htmlFor="category4">Fitness</label>
            </div>
          </div>
        </div>

        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="price">Price</label>
            <InputNumber id="price" value={item.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
          </div>
          <div className="field col">
            <label htmlFor="quantity">Quantity</label>
            <InputNumber id="quantity" value={item.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} integeronly />
          </div>
        </div>
      </Dialog>

      <Dialog visible={deleteItemDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteItemDialogFooter} onHide={hideDeleteItemDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {item && <span>Are you sure you want to delete <b>{item.name}</b>?</span>}
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

export default DataList;