export type Eczane = {
  name: string,
  adress: string,
  start_time: string,
  end_time: string,
  tel_no: string,
  yonetici_id: string,
  eczane_id: string
}

export type Kisi = {
  tc_no: string,
  ad: string,
  soyad: string,
  adres: string
}

export type Urun = {
  urun_id: string,
  urun_turu: string,
  urun_adi: string
}

export type Kullanici = {
  user_id: string,
  kullanici_adi: string,
  parola: string,
  yetki: string
}

export type Calisan = {
  eczane_id: string,
  tc_no: string,
  maas: number,
  pozisyon: string,
  ise_giris_tarihi: string
}

export type Satis = {
  satilma_tarihi: string
}

export type Stok = {
  eczane_id: string,
  urun_id: string,
  adet: number
}