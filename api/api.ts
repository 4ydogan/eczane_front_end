import axios from "axios";

axios.get('/Stok').then(resp => {

    console.log(resp.data);
});